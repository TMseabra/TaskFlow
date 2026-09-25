import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { NewProjectButton, ProjectGrid } from "@/components/projects/projects-view";

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "asc" },
    include: { tasks: { select: { status: true } } },
  });

  const items = projects.map((p) => {
    const done = p.tasks.filter((t) => t.status === "DONE").length;
    const inProgress = p.tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const total = p.tasks.length;
    return {
      id: p.id,
      name: p.name,
      color: p.color,
      total,
      done,
      inProgress,
      progress: total ? Math.round((done / total) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Group related tasks and track their progress"
        action={<NewProjectButton />}
      />
      <ProjectGrid projects={items} />
    </div>
  );
}
