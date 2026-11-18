"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, ImageIcon, Sparkles } from "lucide-react";
import { ideas } from "@/data/ideas";
import { IdeaCard } from "@/components/idea-card";
import { Button } from "@/components/ui/button";
import { CardArt } from "@/components/card-art";

const books = [
  {
    id: "atomic",
    title: "Atomic Habits",
    author: "James Clear",
    match: "Atomic Habits",
    color: "#e8ebf0",
  },
  {
    id: "money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    match: "Psychology of Money",
    color: "#e6dcc8",
  },
  {
    id: "deep",
    title: "Deep Work",
    author: "Cal Newport",
    match: "Deep Work",
    color: "#d5e0e8",
  },
];

export default function ScanPage() {
  const [phase, setPhase] = useState<"camera" | "scanning" | "results">(
    "camera",
  );
  const [bookId, setBookId] = useState(books[0].id);
  const book = books.find((b) => b.id === bookId) ?? books[0];

  const found = useMemo(
    () => ideas.filter((i) => i.source.includes(book.match)).slice(0, 5),
    [book.match],
  );

  const scan = () => {
    setPhase("scanning");
    window.setTimeout(() => setPhase("results"), 1400);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-10 pt-4 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-muted-foreground hover:bg-card"
        >
          <Link href="/feed">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <p className="label-kicker">Scan</p>
        <span className="w-16" />
      </div>

      <h1 className="font-[family-name:var(--font-display)] text-3xl text-foreground">
        Scan books, get key ideas
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Point at a cover — we surface the stashes that matter. Demo mode uses
        sample books.
      </p>

      <AnimatePresence mode="wait">
        {phase !== "results" ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 flex flex-1 flex-col"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#1e2834] p-4 text-white shadow-[0_24px_60px_-30px_rgba(20,24,32,0.5)]">
              <div className="mb-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-foreground">
                  <Camera className="size-4" />
                  Scan Book
                </span>
              </div>

              <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-2xl border-2 border-dashed border-white/50">
                <div
                  className="absolute inset-0"
                  style={{ background: book.color }}
                />
                <CardArt kind="books" className="absolute inset-0 opacity-90" />
                <div className="absolute inset-x-6 top-1/3 rounded-xl bg-white/95 p-4 text-center text-foreground shadow-lg">
                  <p className="font-[family-name:var(--font-display)] text-2xl">
                    {book.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {book.author}
                  </p>
                </div>
                {phase === "scanning" && (
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-[#7aa0c4]"
                    initial={{ top: "10%" }}
                    animate={{ top: ["10%", "85%", "10%"] }}
                    transition={{ duration: 1.2, ease: "linear" }}
                  />
                )}
                <div className="pointer-events-none absolute inset-3 border border-white/70" />
              </div>

              <div className="mt-5 flex items-center justify-center gap-6">
                <button
                  type="button"
                  className="text-white/70"
                  aria-label="Pick from gallery"
                  onClick={() =>
                    setBookId(
                      books[
                        (books.findIndex((b) => b.id === bookId) + 1) %
                          books.length
                      ].id,
                    )
                  }
                >
                  <ImageIcon className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={scan}
                  disabled={phase === "scanning"}
                  className="size-16 rounded-full border-4 border-white/40 bg-white"
                  aria-label="Capture"
                />
                <span className="w-6" />
              </div>

              {phase === "scanning" && (
                <p className="mt-4 text-center text-sm text-[#7aa0c4]">
                  Finding ideas…
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {books.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBookId(b.id);
                    setPhase("camera");
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    b.id === bookId
                      ? "bg-ink text-white"
                      : "bg-card text-muted-foreground"
                  }`}
                >
                  {b.title}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4 pb-8"
          >
            <div className="flex items-center justify-between rounded-full bg-card px-4 py-3 shadow-sm">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" />
                {found.length} ideas found
              </span>
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => setPhase("camera")}
              >
                Scan again
              </Button>
            </div>
            {found.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} variant="compact" />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
