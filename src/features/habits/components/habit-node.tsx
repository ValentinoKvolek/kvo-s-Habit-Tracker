"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { CompletionButton } from "./completion-button";
import { HabitIcons } from "./habit-icons";
import { getHabitColor } from "@/lib/colors";
import { cn } from "@/lib/cn";
import type { HabitWithMeta } from "@/features/habits/types";
import type { HabitColor } from "@/db/schema";

interface HabitNodeProps {
  habit: HabitWithMeta;
  lineColor: string;
  isLast: boolean;
  readOnly?: boolean;
}

export function HabitNode({ habit, lineColor, isLast, readOnly }: HabitNodeProps) {
  const color = getHabitColor(habit.color as HabitColor);
  const auraOpacity = Math.min(0.25, (habit.currentStreak / 30) * 0.25);
  const auraBlur = Math.min(30, 10 + habit.currentStreak * 0.7);

  return (
    <div className="flex items-stretch gap-0">
      {/* L-shaped connector */}
      <div className="flex flex-col items-center w-4 flex-shrink-0 mr-2">
        <div
          className="w-0.5 flex-1"
          style={{ backgroundColor: lineColor, opacity: 0.35, minHeight: 14 }}
        />
        <div
          className="w-full h-0.5 self-center"
          style={{ backgroundColor: lineColor, opacity: 0.35 }}
        />
        {!isLast ? (
          <div
            className="w-0.5 flex-1"
            style={{ backgroundColor: lineColor, opacity: 0.35, minHeight: 14 }}
          />
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* Habit card */}
      <div className="relative flex-1 group">
        {habit.currentStreak > 0 && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: color.hex,
              opacity: auraOpacity,
              filter: `blur(${auraBlur}px)`,
              transform: "scale(0.92)",
            }}
          />
        )}
        <div
          className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "bg-parchment-200 border border-parchment-300",
            "hover:bg-parchment-300/60 hover:border-parchment-400 transition-all duration-150",
            habit.isCompletedToday && "bg-parchment-300/40 dark:bg-[#2d2318]/60"
          )}
        >
          <div
            className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", color.bg)}
          >
            <HabitIcons icon={habit.icon} color={color.hex} size={16} />
          </div>

          <Link href={`/habits/${habit.id}`} className="flex-1 min-w-0">
            <p
              className={cn(
                "font-medium text-sm leading-tight truncate",
                habit.isCompletedToday ? "text-parchment-500 line-through" : "text-parchment-950"
              )}
            >
              {habit.name}
            </p>
            {habit.currentStreak > 0 && (
              <p className="text-xs mt-0.5 tabular-nums" style={{ color: color.hex }}>
                {habit.currentStreak}{" "}
                {habit.currentStreak === 1 ? "día" : "días"}
              </p>
            )}
          </Link>

          {readOnly ? (
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                habit.isCompletedToday
                  ? "border-sienna-600 bg-sienna-100 text-sienna-700 dark:border-sienna-200 dark:bg-sienna-200 dark:text-sienna-700"
                  : "border-parchment-400 bg-parchment-200 text-parchment-400"
              )}
            >
              {habit.isCompletedToday ? <Check size={14} /> : <X size={14} />}
            </div>
          ) : (
            <CompletionButton
              habitId={habit.id}
              isCompleted={habit.isCompletedToday}
              currentStreak={habit.currentStreak}
              color={habit.color as HabitColor}
              targetCount={habit.targetCount}
              todayCount={habit.todayCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}
