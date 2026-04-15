"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { workoutLog } from "@/db/schema";
import type { WorkoutData } from "@/features/workouts/schema";

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autenticado");
  return session;
}

export async function saveWorkoutLog(
  habitId: string,
  date: string, // "YYYY-MM-DD"
  data: WorkoutData
): Promise<{ success: boolean }> {
  const session = await getSessionOrThrow();

  const serialized = JSON.stringify(data);

  const existing = await db
    .select({ id: workoutLog.id })
    .from(workoutLog)
    .where(
      and(
        eq(workoutLog.habitId, habitId),
        eq(workoutLog.userId, session.user.id),
        eq(workoutLog.date, date)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(workoutLog)
      .set({ data: serialized, updatedAt: new Date() })
      .where(eq(workoutLog.id, existing[0].id));
  } else {
    await db.insert(workoutLog).values({
      habitId,
      userId: session.user.id,
      date,
      data: serialized,
    });
  }

  revalidatePath(`/habits/${habitId}`);
  return { success: true };
}
