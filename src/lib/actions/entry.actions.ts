"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { habitEntry } from "@/lib/db/schema";

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autenticado");
  return session;
}

/**
 * Toggle a habit entry for a given date.
 * If an entry exists → delete it (un-complete).
 * If no entry exists → create it (complete).
 */
export async function toggleHabitEntry(
  habitId: string,
  date: string // "YYYY-MM-DD"
): Promise<{ success: boolean; completed: boolean }> {
  const session = await getSessionOrThrow();

  const existing = await db
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

  if (existing.length > 0) {
    await db.delete(habitEntry).where(eq(habitEntry.id, existing[0].id));
    revalidatePath("/dashboard");
    revalidatePath(`/habits/${habitId}`);
    return { success: true, completed: false };
  } else {
    await db.insert(habitEntry).values({
      habitId,
      userId: session.user.id,
      date,
      count: 1,
    });
    revalidatePath("/dashboard");
    revalidatePath(`/habits/${habitId}`);
    return { success: true, completed: true };
  }
}

/**
 * Update the note on an entry.
 */
export async function updateEntryNote(
  entryId: string,
  note: string
): Promise<{ success: boolean }> {
  const session = await getSessionOrThrow();

  await db
    .update(habitEntry)
    .set({ note: note.trim() || null })
    .where(
      and(
        eq(habitEntry.id, entryId),
        eq(habitEntry.userId, session.user.id)
      )
    );

  return { success: true };
}

/**
 * Increment or decrement a count-based habit entry.
 */
export async function updateEntryCount(
  habitId: string,
  date: string,
  count: number
): Promise<{ success: boolean }> {
  const session = await getSessionOrThrow();

  if (count <= 0) {
    // Remove the entry
    await db
      .delete(habitEntry)
      .where(
        and(
          eq(habitEntry.habitId, habitId),
          eq(habitEntry.userId, session.user.id),
          eq(habitEntry.date, date)
        )
      );
  } else {
    const existing = await db
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

    if (existing.length > 0) {
      await db
        .update(habitEntry)
        .set({ count })
        .where(eq(habitEntry.id, existing[0].id));
    } else {
      await db.insert(habitEntry).values({
        habitId,
        userId: session.user.id,
        date,
        count,
      });
    }
  }

  revalidatePath("/dashboard");
  return { success: true };
}
