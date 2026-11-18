import type { Metadata } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Mindstash — Microlearning that sticks",
  description:
    "Replace doomscrolling with bite-sized ideas from books and thinkers. Stash insights, build streaks, listen, and scan books.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${instrument.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
