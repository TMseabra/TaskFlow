import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <nav
        aria-label="Footer"
        className="flex min-h-[75px] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-5 text-[13px] text-body sm:min-h-[100px] sm:gap-x-[35px] sm:text-sm"
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="transition-colors hover:text-brand">
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
