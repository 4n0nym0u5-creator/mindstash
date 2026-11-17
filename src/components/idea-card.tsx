"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { getTopic } from "@/data/topics";
import type { Idea } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type IdeaCardProps = {
  idea: Idea;
  variant?: "feed" | "compact" | "hero";
  className?: string;
  onOpen?: () => void;
};

export function IdeaCard({
  idea,
  variant = "feed",
  className,
  onOpen,
}: IdeaCardProps) {
  const { isStashed, toggleStash, markRead } = useStash();
  const stashed = isStashed(idea.id);
  const primaryTopic = getTopic(idea.topicIds[0]);

  if (variant === "compact") {
    return (
      <Link
        href={`/idea/${idea.id}`}
        onClick={() => markRead(idea.id)}
        className={cn(
          "group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-white/20 hover:bg-white/[0.07]",
          className,
        )}
      >
        <div
          className="h-24 w-full"
          style={{ background: idea.art }}
          aria-hidden
        />
        <div className="space-y-2 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#f3d08a]/80">
            {primaryTopic?.name}
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-lg leading-snug text-white">
            {idea.title}
          </h3>
          <p className="line-clamp-2 text-sm text-white/55">{idea.takeaway}</p>
        </div>
      </Link>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex min-h-[72vh] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]",
        className,
      )}
      style={{ background: idea.art }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at 85% 80%, rgba(0,0,0,0.35), transparent 40%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/75" />

      <div className="relative z-10 flex flex-1 flex-col justify-between p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f3d08a]">
              {primaryTopic?.name ?? "Idea"}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/65">
              <Clock3 className="size-3.5" />
              {idea.minutes} min read
            </div>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={stashed ? "Remove from stash" : "Stash idea"}
            onClick={() => toggleStash(idea.id)}
            className={cn(
              "size-11 rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md hover:bg-black/40",
              stashed && "border-[#f3d08a]/50 text-[#f3d08a]",
            )}
          >
            {stashed ? (
              <BookmarkCheck className="size-5" />
            ) : (
              <Bookmark className="size-5" />
            )}
          </Button>
        </div>

        <div className="mt-auto space-y-5 pt-16">
          <h2 className="max-w-xl font-[family-name:var(--font-display)] text-[2rem] leading-[1.15] tracking-tight text-white sm:text-[2.55rem]">
            {idea.title}
          </h2>
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-white/85 sm:text-lg">
            {idea.body}
          </p>
          <p className="max-w-xl border-l-2 border-[#f3d08a]/70 pl-4 text-sm italic leading-relaxed text-[#f3d08a]">
            {idea.takeaway}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-white/55">
              <p className="font-medium text-white/75">{idea.source}</p>
              <p>Curated by {idea.curator}</p>
            </div>
            <Link
              href={`/idea/${idea.id}`}
              onClick={() => {
                markRead(idea.id);
                onOpen?.();
              }}
              className="inline-flex h-10 items-center justify-center rounded-full bg-white/95 px-4 text-sm font-medium text-[#07141a] transition hover:bg-white"
            >
              Open idea
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
