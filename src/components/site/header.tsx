import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/site/logo";
import { MobileMenu } from "@/components/site/mobile-menu";

const navLinkClass =
  "rounded-md text-base font-medium text-body transition-colors duration-150 hover:text-brand";

export function SiteHeader() {
  return (
    <header className="animate-fade-in sticky top-0 z-40 flex h-[75px] items-center border-b border-line bg-page/90 px-5 backdrop-blur sm:h-[100px] sm:px-6 lg:px-[clamp(28px,12vw,290px)]">
      <div className="flex w-full items-center gap-10">
        <Link href="/" className="shrink-0" aria-label="Taskflow home">
          <Logo iconSize={25} textClassName="text-[22px] sm:text-[27px]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:ml-auto md:flex">
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

        <div className="ml-auto flex items-center gap-3 sm:gap-[22px] md:ml-0">
          <ThemeToggle />
          <Link href="/login" className={`hidden sm:block ${navLinkClass}`}>
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-[7px] bg-navy px-4 text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:shadow-navy/20 dark:bg-white dark:text-navy sm:h-[52px] sm:min-w-[120px] sm:px-[27px] sm:text-[17px]"
          >
            Sign up
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
