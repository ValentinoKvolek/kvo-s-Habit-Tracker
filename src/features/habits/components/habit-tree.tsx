"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Dumbbell, BookOpen, Heart, Star, Plus } from "lucide-react";
import { HabitNode } from "./habit-node";
import { cn } from "@/lib/cn";
import type { HabitWithMeta } from "@/features/habits/types";

interface HabitTreeProps {
  habits: HabitWithMeta[];
  readOnly?: boolean;
}

const CATEGORY_ORDER = ["general", "sport", "study", "health"] as const;
type CategoryKey = (typeof CATEGORY_ORDER)[number];

const CATEGORY_CONFIG: Record<CategoryKey, {
  label: string;
  Icon: React.ElementType;
  lineColor: string;
}> = {
  general: {
    label: "General",
    Icon: Star,
    lineColor: "#b09a7f",
  },
  sport: {
    label: "Deporte",
    Icon: Dumbbell,
    lineColor: "#a85860",   // habit.rose — muted, within palette
  },
  study: {
    label: "Estudio",
    Icon: BookOpen,
    lineColor: "#5a6faa",   // habit.indigo — desaturated
  },
  health: {
    label: "Salud",
    Icon: Heart,
    lineColor: "#3d8c7a",   // habit.teal — muted
  },
};

export function HabitTree({ habits, readOnly }: HabitTreeProps) {
  const grouped = CATEGORY_ORDER.reduce<Partial<Record<CategoryKey, HabitWithMeta[]>>>((acc, cat) => {
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
          habits={grouped[cat]!}
          readOnly={readOnly}
        />
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

function CategoryBranch({
  category,
  habits,
  readOnly,
}: {
  category: CategoryKey;
  habits: HabitWithMeta[];
  readOnly?: boolean;
}) {
  const config = CATEGORY_CONFIG[category];
  const { Icon, lineColor } = config;

  return (
    <div className="flex gap-0">
      <div className="flex flex-col items-center mr-3 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 z-10 bg-parchment-200 border border-parchment-300"
          style={{ borderColor: lineColor + "55" }}
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
        <div className="flex items-center h-8 mb-2">
          <span
            className="text-xs font-medium tracking-normal"
            style={{ color: lineColor }}
          >
            {config.label}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {habits.map((habit, idx) => (
            <HabitNode
              key={habit.id}
              habit={habit}
              lineColor={lineColor}
              isLast={idx === habits.length - 1}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
