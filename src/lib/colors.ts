import type { HabitColor } from "@/db/schema";

export const HABIT_COLOR_MAP: Record<
  HabitColor,
  { hex: string; oklch: string; text: string; bg: string; ring: string }
> = {
  violet: {
    hex: "#8b5cf6",
    oklch: "oklch(65% 0.28 290)",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
    ring: "ring-violet-500/30",
  },
  blue: {
    hex: "#3b82f6",
    oklch: "oklch(60% 0.24 240)",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/30",
  },
  teal: {
    hex: "#14b8a6",
    oklch: "oklch(68% 0.20 185)",
    text: "text-teal-400",
    bg: "bg-teal-500/10",
    ring: "ring-teal-500/30",
  },
  green: {
    hex: "#22c55e",
    oklch: "oklch(65% 0.22 145)",
    text: "text-green-400",
    bg: "bg-green-500/10",
    ring: "ring-green-500/30",
  },
  amber: {
    hex: "#f59e0b",
    oklch: "oklch(72% 0.22 75)",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
  },
  rose: {
    hex: "#f43f5e",
    oklch: "oklch(62% 0.28 10)",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/30",
  },
  orange: {
    hex: "#f97316",
    oklch: "oklch(68% 0.25 45)",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    ring: "ring-orange-500/30",
  },
  indigo: {
    hex: "#6366f1",
    oklch: "oklch(58% 0.26 265)",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    ring: "ring-indigo-500/30",
  },
};

export function getHabitColor(color: HabitColor) {
  return HABIT_COLOR_MAP[color] ?? HABIT_COLOR_MAP.violet;
}
