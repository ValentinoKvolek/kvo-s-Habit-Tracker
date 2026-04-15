import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { studyLog } from "@/db/schema";

export type StudyLogEntry = {
  id: string;
  date: string;
  sessions: number;
  totalMinutes: number;
};

/**
 * Fetch a study log for a habit on a given date.
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
