"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleIcon } from "@/components/auth/google-icon";
import { GitHubIcon } from "@/components/auth/github-icon";
import { IconField } from "@/components/auth/icon-field";
import { MailIcon, LockIcon, UserIcon, CheckIcon } from "@/components/auth/field-icons";

export function RegisterForm({
  googleEnabled,
  githubEnabled,
}: {
  googleEnabled: boolean;
  githubEnabled: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create the account");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      router.push("/login");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 500);
  }

  return (
    <div className="w-full max-w-xl space-y-5 rounded-2xl border border-line bg-card/80 p-6 shadow-xl shadow-navy/5 backdrop-blur sm:p-10 dark:shadow-none">
      {(googleEnabled || githubEnabled) && (
        <>
          <div className="space-y-2">
            {googleEnabled && (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-3 text-base font-semibold text-body transition hover:border-brand/50 hover:bg-subtle"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            )}
            {githubEnabled && (
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-line px-4 py-3 text-base font-semibold text-body transition hover:border-brand/50 hover:bg-subtle"
              >
                <GitHubIcon />
                Continue with GitHub
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <IconField
          id="name"
          label="Name"
          type="text"
          icon={<UserIcon />}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <IconField
          id="email"
          label="Email"
          type="email"
          icon={<MailIcon />}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <IconField
          id="password"
          label="Password"
          type="password"
          icon={<LockIcon />}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p className="animate-shake rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || success}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-semibold text-white transition-all disabled:opacity-70 ${
            success
              ? "bg-green-600"
              : "bg-navy hover:bg-[#1c2638] dark:bg-white dark:text-navy dark:hover:bg-gray-200"
          }`}
        >
          {success ? (
            <>
              <CheckIcon />
              Account created
            </>
          ) : loading ? (
            "Creating account..."
          ) : (
            "Sign up"
          )}
        </button>
        <p className="text-center text-sm text-body">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-ink hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
