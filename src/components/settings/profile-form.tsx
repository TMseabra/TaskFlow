"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-line bg-card px-3 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/10";

export function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const { update } = useSession();
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const dirty = name !== initialName || email !== initialEmail;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save your changes");
      setStatus("error");
      return;
    }

    await update({ name, email });
    setStatus("success");
    router.refresh();
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="profile-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="profile-email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="profile-email"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && (
        <p role="alert" className="animate-shake text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {status === "success" && (
        <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
          Saved.
        </p>
      )}
      <Button type="submit" disabled={!dirty || status === "loading"}>
        {status === "loading" ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
