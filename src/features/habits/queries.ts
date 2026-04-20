import { eq, and, asc } from "drizzle-orm";
import { db } from "@/db";
import { habit, habitEntry } from "@/db/schema";
import { getTodayString } from "@/lib/dates";
import { calculateCurrentStreak, calculateVirtusScore } from "@/features/entries/logic";
import type { HabitWithMeta } from "./types";

/**
 * Fetch all active habits for a user, with completion status for a specific date.
 * Pass getTodayString() for today's view.
 */
export async function getHabitsForDate(
  userId: string,
  date: string
): Promise<HabitWithMeta[]> {
  const habits = await db
    .select()
    .from(habit)
    .where(and(eq(habit.userId, userId), eq(habit.isArchived, false)))
    .orderBy(asc(habit.sortOrder), asc(habit.createdAt));

  if (habits.length === 0) return [];

  const allEntries = await db
    .select()
    .from(habitEntry)
    .where(eq(habitEntry.userId, userId));

  // Group entries by habitId (keeping count for streak calculation)
  const entriesByHabit = allEntries.reduce<Record<string, { date: string; count: number }[]>>(
    (acc, entry) => {
      if (!acc[entry.habitId]) acc[entry.habitId] = [];
      acc[entry.habitId].push({ date: entry.date, count: entry.count ?? 1 });
      return acc;
    },
    {}
  );

  return habits.map((h) => {
    const entries = entriesByHabit[h.id] ?? [];
    // Streak only counts fully completed days (count >= targetCount)
    const completedDates = entries
      .filter((e) => e.count >= h.targetCount)
      .map((e) => e.date);
    const dateEntry = allEntries.find(
      (e) => e.habitId === h.id && e.date === date
    );

    return {
      id: h.id,
      name: h.name,
      description: h.description,
      icon: h.icon,
      color: h.color,
      frequency: h.frequency,
      frequencyDays: h.frequencyDays,
      targetCount: h.targetCount,
      sortOrder: h.sortOrder,
      isArchived: h.isArchived,
      category: h.category,
      sportType: h.sportType,
      reminderTime: h.reminderTime,
      timeSlot: h.timeSlot,
      createdAt: h.createdAt,
      updatedAt: h.updatedAt,
      isCompletedToday: !!dateEntry && (dateEntry.count ?? 1) >= h.targetCount,
      todayCount: dateEntry?.count ?? 0,
      currentStreak: calculateCurrentStreak(completedDates),
      virtusScore: calculateVirtusScore(completedDates),
    };
  });
}

/**
 * Convenience wrapper — fetches habits for today.
 */
export function getHabitsWithTodayEntries(userId: string) {
  return getHabitsForDate(userId, getTodayString());
}

/**
 * Fetch a single habit by ID, verifying ownership.
 */
export async function getHabitById(habitId: string, userId: string) {
  const result = await db
    .select()
    .from(habit)
    .where(and(eq(habit.id, habitId), eq(habit.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Fetch a habit plus all its daily entries (for calendar/history views).
 */
export async function getHabitWithAllEntries(habitId: string, userId: string) {
  const h = await getHabitById(habitId, userId);
  if (!h) return null;

  const entries = await db
    .select()
    .from(habitEntry)
    .where(
      and(eq(habitEntry.habitId, habitId), eq(habitEntry.userId, userId))
    );

  return { habit: h, entries };
}
