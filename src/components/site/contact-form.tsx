"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not send the message");
      setStatus("error");
      return;
    }

    setStatus("success");
    setName("");
    setEmail("");
    setMessage("");
  }

  if (status === "success") {
    return (
      <p className="animate-fade-in-up rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
        Message sent! We&apos;ll reply as soon as possible.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        required
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
      />
      <textarea
        required
        rows={3}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
      />
      {status === "error" && (
        <p className="animate-shake text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c2638] disabled:opacity-50 dark:bg-white dark:text-navy dark:hover:bg-gray-200"
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
