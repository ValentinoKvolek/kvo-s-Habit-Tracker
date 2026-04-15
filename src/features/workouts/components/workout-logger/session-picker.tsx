"use client";

import { ClipboardList } from "lucide-react";
import { formatDisplayDate } from "@/lib/dates";
import type { WorkoutLogEntry } from "@/features/workouts/queries";
import type { WorkoutData } from "@/features/workouts/schema";

interface SessionPickerProps<T extends WorkoutData> {
  history: WorkoutLogEntry[];
  onLoad: (data: T) => void;
}

export function SessionPicker<T extends WorkoutData>({ history, onLoad }: SessionPickerProps<T>) {
  if (history.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-parchment-100 border border-parchment-300 rounded-xl">
      <ClipboardList size={14} className="text-parchment-400 flex-shrink-0" />
      <select
        defaultValue=""
        className="flex-1 text-sm bg-transparent text-parchment-700 focus:outline-none cursor-pointer"
        onChange={(e) => {
          const log = history.find((l) => l.id === e.target.value);
          if (log) onLoad(log.data as T);
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Cargar sesión anterior...
        </option>
        {history.map((log) => {
          const data = log.data as { sessionName?: string };
          const dateLabel = formatDisplayDate(log.date, {
            weekday: "long",
            day: "numeric",
            month: "short",
          });
          return (
            <option key={log.id} value={log.id}>
              {data.sessionName ? `${data.sessionName} — ${dateLabel}` : dateLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}
