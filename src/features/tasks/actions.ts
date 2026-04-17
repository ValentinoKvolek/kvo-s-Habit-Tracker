"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { task, taskList } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getSessionOrThrow() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");
  return session;
}

const taskInputSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  listId: z.string().optional().nullable(),
});

export async function createTask(input: {
  name: string;
  description?: string;
  scheduledDate?: string | null;
  listId?: string | null;
}) {
  const session = await getSessionOrThrow();
  const data = taskInputSchema.parse(input);
  await db.insert(task).values({
    userId: session.user.id,
    name: data.name,
    description: data.description || null,
    scheduledDate: data.scheduledDate || null,
    listId: data.listId || null,
  });
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function completeTask(taskId: string) {
  const session = await getSessionOrThrow();
  await db
    .update(task)
    .set({ isCompleted: true, completedAt: new Date() })
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)));
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function uncompleteTask(taskId: string) {
  const session = await getSessionOrThrow();
  await db
    .update(task)
    .set({ isCompleted: false, completedAt: null })
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)));
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const session = await getSessionOrThrow();
  await db
    .delete(task)
    .where(and(eq(task.id, taskId), eq(task.userId, session.user.id)));
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function createTaskList(name: string, color: string) {
  const session = await getSessionOrThrow();
  const [newList] = await db
    .insert(taskList)
    .values({ userId: session.user.id, name: name.trim(), color })
    .returning({ id: taskList.id });
  revalidatePath("/tasks");
  return { id: newList.id };
}

export async function deleteTaskList(listId: string) {
  const session = await getSessionOrThrow();
  await db
    .delete(taskList)
    .where(and(eq(taskList.id, listId), eq(taskList.userId, session.user.id)));
  revalidatePath("/tasks");
}
