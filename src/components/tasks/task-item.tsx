"use client";

import { useTransition } from "react";
import { motion } from "motion/react";
import { Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { completeTask, uncompleteTask, deleteTask } from "@/lib/actions/task.actions";
import type { Task } from "@/lib/db/schema";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        if (task.isCompleted) {
          await uncompleteTask(task.id);
        } else {
          await completeTask(task.id);
        }
      } catch {
        toast.error("No se pudo actualizar la tarea.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteTask(task.id);
      } catch {
        toast.error("No se pudo eliminar la tarea.");
      }
    });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: isPending ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-parchment-100 border border-parchment-300 group"
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-label={task.isCompleted ? "Marcar como pendiente" : "Completar tarea"}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                   disabled:cursor-not-allowed
                   border-parchment-400 hover:border-sienna-500"
        style={task.isCompleted ? { backgroundColor: "#8B4513", borderColor: "#8B4513" } : {}}
      >
        {task.isCompleted && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Name */}
      <span
        className="flex-1 text-sm text-parchment-900 leading-snug"
        style={task.isCompleted ? { textDecoration: "line-through", color: "#a09080" } : {}}
      >
        {task.name}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {task.isCompleted && (
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            aria-label="Restaurar tarea"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-parchment-400 hover:text-parchment-700 hover:bg-parchment-200 transition-colors"
          >
            <RotateCcw size={13} />
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Eliminar tarea"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-parchment-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}
