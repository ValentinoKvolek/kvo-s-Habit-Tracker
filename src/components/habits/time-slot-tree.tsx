"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sun, Sunset, Moon, Clock, Plus } from "lucide-react";
import { CompletionButton } from "./completion-button";
import { HabitIcons } from "./habit-icons";
import { getHabitColor } from "@/lib/utils/colors";
import { cn } from "@/lib/utils/cn";
import type { HabitWithMeta } from "@/lib/queries/habit.queries";
import type { HabitColor } from "@/lib/db/schema";

interface TimeSlotTreeProps {
  habits: HabitWithMeta[];
}

const SLOT_ORDER = ["morning", "afternoon", "night", "none"] as const;
type SlotKey = (typeof SLOT_ORDER)[number];

const SLOT_CONFIG: Record<SlotKey, {
  label: string;
  Icon: React.ElementType;
  lineColor: string;
  headerBg: string;
  borderColor: string;
}> = {
  morning: {
    label: "Mañana",
    Icon: Sun,
    lineColor: "#d97706",
    headerBg: "bg-amber-50",
    borderColor: "#d97706",
  },
  afternoon: {
    label: "Tarde",
    Icon: Sunset,
    lineColor: "#ea580c",
    headerBg: "bg-orange-50",
    borderColor: "#ea580c",
  },
  night: {
    label: "Noche",
    Icon: Moon,
    lineColor: "#6366f1",
    headerBg: "bg-indigo-50",
    borderColor: "#6366f1",
  },
  none: {
    label: "Sin horario",
    Icon: Clock,
    lineColor: "#b09a7f",
    headerBg: "bg-parchment-300",
    borderColor: "#b09a7f",
  },
};

export function TimeSlotTree({ habits }: TimeSlotTreeProps) {
  const grouped = SLOT_ORDER.reduce<Record<SlotKey, HabitWithMeta[]>>(
    (acc, slot) => {
      const slotHabits = habits.filter(
        (h) => (h.timeSlot ?? "none") === slot
      );
      if (slotHabits.length > 0) acc[slot] = slotHabits;
      return acc;
    },
    { morning: [], afternoon: [], night: [], none: [] }
  );

  const activeSlots = SLOT_ORDER.filter((slot) => grouped[slot]?.length > 0);

  if (activeSlots.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {activeSlots.map((slot) => (
        <SlotBranch key={slot} slot={slot} habits={grouped[slot]} />
      ))}

      <Link
        href="/habits/new"
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-parchment-500 border border-dashed border-parchment-400 rounded-sm hover:border-sienna-400 hover:text-sienna-700 transition-colors self-start"
      >
        <Plus size={14} />
        Nuevo hábito
      </Link>
    </motion.div>
  );
}

function SlotBranch({ slot, habits }: { slot: SlotKey; habits: HabitWithMeta[] }) {
  const config = SLOT_CONFIG[slot];
  const { Icon, lineColor, borderColor } = config;
  const completedCount = habits.filter((h) => h.isCompletedToday).length;

  return (
    <div className="flex gap-0">
      {/* Vertical branch line + header */}
      <div className="flex flex-col items-center mr-3 flex-shrink-0">
        <div
          className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 z-10", config.headerBg)}
          style={{ border: `2px solid ${borderColor}` }}
        >
          <Icon size={14} style={{ color: lineColor }} />
        </div>
        {habits.length > 0 && (
          <div
            className="flex-1 w-0.5 mt-1"
            style={{ backgroundColor: lineColor, opacity: 0.4, minHeight: 16 }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 h-8 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: lineColor }}>
            {config.label}
          </span>
          <span className="text-xs text-parchment-400 tabular-nums">
            {completedCount}/{habits.length}
          </span>
        </div>

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
      <div className="flex flex-col items-center w-4 flex-shrink-0 mr-2">
        <div className="w-0.5 flex-1" style={{ backgroundColor: lineColor, opacity: 0.35, minHeight: 14 }} />
        <div className="w-full h-0.5 self-center" style={{ backgroundColor: lineColor, opacity: 0.35 }} />
        {!isLast ? (
          <div className="w-0.5 flex-1" style={{ backgroundColor: lineColor, opacity: 0.35, minHeight: 14 }} />
        ) : (
          <div className="flex-1" />
        )}
      </div>

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
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", color.bg)}>
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
