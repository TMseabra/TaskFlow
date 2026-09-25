import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { taskInclude, toTaskItem } from "@/lib/tasks";
import { buildTaskWhere } from "@/lib/task-query";
import { createTaskSchema } from "@/lib/validations/task";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tasks = await prisma.task.findMany({
    where: buildTaskWhere(session.user.id, {
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      project: searchParams.get("project") ?? undefined,
    }),
    orderBy: [{ createdAt: "desc" }],
    include: taskInclude,
  });

  return NextResponse.json({ tasks: tasks.map(toTaskItem) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = createTaskSchema.safeParse(await request.json());
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

  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      completedAt: status === "DONE" ? new Date() : null,
      projectId: projectId || null,
      assignee: assignee || null,
      userId: session.user.id,
    },
    include: taskInclude,
  });

  await logActivity(session, "TASK_CREATED", task.title);

  return NextResponse.json({ task: toTaskItem(task) }, { status: 201 });
}
