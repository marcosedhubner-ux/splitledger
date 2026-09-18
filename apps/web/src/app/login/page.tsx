"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/apiClient";

const DEMO_ACCOUNTS = ["alex@splitledger.dev", "blair@splitledger.dev", "casey@splitledger.dev", "dana@splitledger.dev"];

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    login.mutate(
      { email, password },
      {
        onSuccess: () => router.push("/"),
        onError: (err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong");
        },
      }
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-paper lg:grid-cols-2">
      <div className="receipt-texture relative hidden overflow-hidden border-r-2 border-dashed border-terracotta/30 bg-terracotta-soft lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="relative z-10">
          <span className="text-2xl font-extrabold tracking-tight text-terracotta">Tab</span>
        </div>
        <div className="relative z-10 space-y-4">
          <p className="max-w-md text-3xl font-bold leading-tight text-ink">
            Untangles a week of shared dinners into the fewest payments that make everyone even.
          </p>
          <p className="max-w-sm text-sm text-ink-soft">
            Add what you spent, tag who was in on it — Tab does the math and tells you exactly who
            pays who.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-soft">Welcome back — let&apos;s settle up.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta"
              />
            </div>

            {errorMessage && (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{errorMessage}</p>
            )}

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            New here?{" "}
            <Link href="/register" className="font-medium text-terracotta hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-ink/20 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Demo accounts (password: Passw0rd!123)
            </p>
            <ul className="mt-2 space-y-1">
              {DEMO_ACCOUNTS.map((email) => (
                <li key={email} className="font-mono text-xs text-ink-soft">
                  {email}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
