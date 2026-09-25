import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { SettingsLink } from "@/components/dashboard/settings-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/site/logo";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="border-b border-gray-200 bg-white dark:border-gray-900 dark:bg-black">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-4 sm:py-5">
            <div className="flex items-center gap-10">
              <Link href="/dashboard">
                <Logo size={48} textClassName="text-xl sm:text-4xl" />
              </Link>
              <div className="hidden sm:block">
                <DashboardNav />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <SettingsLink />
              <span className="hidden text-base text-gray-600 dark:text-gray-400 md:inline">
                {session.user.name ?? session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
          <div className="pb-3 sm:hidden">
            <DashboardNav />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
