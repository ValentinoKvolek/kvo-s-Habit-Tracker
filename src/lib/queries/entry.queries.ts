import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { habitEntry } from "@/lib/db/schema";

/**
 * Get all entries for a habit in a given month.
 * Returns a Set of date strings ("YYYY-MM-DD") for quick lookup.
 */
export async function getEntriesByMonth(
  habitId: string,
  userId: string,
  year: number,
  month: number // 0-indexed
): Promise<Map<string, number>> {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const entries = await db
    .select()
    .from(habitEntry)
    .where(
      and(
        eq(habitEntry.habitId, habitId),
        eq(habitEntry.userId, userId),
        gte(habitEntry.date, startDate),
        lte(habitEntry.date, endDate)
      )
    );

  return new Map(entries.map((e) => [e.date, e.count]));
}

/**
 * Get all entries for a habit (for streak calculation and history).
 */
export async function getAllEntryDates(
  habitId: string,
  userId: string
): Promise<string[]> {
  const entries = await db
    .select({ date: habitEntry.date })
    .from(habitEntry)
    .where(
      and(eq(habitEntry.habitId, habitId), eq(habitEntry.userId, userId))
    );

  return entries.map((e) => e.date);
}
