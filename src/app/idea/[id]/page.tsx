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
import { CardArt } from "@/components/card-art";
import { ListenButton } from "@/components/listen-button";
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
        <p className="font-[family-name:var(--font-display)] text-3xl text-[#1A1D21]">
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
          className="rounded-full"
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
                className="rounded-full"
                aria-label="Add to collection"
              >
                <FolderPlus className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="border-black/5 bg-white text-[#1A1D21] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-[family-name:var(--font-display)] text-2xl">
                  Add to a stash
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {collections.length === 0 && (
                  <p className="text-sm text-[#5F6B76]">
                    No collections yet. Create one from your Library.
                  </p>
                )}
                {collections.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => addToCollection(c.id, idea.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-black/5 bg-[#EEF1F4] px-4 py-3 text-left text-sm hover:bg-[#e2e7ec]"
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-[#5F6B76]">
                      {c.ideaIds.length}
                    </span>
                  </button>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-2 w-full rounded-full"
                  onClick={() => createCollection("Quick stash", idea.id)}
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
              "rounded-full border border-black/5 bg-white text-[#1A1D21]",
              stashed && "border-[#E8573A]/40 text-[#E8573A]",
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

      <article className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_24px_60px_-36px_rgba(0,0,0,0.4)]">
        <CardArt kind={idea.artKind} title={idea.title} className="h-48 w-full" />
        <div className="p-6 sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8573A]">
            {primaryTopic?.name}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-[#1A1D21]">
            {idea.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#5F6B76]">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4" />
              {idea.minutes} min · {idea.curator}
            </span>
            <ListenButton text={`${idea.title}. ${idea.body}. ${idea.takeaway}`} />
          </div>
          <p className="mt-6 text-lg leading-relaxed text-[#1A1D21]/90">
            {idea.body}
          </p>
          <p className="mt-6 border-l-[3px] border-[#E8573A] pl-4 text-base italic text-[#5F6B76]">
            {idea.takeaway}
          </p>
          <p className="mt-6 text-sm text-[#5F6B76]">{idea.source}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {idea.topicIds.map((tid) => {
              const t = getTopic(tid);
              if (!t) return null;
              return (
                <Link
                  key={tid}
                  href={`/topic/${tid}`}
                  className="rounded-full border border-black/5 bg-[#EEF1F4] px-3 py-1 text-xs font-semibold text-[#1A1D21]"
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
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-[#1A1D21]">
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
