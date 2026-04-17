import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActiveTasks, getCompletedTasks, getTaskLists } from "@/features/tasks/queries";
import { AddTaskForm } from "@/features/tasks/components/add-task-form";
import { TaskItem } from "@/features/tasks/components/task-item";
import { NewListForm } from "@/features/tasks/components/new-list-form";
import { TasksListView } from "@/features/tasks/components/tasks-list-view";
import { ClipboardList } from "lucide-react";

export const metadata = { title: "Tareas — Constantia" };

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [active, completed, lists] = await Promise.all([
    getActiveTasks(session.user.id),
    getCompletedTasks(session.user.id),
    getTaskLists(session.user.id),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-parchment-950">Tareas</h1>
        <p className="text-sm text-parchment-500 mt-0.5">
          {active.length === 0
            ? "Todo al día"
            : `${active.length} pendiente${active.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <TasksListView
        active={active}
        completed={completed}
        lists={lists}
      />
    </div>
  );
}
