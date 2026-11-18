"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Flame } from "lucide-react";
import { ideas } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";

export function IdeaFeed() {
  const { topics, streak, markRead, profile } = useStash();
  const topicsKey = topics.slice().sort().join("|");

  const feed = useMemo(() => {
    const preferred = ideas.filter((idea) =>
      idea.topicIds.some((t) => topics.includes(t)),
    );
    const rest = ideas.filter((idea) => !preferred.includes(idea));
    return [...preferred, ...rest];
  }, [topics]);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [seenTopicsKey, setSeenTopicsKey] = useState(topicsKey);

  if (seenTopicsKey !== topicsKey) {
    setSeenTopicsKey(topicsKey);
    setCurrentId(feed[0]?.id ?? null);
  }

  const activeId =
    currentId && feed.some((i) => i.id === currentId)
      ? currentId
      : (feed[0]?.id ?? null);

  const index = activeId ? feed.findIndex((i) => i.id === activeId) : 0;
  const current = activeId ? feed.find((i) => i.id === activeId) : undefined;

  useEffect(() => {
    if (current) markRead(current.id);
  }, [current, markRead]);

  const next = () => {
    if (feed.length === 0) return;
    const nextIndex = (Math.max(index, 0) + 1) % feed.length;
    setCurrentId(feed[nextIndex].id);
  };

  const prev = () => {
    if (feed.length === 0) return;
    const prevIndex = (Math.max(index, 0) - 1 + feed.length) % feed.length;
    setCurrentId(feed[prevIndex].id);
  };

  if (!current) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-[#5F6B76]">
        No ideas yet. Explore topics to fill your feed.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-6 sm:px-6">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E8573A]">
            Mindstash
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[#1A1D21]">
            Today&apos;s ideas
          </h1>
          <p className="mt-1 text-sm text-[#5F6B76]">
            {profile?.energy
              ? `Your plan · ${profile.monthlyGoal} ideas / week`
              : "Quick microlearning insights"}
          </p>
        </div>
        <Link
          href="/streaks"
          className="flex items-center gap-1.5 rounded-full border border-[#E8573A]/25 bg-[#FFE8E1] px-3 py-1.5 text-sm font-semibold text-[#E8573A]"
        >
          <Flame className="size-4" />
          {streak}
        </Link>
      </header>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <IdeaCard idea={current} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={prev}
          className="rounded-full text-[#5F6B76] hover:bg-white hover:text-[#1A1D21]"
        >
          Previous
        </Button>
        <p className="text-xs tabular-nums text-[#5F6B76]">
          {index + 1} / {feed.length}
        </p>
        <Button
          type="button"
          onClick={next}
          className="rounded-full bg-[#1A1D21] text-white hover:bg-black"
        >
          Next idea
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
