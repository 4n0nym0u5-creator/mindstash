"use client";

import { cn } from "@/lib/utils";

type MascotProps = {
  mood?: "hero" | "overwhelmed" | "wink";
  className?: string;
};

/** Spark — Mindstash's little flame guide */
export function Mascot({ mood = "hero", className }: MascotProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={cn("drop-shadow-sm", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="sparkBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B4A" />
          <stop offset="55%" stopColor="#C94B34" />
          <stop offset="100%" stopColor="#C93A2A" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="128" rx="28" ry="6" fill="#141820" opacity="0.12" />
      <path
        d="M60 12C78 28 96 48 96 72c0 22-16 40-36 40S24 94 24 72C24 48 42 28 60 12Z"
        fill="url(#sparkBody)"
      />
      <path
        d="M60 38c10 10 18 20 18 32 0 12-8 22-18 22s-18-10-18-22c0-12 8-22 18-32Z"
        fill="#FFB199"
        opacity="0.45"
      />
      {/* Eyes */}
      <circle cx="48" cy="68" r="5.5" fill="#141820" />
      <circle cx="72" cy="68" r="5.5" fill="#141820" />
      <circle cx="49.5" cy="66.5" r="1.8" fill="white" />
      <circle cx="73.5" cy="66.5" r="1.8" fill="white" />
      {mood === "overwhelmed" ? (
        <>
          <path
            d="M50 86c4 3 8 3 12 0"
            stroke="#141820"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="86" cy="58" r="4" fill="#5B9FFF" opacity="0.9" />
          <path
            d="M86 62v8"
            stroke="#5B9FFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      ) : mood === "wink" ? (
        <>
          <path
            d="M68 68h8"
            stroke="#141820"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M50 84c6 6 14 6 20 0"
            stroke="#141820"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <path
            d="M50 84c6 7 14 7 20 0"
            stroke="#141820"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cape */}
          <path
            d="M38 92c-10 18-8 34 2 38 6-10 14-16 20-18-2-8-8-14-22-20Z"
            fill="#2A4A6B"
            opacity="0.95"
          />
          <path
            d="M82 92c10 18 8 34-2 38-6-10-14-16-20-18 2-8 8-14 22-20Z"
            fill="#2A4A6B"
            opacity="0.95"
          />
          <circle cx="60" cy="96" r="7" fill="#F5C542" />
          <circle cx="60" cy="96" r="3.5" fill="#FFF6D6" />
        </>
      )}
    </svg>
  );
}
