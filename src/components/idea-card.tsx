"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { getTopic } from "@/data/topics";
import type { Idea } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardArt } from "@/components/card-art";
import { ListenButton } from "@/components/listen-button";

type IdeaCardProps = {
  idea: Idea;
  variant?: "feed" | "compact" | "quote";
  className?: string;
};

export function IdeaCard({
  idea,
  variant = "feed",
  className,
}: IdeaCardProps) {
  const { isStashed, toggleStash, markRead } = useStash();
  const stashed = isStashed(idea.id);
  const primaryTopic = getTopic(idea.topicIds[0]);
  const isQuote = idea.format === "quote" || variant === "quote";

  if (variant === "compact") {
    return (
      <Link
        href={`/idea/${idea.id}`}
        onClick={() => markRead(idea.id)}
        className={cn(
          "group block overflow-hidden rounded-[1.35rem] border border-black/5 bg-white shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5",
          className,
        )}
      >
        <CardArt kind={idea.artKind} title={idea.title} className="h-28 w-full" />
        <div className="space-y-2 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E8573A]">
            {primaryTopic?.name}
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-lg leading-snug text-[#1A1D21]">
            {idea.title}
          </h3>
          <p className="line-clamp-2 text-sm text-[#5F6B76]">{idea.takeaway}</p>
        </div>
      </Link>
    );
  }

  if (isQuote) {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.4)] sm:p-8",
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8573A] to-[#F5C542]">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={stashed ? "Remove from stash" : "Stash idea"}
            onClick={() => toggleStash(idea.id)}
            className={cn(
              "rounded-full",
              stashed && "text-[#E8573A]",
            )}
          >
            {stashed ? (
              <BookmarkCheck className="size-5" />
            ) : (
              <Bookmark className="size-5" />
            )}
          </Button>
        </div>
        <div className="mx-auto mt-6 flex max-w-sm flex-col items-center text-center">
          <CardArt
            kind="portrait"
            title={idea.quoteAuthor ?? idea.title}
            className="mb-5 size-24 rounded-full border-4 border-white shadow-md"
          />
          <p className="font-[family-name:var(--font-display)] text-2xl italic leading-snug text-[#1A1D21] sm:text-3xl">
            “{idea.takeaway}”
          </p>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#5F6B76]">
            {idea.quoteAuthor ?? idea.source}
          </p>
        </div>
        <div className="mt-8 flex items-center justify-between gap-3">
          <ListenButton text={`${idea.takeaway}. ${idea.body}`} />
          <Link
            href={`/idea/${idea.id}`}
            onClick={() => markRead(idea.id)}
            className="text-sm font-semibold text-[#2F6BFF]"
          >
            Open idea
          </Link>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex min-h-[70vh] flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_28px_70px_-40px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <CardArt kind={idea.artKind} title={idea.title} className="h-44 w-full sm:h-52" />

      <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8573A]">
              {primaryTopic?.name ?? "Idea"}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#5F6B76]">
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
              "size-10 rounded-full border border-black/5 bg-[#EEF1F4]",
              stashed && "border-[#E8573A]/30 text-[#E8573A]",
            )}
          >
            {stashed ? (
              <BookmarkCheck className="size-5" />
            ) : (
              <Bookmark className="size-5" />
            )}
          </Button>
        </div>

        <h2 className="mt-5 font-[family-name:var(--font-display)] text-[1.85rem] leading-[1.15] tracking-tight text-[#1A1D21] sm:text-[2.2rem]">
          {idea.title}
        </h2>

        {idea.format === "list" && idea.bullets ? (
          <ul className="mt-4 space-y-2.5">
            {idea.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-[1.02rem] text-[#1A1D21]/85">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#E8573A]" />
                <span>
                  <strong className="font-semibold">{b.split(":")[0]}</strong>
                  {b.includes(":") ? `:${b.split(":").slice(1).join(":")}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[1.05rem] leading-relaxed text-[#1A1D21]/85">
            {idea.body}
          </p>
        )}

        <p className="mt-5 border-l-[3px] border-[#E8573A] pl-3 text-sm italic leading-relaxed text-[#5F6B76]">
          {idea.takeaway}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <div className="text-xs text-[#5F6B76]">
            <p className="font-semibold text-[#1A1D21]/80">{idea.source}</p>
            <p>Curated by {idea.curator}</p>
          </div>
          <div className="flex items-center gap-2">
            <ListenButton text={`${idea.title}. ${idea.body}. ${idea.takeaway}`} />
            <Link
              href={`/idea/${idea.id}`}
              onClick={() => markRead(idea.id)}
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#1A1D21] px-4 text-sm font-semibold text-white transition hover:bg-black"
            >
              Open
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
