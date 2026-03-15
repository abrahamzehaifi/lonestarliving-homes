"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function OpsLoginPage() {
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null;

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    if (!supabase) {
      setError("Supabase client is not configured correctly.");
      return;
    }

    setLoading(true);
    setError("");

    const safeEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: safeEmail,
        password,
      });

      if (error) {
        setError("Login failed. Check your email and password.");
        return;
      }

      router.push("/ops/today");
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-6 py-20 text-neutral-950">
      <div className="mx-auto max-w-md rounded-[1.75rem] border border-black/5 bg-white p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Private Access
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Operations Login
        </h1>

        <p className="mt-3 text-sm leading-7 text-neutral-600">
          Sign in to access the private operations workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            inputMode="email"
            autoFocus
            required
            disabled={loading}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            disabled={loading}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || !supabase}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {!supabase ? (
            <p className="text-sm text-red-600">
              Missing Supabase public environment variables.
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}