"use client";

import { Suspense, useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StashProvider, useStash } from "@/lib/stash-store";
import { BottomNav } from "@/components/bottom-nav";
import { Onboarding } from "@/components/onboarding";

function LoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="h-10 w-10 animate-pulse rounded-full bg-primary/30" />
    </div>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  const { ready, onboarded } = useStash();
  const pathname = usePathname();
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient || !ready || !onboarded) return;
    if (pathname === "/") router.replace("/feed");
  }, [isClient, ready, onboarded, pathname, router]);

  if (!isClient || !ready) {
    return <LoadingScreen />;
  }

  if (!onboarded) {
    return <Onboarding />;
  }

  const hideNav = pathname.startsWith("/idea/");

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
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
