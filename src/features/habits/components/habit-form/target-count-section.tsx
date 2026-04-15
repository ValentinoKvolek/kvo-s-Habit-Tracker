"use client";

import { useFormContext } from "react-hook-form";
import type { HabitInput } from "@/features/habits/schema";

export function TargetCountSection() {
  const { watch, setValue } = useFormContext<HabitInput>();
  const value = watch("targetCount");

  function dec() {
    setValue("targetCount", Math.max(1, value - 1));
  }

  function inc() {
    setValue("targetCount", Math.min(99, value + 1));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-parchment-950">
        Repeticiones diarias
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={dec}
          className="w-8 h-8 rounded-lg border border-parchment-300 bg-parchment-200 hover:bg-parchment-300 text-parchment-700 font-bold text-lg flex items-center justify-center transition-colors"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold text-parchment-950">
          {value}
        </span>
        <button
          type="button"
          onClick={inc}
          className="w-8 h-8 rounded-lg border border-parchment-300 bg-parchment-200 hover:bg-parchment-300 text-parchment-700 font-bold text-lg flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
      <p className="text-xs text-parchment-500">
        Cuántas veces por día para marcar el hábito como completado
      </p>
    </div>
  );
}
