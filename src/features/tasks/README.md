# tasks

## Purpose
One-off to-dos scoped to a date — separate from habits. A task is done once, not tracked as a streak.

## What's inside
- `actions.ts` — `createTask`, `toggleTask`, `deleteTask`.
- `queries.ts` — `getActiveTasks`, `getCompletedTasks`.
- `components/add-task-form.tsx` — creation form.
- `components/task-item.tsx` — single row with checkbox + delete.

## Public exports
- `createTask`, `toggleTask`, `deleteTask`
- `getActiveTasks`, `getCompletedTasks`
- `AddTaskForm`, `TaskItem`

## What this module does NOT do
- Does not integrate with habits or entries — tasks are standalone.
- Does not send reminders.

## Dependencies
- `@/db` — `task` schema
