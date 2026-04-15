"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTodayString, getDateString, formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/cn";

function getLabel(dateStr: string): string {
  const today = getTodayString();
  if (dateStr === today) return "Hoy";
  const yesterday = getDateString(-1);
  if (dateStr === yesterday) return "Ayer";
  return formatDisplayDate(dateStr, { weekday: "long", day: "numeric", month: "long" });
}

function shiftDate(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(y, m - 1, d + delta);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
}

export function DateNavigator({ currentDate }: { currentDate: string }) {
  const router = useRouter();
  const today = getTodayString();
  const isToday = currentDate === today;

  function go(delta: number) {
    const next = shiftDate(currentDate, delta);
    if (next > today) return;
    router.push(next === today ? "/dashboard" : `/dashboard?date=${next}`);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => go(-1)}
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center",
          "text-parchment-500 hover:text-parchment-950 hover:bg-parchment-300",
          "transition-colors duration-150"
        )}
        aria-label="Día anterior"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="min-w-[140px] text-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentDate}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "block text-sm font-medium",
              isToday ? "text-sienna-700" : "text-parchment-700"
            )}
          >
            {getLabel(currentDate)}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        onClick={() => go(1)}
        disabled={isToday}
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center",
          "text-parchment-500 hover:text-parchment-950 hover:bg-parchment-300",
          "transition-colors duration-150",
          "disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-parchment-500"
        )}
        aria-label="Día siguiente"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
