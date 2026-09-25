import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative flex h-[calc(100svh-150px)] min-h-[600px] flex-col items-center justify-center overflow-hidden px-4 text-center sm:h-[calc(100svh-200px)] sm:min-h-[650px] sm:px-6">
          <DashboardPreview />

          <div className="relative z-10 mt-[30px]">
            <h1 className="animate-fade-in-up text-[58px] font-extrabold lowercase leading-none tracking-[-4px] text-brand-ink sm:text-[clamp(70px,6vw,105px)] sm:tracking-[-5px]">
              task<span className="text-brand">flow</span>
            </h1>
            <p
              className="animate-fade-in-up mx-auto mt-[34px] max-w-[750px] px-2 text-[17px] leading-[1.4] text-body sm:px-0 sm:text-[21px]"
              style={{ animationDelay: "80ms" }}
            >
              Organize your tasks: statuses, priorities, deadlines, and a dashboard with
              <br className="hidden sm:inline" /> real-time statistics.
            </p>
            <div
              className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-[15px] sm:flex-row"
              style={{ animationDelay: "160ms" }}
            >
              <Link
                href="/register"
                className="inline-flex h-[50px] min-w-[140px] items-center justify-center rounded-[7px] border border-navy bg-navy px-[27px] text-[17px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/20 dark:border-white dark:bg-white dark:text-navy sm:h-[58px] sm:min-w-[120px]"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="inline-flex h-[50px] min-w-[140px] items-center justify-center rounded-[7px] border border-[#dce1e6] bg-card px-[27px] text-[17px] font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand dark:border-line sm:h-[58px] sm:min-w-[120px]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
