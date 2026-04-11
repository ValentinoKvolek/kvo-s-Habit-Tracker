"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { formatShortDate } from "@/lib/utils/dates";
import type { StudyLogEntry } from "@/lib/queries/habit.queries";

interface StudyHistoryProps {
  sessions: StudyLogEntry[];
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const PAGE_SIZE = 5;

export function StudyHistory({ sessions }: StudyHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? sessions : sessions.slice(0, PAGE_SIZE);
  const maxSessions = sessions.length > 0 ? Math.max(...sessions.map((s) => s.sessions)) : 1;

  if (sessions.length === 0) {
    return (
      <div className="bg-parchment-200 border border-parchment-300 rounded-2xl p-5">
        <h2 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-3">
          Historial de estudio
        </h2>
        <p className="text-sm text-parchment-500">
          Todavía no hay sesiones registradas. ¡Empezá hoy con el Pomodoro!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-parchment-200 border border-parchment-300 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-4">
        Historial de estudio
      </h2>

      <div className="flex flex-col gap-2.5">
        {visible.map((entry) => (
          <div
            key={entry.id}
            className="bg-parchment-100 border border-parchment-300 rounded-xl p-3.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={13} className="text-parchment-500 flex-shrink-0" />
                <span className="text-xs text-parchment-500">
                  {formatShortDate(entry.date)}
                </span>
              </div>
              <span className="text-xs font-medium text-parchment-700">
                {formatDuration(entry.totalMinutes)}
              </span>
            </div>

            {/* Visual bar + sessions count */}
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-1.5 rounded-full bg-parchment-300 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${(entry.sessions / maxSessions) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-parchment-950 flex-shrink-0">
                {entry.sessions} {entry.sessions === 1 ? "Pomodoro" : "Pomodoros"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {sessions.length > PAGE_SIZE && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 text-xs text-parchment-500 hover:text-parchment-950 transition-colors w-full text-center"
        >
          {showAll ? "Ver menos" : `Ver ${sessions.length - PAGE_SIZE} más`}
        </button>
      )}
    </div>
  );
}
