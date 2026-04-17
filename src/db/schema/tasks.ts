import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { taskList } from "./task-lists";

export const task = pgTable("task", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  listId: text("list_id").references(() => taskList.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description"),
  scheduledDate: text("scheduled_date"), // "YYYY-MM-DD", null = sin fecha específica
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Task = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;
