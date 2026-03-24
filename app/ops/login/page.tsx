"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OpsLoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("zehaifirealty@gmail.com");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlError = searchParams.get("error");

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
      setError("Something went wrong. Try again.");
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

        <p className="mt-2 text-sm text-neutral-600">
          Secure email link access for the private CRM and dashboard.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white"
            >
              {loading ? "Sending..." : "Send Access Link"}
            </button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {!error && urlError ? (
              <p className="text-sm text-red-600">
                Login link expired or invalid. Request a new one.
              </p>
            ) : null}
          </form>
        ) : (
          <div className="mt-6 rounded-xl border bg-neutral-50 p-4 text-sm text-neutral-700">
            Check your email and click the secure access link.
          </div>
        )}
      </div>
    </main>
  );
}