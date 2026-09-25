"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function DangerZone({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmation === email;

  async function handleDelete() {
    if (!canDelete) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/account", { method: "DELETE" });

    if (!res.ok) {
      setError("Could not delete your account. Please try again.");
      setLoading(false);
      return;
    }

    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-red-300 bg-card dark:border-red-900">
      <div className="border-b border-red-300 bg-red-50 px-5 py-3 dark:border-red-900 dark:bg-red-950/40">
        <h2 className="text-sm font-bold uppercase tracking-wide text-red-700 dark:text-red-400">
          Danger Zone
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="font-medium text-ink">
            Delete this account
          </p>
          <p className="text-sm text-muted">
            Permanently deletes your account and all your tasks. This action
            cannot be undone.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-md border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
        >
          Delete account
        </button>
      </div>

      {open && (
        <div className="animate-fade-in-up space-y-3 border-t border-red-200 px-5 py-4 dark:border-red-900">
          <p className="text-sm text-body">
            This action is irreversible. To confirm, type your email (
            <span className="font-semibold">{email}</span>) in the box below.
          </p>
          <input
            aria-label="Type your email to confirm"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={email}
            className="w-full max-w-sm h-10 rounded-lg border border-line bg-card px-3 text-sm text-ink outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          />
          {error && (
            <p className="animate-shake text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete || loading}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Deleting..." : "Permanently delete"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmation("");
                setError(null);
              }}
              className="rounded-md px-4 py-2 text-sm font-semibold text-body hover:bg-subtle"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
