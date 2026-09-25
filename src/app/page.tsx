import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { HeroMockup } from "@/components/site/hero-mockup";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative flex min-h-[650px] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6 lg:h-[calc(100vh-180px)]">
          <HeroMockup />

          <div className="relative z-10">
            <h1 className="animate-fade-in-up lowercase text-6xl font-extrabold leading-none tracking-[-2px] sm:text-8xl sm:tracking-[-3px] md:text-[100px] md:tracking-[-4px]">
              <span className="text-[#07585c] dark:text-[#3ddc9a]">task</span>
              <span className="text-[#00c96b]">flow</span>
            </h1>
            <p className="animate-fade-in-up mx-auto mt-8 max-w-2xl text-lg leading-snug text-[#5b687a] dark:text-gray-400 sm:text-xl">
              Organize your tasks: statuses, priorities, deadlines, and a
              dashboard with real-time statistics.
            </p>
            <div className="mt-10 flex w-full max-w-xs flex-col gap-3 sm:mx-auto sm:w-auto sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/register"
                className="rounded-md border border-transparent bg-[#101827] px-7 py-3.5 text-lg font-bold text-white transition-all duration-200 hover:scale-110 hover:border-green-400 hover:shadow-md dark:bg-white dark:text-gray-900"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-[#dce1e6] bg-white px-7 py-3.5 text-lg font-bold text-[#101827] transition-all duration-200 hover:scale-110 hover:border-green-500 hover:text-green-600 hover:shadow-md dark:border-gray-700 dark:bg-transparent dark:text-gray-100 dark:hover:border-green-400 dark:hover:text-green-400"
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
