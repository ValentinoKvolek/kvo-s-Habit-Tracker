"use client";

import { useState } from "react";
import { getDaysInMonth, getDayOfWeek, formatDisplayDate } from "@/lib/utils/dates";
import { getHabitColor } from "@/lib/utils/colors";
import { cn } from "@/lib/utils/cn";
import type { HabitColor } from "@/lib/db/schema";

interface HabitCalendarProps {
  entryDates: Set<string>;
  color: HabitColor;
}

const DAY_LABELS = ["D", "L", "M", "M", "J", "V", "S"];
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

  // First day of month to calculate offset
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
      return; // Don't go into the future
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
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-medium text-white/80">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-white/25 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
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
                "aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium cursor-default transition-all duration-150",
                isCompleted
                  ? "text-white"
                  : isToday
                  ? "bg-white/8 text-white/60 ring-1 ring-white/20"
                  : "text-white/25 hover:bg-white/6"
              )}
              style={
                isCompleted
                  ? { background: colorData.hex + "cc" }
                  : {}
              }
            >
              {dayNum}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/6">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-white/8" />
          <span className="text-xs text-white/30">Sin completar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ background: colorData.hex + "cc" }}
          />
          <span className="text-xs text-white/30">Completado</span>
        </div>
      </div>
    </div>
  );
}
