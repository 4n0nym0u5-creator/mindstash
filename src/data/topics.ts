export type Topic = {
  id: string;
  name: string;
  description: string;
  accent: string;
  pattern: string;
};

export const topics: Topic[] = [
  {
    id: "narcissism",
    name: "Narcissism",
    description: "Patterns, protections, and recovering your self",
    accent: "#6B3A4A",
    pattern:
      "radial-gradient(circle at 20% 20%, #c94b3444, transparent 45%), linear-gradient(150deg, #3a2430, #6b3a4a)",
  },
  {
    id: "relationships",
    name: "Relationships",
    description: "Attachment, repair, and choosing wisely",
    accent: "#8B4557",
    pattern:
      "radial-gradient(circle at 80% 20%, #e8a0b044, transparent 40%), linear-gradient(155deg, #5c2e3a, #8b4557)",
  },
  {
    id: "boundaries",
    name: "Boundaries",
    description: "Saying no without abandoning yourself",
    accent: "#2A4A6B",
    pattern:
      "radial-gradient(circle at 30% 70%, #7aa0c444, transparent 40%), linear-gradient(150deg, #1a3048, #2a4a6b)",
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Systems that make focus inevitable",
    accent: "#3D6B5A",
    pattern:
      "radial-gradient(circle at 20% 20%, #6bc4a433, transparent 45%), linear-gradient(145deg, #1e3d34, #3d6b5a)",
  },
  {
    id: "psychology",
    name: "Psychology",
    description: "How minds actually decide",
    accent: "#2A4A6B",
    pattern:
      "radial-gradient(circle at 80% 10%, #7aa0c444, transparent 40%), linear-gradient(160deg, #1a3048, #2a4a6b)",
  },
  {
    id: "philosophy",
    name: "Philosophy",
    description: "Timeless frames for a noisy life",
    accent: "#2C333D",
    pattern:
      "radial-gradient(circle at 30% 80%, #94a3b833, transparent 40%), linear-gradient(150deg, #141820, #2c333d)",
  },
  {
    id: "money",
    name: "Money",
    description: "Judgment under uncertainty",
    accent: "#8A6A3A",
    pattern:
      "radial-gradient(circle at 70% 30%, #c4a35a44, transparent 45%), linear-gradient(145deg, #4a3a20, #8a6a3a)",
  },
  {
    id: "health",
    name: "Health",
    description: "Energy, sleep, and longevity",
    accent: "#3D6B5A",
    pattern:
      "radial-gradient(circle at 15% 60%, #6bc4a444, transparent 40%), linear-gradient(155deg, #1e3d34, #3d6b5a)",
  },
  {
    id: "creativity",
    name: "Creativity",
    description: "Making original work on purpose",
    accent: "#6B3A4A",
    pattern:
      "radial-gradient(circle at 90% 70%, #c94b3444, transparent 40%), linear-gradient(140deg, #3a2430, #6b3a4a)",
  },
  {
    id: "leadership",
    name: "Leadership",
    description: "Influence without theatrics",
    accent: "#2A4A6B",
    pattern:
      "radial-gradient(circle at 25% 25%, #7aa0c444, transparent 45%), linear-gradient(150deg, #1a3048, #2a4a6b)",
  },
  {
    id: "science",
    name: "Science",
    description: "Mental models from the lab",
    accent: "#3A5A6B",
    pattern:
      "radial-gradient(circle at 60% 20%, #7ab8c444, transparent 40%), linear-gradient(160deg, #1e3540, #3a5a6b)",
  },
];

export function getTopic(id: string) {
  return topics.find((t) => t.id === id);
}
