"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sun, Sunset, Moon, Clock, Plus } from "lucide-react";
import { HabitNode } from "./habit-node";
import { cn } from "@/lib/cn";
import type { HabitWithMeta } from "@/features/habits/types";

interface TimeSlotTreeProps {
  habits: HabitWithMeta[];
  readOnly?: boolean;
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

export function TimeSlotTree({ habits, readOnly }: TimeSlotTreeProps) {
  const grouped = SLOT_ORDER.reduce<Record<SlotKey, HabitWithMeta[]>>(
    (acc, slot) => {
      const slotHabits = habits.filter((h) => (h.timeSlot ?? "none") === slot);
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
        <SlotBranch key={slot} slot={slot} habits={grouped[slot]} readOnly={readOnly} />
      ))}

      {!readOnly && (
        <Link
          href="/habits/new"
          className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-parchment-500 border border-dashed border-parchment-400 rounded-sm hover:border-sienna-400 hover:text-sienna-700 transition-colors self-start"
        >
          <Plus size={14} />
          Nuevo hábito
        </Link>
      )}
    </motion.div>
  );
}

function SlotBranch({
  slot,
  habits,
  readOnly,
}: {
  slot: SlotKey;
  habits: HabitWithMeta[];
  readOnly?: boolean;
}) {
  const config = SLOT_CONFIG[slot];
  const { Icon, lineColor, borderColor } = config;
  const completedCount = habits.filter((h) => h.isCompletedToday).length;

  return (
    <div className="flex gap-0">
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
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
