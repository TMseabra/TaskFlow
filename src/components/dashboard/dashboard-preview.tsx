import { AppShell } from "@/components/app/app-shell";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { demoProjects, demoUser, getDemoDashboardData, getDemoNotifications } from "@/lib/demo-data";

export function DashboardPreview() {
  const now = new Date();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      <div className="absolute left-[4%] top-[18%] h-[440px] w-[440px] rounded-full bg-brand/20 blur-[130px] dark:bg-brand/10" />
      <div className="absolute right-[2%] top-[48%] h-[380px] w-[380px] rounded-full bg-brand/15 blur-[130px] dark:bg-brand/10" />

      <div className="animate-fade-in-slow absolute left-1/2 top-[70px] w-[1440px] -translate-x-1/2">
        <div
          inert
          className="h-[900px] origin-top rotate-[-3deg] scale-[0.94] overflow-hidden rounded-[28px] border border-line shadow-[0_30px_90px_rgba(16,24,39,0.08)] [mask-image:linear-gradient(to_bottom,#000_60%,transparent_96%)]"
        >
          <AppShell
            preview
            activeHref="/dashboard"
            user={demoUser}
            projects={demoProjects}
            assignees={[]}
            notifications={getDemoNotifications(now)}
          >
            <DashboardView data={getDemoDashboardData(now)} preview />
          </AppShell>
        </div>
      </div>

      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(255,255,255,.5), rgba(255,255,255,.7) 55%, rgba(255,255,255,.92) 88%), linear-gradient(90deg, rgba(255,255,255,.7), rgba(237,250,243,.2), rgba(255,255,255,.7))",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(13,19,27,.45), rgba(13,19,27,.72) 55%, rgba(13,19,27,.93) 88%), linear-gradient(90deg, rgba(13,19,27,.72), rgba(0,201,107,.05), rgba(13,19,27,.72))",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-page to-transparent" />
    </div>
  );
}
