import type { LucideIcon } from "lucide-react";
import {
  AudioLines,
  Bath,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  ChartLine,
  CircleDollarSign,
  Cloud,
  Coffee,
  Dumbbell,
  Eye,
  Gamepad2,
  Handshake,
  Heart,
  HeartHandshake,
  Home,
  Layers,
  Lightbulb,
  Moon,
  Palette,
  Plane,
  Salad,
  Smile,
  Sparkles,
  ShieldAlert,
  Target,
  TrainFront,
  Trophy,
  Utensils,
} from "lucide-react";

export type ProfileTopic = {
  id: string;
  label: string;
  mapsTo: string[];
  icon: LucideIcon;
};

/** Lifestyle topics shown in PROFILE — mapped onto feed topic ids */
export const profileTopics: ProfileTopic[] = [
  { id: "mental-health", label: "Mental Health", mapsTo: ["psychology"], icon: Smile },
  { id: "motivation", label: "Motivation", mapsTo: ["productivity"], icon: Dumbbell },
  { id: "nutrition", label: "Nutrition", mapsTo: ["health"], icon: Salad },
  { id: "habits", label: "Habits", mapsTo: ["productivity"], icon: ChartLine },
  {
    id: "personal-development",
    label: "Personal Development",
    mapsTo: ["philosophy", "productivity"],
    icon: Sparkles,
  },
  { id: "mindset", label: "Mindset", mapsTo: ["psychology", "philosophy"], icon: Brain },
  { id: "self-care", label: "Self-Care", mapsTo: ["health"], icon: Bath },
  { id: "exercise", label: "Exercise", mapsTo: ["health"], icon: Dumbbell },
  { id: "social-skills", label: "Social skills", mapsTo: ["leadership"], icon: Handshake },
  {
    id: "love",
    label: "Love & Relationships",
    mapsTo: ["relationships", "psychology"],
    icon: Heart,
  },
  {
    id: "narcissism",
    label: "Narcissism & recovery",
    mapsTo: ["narcissism", "boundaries", "relationships"],
    icon: ShieldAlert,
  },
  {
    id: "boundaries",
    label: "Boundaries",
    mapsTo: ["boundaries", "relationships"],
    icon: Target,
  },
  {
    id: "personal-finance",
    label: "Personal Finance",
    mapsTo: ["money"],
    icon: CircleDollarSign,
  },
  { id: "creativity", label: "Creativity", mapsTo: ["creativity"], icon: Palette },
];

export const growthReasons = [
  { id: "promotion", label: "Getting a promotion", icon: BriefcaseBusiness },
  { id: "entrepreneur", label: "Becoming an entrepreneur", icon: ChartLine },
  { id: "relationship", label: "Relationship commitment", icon: HeartHandshake },
  { id: "leaving", label: "Leaving a harmful relationship", icon: ShieldAlert },
  { id: "parenthood", label: "Parenthood", icon: Home },
  { id: "transition", label: "Major life transition", icon: Plane },
  { id: "financial", label: "Financial milestone", icon: CircleDollarSign },
  { id: "retirement", label: "Retirement planning", icon: Trophy },
  { id: "grief", label: "Grief and loss", icon: Cloud },
] as const;

export const energyWindows = [
  { id: "morning", label: "Morning coffee time", icon: Coffee },
  { id: "commute", label: "During commute", icon: TrainFront },
  { id: "lunch", label: "Lunch break", icon: Utensils },
  { id: "evening", label: "Before bed", icon: Moon },
] as const;

export const learningStyles = [
  { id: "text", label: "Quick text summaries", icon: BookOpen },
  { id: "audio", label: "Audio content", icon: AudioLines },
  { id: "visual", label: "Visual explanations", icon: Eye },
  { id: "interactive", label: "Interactive elements", icon: Gamepad2 },
  { id: "bites", label: "Bite-sized chunks", icon: Layers },
  { id: "stories", label: "Story-based learning", icon: Lightbulb },
] as const;

export const monthBenefits = [
  {
    title: "Replace mindless scrolling habits",
    body: "Your phone becomes a tool for growth, not distraction.",
    icon: Target,
  },
  {
    title: "You start connecting dots everywhere",
    body: "Ideas from different fields suddenly click together.",
    icon: Layers,
  },
  {
    title: 'Become the "interesting person" in conversations',
    body: "People ask where you get your cool insights.",
    icon: Sparkles,
  },
  {
    title: "Confidence boost from continuous growth",
    body: "You feel smarter and more intellectually capable.",
    icon: Trophy,
  },
  {
    title: "Enhanced curiosity muscle",
    body: "You naturally ask better questions and seek deeper understanding.",
    icon: Lightbulb,
  },
  {
    title: "Decision-making improvements",
    body: "You have more mental frameworks to draw from.",
    icon: Brain,
  },
] as const;

export function formatPlanDate(d: Date) {
  return d.toLocaleDateString("en-AU", {
    month: "long",
    day: "numeric",
    timeZone: "Australia/Sydney",
  });
}

export function planWindow() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  return {
    now,
    end,
    nowLabel: formatPlanDate(now),
    endLabel: formatPlanDate(end),
  };
}

export function resolveFeedTopics(profileTopicIds: string[]) {
  const set = new Set<string>();
  for (const id of profileTopicIds) {
    const row = profileTopics.find((t) => t.id === id);
    row?.mapsTo.forEach((t) => set.add(t));
  }
  return [...set];
}
