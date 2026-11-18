"use client";

import { cn } from "@/lib/utils";

export type ArtKind =
  | "habit-loop"
  | "zones"
  | "books"
  | "lightbulb"
  | "waves"
  | "portrait"
  | "compass"
  | "spark";

const palettes: Record<ArtKind, { bg: string; accent: string }> = {
  "habit-loop": { bg: "#E8E4D8", accent: "#141820" },
  zones: { bg: "#DCE3EC", accent: "#2A4A6B" },
  books: { bg: "#D9E6DF", accent: "#3D6B5A" },
  lightbulb: { bg: "#F0E0D8", accent: "#C94B34" },
  waves: { bg: "#D8E4EC", accent: "#2A4A6B" },
  portrait: { bg: "#E8E6E2", accent: "#141820" },
  compass: { bg: "#D9E2EC", accent: "#2A4A6B" },
  spark: { bg: "#EDD9D2", accent: "#C94B34" },
};

export function CardArt({
  kind,
  className,
  title,
}: {
  kind: ArtKind;
  className?: string;
  title?: string;
}) {
  const p = palettes[kind];
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: p.bg }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-40" style={noise()} />
      {kind === "habit-loop" && <HabitLoop />}
      {kind === "zones" && <Zones />}
      {kind === "books" && <BooksStack />}
      {kind === "lightbulb" && <Lightbulb />}
      {kind === "waves" && <Waves />}
      {kind === "portrait" && <PortraitMark title={title} />}
      {kind === "compass" && <Compass />}
      {kind === "spark" && <SparkBurst />}
    </div>
  );
}

function noise() {
  return {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  } as const;
}

function HabitLoop() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <circle cx="160" cy="90" r="48" fill="none" stroke="#141820" strokeWidth="8" />
      <circle cx="160" cy="42" r="16" fill="#C94B34" />
      <circle cx="208" cy="112" r="16" fill="#2A4A6B" />
      <circle cx="112" cy="112" r="16" fill="#141820" />
      <text x="160" y="46" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">
        CUE
      </text>
      <text x="208" y="116" textAnchor="middle" fontSize="7" fill="white" fontWeight="700">
        ROUTINE
      </text>
      <text x="112" y="116" textAnchor="middle" fontSize="7" fill="white" fontWeight="700">
        REWARD
      </text>
      <path d="M150 55c30 8 48 28 52 48" fill="none" stroke="#141820" strokeWidth="3" strokeDasharray="4 4" />
    </svg>
  );
}

function Zones() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <circle cx="160" cy="90" r="70" fill="#C9B6F2" />
      <circle cx="160" cy="90" r="52" fill="#B39AE8" />
      <circle cx="160" cy="90" r="34" fill="#9B7CDE" />
      <circle cx="160" cy="90" r="16" fill="#7A54C8" />
      <text x="160" y="94" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
        GROW
      </text>
    </svg>
  );
}

function BooksStack() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <rect x="90" y="110" width="140" height="18" rx="3" fill="#C94B34" transform="rotate(-4 160 119)" />
      <rect x="95" y="90" width="130" height="18" rx="3" fill="#2A4A6B" transform="rotate(3 160 99)" />
      <rect x="100" y="70" width="120" height="18" rx="3" fill="#0F766E" transform="rotate(-2 160 79)" />
      <rect x="105" y="50" width="110" height="18" rx="3" fill="#F5C542" transform="rotate(4 160 59)" />
      <circle cx="230" cy="48" r="3" fill="#141820" opacity="0.25" />
      <circle cx="80" cy="60" r="2" fill="#141820" opacity="0.2" />
    </svg>
  );
}

function Lightbulb() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <circle cx="160" cy="78" r="36" fill="#FFF6D6" stroke="#C94B34" strokeWidth="4" />
      <path d="M146 112h28v10c0 6-6 12-14 12s-14-6-14-12v-10Z" fill="#C94B34" />
      <path d="M160 30v12M210 78h12M98 78h12M196 48l8-8M116 48l-8-8" stroke="#C94B34" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Waves() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const h = 20 + ((i * 17) % 70);
        return (
          <rect
            key={i}
            x={40 + i * 20}
            y={90 - h / 2}
            width="10"
            height={h}
            rx="5"
            fill={i % 2 === 0 ? "#2A4A6B" : "#3D6B5A"}
            opacity={0.85}
          >
            <animate
              attributeName="height"
              values={`${h};${h + 18};${h}`}
              dur={`${1.2 + (i % 5) * 0.15}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${90 - h / 2};${90 - (h + 18) / 2};${90 - h / 2}`}
              dur={`${1.2 + (i % 5) * 0.15}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
    </svg>
  );
}

function PortraitMark({ title }: { title?: string }) {
  const initial = (title ?? "Q").trim().charAt(0).toUpperCase();
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <circle cx="160" cy="88" r="48" fill="#141820" />
      <circle cx="160" cy="78" r="18" fill="#F3F5F7" />
      <ellipse cx="160" cy="118" rx="28" ry="18" fill="#F3F5F7" />
      <text
        x="160"
        y="168"
        textAnchor="middle"
        fontSize="14"
        fill="#141820"
        fontWeight="700"
        opacity="0.35"
      >
        {initial}
      </text>
    </svg>
  );
}

function Compass() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <circle cx="160" cy="90" r="54" fill="none" stroke="#2A4A6B" strokeWidth="6" />
      <circle cx="160" cy="90" r="6" fill="#C94B34" />
      <path d="M160 50l10 40-10 10-10-10 10-40Z" fill="#C94B34" />
      <path d="M160 130l-10-40 10-10 10 10-10 40Z" fill="#141820" opacity="0.35" />
    </svg>
  );
}

function SparkBurst() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full">
      <circle cx="160" cy="90" r="34" fill="#C94B34" />
      <circle cx="160" cy="90" r="18" fill="#FFB199" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = 160 + Math.cos(rad) * 70;
        const y2 = 90 + Math.sin(rad) * 70;
        return (
          <line
            key={deg}
            x1={160 + Math.cos(rad) * 42}
            y1={90 + Math.sin(rad) * 42}
            x2={x2}
            y2={y2}
            stroke="#C94B34"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
