"use client";

import { useMemo } from "react";
import { Flame, Snowflake, Trophy } from "lucide-react";
import { todayKey, useStash } from "@/lib/stash-store";
import { AppFrame, PageHeader } from "@/components/page-header";
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
    <AppFrame>
      <PageHeader
        eyebrow="Streaks"
        title="Keep the flame lit"
        subtitle="Small daily reads compound into lasting change"
      />

      <div className="surface-card p-5">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5 text-primary">
            <Flame className="size-4" />
            {streak}
          </span>
          <div className="flex gap-4 text-muted-foreground">
            {milestones.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[#c4a35a] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-secondary px-2 py-4">
            <Trophy className="mx-auto size-5 text-[#c4a35a]" />
            <p className="mt-2 text-2xl font-bold text-foreground">{maxStreak}</p>
            <p className="text-xs text-muted-foreground">Max streak</p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-2 py-4">
            <Flame className="mx-auto size-5 text-primary" />
            <p className="mt-2 text-2xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
          <div className="rounded-2xl bg-accent/10 px-2 py-4">
            <Snowflake className="mx-auto size-5 text-accent" />
            <p className="mt-2 text-2xl font-bold text-foreground">
              {freezesLeft}
            </p>
            <p className="text-xs text-muted-foreground">Freezes left</p>
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

      <section className="surface-card mt-6 p-5">
        <h2 className="font-semibold text-foreground">{month.label}</h2>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
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
                  status === "read" && "bg-primary/15 text-primary",
                  status === "freeze" && "bg-accent/15 text-accent",
                  !status && "bg-secondary text-muted-foreground",
                  isToday && "ring-2 ring-primary",
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

      <p className="mt-6 rounded-full bg-ink px-4 py-3 text-center text-sm font-semibold text-white">
        {streak}-day reading streak
      </p>
    </AppFrame>
  );
}
