import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/site/logo";
import { MobileMenu } from "@/components/site/mobile-menu";

const navLinkClass =
  "rounded-md border border-transparent px-3 py-1.5 transition-all duration-200 hover:scale-110 hover:border-green-500 hover:text-green-600 hover:shadow-sm dark:hover:border-green-400 dark:hover:text-green-400";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-900 dark:bg-black">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="min-w-0">
          <Logo size={44} textClassName="text-xl sm:text-3xl" />
        </Link>

        <nav className="hidden items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-300 md:flex">
          <Link href="/how-it-works" className={navLinkClass}>
            How it works
          </Link>
          <Link href="/faq" className={navLinkClass}>
            FAQ
          </Link>
          <Link href="/support" className={navLinkClass}>
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className={`hidden text-base font-semibold text-gray-700 dark:text-gray-300 sm:block ${navLinkClass}`}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-transparent bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-110 hover:border-green-400 hover:shadow-sm dark:bg-white dark:text-gray-900 sm:px-5 sm:py-2.5 sm:text-base"
          >
            Sign up
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
