"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { task } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

const taskInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(200),
  description: z.string().max(500).optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");
  return session;
}

export async function createTask(input: { name: string; description?: string; scheduledDate?: string | null }) {
  const session = await getSessionOrThrow();
  const data = taskInputSchema.parse(input);
  await db.insert(task).values({
    userId: session.user.id,
    name: data.name,
    description: data.description || null,
    scheduledDate: data.scheduledDate || null,
  });
  revalidatePath("/tasks");
}

export async function completeTask(taskId: string) {
  const session = await getSessionOrThrow();
  await db
    .update(task)
    .set({ isCompleted: true, completedAt: new Date() })
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)));
  revalidatePath("/tasks");
}

export async function uncompleteTask(taskId: string) {
  const session = await getSessionOrThrow();
  await db
    .update(task)
    .set({ isCompleted: false, completedAt: null })
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)));
  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  const session = await getSessionOrThrow();
  await db
    .delete(task)
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)));
  revalidatePath("/tasks");
}
