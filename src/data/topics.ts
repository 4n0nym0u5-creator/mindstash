export type Topic = {
  id: string;
  name: string;
  description: string;
  accent: string;
  pattern: string;
};

export const topics: Topic[] = [
  {
    id: "productivity",
    name: "Productivity",
    description: "Systems that make focus inevitable",
    accent: "#0F766E",
    pattern: "radial-gradient(circle at 20% 20%, #14b8a633, transparent 45%), linear-gradient(145deg, #0f766e, #134e4a)",
  },
  {
    id: "psychology",
    name: "Psychology",
    description: "How minds actually decide",
    accent: "#1D4ED8",
    pattern: "radial-gradient(circle at 80% 10%, #60a5fa44, transparent 40%), linear-gradient(160deg, #1e3a8a, #1d4ed8)",
  },
  {
    id: "philosophy",
    name: "Philosophy",
    description: "Timeless frames for a noisy life",
    accent: "#0F172A",
    pattern: "radial-gradient(circle at 30% 80%, #94a3b833, transparent 40%), linear-gradient(150deg, #0f172a, #334155)",
  },
  {
    id: "money",
    name: "Money",
    description: "Judgment under uncertainty",
    accent: "#B45309",
    pattern: "radial-gradient(circle at 70% 30%, #fbbf2444, transparent 45%), linear-gradient(145deg, #92400e, #b45309)",
  },
  {
    id: "health",
    name: "Health",
    description: "Energy, sleep, and longevity",
    accent: "#047857",
    pattern: "radial-gradient(circle at 15% 60%, #34d39944, transparent 40%), linear-gradient(155deg, #064e3b, #047857)",
  },
  {
    id: "creativity",
    name: "Creativity",
    description: "Making original work on purpose",
    accent: "#BE123C",
    pattern: "radial-gradient(circle at 90% 70%, #fb718544, transparent 40%), linear-gradient(140deg, #9f1239, #e11d48)",
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "Influence without theatrics",
    accent: "#4338CA",
    pattern: "radial-gradient(circle at 25% 25%, #a5b4fc44, transparent 45%), linear-gradient(150deg, #312e81, #4338ca)",
  },
  {
    id: "science",
    name: "Science",
    description: "Mental models from the lab",
    accent: "#0E7490",
    pattern: "radial-gradient(circle at 60% 20%, #22d3ee33, transparent 40%), linear-gradient(160deg, #155e75, #0e7490)",
  },
];

export function getTopic(id: string) {
  return topics.find((t) => t.id === id);
}
