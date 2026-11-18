"use client";

import { planWindow } from "@/data/onboarding";

export function GrowthPlanChart({
  goalLabel = "15 ideas / week",
}: {
  goalLabel?: string;
}) {
  const { nowLabel, endLabel } = planWindow();

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-secondary/60 px-4 pb-6 pt-10">
      <div
        className="pointer-events-none absolute inset-x-6 top-8 bottom-14 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #cfd4db 27px, #cfd4db 28px)",
        }}
      />

      <svg viewBox="0 0 320 160" className="relative z-10 h-40 w-full">
        <path
          d="M28 128 C 90 120, 140 95, 180 70 S 260 28, 292 22"
          fill="none"
          stroke="#3D6B5A"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="28" cy="128" r="8" fill="#3D6B5A" />
        <circle cx="292" cy="22" r="8" fill="#C94B34" />
      </svg>

      <div className="relative z-10 -mt-36 flex items-start justify-between px-1">
        <div className="mt-24">
          <span className="rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
            Now
          </span>
        </div>
        <div className="mr-2 mt-1 max-w-[46%] text-right">
          <span className="inline-block rounded-2xl bg-primary px-3 py-2 text-left text-xs font-bold leading-snug text-primary-foreground shadow-sm">
            {goalLabel}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-16 flex items-end justify-between px-1 text-xs font-semibold">
        <span className="text-[#3D6B5A]">{nowLabel}</span>
        <span className="text-primary">{endLabel}</span>
      </div>
    </div>
  );
}
