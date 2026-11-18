"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { topics, getTopic } from "@/data/topics";
import { ideas } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { AppFrame, PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const { topics: followed, toggleTopic } = useStash();
  const [query, setQuery] = useState("");
  const spotlight = getTopic("narcissism");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const featured = ideas.filter((i) =>
        i.topicIds.some((t) =>
          ["narcissism", "relationships", "boundaries"].includes(t),
        ),
      );
      return (featured.length ? featured : ideas).slice(0, 10);
    }
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(q) ||
        idea.body.toLowerCase().includes(q) ||
        idea.source.toLowerCase().includes(q) ||
        idea.takeaway.toLowerCase().includes(q) ||
        idea.topicIds.some((t) => t.includes(q)),
    );
  }, [query]);

  return (
    <AppFrame>
      <PageHeader
        eyebrow="Explore"
        title="Find your next idea"
        subtitle={`${ideas.length} insights across ${topics.length} topics`}
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ideas, books, topics…"
          className="h-12 rounded-full border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground/70"
        />
      </div>

      {spotlight && !query ? (
        <Link
          href={`/topic/${spotlight.id}`}
          className="relative mt-6 block overflow-hidden rounded-[1.5rem] border border-border p-5 shadow-[0_18px_50px_-36px_rgba(20,24,32,0.35)]"
          style={{ background: spotlight.pattern }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Spotlight
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white sm:text-3xl">
              Narcissism & life partners
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
              Recognize the cycle, protect your boundaries, and rebuild after a
              relationship that drained your self.
            </p>
            <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary">
              {
                ideas.filter((i) => i.topicIds.includes("narcissism")).length
              }{" "}
              ideas
            </span>
          </div>
        </Link>
      ) : null}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Topics</h2>
          <p className="text-xs text-muted-foreground">
            {followed.length} following
          </p>
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
                className="relative overflow-hidden rounded-2xl border border-border"
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
                        ? "bg-white text-primary"
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
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          {query ? "Search results" : "Featured ideas"}
        </h2>
        {results.length === 0 ? (
          <p className="surface-card border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
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
    </AppFrame>
  );
}
