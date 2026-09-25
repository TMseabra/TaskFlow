import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/site/logo";

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
  );

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center bg-subtle px-4 py-10 sm:px-6 sm:py-12">
      <Link href="/" className="animate-fade-in-up mb-6 sm:absolute sm:left-6 sm:top-6 sm:mb-0">
        <Logo iconSize={24} textClassName="text-[22px] sm:text-2xl" />
      </Link>
      <h1 className="animate-fade-in-up mb-6 text-2xl font-semibold text-ink">
        Sign in
      </h1>
      <Suspense>
        <LoginForm googleEnabled={googleEnabled} githubEnabled={githubEnabled} />
      </Suspense>
    </main>
  );
}
