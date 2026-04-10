"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { habit } from "@/lib/db/schema";
import { habitSchema, type HabitInput } from "@/lib/validations/habit.schema";

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autenticado");
  return session;
}

export async function createHabit(input: HabitInput) {
  const session = await getSessionOrThrow();
  const data = habitSchema.parse(input);

  // Get current max sortOrder for this user
  const existing = await db
    .select({ sortOrder: habit.sortOrder })
    .from(habit)
    .where(eq(habit.userId, session.user.id))
    .orderBy(habit.sortOrder);

  const maxOrder =
    existing.length > 0 ? existing[existing.length - 1].sortOrder : -1;

  await db.insert(habit).values({
    userId: session.user.id,
    name: data.name,
    description: data.description ?? null,
    icon: data.icon,
    color: data.color,
    frequency: data.frequency,
    frequencyDays: data.frequencyDays ?? null,
    targetCount: data.targetCount,
    sortOrder: maxOrder + 1,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateHabit(habitId: string, input: HabitInput) {
  const session = await getSessionOrThrow();
  const data = habitSchema.parse(input);

  const result = await db
    .update(habit)
    .set({
      name: data.name,
      description: data.description ?? null,
      icon: data.icon,
      color: data.color,
      frequency: data.frequency,
      frequencyDays: data.frequencyDays ?? null,
      targetCount: data.targetCount,
      updatedAt: new Date(),
    })
    .where(and(eq(habit.id, habitId), eq(habit.userId, session.user.id)));

  revalidatePath("/dashboard");
  revalidatePath(`/habits/${habitId}`);
  return { success: true };
}

export async function archiveHabit(habitId: string) {
  const session = await getSessionOrThrow();

  await db
    .update(habit)
    .set({ isArchived: true, updatedAt: new Date() })
    .where(and(eq(habit.id, habitId), eq(habit.userId, session.user.id)));

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteHabit(habitId: string) {
  const session = await getSessionOrThrow();

  await db
    .delete(habit)
    .where(and(eq(habit.id, habitId), eq(habit.userId, session.user.id)));

  revalidatePath("/dashboard");
  return { success: true };
}

export async function reorderHabits(habitIds: string[]) {
  const session = await getSessionOrThrow();

  await Promise.all(
    habitIds.map((id, index) =>
      db
        .update(habit)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(and(eq(habit.id, id), eq(habit.userId, session.user.id)))
    )
  );

  revalidatePath("/dashboard");
  return { success: true };
}
