"use client";

import { useMemo, useState } from "react";
import { FolderPlus, Trash2 } from "lucide-react";
import { getIdea } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { AppFrame, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LibraryPage() {
  const { stashed, collections, createCollection, deleteCollection } =
    useStash();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"ideas" | "stashes">("ideas");

  const stashedIdeas = useMemo(
    () => stashed.map((id) => getIdea(id)).filter(Boolean),
    [stashed],
  );

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Library"
        title="Your knowledge home"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Create stash"
              >
                <FolderPlus className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-[family-name:var(--font-display)] text-2xl">
                  New stash
                </DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  createCollection(name);
                  setName("");
                  setOpen(false);
                  setTab("stashes");
                }}
              >
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leaving & healing"
                  className="h-11 border-border bg-secondary"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create stash
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex gap-2 rounded-full bg-card p-1 shadow-sm">
        {(
          [
            ["ideas", `Stashed (${stashedIdeas.length})`],
            ["stashes", `Collections (${collections.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
              tab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "ideas" ? (
        <section className="mt-6">
          {stashedIdeas.length === 0 ? (
            <div className="surface-card border-dashed px-5 py-14 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-foreground">
                Nothing stashed yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap the bookmark on any idea to save it here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {stashedIdeas.map(
                (idea) =>
                  idea && (
                    <IdeaCard key={idea.id} idea={idea} variant="compact" />
                  ),
              )}
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6 space-y-3">
          {collections.length === 0 ? (
            <div className="surface-card border-dashed px-5 py-14 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-foreground">
                No collections yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Group ideas into stashes for healing, goals, or moods.
              </p>
            </div>
          ) : (
            collections.map((collection) => (
              <div key={collection.id} className="surface-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {collection.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {collection.ideaIds.length} idea
                      {collection.ideaIds.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${collection.name}`}
                    onClick={() => deleteCollection(collection.id)}
                    className="text-muted-foreground"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                {collection.ideaIds.length > 0 && (
                  <ul className="mt-3 space-y-2 border-t border-border pt-3">
                    {collection.ideaIds.map((id) => {
                      const idea = getIdea(id);
                      if (!idea) return null;
                      return (
                        <li key={id} className="text-sm text-muted-foreground">
                          · {idea.title}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))
          )}
        </section>
      )}
    </AppFrame>
  );
}
