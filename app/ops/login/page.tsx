"use client";

import { useState } from "react";

export default function OpsLoginPage() {
  const [email, setEmail] = useState("zehaifirealty@gmail.com");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to send access link.");
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch {
      setError("Something went wrong.");
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-2 text-white"
            >
              {loading ? "Sending..." : "Send Access Link"}
            </button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
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
