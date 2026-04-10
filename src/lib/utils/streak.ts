import { getTodayString, getDateString } from "./dates";

/**
 * Calculates the current streak from an array of completion date strings ("YYYY-MM-DD").
 * A streak is broken if there's no entry for yesterday (or today if none yet today).
 */
export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const dateSet = new Set(dates);
  const today = getTodayString();
  const yesterday = getDateString(-1);

  // If neither today nor yesterday is completed, streak is 0
  if (!dateSet.has(today) && !dateSet.has(yesterday)) return 0;

  let streak = 0;
  // Start from today and go backwards
  const startFrom = dateSet.has(today) ? 0 : -1;

  for (let i = startFrom; i >= -3650; i--) {
    const dateStr = getDateString(i);
    if (dateSet.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates the longest ever streak from an array of completion date strings.
 */
export function calculateLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Sort ascending
  const sorted = [...dates].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`);
    const curr = new Date(`${sorted[i]}T00:00:00`);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
    // diffDays === 0 means duplicate date — skip
  }

  return longest;
}

/**
 * Returns the completion rate as a percentage (0–100) for the last N days.
 */
export function getCompletionRate(dates: string[], days: number = 7): number {
  const dateSet = new Set(dates);
  let count = 0;
  for (let i = 0; i < days; i++) {
    if (dateSet.has(getDateString(-i))) count++;
  }
  return Math.round((count / days) * 100);
}

/**
 * Milestone streak values for special animations.
 */
export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 100, 365];

export function isStreakMilestone(streak: number): boolean {
  return STREAK_MILESTONES.includes(streak);
}
