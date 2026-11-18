"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  energyWindows,
  growthReasons,
  learningStyles,
  monthBenefits,
  profileTopics,
  resolveFeedTopics,
} from "@/data/onboarding";
import { useStash } from "@/lib/stash-store";
import { Button } from "@/components/ui/button";
import { GrowthPlanChart } from "@/components/growth-plan-chart";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

type StepId =
  | "welcome"
  | "compare"
  | "profile"
  | "reasons"
  | "energy"
  | "styles"
  | "plan"
  | "benefits";

const steps: { id: StepId; phase: "INTRO" | "PROFILE" | "PERSONALIZE" | "PERSONALITY" | "PLAN" }[] = [
  { id: "welcome", phase: "INTRO" },
  { id: "compare", phase: "INTRO" },
  { id: "profile", phase: "PROFILE" },
  { id: "reasons", phase: "PERSONALIZE" },
  { id: "energy", phase: "PERSONALITY" },
  { id: "styles", phase: "PERSONALITY" },
  { id: "plan", phase: "PLAN" },
  { id: "benefits", phase: "PLAN" },
];

function toggleIn(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function ProgressRail({ index }: { index: number }) {
  const phaseOrder = ["PROFILE", "PERSONALIZE", "PERSONALITY", "PLAN"] as const;
  const currentPhase = steps[index]?.phase;
  const activeIdx =
    currentPhase === "INTRO"
      ? -1
      : phaseOrder.indexOf(currentPhase as (typeof phaseOrder)[number]);

  return (
    <div className="mx-auto mb-4 flex w-full max-w-xs items-center gap-0 px-2">
      {phaseOrder.map((phase, i) => {
        const done = i < activeIdx;
        const current = i === activeIdx;
        return (
          <div key={phase} className="flex flex-1 items-center">
            <div
              className={cn(
                "flex size-5 items-center justify-center rounded-full border-2 text-[10px]",
                done && "border-primary bg-primary text-primary-foreground",
                current && "border-primary bg-card text-primary",
                !done && !current && "border-border bg-card text-transparent",
              )}
            >
              {done ? <Check className="size-3" strokeWidth={3} /> : "•"}
            </div>
            {i < phaseOrder.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  i < activeIdx ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Onboarding() {
  const { completeOnboarding } = useStash();
  const [index, setIndex] = useState(0);
  const [pickedTopics, setPickedTopics] = useState<string[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [energy, setEnergy] = useState<string | null>(null);
  const [styles, setStyles] = useState<string[]>([]);

  const step = steps[index];
  const feedTopics = useMemo(
    () => resolveFeedTopics(pickedTopics),
    [pickedTopics],
  );

  const canContinue = (() => {
    switch (step.id) {
      case "profile":
        return pickedTopics.length >= 3;
      case "reasons":
        return reasons.length >= 1;
      case "energy":
        return Boolean(energy);
      case "styles":
        return styles.length >= 1;
      default:
        return true;
    }
  })();

  const finish = () => {
    completeOnboarding({
      topics: feedTopics.length ? feedTopics : ["productivity", "psychology"],
      profile: {
        profileTopics: pickedTopics,
        reasons,
        energy,
        styles,
        monthlyGoal: 15,
      },
    });
  };

  const next = () => {
    if (!canContinue) return;
    if (index >= steps.length - 1) finish();
    else setIndex((i) => i + 1);
  };

  const phaseLabel =
    step.phase === "INTRO" ? "Mindstash" : step.phase;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-6 sm:px-7">
        {step.phase !== "INTRO" && <ProgressRail index={index} />}

        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          {phaseLabel}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
          >
            {step.id === "welcome" && (
              <>
                <h1 className="mt-6 text-center font-[family-name:var(--font-display)] text-4xl leading-[1.1]">
                  Become the most interesting person in the room
                </h1>
                <p className="mt-3 text-center text-muted-foreground">
                  Based on your answers, we craft a self-growth plan.
                </p>
                <div className="mt-10 flex flex-1 flex-col items-center justify-center">
                  <Mascot mood="hero" className="h-36 w-32 animate-float-soft" />
                </div>
              </>
            )}

            {step.id === "compare" && (
              <>
                <h1 className="mt-5 text-center text-2xl font-bold leading-snug sm:text-3xl">
                  Key insights in 15 min
                </h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Skip the overwhelm of full books — keep the ideas that change
                  how you think.
                </p>
                <div className="mt-8 grid flex-1 grid-cols-2 gap-0 overflow-hidden rounded-[1.5rem] border border-black/5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]">
                  <div className="relative flex flex-col items-center bg-[#9AA3AD] px-3 pb-6 pt-8 text-center text-white">
                    <p className="text-sm font-bold">Full Books</p>
                    <p className="text-xs opacity-80">too many hours</p>
                    <Mascot mood="overwhelmed" className="mt-4 h-28 w-24" />
                    <div className="mt-2 flex flex-col gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-2.5 w-14 rounded-sm"
                          style={{
                            background: ["#c94b34", "#2a4a6b", "#c4a35a"][i],
                            transform: `rotate(${(i - 1) * 4}deg)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    className="relative flex flex-col items-center px-3 pb-6 pt-8 text-center"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 30%, #FFF6D6, #F5C542)",
                    }}
                  >
                    <p className="text-sm font-bold">
                      <span className="text-primary">Key</span> insights
                    </p>
                    <p className="text-xs text-foreground/70">in 15 min.</p>
                    <Mascot mood="hero" className="mt-4 h-28 w-24" />
                  </div>
                </div>
              </>
            )}

            {step.id === "profile" && (
              <>
                <h1 className="mt-5 text-center text-2xl font-bold leading-snug sm:text-3xl">
                  Choose the topics you’d like to elevate
                </h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  The choice won’t limit your experience
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2.5">
                  {profileTopics.map((topic) => {
                    const active = pickedTopics.includes(topic.id);
                    const Icon = topic.icon;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() =>
                          setPickedTopics((list) => toggleIn(list, topic.id))
                        }
                        className={cn(
                          "flex min-h-[6.5rem] flex-col items-center justify-center gap-2 rounded-2xl border bg-white px-2 py-3 text-center shadow-sm transition",
                          active
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-black/5 hover:border-black/15",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-6",
                            active ? "text-primary" : "text-foreground",
                          )}
                        />
                        <span className="text-[11px] font-semibold leading-tight">
                          {topic.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step.id === "reasons" && (
              <>
                <h1 className="mt-5 text-center text-2xl font-bold leading-snug sm:text-3xl">
                  Do you have a specific reason for self-growth?
                </h1>
                <div className="mt-6 space-y-2.5">
                  {growthReasons.map((row) => {
                    const active = reasons.includes(row.id);
                    const Icon = row.icon;
                    return (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() =>
                          setReasons((list) => toggleIn(list, row.id))
                        }
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left shadow-sm transition",
                          active
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-black/5",
                        )}
                      >
                        <Icon className="size-5 shrink-0 text-foreground" />
                        <span className="flex-1 text-sm font-semibold">
                          {row.label}
                        </span>
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-md border",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-[#C9CED6]",
                          )}
                        >
                          {active && <Check className="size-3" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step.id === "energy" && (
              <>
                <h1 className="mt-5 text-center text-2xl font-bold leading-snug sm:text-3xl">
                  When do you have the most mental energy for learning?
                </h1>
                <div className="mt-8 space-y-3">
                  {energyWindows.map((row) => {
                    const active = energy === row.id;
                    const Icon = row.icon;
                    return (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() => setEnergy(row.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-full border bg-white px-5 py-4 text-left shadow-sm transition",
                          active
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-black/5",
                        )}
                      >
                        <Icon className="size-5 text-foreground" />
                        <span className="text-sm font-semibold">{row.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step.id === "styles" && (
              <>
                <h1 className="mt-5 text-center text-2xl font-bold leading-snug sm:text-3xl">
                  What learning styles work best for you?
                </h1>
                <div className="mt-6 space-y-2.5">
                  {learningStyles.map((row) => {
                    const active = styles.includes(row.id);
                    const Icon = row.icon;
                    return (
                      <button
                        key={row.id}
                        type="button"
                        onClick={() =>
                          setStyles((list) => toggleIn(list, row.id))
                        }
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left shadow-sm transition",
                          active
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-black/5",
                        )}
                      >
                        <Icon className="size-5 shrink-0 text-foreground" />
                        <span className="flex-1 text-sm font-semibold">
                          {row.label}
                        </span>
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-md border",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-[#C9CED6]",
                          )}
                        >
                          {active && <Check className="size-3" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step.id === "plan" && (
              <>
                <div className="mt-4 flex justify-center">
                  <Mascot mood="wink" className="h-14 w-12" />
                </div>
                <h1 className="mt-3 text-center text-3xl font-bold leading-tight">
                  Your personal growth plan{" "}
                  <span className="text-primary">is ready</span>
                </h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Based on your answers, we crafted a self-growth plan.
                </p>
                <div className="mt-6">
                  <GrowthPlanChart goalLabel="15 ideas per week" />
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Tuned for{" "}
                  {energyWindows.find((e) => e.id === energy)?.label?.toLowerCase() ??
                    "your best hours"}
                  {styles.includes("audio") ? " · listen mode on" : ""}.
                </p>
              </>
            )}

            {step.id === "benefits" && (
              <>
                <h1 className="mt-5 text-center text-3xl font-bold leading-tight">
                  One Month In: You&apos;re{" "}
                  <span className="text-primary">Legally Smarter</span>
                </h1>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  People reported these top 6 benefits after the first month
                </p>
                <ul className="mt-6 space-y-3">
                  {monthBenefits.map((b) => {
                    const Icon = b.icon;
                    return (
                      <li
                        key={b.title}
                        className="flex gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm"
                      >
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {b.title}
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground">{b.body}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 pb-2">
          <Button
            size="lg"
            disabled={!canContinue}
            onClick={next}
            className="h-12 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {step.id === "benefits"
              ? "Start learning"
              : step.id === "plan"
                ? "See what changes"
                : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
          {step.phase !== "INTRO" && step.id !== "benefits" && (
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="mt-3 w-full text-center text-sm font-semibold text-muted-foreground"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
