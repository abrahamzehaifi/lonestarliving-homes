"use client";

import { useState } from "react";

export default function OpsLoginPage() {
  const [email, setEmail] = useState("zehaifirealty@gmail.com");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(data?.error || "Failed to send access link.");
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
          Private access
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-neutral-950">
          Operations Login
        </h1>

        {!sent ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className="w-full rounded-lg border px-3 py-2"
              autoComplete="email"
              placeholder="you@example.com"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Access Link"}
            </button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        ) : (
          <p className="mt-6 text-sm text-neutral-600">
            Check your email and click the access link.
          </p>
        )}
      </div>
    </main>
  );
}