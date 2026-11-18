"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Flame } from "lucide-react";
import { ideas } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { AppFrame, PageHeader } from "@/components/page-header";
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
      <AppFrame className="items-center justify-center text-center text-muted-foreground">
        No ideas yet. Explore topics to fill your feed.
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Mindstash"
        title="Today's ideas"
        subtitle={
          profile?.energy
            ? `Your plan · ${profile.monthlyGoal} ideas / week`
            : "Quick microlearning insights"
        }
        action={
          <Link
            href="/streaks"
            className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
          >
            <Flame className="size-4" />
            {streak}
          </Link>
        }
      />

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
          className="rounded-full text-muted-foreground hover:bg-card hover:text-foreground"
        >
          Previous
        </Button>
        <p className="text-xs tabular-nums text-muted-foreground">
          {index + 1} / {feed.length}
        </p>
        <Button
          type="button"
          onClick={next}
          className="rounded-full bg-ink text-white hover:bg-foreground"
        >
          Next idea
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </AppFrame>
  );
}
