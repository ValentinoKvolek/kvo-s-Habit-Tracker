import { getTodayString, getDayOfWeek } from "@/lib/dates";
import type { HabitWithMeta } from "./types";

/**
 * Returns true if the habit should appear on today's dashboard.
 * Weekly habits are filtered by today's day of week.
 */
export function isHabitScheduledToday(habit: HabitWithMeta): boolean {
  return isHabitScheduledForDate(habit, getTodayString());
}

/**
 * Returns true if the habit should appear on the given date's dashboard.
 */
export function isHabitScheduledForDate(habit: HabitWithMeta, date: string): boolean {
  if (habit.frequency !== "weekly") return true;
  if (!habit.frequencyDays) return true;
  const dow = getDayOfWeek(date);
  return habit.frequencyDays.split(",").map(Number).includes(dow);
}
