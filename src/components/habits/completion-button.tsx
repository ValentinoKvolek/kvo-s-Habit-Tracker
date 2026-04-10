"use client";

import { useOptimistic, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toggleHabitEntry } from "@/lib/actions/entry.actions";
import { getTodayString } from "@/lib/utils/dates";
import { StreakRing } from "./streak-ring";
import { getHabitColor } from "@/lib/utils/colors";
import { isStreakMilestone } from "@/lib/utils/streak";
import { toast } from "sonner";
import type { HabitColor } from "@/lib/db/schema";

interface CompletionButtonProps {
  habitId: string;
  isCompleted: boolean;
  currentStreak: number;
  color: HabitColor;
  targetCount?: number;
  todayCount?: number;
}

export function CompletionButton({
  habitId,
  isCompleted,
  currentStreak,
  color,
  targetCount = 1,
  todayCount = 0,
}: CompletionButtonProps) {
  const [optimisticCompleted, setOptimistic] = useOptimistic(isCompleted);
  const [isPending, startTransition] = useTransition();
  const colorData = getHabitColor(color);
  const today = getTodayString();

  // Progress: for simple habits, 0 or 100. For count-based, proportional.
  const progress = optimisticCompleted
    ? 100
    : targetCount > 1
    ? Math.min(100, (todayCount / targetCount) * 100)
    : 0;

  async function handleToggle() {
    const willBeCompleted = !optimisticCompleted;

    startTransition(async () => {
      setOptimistic(willBeCompleted);

      try {
        const result = await toggleHabitEntry(habitId, today);

        if (!result.success) {
          toast.error("No se pudo guardar. Intentá de nuevo.");
        } else if (result.completed && isStreakMilestone(currentStreak + 1)) {
          toast.success(`🔥 ¡${currentStreak + 1} días seguidos!`, {
            description: "Seguís sumando. ¡Increíble constancia!",
          });
        }
      } catch {
        toast.error("No se pudo guardar. Intentá de nuevo.");
      }
    });
  }

  return (
    <motion.button
      onClick={handleToggle}
      disabled={isPending}
      className="relative cursor-pointer disabled:opacity-70 flex-shrink-0"
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label={optimisticCompleted ? "Marcar como no completado" : "Marcar como completado"}
    >
      {/* Glow on completion */}
      <AnimatePresence>
        {optimisticCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-full blur-md pointer-events-none"
            style={{ background: colorData.hex + "50" }}
          />
        )}
      </AnimatePresence>

      <StreakRing
        progress={progress}
        color={colorData.hex}
        isCompleted={optimisticCompleted}
        streak={optimisticCompleted ? 0 : currentStreak}
      />
    </motion.button>
  );
}
