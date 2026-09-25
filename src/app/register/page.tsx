import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/site/logo";

export default function RegisterPage() {
  const googleEnabled = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
  );

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-10 sm:px-6 sm:py-12 dark:from-black dark:via-black dark:to-black">
      <Link href="/" className="animate-fade-in-up mb-6 sm:absolute sm:left-6 sm:top-6 sm:mb-0">
        <Logo size={40} textClassName="text-xl sm:text-2xl" />
      </Link>
      <h1 className="animate-fade-in-up mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Sign up
      </h1>
      <RegisterForm googleEnabled={googleEnabled} githubEnabled={githubEnabled} />
    </main>
  );
}
