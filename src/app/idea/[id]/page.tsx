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
        <p className="font-[family-name:var(--font-display)] text-3xl text-foreground">
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
    <div className="mx-auto w-full max-w-lg px-5 pb-16 pt-4 sm:px-6">
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
            <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-[family-name:var(--font-display)] text-2xl">
                  Add to a stash
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {collections.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No collections yet. Create one from your Library.
                  </p>
                )}
                {collections.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => addToCollection(c.id, idea.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3 text-left text-sm hover:bg-secondary/80"
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-muted-foreground">
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
              "rounded-full border border-border bg-card text-foreground",
              stashed && "border-primary/40 text-primary",
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

      <article className="surface-card overflow-hidden">
        <CardArt kind={idea.artKind} title={idea.title} className="h-48 w-full" />
        <div className="p-6 sm:p-8">
          <p className="label-kicker">{primaryTopic?.name}</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-foreground">
            {idea.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4" />
              {idea.minutes} min · {idea.curator}
            </span>
            <ListenButton
              text={`${idea.title}. ${idea.body}. ${idea.takeaway}`}
            />
          </div>
          {idea.format === "list" && idea.bullets ? (
            <ul className="mt-6 space-y-2.5">
              {idea.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-lg text-foreground/90">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {b}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-lg leading-relaxed text-foreground/90">
              {idea.body}
            </p>
          )}
          <p className="mt-6 border-l-[3px] border-primary pl-4 text-base italic text-muted-foreground">
            {idea.takeaway}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">{idea.source}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {idea.topicIds.map((tid) => {
              const t = getTopic(tid);
              if (!t) return null;
              return (
                <Link
                  key={tid}
                  href={`/topic/${tid}`}
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground"
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
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-foreground">
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
