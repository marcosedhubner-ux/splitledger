"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useAuth";
import { AppHeader } from "./AppHeader";
import { BottomTabBar } from "./BottomTabBar";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = useSession();

  useEffect(() => {
    if (isLoading) return;
    if (isError || !data?.user) {
      router.replace("/login");
    }
  }, [isLoading, isError, data, router]);

  if (isLoading || !data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-ink-soft">
        Loading...
      </div>
    );
  }

  return (
    <div className="receipt-texture min-h-screen bg-paper sm:py-8">
      {/* Narrow centered column: on small screens this fills the viewport like
         a real phone; from sm up it floats as a card over the paper texture,
         so the app visually reads as a mobile shell rather than a wide
         desktop dashboard. */}
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface sm:min-h-[calc(100vh-4rem)] sm:rounded-[2rem] sm:border sm:border-ink/[0.06] sm:shadow-[0_8px_40px_rgba(36,31,26,0.12)]">
        <AppHeader />
        <main className="flex-1 px-5 pb-8 pt-6">{children}</main>
        <BottomTabBar />
      </div>
    </div>
  );
}
