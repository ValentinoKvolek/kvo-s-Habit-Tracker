"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { studyLog, habitEntry } from "@/db/schema";
import { studyLogSchema, type StudyLogInput } from "@/features/study/schema";

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autenticado");
  return session;
}

/**
 * Save (accumulate) a completed Pomodoro session for a study habit.
 * Call this once per completed work cycle.
 * Also updates the habitEntry.count so dashboard progress reflects Pomodoro count.
 */
export async function saveStudySession(
  habitId: string,
  date: string, // "YYYY-MM-DD"
  input: StudyLogInput
): Promise<{ success: boolean; totalSessions: number }> {
  const session = await getSessionOrThrow();
  const data = studyLogSchema.parse(input);

  // Upsert study_log — accumulate, never replace
  const existing = await db
    .select()
    .from(studyLog)
    .where(
      and(
        eq(studyLog.habitId, habitId),
        eq(studyLog.userId, session.user.id),
        eq(studyLog.date, date)
      )
    )
    .limit(1);

  let totalSessions: number;

  if (existing.length > 0) {
    totalSessions = existing[0].sessions + data.sessions;
    const totalMinutes = existing[0].totalMinutes + data.totalMinutes;
    await db
      .update(studyLog)
      .set({ sessions: totalSessions, totalMinutes, updatedAt: new Date() })
      .where(eq(studyLog.id, existing[0].id));
  } else {
    totalSessions = data.sessions;
    await db.insert(studyLog).values({
      habitId,
      userId: session.user.id,
      date,
      sessions: data.sessions,
      totalMinutes: data.totalMinutes,
    });
  }

  // Mirror totalSessions into habitEntry.count so CompletionButton progress works
  const existingEntry = await db
    .select()
    .from(habitEntry)
    .where(
      and(
        eq(habitEntry.habitId, habitId),
        eq(habitEntry.userId, session.user.id),
        eq(habitEntry.date, date)
      )
    )
    .limit(1);

  if (existingEntry.length > 0) {
    await db
      .update(habitEntry)
      .set({ count: totalSessions })
      .where(eq(habitEntry.id, existingEntry[0].id));
  } else {
    await db.insert(habitEntry).values({
      habitId,
      userId: session.user.id,
      date,
      count: totalSessions,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/habits/${habitId}`);
  return { success: true, totalSessions };
}
