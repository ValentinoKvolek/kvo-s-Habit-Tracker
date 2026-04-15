import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { workoutLog } from "@/db/schema";
import type { WorkoutData } from "@/features/workouts/schema";

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
