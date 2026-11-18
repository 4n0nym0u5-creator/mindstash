"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Camera, Compass, Flame, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/feed", label: "Today", icon: Sparkles },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/streaks", label: "Streak", icon: Flame },
  { href: "/library", label: "Library", icon: Bookmark },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 backdrop-blur-xl"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-wide transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn("size-5", active && "scale-105")}
                strokeWidth={active ? 2.35 : 1.85}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
