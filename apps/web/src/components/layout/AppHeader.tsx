"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogout, useSession } from "@/hooks/useAuth";

export function AppHeader() {
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-ink/10 px-5 py-4 sm:rounded-t-[2rem]">
      <Link href="/groups" className="text-lg font-extrabold tracking-tight text-terracotta">
        Tab
      </Link>
      {data?.user && (
        <button
          onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
          aria-label="Sign out"
          title="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper hover:text-ink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H9m12 0-3.75-3.75M21 12l-3.75 3.75" />
          </svg>
        </button>
      )}
    </header>
  );
}
