"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StashProvider, useStash } from "@/lib/stash-store";
import { BottomNav } from "@/components/bottom-nav";
import { Onboarding } from "@/components/onboarding";

function LoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#07141a] text-white/50">
      <div className="h-8 w-8 animate-pulse rounded-full bg-[#f3d08a]/40" />
    </div>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, onboarded } = useStash();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ready || !onboarded) return;
    if (pathname === "/") router.replace("/feed");
  }, [mounted, ready, onboarded, pathname, router]);

  // Keep SSR and the first client paint identical to avoid hydration mismatches.
  if (!mounted || !ready) {
    return <LoadingScreen />;
  }

  if (!onboarded) {
    return <Onboarding />;
  }

  const hideNav = pathname.startsWith("/idea/");

  return (
    <div className="relative min-h-dvh bg-[#07141a] text-white">
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% -5%, #0f766e44, transparent), radial-gradient(ellipse 50% 30% at 100% 60%, #b4530922, transparent)",
        }}
      />
      <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <StashProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Gate>{children}</Gate>
      </Suspense>
    </StashProvider>
  );
}
