import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getActiveTasks, getCompletedTasks } from "@/lib/queries/task.queries";
import { AddTaskForm } from "@/components/tasks/add-task-form";
import { TaskItem } from "@/components/tasks/task-item";
import { ClipboardList } from "lucide-react";
import type { Task } from "@/lib/db/schema";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function tomorrowString() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(dateStr: string | null): string {
  const today = todayString();
  const tomorrow = tomorrowString();
  if (!dateStr) return "Sin fecha";
  if (dateStr === today) return "Hoy";
  if (dateStr === tomorrow) return "Mañana";

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const isPast = dateStr < today;

  const label = date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return isPast ? `${label} (vencida)` : label;
}

function groupByDate(tasks: Task[]): [string, Task[]][] {
  const groups = new Map<string, Task[]>();
  for (const t of tasks) {
    const key = t.scheduledDate ?? "sin-fecha";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  return Array.from(groups.entries());
}

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [active, completed] = await Promise.all([
    getActiveTasks(session.user.id),
    getCompletedTasks(session.user.id),
  ]);

  const today = todayString();
  const overdue = active.filter((t) => t.scheduledDate && t.scheduledDate < today);
  const upcoming = active.filter((t) => !t.scheduledDate || t.scheduledDate >= today);
  const groups = groupByDate(upcoming);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-parchment-950">Tareas</h1>
        <p className="text-sm text-parchment-500 mt-0.5">
          {active.length === 0
            ? "Todo al día"
            : `${active.length} tarea${active.length !== 1 ? "s" : ""} pendiente${active.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <AddTaskForm />

      {/* Vencidas */}
      {overdue.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">
            Vencidas ({overdue.length})
          </h2>
          <div className="flex flex-col gap-2">
            {overdue.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}

      {/* Agrupadas por fecha */}
      {groups.length === 0 && overdue.length === 0 && completed.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-parchment-400">
          <ClipboardList size={32} strokeWidth={1.5} />
          <p className="text-sm">No tenés tareas todavía. ¡Agregá una!</p>
        </div>
      )}

      {groups.map(([key, tasks]) => {
        const dateStr = key === "sin-fecha" ? null : key;
        const label = formatDateLabel(dateStr);
        const isToday = dateStr === today;

        return (
          <div key={key} className="mt-6">
            <h2
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: isToday ? "#8B4513" : "#a09080" }}
            >
              {label}
            </h2>
            <div className="flex flex-col gap-2">
              {tasks.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Completadas */}
      {completed.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-parchment-400 mb-3">
            Completadas ({completed.length})
          </h2>
          <div className="flex flex-col gap-2">
            {completed.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
