import { eq, and, asc, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { habit, habitEntry, workoutLog, studyLog } from "@/lib/db/schema";
import { getTodayString } from "@/lib/utils/dates";
import { calculateCurrentStreak } from "@/lib/utils/streak";
import type { WorkoutData } from "@/lib/validations/workout.schema";

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
  category: string;
  sportType: string | null;
  reminderTime: string | null;
  timeSlot: string | null;
  createdAt: Date;
  updatedAt: Date;
  isCompletedToday: boolean;
  todayCount: number;
  currentStreak: number;
};

/**
 * Returns true if the habit should appear on today's dashboard.
 * Weekly habits are filtered by today's day of week.
 */
export function isHabitScheduledToday(habit: HabitWithMeta): boolean {
  if (habit.frequency !== "weekly") return true;
  if (!habit.frequencyDays) return true; // fallback: show rather than hide
  const todayDow = new Date().getDay(); // 0=Sun, 6=Sat
  return habit.frequencyDays.split(",").map(Number).includes(todayDow);
}

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
      isCompletedToday: !!todayEntry && (todayEntry.count ?? 1) >= h.targetCount,
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

// ── Workout log queries ─────────────────────────────────────────────────────

export type WorkoutLogEntry = {
  id: string;
  date: string;
  data: WorkoutData;
};

/**
 * Fetch a single workout log for a habit on a given date.
 */
export async function getWorkoutLog(
  habitId: string,
  date: string,
  userId: string
): Promise<WorkoutData | null> {
  const result = await db
    .select()
    .from(workoutLog)
    .where(
      and(
        eq(workoutLog.habitId, habitId),
        eq(workoutLog.userId, userId),
        eq(workoutLog.date, date)
      )
    )
    .limit(1);

  if (!result[0]) return null;
  return JSON.parse(result[0].data) as WorkoutData;
}

/**
 * Fetch all workout logs for a habit, ordered by date descending.
 */
export async function getWorkoutHistory(
  habitId: string,
  userId: string
): Promise<WorkoutLogEntry[]> {
  const results = await db
    .select()
    .from(workoutLog)
    .where(
      and(eq(workoutLog.habitId, habitId), eq(workoutLog.userId, userId))
    )
    .orderBy(desc(workoutLog.date));

  return results.map((row) => ({
    id: row.id,
    date: row.date,
    data: JSON.parse(row.data) as WorkoutData,
  }));
}

// ── Study log queries ───────────────────────────────────────────────────────

export type StudyLogEntry = {
  id: string;
  date: string;
  sessions: number;
  totalMinutes: number;
};

/**
 * Fetch today's study log for a habit.
 */
export async function getStudyLog(
  habitId: string,
  date: string,
  userId: string
): Promise<{ sessions: number; totalMinutes: number } | null> {
  const result = await db
    .select()
    .from(studyLog)
    .where(
      and(
        eq(studyLog.habitId, habitId),
        eq(studyLog.userId, userId),
        eq(studyLog.date, date)
      )
    )
    .limit(1);

  if (!result[0]) return null;
  return { sessions: result[0].sessions, totalMinutes: result[0].totalMinutes };
}

/**
 * Fetch all study logs for a habit, ordered by date descending.
 */
export async function getStudyHistory(
  habitId: string,
  userId: string
): Promise<StudyLogEntry[]> {
  const results = await db
    .select()
    .from(studyLog)
    .where(
      and(eq(studyLog.habitId, habitId), eq(studyLog.userId, userId))
    )
    .orderBy(desc(studyLog.date));

  return results.map((row) => ({
    id: row.id,
    date: row.date,
    sessions: row.sessions,
    totalMinutes: row.totalMinutes,
  }));
}
