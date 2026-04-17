"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Calendar, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { createTask } from "@/features/tasks/actions";
import { LIST_COLORS } from "./new-list-form";
import type { TaskList } from "@/db/schema";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getListColor(color: string) {
  return LIST_COLORS.find((c) => c.id === color)?.hex ?? "#8b4513";
}

interface AddTaskFormProps {
  lists: TaskList[];
  defaultListId?: string | null;
}

export function AddTaskForm({ lists, defaultListId }: AddTaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [date, setDate] = useState(todayString());
  const [listId, setListId] = useState<string | null>(defaultListId ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      try {
        await createTask({ name: trimmed, scheduledDate: date || null, listId });
        setName("");
        inputRef.current?.focus();
      } catch {
        toast.error("No se pudo crear la tarea.");
      }
    });
  }

  const selectedList = lists.find((l) => l.id === listId);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nueva tarea..."
          disabled={isPending}
          className="flex-1 px-3 py-2 text-sm rounded-xl border border-parchment-300 bg-parchment-100
                     placeholder:text-parchment-400 text-parchment-950 focus:outline-none
                     focus:ring-2 focus:ring-sienna-400 disabled:opacity-60 transition"
        />
        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-parchment-950
                     text-parchment-100 hover:bg-parchment-800 disabled:opacity-40
                     disabled:cursor-not-allowed transition-colors flex-shrink-0"
          aria-label="Agregar tarea"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-parchment-400 flex-shrink-0" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isPending}
            className="text-xs text-parchment-600 bg-transparent border-none outline-none
                       focus:text-parchment-950 cursor-pointer disabled:opacity-60"
          />
        </div>

        {lists.length > 0 && (
          <div className="relative">
            <select
              value={listId ?? ""}
              onChange={(e) => setListId(e.target.value || null)}
              disabled={isPending}
              className="text-xs bg-transparent border-none outline-none cursor-pointer appearance-none pr-4
                         disabled:opacity-60 focus:outline-none"
              style={{ color: selectedList ? getListColor(selectedList.color) : "#a09080" }}
            >
              <option value="">Sin lista</option>
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-parchment-400 pointer-events-none" />
          </div>
        )}
      </div>
    </form>
  );
}
