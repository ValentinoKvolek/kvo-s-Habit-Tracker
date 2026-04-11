"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Dumbbell, BookOpen, Heart, Star } from "lucide-react";
import { CompletionButton } from "./completion-button";
import { HabitIcons } from "./habit-icons";
import { getHabitColor } from "@/lib/utils/colors";
import { cn } from "@/lib/utils/cn";
import type { HabitWithMeta } from "@/lib/queries/habit.queries";
import type { HabitColor } from "@/lib/db/schema";

interface HabitTreeProps {
  habits: HabitWithMeta[];
}

const CATEGORY_ORDER = ["general", "sport", "study", "health"] as const;

const CATEGORY_CONFIG = {
  general: {
    label: "General",
    Icon: Star,
    lineColor: "#b09a7f",   // parchment-ish
    headerBg: "bg-parchment-300",
    headerText: "text-parchment-700",
    borderColor: "#b09a7f",
  },
  sport: {
    label: "Deporte",
    Icon: Dumbbell,
    lineColor: "#c0392b",
    headerBg: "bg-rose-50",
    headerText: "text-rose-700",
    borderColor: "#c0392b",
  },
  study: {
    label: "Estudio",
    Icon: BookOpen,
    lineColor: "#6366f1",
    headerBg: "bg-indigo-50",
    headerText: "text-indigo-700",
    borderColor: "#6366f1",
  },
  health: {
    label: "Salud",
    Icon: Heart,
    lineColor: "#14b8a6",
    headerBg: "bg-teal-50",
    headerText: "text-teal-700",
    borderColor: "#14b8a6",
  },
} as const;

export function HabitTree({ habits }: HabitTreeProps) {
  // Group by category, keep only categories with habits
  const grouped = CATEGORY_ORDER.reduce<Record<string, HabitWithMeta[]>>((acc, cat) => {
    const catHabits = habits.filter((h) => h.category === cat);
    if (catHabits.length > 0) acc[cat] = catHabits;
    return acc;
  }, {});

  const activeCategories = CATEGORY_ORDER.filter((cat) => grouped[cat]);

  if (activeCategories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {activeCategories.map((cat) => (
        <CategoryBranch
          key={cat}
          category={cat}
          habits={grouped[cat]}
        />
      ))}
    </motion.div>
  );
}

function CategoryBranch({
  category,
  habits,
}: {
  category: keyof typeof CATEGORY_CONFIG;
  habits: HabitWithMeta[];
}) {
  const config = CATEGORY_CONFIG[category];
  const { Icon, lineColor, borderColor } = config;

  return (
    <div className="flex gap-0">
      {/* Vertical branch line + header */}
      <div className="flex flex-col items-center mr-3 flex-shrink-0">
        {/* Category node */}
        <div
          className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 z-10",
            config.headerBg
          )}
          style={{ border: `2px solid ${borderColor}` }}
        >
          <Icon size={14} style={{ color: lineColor }} />
        </div>
        {/* Vertical line going down */}
        {habits.length > 0 && (
          <div
            className="flex-1 w-0.5 mt-1"
            style={{ backgroundColor: lineColor, opacity: 0.4, minHeight: 16 }}
          />
        )}
      </div>

      {/* Right side: category label + habits */}
      <div className="flex-1 min-w-0">
        {/* Category label */}
        <div className="flex items-center h-8 mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: lineColor }}
          >
            {config.label}
          </span>
        </div>

        {/* Habit nodes */}
        <div className="flex flex-col gap-2">
          {habits.map((habit, idx) => (
            <HabitNode
              key={habit.id}
              habit={habit}
              lineColor={lineColor}
              isLast={idx === habits.length - 1}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HabitNode({
  habit,
  lineColor,
  isLast,
  index,
}: {
  habit: HabitWithMeta;
  lineColor: string;
  isLast: boolean;
  index: number;
}) {
  const color = getHabitColor(habit.color as HabitColor);
  const auraOpacity = Math.min(0.25, (habit.currentStreak / 30) * 0.25);
  const auraBlur = Math.min(30, 10 + habit.currentStreak * 0.7);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="flex items-stretch gap-0"
    >
      {/* L-shaped connector */}
      <div className="flex flex-col items-center w-4 flex-shrink-0 mr-2">
        {/* Top half of vertical segment */}
        <div
          className="w-0.5 flex-1"
          style={{ backgroundColor: lineColor, opacity: 0.35, minHeight: 14 }}
        />
        {/* Horizontal segment */}
        <div
          className="w-full h-0.5 self-center"
          style={{ backgroundColor: lineColor, opacity: 0.35 }}
        />
        {/* Bottom half — only if not last */}
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
            habit.isCompletedToday && "bg-parchment-300/40"
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
              <p className="text-xs mt-0.5" style={{ color: color.hex }}>
                🔥 {habit.currentStreak}{" "}
                {habit.currentStreak === 1 ? "día" : "días"}
              </p>
            )}
          </Link>

          <CompletionButton
            habitId={habit.id}
            isCompleted={habit.isCompletedToday}
            currentStreak={habit.currentStreak}
            color={habit.color as HabitColor}
            targetCount={habit.targetCount}
            todayCount={habit.todayCount}
          />
        </div>
      </div>
    </motion.div>
  );
}
