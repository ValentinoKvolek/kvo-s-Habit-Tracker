import { eq, and, asc, desc, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { task } from "@/db/schema";
import type { Task } from "@/db/schema";

export async function getActiveTasks(userId: string): Promise<Task[]> {
  return db
    .select()
    .from(task)
    .where(and(eq(task.userId, userId), eq(task.isCompleted, false)))
    .orderBy(asc(task.scheduledDate), asc(task.createdAt));
}

export async function getCompletedTasks(userId: string): Promise<Task[]> {
  return db
    .select()
    .from(task)
    .where(and(eq(task.userId, userId), eq(task.isCompleted, true)))
    .orderBy(desc(task.completedAt));
}
