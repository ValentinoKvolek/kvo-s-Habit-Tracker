import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const taskList = pgTable("task_list", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("sienna"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TaskList = typeof taskList.$inferSelect;
export type NewTaskList = typeof taskList.$inferInsert;
