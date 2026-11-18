"use client";

import { useMemo } from "react";
import { Flame, Snowflake, Trophy } from "lucide-react";
import { todayKey, useStash } from "@/lib/stash-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StreaksPage() {
  const { streak, maxStreak, freezesLeft, dayLog, applyFreeze } = useStash();

  const month = useMemo(() => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const monthIndex = now.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const startWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
    const cells: Array<{ day: number | null; key: string | null }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null, key: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, key });
    }
    return {
      label: now.toLocaleString("en-AU", { month: "long", timeZone: "UTC" }),
      cells,
      today: todayKey(),
    };
  }, []);

  const milestones = [streak + 7, streak + 14, streak + 28].map((n) =>
    Math.max(n, 7),
  );
  const progress = Math.min(100, (streak / milestones[2]) * 100);

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-28 pt-6 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E8573A]">
        Streaks
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[#1A1D21]">
        Keep the flame lit
      </h1>

      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5 text-[#E8573A]">
            <Flame className="size-4" />
            {streak}
          </span>
          <div className="flex gap-4 text-[#5F6B76]">
            {milestones.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#EEF1F4]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#E8573A] to-[#F5C542] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-[#EEF1F4] px-2 py-4">
            <Trophy className="mx-auto size-5 text-[#F5C542]" />
            <p className="mt-2 text-2xl font-bold text-[#1A1D21]">{maxStreak}</p>
            <p className="text-xs text-[#5F6B76]">Max streak</p>
          </div>
          <div className="rounded-2xl bg-[#FFE8E1] px-2 py-4">
            <Flame className="mx-auto size-5 text-[#E8573A]" />
            <p className="mt-2 text-2xl font-bold text-[#1A1D21]">{streak}</p>
            <p className="text-xs text-[#5F6B76]">Current</p>
          </div>
          <div className="rounded-2xl bg-[#E4F2FF] px-2 py-4">
            <Snowflake className="mx-auto size-5 text-[#2F6BFF]" />
            <p className="mt-2 text-2xl font-bold text-[#1A1D21]">{freezesLeft}</p>
            <p className="text-xs text-[#5F6B76]">Freezes left</p>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          disabled={freezesLeft <= 0 || dayLog[month.today] === "freeze"}
          onClick={() => applyFreeze()}
          className="mt-5 w-full rounded-full"
        >
          Use a streak freeze today
        </Button>
      </div>

      <section className="mt-6 rounded-[1.5rem] border border-black/5 bg-white p-5">
        <h2 className="font-semibold text-[#1A1D21]">{month.label}</h2>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-[#5F6B76]">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {month.cells.map((cell, i) => {
            if (!cell.day || !cell.key) {
              return <span key={`e-${i}`} className="aspect-square" />;
            }
            const status = dayLog[cell.key];
            const isToday = cell.key === month.today;
            return (
              <div
                key={cell.key}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl text-sm font-semibold",
                  status === "read" && "bg-[#FFE8C8] text-[#E8573A]",
                  status === "freeze" && "bg-[#E4F2FF] text-[#2F6BFF]",
                  !status && "bg-[#EEF1F4] text-[#5F6B76]",
                  isToday && "ring-2 ring-[#E8573A]",
                )}
              >
                {status === "freeze" ? (
                  <Snowflake className="size-3.5" />
                ) : (
                  cell.day
                )}
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-6 rounded-full bg-[#1A1D21] px-4 py-3 text-center text-sm font-semibold text-white">
        🔥 {streak}-day reading streak
      </p>
    </div>
  );
}
