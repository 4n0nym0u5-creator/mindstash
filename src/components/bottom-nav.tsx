"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/feed", label: "Today", icon: Sparkles },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/library", label: "Library", icon: Bookmark },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#07141a]/90 backdrop-blur-xl"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium tracking-wide transition-colors",
                active ? "text-[#f3d08a]" : "text-white/45 hover:text-white/75",
              )}
            >
              <Icon
                className={cn("size-5", active && "drop-shadow-[0_0_8px_#f3d08a88]")}
                strokeWidth={active ? 2.25 : 1.75}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
