"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStash } from "@/lib/stash-store";

export default function HomePage() {
  const { ready, onboarded } = useStash();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (onboarded) router.replace("/feed");
  }, [ready, onboarded, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-[#f3d08a]/40" />
    </div>
  );
}
