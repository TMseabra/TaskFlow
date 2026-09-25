import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNotifications } from "@/lib/dashboard";
import { AppShell } from "@/components/app/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [projects, assigneeRows, notifications] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, color: true },
    }),
    prisma.task.findMany({
      where: { userId, assignee: { not: null } },
      distinct: ["assignee"],
      select: { assignee: true },
    }),
    getNotifications(userId),
  ]);

  return (
    <AppShell
      user={{ name: session.user.name ?? "", email: session.user.email ?? "" }}
      projects={projects}
      assignees={assigneeRows.map((r) => r.assignee!).sort()}
      notifications={notifications}
    >
      {children}
    </AppShell>
  );
}
