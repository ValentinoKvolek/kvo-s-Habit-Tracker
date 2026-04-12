"use client";

import { useOptimistic, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toggleHabitEntry, updateEntryCount } from "@/lib/actions/entry.actions";
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
  const colorData = getHabitColor(color);
  const today = getTodayString();

  // ── Simple toggle mode (targetCount === 1) ────────────────────────────────
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(isCompleted);
  const [isPendingToggle, startToggle] = useTransition();

  // ── Count mode (targetCount > 1) ──────────────────────────────────────────
  const [optimisticCount, setOptimisticCount] = useOptimistic(todayCount);
  const [isPendingCount, startCount] = useTransition();

  const isCountMode = targetCount > 1;
  const optimisticCountCompleted = optimisticCount >= targetCount;

  const progress = isCountMode
    ? optimisticCountCompleted
      ? 100
      : Math.min(100, (optimisticCount / targetCount) * 100)
    : optimisticCompleted
    ? 100
    : 0;

  const centerLabel =
    isCountMode && !optimisticCountCompleted && optimisticCount > 0
      ? `${optimisticCount}/${targetCount}`
      : undefined;

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleToggle() {
    const willBeCompleted = !optimisticCompleted;
    startToggle(async () => {
      setOptimisticCompleted(willBeCompleted);
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

  function handleIncrement() {
    if (optimisticCountCompleted) return;
    const newCount = optimisticCount + 1;
    startCount(async () => {
      setOptimisticCount(newCount);
      try {
        await updateEntryCount(habitId, today, newCount);
        if (newCount >= targetCount && isStreakMilestone(currentStreak + 1)) {
          toast.success(`🔥 ¡${currentStreak + 1} días seguidos!`, {
            description: "Seguís sumando. ¡Increíble constancia!",
          });
        }
      } catch {
        toast.error("No se pudo guardar. Intentá de nuevo.");
      }
    });
  }

  const isPending = isPendingToggle || isPendingCount;
  const isDisabled = isPending || (isCountMode && optimisticCountCompleted);
  const showGlow = isCountMode ? optimisticCountCompleted : optimisticCompleted;

  return (
    <motion.button
      onClick={isCountMode ? handleIncrement : handleToggle}
      disabled={isDisabled}
      className="relative cursor-pointer disabled:opacity-70 flex-shrink-0"
      whileTap={{ scale: isDisabled ? 1 : 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label={
        isCountMode
          ? `${optimisticCount} de ${targetCount} completados`
          : optimisticCompleted
          ? "Marcar como no completado"
          : "Marcar como completado"
      }
    >
      <AnimatePresence>
        {showGlow && (
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
        isCompleted={isCountMode ? optimisticCountCompleted : optimisticCompleted}
        streak={showGlow ? 0 : currentStreak}
        label={centerLabel}
      />
    </motion.button>
  );
}
