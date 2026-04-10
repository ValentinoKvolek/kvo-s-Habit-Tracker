import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { habit, habitEntry } from "@/lib/db/schema";
import { getTodayString } from "@/lib/utils/dates";
import { calculateCurrentStreak } from "@/lib/utils/streak";

export type HabitWithMeta = {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: string;
  frequencyDays: string | null;
  targetCount: number;
  sortOrder: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  isCompletedToday: boolean;
  todayCount: number;
  currentStreak: number;
};

/**
 * Fetch all active habits for a user, with today's completion status and streaks.
 * Used in the dashboard Server Component.
 */
export async function getHabitsWithTodayEntries(
  userId: string
): Promise<HabitWithMeta[]> {
  const today = getTodayString();

  // Fetch all non-archived habits
  const habits = await db
    .select()
    .from(habit)
    .where(and(eq(habit.userId, userId), eq(habit.isArchived, false)))
    .orderBy(asc(habit.sortOrder), asc(habit.createdAt));

  if (habits.length === 0) return [];

  // Fetch all entries for these habits to compute streaks
  const allEntries = await db
    .select()
    .from(habitEntry)
    .where(eq(habitEntry.userId, userId));

  // Group entries by habitId
  const entriesByHabit = allEntries.reduce<Record<string, string[]>>(
    (acc, entry) => {
      if (!acc[entry.habitId]) acc[entry.habitId] = [];
      acc[entry.habitId].push(entry.date);
      return acc;
    },
    {}
  );

  return habits.map((h) => {
    const dates = entriesByHabit[h.id] ?? [];
    const todayEntry = allEntries.find(
      (e) => e.habitId === h.id && e.date === today
    );

    return {
      ...h,
      isCompletedToday: !!todayEntry,
      todayCount: todayEntry?.count ?? 0,
      currentStreak: calculateCurrentStreak(dates),
    };
  });
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
 * Fetch all entries for a habit (for detail/calendar view).
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
