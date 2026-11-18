"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { topics } from "@/data/topics";
import { useStash } from "@/lib/stash-store";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: "hero",
    title: "Become the most interesting person in the room",
    subtitle: "Based on your answers, we craft a self-growth plan",
  },
  {
    id: "compare",
    title: "Key insights in 15 min",
    subtitle: "Skip the overwhelm of full books — keep the ideas that change how you think.",
  },
  {
    id: "topics",
    title: "What do you want to get smarter at?",
    subtitle: "Pick at least three topics. Your feed will follow.",
  },
] as const;

export function Onboarding() {
  const { completeOnboarding } = useStash();
  const [selected, setSelected] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const next = () => {
    if (index < slides.length - 1) setIndex((i) => i + 1);
    else if (selected.length >= 3) completeOnboarding(selected);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#EEF1F4] text-[#1A1D21]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, #FFD8CC88, transparent), radial-gradient(ellipse 50% 30% at 100% 100%, #FFE56A44, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#E8573A]">
            Mindstash
          </p>
          <div className="flex gap-1.5">
            {slides.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  i === index ? "w-5 bg-[#E8573A]" : "bg-[#1A1D21]/15",
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
          >
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-[2.35rem] leading-[1.1] tracking-tight sm:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-3 text-base text-[#5F6B76] sm:text-lg">
              {slide.subtitle}
            </p>

            {slide.id === "hero" && (
              <div className="mt-10 flex flex-1 flex-col items-center justify-center">
                <Mascot mood="hero" className="h-40 w-36 animate-float-soft" />
                <p className="mt-6 max-w-xs text-center text-sm text-[#5F6B76]">
                  Replace doomscrolling with microlearning that actually sticks.
                </p>
              </div>
            )}

            {slide.id === "compare" && (
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
                          background: ["#E8573A", "#2F6BFF", "#F5C542"][i],
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
                    <span className="text-[#E8573A]">Key</span> insights
                  </p>
                  <p className="text-xs text-[#1A1D21]/70">in 15 min.</p>
                  <Mascot mood="hero" className="mt-4 h-28 w-24" />
                </div>
              </div>
            )}

            {slide.id === "topics" && (
              <div className="mt-8 grid grid-cols-2 gap-3">
                {topics.map((topic, i) => {
                  const active = selected.includes(topic.id);
                  return (
                    <motion.button
                      key={topic.id}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => toggle(topic.id)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border p-4 text-left transition",
                        active
                          ? "border-[#E8573A] ring-2 ring-[#E8573A]/25"
                          : "border-black/5 bg-white hover:border-black/15",
                      )}
                      style={
                        active
                          ? { background: topic.pattern }
                          : undefined
                      }
                    >
                      {active && <div className="absolute inset-0 bg-black/35" />}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "font-semibold",
                              active ? "text-white" : "text-[#1A1D21]",
                            )}
                          >
                            {topic.name}
                          </p>
                          {active && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-white text-[#E8573A]">
                              <Check className="size-3.5" strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "mt-1.5 text-xs leading-snug",
                            active ? "text-white/75" : "text-[#5F6B76]",
                          )}
                        >
                          {topic.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 pb-2">
          <Button
            size="lg"
            disabled={slide.id === "topics" && selected.length < 3}
            onClick={next}
            className="h-12 w-full rounded-full bg-[#E8573A] text-base font-semibold text-white hover:bg-[#d4482e] disabled:opacity-40"
          >
            {slide.id === "topics" ? "Open my feed" : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
