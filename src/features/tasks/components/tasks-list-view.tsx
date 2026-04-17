"use client";

import { useState } from "react";
import { Trash2, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { AddTaskForm } from "./add-task-form";
import { TaskItem } from "./task-item";
import { NewListForm, LIST_COLORS } from "./new-list-form";
import { deleteTaskList } from "@/features/tasks/actions";
import type { TaskWithList } from "@/features/tasks/queries";
import type { TaskList } from "@/db/schema";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekAgoString() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getListColor(color: string) {
  return LIST_COLORS.find((c) => c.id === color)?.hex ?? "#8b4513";
}

interface TasksListViewProps {
  active: TaskWithList[];
  completed: TaskWithList[];
  lists: TaskList[];
}

export function TasksListView({ active, completed, lists: initialLists }: TasksListViewProps) {
  const [lists, setLists] = useState<TaskList[]>(initialLists);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showOlderCompleted, setShowOlderCompleted] = useState(false);

  const today = todayString();
  const weekAgo = getWeekAgoString();

  const filteredActive =
    activeTab === "all"
      ? active
      : activeTab === "none"
      ? active.filter((t) => !t.listId)
      : active.filter((t) => t.listId === activeTab);

  const filteredCompleted =
    activeTab === "all"
      ? completed
      : activeTab === "none"
      ? completed.filter((t) => !t.listId)
      : completed.filter((t) => t.listId === activeTab);

  const completedToday = filteredCompleted.filter(
    (t) => t.completedAt && t.completedAt.toISOString().slice(0, 10) === today
  );
  const completedThisWeek = filteredCompleted.filter((t) => {
    if (!t.completedAt) return false;
    const d = t.completedAt.toISOString().slice(0, 10);
    return d >= weekAgo && d < today;
  });
  const completedOlder = filteredCompleted.filter((t) => {
    if (!t.completedAt) return false;
    return t.completedAt.toISOString().slice(0, 10) < weekAgo;
  });

  const overdue = filteredActive.filter((t) => t.scheduledDate && t.scheduledDate < today);
  const upcoming = filteredActive.filter((t) => !t.scheduledDate || t.scheduledDate >= today);

  const selectedList = lists.find((l) => l.id === activeTab);

  async function handleDeleteList(listId: string) {
    try {
      await deleteTaskList(listId);
      setLists((prev) => prev.filter((l) => l.id !== listId));
      if (activeTab === listId) setActiveTab("all");
    } catch {
      toast.error("No se pudo eliminar la lista.");
    }
  }

  return (
    <div>
      {/* List tabs */}
      <div className="flex items-center gap-1 flex-wrap mb-5">
        {[
          { id: "all", label: "Todas" },
          { id: "none", label: "Sin lista" },
          ...lists.map((l) => ({ id: l.id, label: l.name, color: l.color })),
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const color = "color" in tab ? getListColor(tab.color) : undefined;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
              style={
                isActive
                  ? {
                      backgroundColor: color ? color + "20" : "#8b451320",
                      borderColor: color ?? "#8b4513",
                      color: color ?? "#8b4513",
                    }
                  : {
                      backgroundColor: "transparent",
                      borderColor: "#d4c4b0",
                      color: "#a09080",
                    }
              }
            >
              {tab.label}
            </button>
          );
        })}
        <NewListForm
          onCreated={(id, name, color) =>
            setLists((prev) => [
              ...prev,
              { id, name, color, userId: "", createdAt: new Date() },
            ])
          }
        />
      </div>

      {/* Delete list button */}
      {selectedList && (
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs text-parchment-500">Lista seleccionada</span>
          <button
            onClick={() => handleDeleteList(selectedList.id)}
            className="flex items-center gap-1 text-xs text-parchment-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={12} />
            Eliminar lista
          </button>
        </div>
      )}

      {/* Add task form */}
      <AddTaskForm
        lists={lists}
        defaultListId={activeTab !== "all" && activeTab !== "none" ? activeTab : null}
      />

      {/* Overdue */}
      {overdue.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">
            Vencidas ({overdue.length})
          </h2>
          <div className="flex flex-col gap-2">
            {overdue.map((t) => (
              <TaskItem key={t.id} task={t} showList={activeTab === "all"} />
            ))}
          </div>
        </div>
      )}

      {/* Active tasks */}
      {upcoming.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          {upcoming.map((t) => (
            <TaskItem key={t.id} task={t} showList={activeTab === "all"} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredActive.length === 0 && filteredCompleted.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-parchment-400">
          <ClipboardList size={32} strokeWidth={1.5} />
          <p className="text-sm">No hay tareas acá todavía.</p>
        </div>
      )}

      {/* Completed — today */}
      {completedToday.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-parchment-400 mb-3">
            Completadas hoy ({completedToday.length})
          </h2>
          <div className="flex flex-col gap-2">
            {completedToday.map((t) => (
              <TaskItem key={t.id} task={t} showList={activeTab === "all"} />
            ))}
          </div>
        </div>
      )}

      {/* Completed — this week */}
      {completedThisWeek.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-parchment-400 mb-3">
            Esta semana ({completedThisWeek.length})
          </h2>
          <div className="flex flex-col gap-2">
            {completedThisWeek.map((t) => (
              <TaskItem key={t.id} task={t} showList={activeTab === "all"} />
            ))}
          </div>
        </div>
      )}

      {/* Completed — older (collapsed) */}
      {completedOlder.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowOlderCompleted((v) => !v)}
            className="text-xs font-semibold uppercase tracking-wider text-parchment-300 hover:text-parchment-500 transition-colors mb-3 flex items-center gap-1"
          >
            {showOlderCompleted ? "▾" : "▸"} Anteriores ({completedOlder.length})
          </button>
          {showOlderCompleted && (
            <div className="flex flex-col gap-2">
              {completedOlder.map((t) => (
                <TaskItem key={t.id} task={t} showList={activeTab === "all"} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
