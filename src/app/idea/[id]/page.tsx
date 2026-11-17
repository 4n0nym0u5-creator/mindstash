"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Clock3,
  FolderPlus,
} from "lucide-react";
import { getIdea, relatedIdeas } from "@/data/ideas";
import { getTopic } from "@/data/topics";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const idea = getIdea(id);
  const router = useRouter();
  const {
    isStashed,
    toggleStash,
    markRead,
    collections,
    addToCollection,
    createCollection,
  } = useStash();

  useEffect(() => {
    if (idea) markRead(idea.id);
  }, [idea, markRead]);

  if (!idea) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl text-white">
          Idea not found
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/feed">Back to feed</Link>
        </Button>
      </div>
    );
  }

  const stashed = isStashed(idea.id);
  const related = relatedIdeas(idea);
  const primaryTopic = getTopic(idea.topicIds[0]);

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-16 pt-4 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Add to collection"
              >
                <FolderPlus className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-[#0d2229] text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-[family-name:var(--font-display)] text-2xl">
                  Add to a stash
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {collections.length === 0 && (
                  <p className="text-sm text-white/50">
                    No collections yet. Create one from your Library.
                  </p>
                )}
                {collections.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => addToCollection(c.id, idea.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm hover:bg-white/10"
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-white/40">
                      {c.ideaIds.length}
                    </span>
                  </button>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2 w-full rounded-full"
                  onClick={() => {
                    createCollection("Quick stash", idea.id);
                  }}
                >
                  Create “Quick stash”
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            type="button"
            size="icon"
            onClick={() => toggleStash(idea.id)}
            className={cn(
              "rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/15",
              stashed && "border-[#f3d08a]/50 bg-[#f3d08a]/15 text-[#f3d08a]",
            )}
            aria-label={stashed ? "Remove from stash" : "Stash idea"}
          >
            {stashed ? (
              <BookmarkCheck className="size-5" />
            ) : (
              <Bookmark className="size-5" />
            )}
          </Button>
        </div>
      </div>

      <article
        className="overflow-hidden rounded-[1.75rem] border border-white/10"
        style={{ background: idea.art }}
      >
        <div className="bg-gradient-to-b from-black/20 via-transparent to-black/80 p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f3d08a]">
            {primaryTopic?.name}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-white sm:text-5xl">
            {idea.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/65">
            <Clock3 className="size-4" />
            {idea.minutes} min · Curated by {idea.curator}
          </div>
          <p className="mt-8 text-lg leading-relaxed text-white/90">
            {idea.body}
          </p>
          <p className="mt-6 border-l-2 border-[#f3d08a]/70 pl-4 text-base italic text-[#f3d08a]">
            {idea.takeaway}
          </p>
          <p className="mt-8 text-sm text-white/55">{idea.source}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {idea.topicIds.map((tid) => {
              const t = getTopic(tid);
              if (!t) return null;
              return (
                <Link
                  key={tid}
                  href={`/topic/${tid}`}
                  className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-white/80 backdrop-blur hover:bg-black/40"
                >
                  {t.name}
                </Link>
              );
            })}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-white">
            Related ideas
          </h2>
          <div className="grid gap-4">
            {related.map((r) => (
              <IdeaCard key={r.id} idea={r} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
