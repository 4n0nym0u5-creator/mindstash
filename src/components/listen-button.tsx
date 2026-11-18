"use client";

import { useEffect, useState } from "react";
import { Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ListenButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const toggle = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggle}
      className={cn(
        "rounded-full gap-2",
        speaking && "bg-accent text-accent-foreground hover:bg-accent/90",
        className,
      )}
      aria-pressed={speaking}
    >
      {speaking ? <Pause className="size-4" /> : <Volume2 className="size-4" />}
      {speaking ? "Pause" : "Listen"}
      {speaking && (
        <span className="ml-1 flex h-4 items-end gap-0.5" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="wave-bar w-0.5 rounded-full bg-white"
              style={{
                height: 10 + (i % 3) * 3,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </span>
      )}
    </Button>
  );
}
