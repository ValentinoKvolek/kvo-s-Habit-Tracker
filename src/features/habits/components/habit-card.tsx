"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CompletionButton } from "./completion-button";
import { getHabitColor } from "@/lib/colors";
import { cn } from "@/lib/cn";
import { HabitIcons } from "./habit-icons";
import type { HabitWithMeta } from "@/features/habits/types";
import type { HabitColor } from "@/db/schema";

interface HabitCardProps {
  habit: HabitWithMeta;
  index?: number;
}

export function HabitCard({ habit, index = 0 }: HabitCardProps) {
  const color = getHabitColor(habit.color as HabitColor);

  const auraOpacity = Math.min(0.35, (habit.currentStreak / 30) * 0.35);
  const auraBlur = Math.min(40, 15 + habit.currentStreak * 0.8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="relative group"
    >
      {/* Streak aura glow */}
      {habit.currentStreak > 0 && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-700"
          style={{
            background: color.hex,
            opacity: auraOpacity,
            filter: `blur(${auraBlur}px)`,
            transform: "scale(0.9)",
          }}
        />
      )}

      <div
        className={cn(
          "relative flex items-center gap-4 p-4 rounded-2xl",
          "bg-parchment-200 dark:bg-parchment-900 border border-parchment-300 dark:border-parchment-700",
          "hover:bg-parchment-300/60 dark:hover:bg-parchment-800 hover:border-parchment-400 dark:hover:border-parchment-600",
          "transition-all duration-200",
          habit.isCompletedToday && "bg-parchment-300/40 dark:bg-parchment-800/40"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg",
            color.bg
          )}
        >
          <HabitIcons icon={habit.icon} color={color.hex} size={20} />
        </div>

        {/* Content */}
        <Link href={`/habits/${habit.id}`} className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium text-sm leading-tight truncate",
              habit.isCompletedToday ? "text-parchment-500 dark:text-parchment-400 line-through" : "text-parchment-950 dark:text-parchment-100"
            )}
          >
            {habit.name}
          </p>
          {habit.currentStreak > 0 && (
            <p className="text-xs mt-0.5" style={{ color: color.hex }}>
              {habit.currentStreak}{" "}
              {habit.currentStreak === 1 ? "día seguido" : "días seguidos"}
            </p>
          )}
        </Link>

        {/* Completion button */}
        <CompletionButton
          habitId={habit.id}
          isCompleted={habit.isCompletedToday}
          currentStreak={habit.currentStreak}
          color={habit.color as HabitColor}
          targetCount={habit.targetCount}
          todayCount={habit.todayCount}
        />
      </div>
    </motion.div>
  );
}
