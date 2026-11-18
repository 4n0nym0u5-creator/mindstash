"use client";

import { useMemo, useState } from "react";
import { FolderPlus, Trash2 } from "lucide-react";
import { getIdea } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
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
    <div className="mx-auto w-full max-w-lg px-4 pb-28 pt-6 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E8573A]">
            Library
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[#1A1D21]">
            Your knowledge home
          </h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="rounded-full bg-[#E8573A] text-white hover:bg-[#d4482e]"
              aria-label="Create stash"
            >
              <FolderPlus className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="border-black/5 bg-white text-[#1A1D21] sm:max-w-md">
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
                placeholder="e.g. Morning mindset"
                className="h-11 border-black/10 bg-[#EEF1F4]"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!name.trim()}
                className="w-full rounded-full bg-[#E8573A] text-white hover:bg-[#d4482e]"
              >
                Create stash
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 flex gap-2 rounded-full bg-white p-1 shadow-sm">
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
                ? "bg-[#E8573A] text-white"
                : "text-[#5F6B76] hover:text-[#1A1D21]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "ideas" ? (
        <section className="mt-6">
          {stashedIdeas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-14 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-[#1A1D21]">
                Nothing stashed yet
              </p>
              <p className="mt-2 text-sm text-[#5F6B76]">
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
            <div className="rounded-2xl border border-dashed border-black/10 bg-white px-5 py-14 text-center">
              <p className="font-[family-name:var(--font-display)] text-2xl text-[#1A1D21]">
                No collections yet
              </p>
              <p className="mt-2 text-sm text-[#5F6B76]">
                Group ideas into stashes for projects, goals, or moods.
              </p>
            </div>
          ) : (
            collections.map((collection) => (
              <div
                key={collection.id}
                className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#1A1D21]">
                      {collection.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#5F6B76]">
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
                    className="text-[#5F6B76]"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                {collection.ideaIds.length > 0 && (
                  <ul className="mt-3 space-y-2 border-t border-black/5 pt-3">
                    {collection.ideaIds.map((id) => {
                      const idea = getIdea(id);
                      if (!idea) return null;
                      return (
                        <li key={id} className="text-sm text-[#5F6B76]">
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
    </div>
  );
}
