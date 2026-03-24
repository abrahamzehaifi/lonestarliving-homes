"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce",
    },
  }
);

export default function OpsLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
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
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
              {loading ? "Sending..." : "Send Magic Link"}
            </button>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        ) : (
          <div className="mt-6 text-sm text-neutral-600">
            Check your email and click the login link.
          </div>
        )}
      </div>
    </main>
  );
}