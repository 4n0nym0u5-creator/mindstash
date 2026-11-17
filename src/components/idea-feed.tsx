"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Flame } from "lucide-react";
import { ideas } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";

export function IdeaFeed() {
  const { topics, streak, readToday, markRead } = useStash();
  const topicsKey = topics.slice().sort().join("|");
  const [index, setIndex] = useState(0);
  const [seenTopicsKey, setSeenTopicsKey] = useState(topicsKey);

  if (seenTopicsKey !== topicsKey) {
    setSeenTopicsKey(topicsKey);
    setIndex(0);
  }

  const feed = useMemo(() => {
    const preferred = ideas.filter((idea) =>
      idea.topicIds.some((t) => topics.includes(t)),
    );
    const rest = ideas.filter((idea) => !preferred.includes(idea));
    const ordered = [...preferred, ...rest];
    return [
      ...ordered.filter((i) => !readToday.includes(i.id)),
      ...ordered.filter((i) => readToday.includes(i.id)),
    ];
  }, [topics, readToday]);

  const safeIndex = feed.length === 0 ? 0 : index % feed.length;
  const current = feed[safeIndex];

  useEffect(() => {
    if (current) markRead(current.id);
  }, [current, markRead]);

  const next = () =>
    setIndex((i) => (feed.length === 0 ? 0 : (i + 1) % feed.length));
  const prev = () =>
    setIndex((i) =>
      feed.length === 0 ? 0 : (i - 1 + feed.length) % feed.length,
    );

  if (!current) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center text-white/60">
        No ideas yet. Explore topics to fill your feed.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-6 sm:px-6">
      <header className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f3d08a]">
            Mindstash
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-white">
            Today&apos;s ideas
          </h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-[#f3d08a]/30 bg-[#f3d08a]/10 px-3 py-1.5 text-sm text-[#f3d08a]">
          <Flame className="size-4" />
          {streak} day{streak === 1 ? "" : "s"}
        </div>
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
          className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          Previous
        </Button>
        <p className="text-xs tabular-nums text-white/45">
          {safeIndex + 1} / {feed.length}
        </p>
        <Button
          type="button"
          onClick={next}
          className="rounded-full bg-white/10 text-white hover:bg-white/15"
        >
          Next idea
          <ChevronDown className="size-4 rotate-[-90deg]" />
        </Button>
      </div>
    </div>
  );
}
