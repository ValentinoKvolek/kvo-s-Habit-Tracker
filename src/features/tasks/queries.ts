import { eq, and, asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { task, taskList } from "@/db/schema";
import type { Task, TaskList } from "@/db/schema";

export type TaskWithList = Task & { list: TaskList | null };

export async function getActiveTasks(userId: string): Promise<TaskWithList[]> {
  const rows = await db
    .select()
    .from(task)
    .leftJoin(taskList, eq(task.listId, taskList.id))
    .where(and(eq(task.userId, userId), eq(task.isCompleted, false)))
    .orderBy(asc(task.scheduledDate), asc(task.createdAt));

  return rows.map((r) => ({ ...r.task, list: r.task_list }));
}

export async function getCompletedTasks(userId: string): Promise<TaskWithList[]> {
  const rows = await db
    .select()
    .from(task)
    .leftJoin(taskList, eq(task.listId, taskList.id))
    .where(and(eq(task.userId, userId), eq(task.isCompleted, true)))
    .orderBy(desc(task.completedAt));

  return rows.map((r) => ({ ...r.task, list: r.task_list }));
}

export async function getTaskLists(userId: string): Promise<TaskList[]> {
  return db
    .select()
    .from(taskList)
    .where(eq(taskList.userId, userId))
    .orderBy(asc(taskList.createdAt));
}

export async function getTodayTasks(userId: string, today: string): Promise<TaskWithList[]> {
  const rows = await db
    .select()
    .from(task)
    .leftJoin(taskList, eq(task.listId, taskList.id))
    .where(
      and(
        eq(task.userId, userId),
        eq(task.isCompleted, false),
        eq(task.scheduledDate, today)
      )
    )
    .orderBy(asc(task.createdAt));

  return rows.map((r) => ({ ...r.task, list: r.task_list }));
}
