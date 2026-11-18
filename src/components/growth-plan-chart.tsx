"use client";

import { planWindow } from "@/data/onboarding";

export function GrowthPlanChart({
  goalLabel = "15 ideas / week",
}: {
  goalLabel?: string;
}) {
  const { nowLabel, endLabel } = planWindow();

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-black/5 bg-[#F4F5F7] px-4 pb-6 pt-10">
      <div
        className="pointer-events-none absolute inset-x-6 top-8 bottom-14 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, #d5d8de 27px, #d5d8de 28px)",
        }}
      />

      <svg viewBox="0 0 320 160" className="relative z-10 h-40 w-full">
        <path
          d="M28 128 C 90 120, 140 95, 180 70 S 260 28, 292 22"
          fill="none"
          stroke="#3DBF7A"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="28" cy="128" r="8" fill="#3DBF7A" />
        <circle cx="292" cy="22" r="8" fill="#E8573A" />
      </svg>

      <div className="relative z-10 -mt-36 flex items-start justify-between px-1">
        <div className="mt-24">
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#5F6B76] shadow-sm">
            Now
          </span>
        </div>
        <div className="mr-2 mt-1 max-w-[46%] text-right">
          <span className="inline-block rounded-2xl bg-[#E8573A] px-3 py-2 text-left text-xs font-bold leading-snug text-white shadow-sm">
            {goalLabel}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-16 flex items-end justify-between px-1 text-xs font-semibold">
        <span className="text-[#3DBF7A]">{nowLabel}</span>
        <span className="text-[#E8573A]">{endLabel}</span>
      </div>
    </div>
  );
}
