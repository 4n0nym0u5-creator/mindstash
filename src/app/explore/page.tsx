"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { topics } from "@/data/topics";
import { ideas } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const { topics: followed, toggleTopic } = useStash();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ideas.slice(0, 8);
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(q) ||
        idea.body.toLowerCase().includes(q) ||
        idea.source.toLowerCase().includes(q) ||
        idea.takeaway.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-28 pt-6 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E8573A]">
        Explore
      </p>
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[#1A1D21]">
        Find your next idea
      </h1>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5F6B76]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ideas, books, topics…"
          className="h-12 rounded-full border-black/5 bg-white pl-10 text-[#1A1D21] placeholder:text-[#5F6B76]/70"
        />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#5F6B76]">Topics</h2>
          <p className="text-xs text-[#5F6B76]">{followed.length} following</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {topics.map((topic) => {
            const active = followed.includes(topic.id);
            const count = ideas.filter((i) =>
              i.topicIds.includes(topic.id),
            ).length;
            return (
              <div
                key={topic.id}
                className="relative overflow-hidden rounded-2xl border border-black/5 shadow-sm"
                style={{ background: topic.pattern }}
              >
                <div className="absolute inset-0 bg-black/35" />
                <div className="relative z-10 flex h-full flex-col p-4">
                  <Link href={`/topic/${topic.id}`} className="flex-1">
                    <p className="font-semibold text-white">{topic.name}</p>
                    <p className="mt-1 text-xs text-white/75">
                      {count} ideas · {topic.description}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={cn(
                      "mt-3 self-start rounded-full px-3 py-1 text-xs font-semibold transition",
                      active
                        ? "bg-white text-[#E8573A]"
                        : "bg-white/20 text-white hover:bg-white/30",
                    )}
                  >
                    {active ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold text-[#5F6B76]">
          {query ? "Search results" : "Featured ideas"}
        </h2>
        {results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/10 bg-white px-4 py-10 text-center text-sm text-[#5F6B76]">
            No ideas match “{query}”. Try another word or browse topics.
          </p>
        ) : (
          <div className="grid gap-4">
            {results.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} variant="compact" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
