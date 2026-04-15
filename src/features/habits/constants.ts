import { Dumbbell, PersonStanding, Bike, Waves, MoreHorizontal, Star, BookOpen, Heart } from "lucide-react";
import type { SportType } from "@/features/workouts/schema";

/**
 * Day-of-week single-character labels, index matches `Date.getDay()` (0 = Sunday).
 * Uses Spanish convention: X for Miércoles (Wednesday) to avoid collision with M for Martes (Tuesday).
 */
export const DAY_LABELS = ["D", "L", "M", "X", "J", "V", "S"] as const;

export const SPORT_ICONS: Record<SportType, React.ElementType> = {
  gym: Dumbbell,
  running: PersonStanding,
  cycling: Bike,
  swimming: Waves,
  other: MoreHorizontal,
};

export const CATEGORY_ICONS: Record<string, React.ElementType> = {
  general: Star,
  sport: Dumbbell,
  study: BookOpen,
  health: Heart,
};
