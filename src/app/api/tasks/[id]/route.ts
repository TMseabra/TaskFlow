import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { taskInclude, toTaskItem } from "@/lib/tasks";
import { updateTaskSchema } from "@/lib/validations/task";

type RouteParams = { params: Promise<{ id: string }> };

async function findOwnedTask(id: string, userId: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  return task && task.userId === userId ? task : null;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const task = await prisma.task.findFirst({
    where: { id, userId: session.user.id },
    include: taskInclude,
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ task: toTaskItem(task) });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findOwnedTask(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const parsed = updateTaskSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const { title, description, status, priority, dueDate, projectId, assignee } = parsed.data;

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 400 });
    }
  }

  const wasDone = existing.status === "DONE";
  const isNowDone = status === "DONE";

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description: description || null } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(priority !== undefined ? { priority } : {}),
      ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
      ...(projectId !== undefined ? { projectId: projectId || null } : {}),
      ...(assignee !== undefined ? { assignee: assignee || null } : {}),
      ...(status !== undefined
        ? {
            completedAt: isNowDone
              ? existing.completedAt ?? new Date()
              : wasDone
              ? null
              : existing.completedAt,
          }
        : {}),
    },
    include: taskInclude,
  });

  const activityType =
    status !== undefined && isNowDone && !wasDone
      ? "TASK_COMPLETED"
      : status !== undefined && wasDone && !isNowDone
      ? "TASK_REOPENED"
      : "TASK_UPDATED";
  await logActivity(session, activityType, task.title);

  return NextResponse.json({ task: toTaskItem(task) });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findOwnedTask(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });
  await logActivity(session, "TASK_DELETED", existing.title);

  return NextResponse.json({ success: true });
}
