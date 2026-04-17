"use client";

import { useState } from "react";
import { getDaysInMonth, getDayOfWeek, formatDisplayDate } from "@/lib/dates";
import { getHabitColor } from "@/lib/colors";
import { cn } from "@/lib/cn";
import { DAY_LABELS } from "@/features/habits/constants";
import type { HabitColor } from "@/db/schema";

interface HabitCalendarProps {
  entryDates: Set<string>;
  color: HabitColor;
}

const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export function HabitCalendar({ entryDates, color }: HabitCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const colorData = getHabitColor(color);
  const days = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getDayOfWeek(days[0]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    const now = new Date();
    if (viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth())) {
      return;
    }
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <div className="bg-parchment-200 dark:bg-parchment-900 border border-parchment-300 dark:border-parchment-700 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg text-parchment-500 dark:text-parchment-400 hover:text-parchment-950 dark:hover:text-parchment-100 hover:bg-parchment-300 dark:hover:bg-parchment-700 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-medium text-parchment-700 dark:text-parchment-300">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="p-1.5 rounded-lg text-parchment-500 dark:text-parchment-400 hover:text-parchment-950 dark:hover:text-parchment-100 hover:bg-parchment-300 dark:hover:bg-parchment-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-parchment-500 dark:text-parchment-400 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((dateStr) => {
          const isCompleted = entryDates.has(dateStr);
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const isToday = dateStr === todayStr;
          const dayNum = parseInt(dateStr.split("-")[2]);

          return (
            <div
              key={dateStr}
              title={isCompleted ? `✓ ${formatDisplayDate(dateStr)}` : formatDisplayDate(dateStr)}
              className={cn(
                "aspect-square rounded-md sm:rounded-lg flex items-center justify-center text-[10px] sm:text-[11px] font-medium cursor-default transition-all duration-150",
                isCompleted
                  ? "text-white"
                  : isToday
                  ? "bg-parchment-300 dark:bg-parchment-700 text-parchment-800 dark:text-parchment-100 ring-1 ring-parchment-400 dark:ring-parchment-500"
                  : "text-parchment-500 dark:text-parchment-400 hover:bg-parchment-300 dark:hover:bg-parchment-700"
              )}
              style={isCompleted ? { background: colorData.hex + "cc" } : {}}
            >
              {dayNum}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-parchment-300 dark:border-parchment-700">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-parchment-300 dark:bg-parchment-700" />
          <span className="text-xs text-parchment-500 dark:text-parchment-400">Sin completar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm" style={{ background: colorData.hex + "cc" }} />
          <span className="text-xs text-parchment-500 dark:text-parchment-400">Completado</span>
        </div>
      </div>
    </div>
  );
}
