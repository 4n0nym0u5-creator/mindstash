"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { topics } from "@/data/topics";
import { useStash } from "@/lib/stash-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const { completeOnboarding } = useStash();
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<"welcome" | "topics">("welcome");

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#07141a] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, #0f766e66, transparent), radial-gradient(ellipse 60% 40% at 100% 100%, #b4530933, transparent), linear-gradient(180deg, #07141a, #0a1f24)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-10 sm:px-8">
        <AnimatePresence mode="wait">
          {step === "welcome" ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f3d08a]">
                Mindstash
              </p>
              <h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                Replace doomscrolling with microlearning
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">
                Bite-sized ideas from books and thinkers — stashed into a library
                that grows with you. Five minutes a day. A sharper mind.
              </p>
              <div className="mt-auto space-y-4 pt-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="grid grid-cols-3 gap-3 text-center text-xs text-white/50"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-4">
                    <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                      30+
                    </p>
                    curated ideas
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-4">
                    <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                      8
                    </p>
                    topics
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-4">
                    <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                      ∞
                    </p>
                    stashes
                  </div>
                </motion.div>
                <Button
                  size="lg"
                  onClick={() => setStep("topics")}
                  className="h-12 w-full rounded-full bg-[#f3d08a] text-base font-semibold text-[#07141a] hover:bg-[#ffe0a3]"
                >
                  Start learning
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="topics"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="flex flex-1 flex-col"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f3d08a]">
                Personalize
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight">
                What do you want to get smarter at?
              </h2>
              <p className="mt-3 text-white/55">
                Pick at least three topics. You can change these anytime.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {topics.map((topic, i) => {
                  const active = selected.includes(topic.id);
                  return (
                    <motion.button
                      key={topic.id}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => toggle(topic.id)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border p-4 text-left transition",
                        active
                          ? "border-[#f3d08a]/60 ring-1 ring-[#f3d08a]/40"
                          : "border-white/10 hover:border-white/25",
                      )}
                      style={{ background: topic.pattern }}
                    >
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white">{topic.name}</p>
                          {active && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-[#f3d08a] text-[#07141a]">
                              <Check className="size-3.5" strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs leading-snug text-white/70">
                          {topic.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-auto pt-8">
                <Button
                  size="lg"
                  disabled={selected.length < 3}
                  onClick={() => completeOnboarding(selected)}
                  className="h-12 w-full rounded-full bg-[#f3d08a] text-base font-semibold text-[#07141a] hover:bg-[#ffe0a3] disabled:opacity-40"
                >
                  Open my feed
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
