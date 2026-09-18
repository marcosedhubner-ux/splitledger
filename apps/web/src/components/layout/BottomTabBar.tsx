"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLogout, useSession } from "@/hooks/useAuth";

function GroupsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 10.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25ZM15.75 10.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 19.125c0-3.107 2.393-5.625 5.35-5.625h1.3c1.396 0 2.665.567 3.6 1.494M21.75 19.125c0-3.107-2.393-5.625-5.35-5.625h-1.3c-1.396 0-2.665.567-3.6 1.494M12 19.5v-1.125c0-2.485-2.015-4.5-4.5-4.5h-.15"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();
  const [showAccount, setShowAccount] = useState(false);

  const isGroups = (pathname?.startsWith("/groups") ?? false) && !showAccount;

  return (
    <div className="sticky bottom-0 z-10 shrink-0">
      {showAccount && (
        <div className="border-t border-ink/10 bg-surface px-5 py-4 shadow-[0_-4px_16px_rgba(36,31,26,0.08)]">
          <p className="text-sm font-semibold text-ink">{data?.user?.fullName}</p>
          <p className="mt-0.5 text-xs text-ink-soft">{data?.user?.email}</p>
          <button
            onClick={() => logout.mutate(undefined, { onSuccess: () => router.push("/login") })}
            className="mt-3 text-sm font-medium text-danger hover:underline"
          >
            Sign out
          </button>
        </div>
      )}
      <nav className="flex border-t border-ink/10 bg-surface px-2 py-1.5 sm:rounded-b-[2rem]">
        <Link
          href="/groups"
          onClick={() => setShowAccount(false)}
          className={clsx(
            "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors",
            isGroups ? "text-terracotta" : "text-ink-soft hover:text-ink"
          )}
        >
          <GroupsIcon className="h-5 w-5" />
          Groups
        </Link>
        <button
          type="button"
          onClick={() => setShowAccount((value) => !value)}
          className={clsx(
            "flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition-colors",
            showAccount ? "text-terracotta" : "text-ink-soft hover:text-ink"
          )}
        >
          <UserIcon className="h-5 w-5" />
          Account
        </button>
      </nav>
    </div>
  );
}
