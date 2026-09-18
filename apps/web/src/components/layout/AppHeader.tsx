"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogout, useSession } from "@/hooks/useAuth";

export function AppHeader() {
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();

  return (
    <header className="border-b border-ink/10 bg-surface">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/groups" className="text-lg font-extrabold tracking-tight text-terracotta">
          Tab
        </Link>
        {data?.user && (
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-ink">{data.user.fullName}</p>
            <button
              onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
