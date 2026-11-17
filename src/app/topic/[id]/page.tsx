"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTopic } from "@/data/topics";
import { ideasByTopic } from "@/data/ideas";
import { useStash } from "@/lib/stash-store";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const topic = getTopic(id);
  const list = ideasByTopic(id);
  const { topics, toggleTopic } = useStash();
  const following = topics.includes(id);

  if (!topic) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-3xl text-white">
          Topic not found
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/explore">Back to explore</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-28 pt-4 sm:px-6">
      <Button
        asChild
        variant="ghost"
        className="mb-4 -ml-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
      >
        <Link href="/explore">
          <ArrowLeft className="size-4" />
          Explore
        </Link>
      </Button>

      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 p-6 sm:p-8"
        style={{ background: topic.pattern }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f3d08a]">
            Topic
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">
            {topic.name}
          </h1>
          <p className="mt-3 max-w-sm text-white/70">{topic.description}</p>
          <button
            type="button"
            onClick={() => toggleTopic(topic.id)}
            className={cn(
              "mt-5 rounded-full px-4 py-2 text-sm font-medium transition",
              following
                ? "bg-[#f3d08a] text-[#07141a]"
                : "bg-white/15 text-white hover:bg-white/25",
            )}
          >
            {following ? "Following" : "Follow topic"}
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-medium text-white/60">
          {list.length} ideas
        </h2>
        <div className="grid gap-4">
          {list.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
