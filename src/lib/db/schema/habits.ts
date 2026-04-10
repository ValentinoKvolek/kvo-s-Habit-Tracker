import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const frequencyEnum = pgEnum("frequency", [
  "daily",
  "weekly",
  "monthly",
  "custom",
]);

export const habitColorEnum = pgEnum("habit_color", [
  "violet",
  "blue",
  "teal",
  "green",
  "amber",
  "rose",
  "orange",
  "indigo",
]);

export const habitIconEnum = pgEnum("habit_icon", [
  "book",
  "dumbbell",
  "heart",
  "droplets",
  "moon",
  "sun",
  "brain",
  "music",
  "code",
  "pen",
  "running",
  "salad",
  "piggy-bank",
  "star",
]);

export const habit = pgTable("habit", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  icon: habitIconEnum("icon").notNull().default("star"),
  color: habitColorEnum("color").notNull().default("violet"),
  frequency: frequencyEnum("frequency").notNull().default("daily"),
  // Comma-separated day indices for weekly habits: "0,1,5" (0=Sun, 6=Sat)
  frequencyDays: text("frequency_days"),
  targetCount: integer("target_count").notNull().default(1),
  sortOrder: integer("sort_order").notNull().default(0),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const habitEntry = pgTable(
  "habit_entry",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    habitId: text("habit_id")
      .notNull()
      .references(() => habit.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Stored as "YYYY-MM-DD" text — local date, intentionally not UTC timestamp.
    // This avoids timezone conversion bugs: the user's local date is authoritative.
    date: text("date").notNull(),
    count: integer("count").notNull().default(1),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("habit_entry_unique_idx").on(
      table.habitId,
      table.userId,
      table.date
    ),
  ]
);

// Type helpers
export type Habit = typeof habit.$inferSelect;
export type NewHabit = typeof habit.$inferInsert;
export type HabitEntry = typeof habitEntry.$inferSelect;
export type NewHabitEntry = typeof habitEntry.$inferInsert;
export type HabitColor = (typeof habitColorEnum.enumValues)[number];
export type HabitIcon = (typeof habitIconEnum.enumValues)[number];
export type Frequency = (typeof frequencyEnum.enumValues)[number];
