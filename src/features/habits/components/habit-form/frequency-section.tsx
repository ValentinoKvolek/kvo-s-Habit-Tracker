"use client";

import { useFormContext } from "react-hook-form";
import type { HabitInput } from "@/features/habits/schema";
import { DAY_LABELS } from "@/features/habits/constants";
import { cn } from "@/lib/cn";

export function FrequencySection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<HabitInput>();
  const frequency = watch("frequency");
  const frequencyDays = watch("frequencyDays");

  function toggleDay(idx: number) {
    const current = frequencyDays ? frequencyDays.split(",").map(Number) : [];
    const next = current.includes(idx)
      ? current.filter((d) => d !== idx)
      : [...current, idx].sort((a, b) => a - b);
    setValue("frequencyDays", next.length > 0 ? next.join(",") : undefined);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-parchment-950">Frecuencia</label>
      <div className="flex gap-2">
        {(["daily", "weekly"] as const).map((freq) => (
          <button
            key={freq}
            type="button"
            onClick={() => {
              setValue("frequency", freq);
              if (freq !== "weekly") setValue("frequencyDays", undefined);
            }}
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-150",
              frequency === freq
                ? "border-sienna-600 bg-sienna-50 text-sienna-700"
                : "border-parchment-300 bg-parchment-200 text-parchment-600 hover:bg-parchment-300"
            )}
          >
            {freq === "daily" ? "Diario" : "Semanal"}
          </button>
        ))}
      </div>

      {frequency === "weekly" && (
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-xs text-parchment-500">Días de la semana</span>
          <div className="flex gap-1.5">
            {DAY_LABELS.map((label, idx) => {
              const selected = frequencyDays?.split(",").map(Number).includes(idx) ?? false;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={cn(
                    "w-9 h-9 rounded-xl text-xs font-semibold border transition-all duration-150",
                    selected
                      ? "border-sienna-600 bg-sienna-50 text-sienna-700"
                      : "border-parchment-300 bg-parchment-200 text-parchment-600 hover:bg-parchment-300"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.frequencyDays && (
            <p className="text-xs text-rose-600">{errors.frequencyDays.message as string}</p>
          )}
        </div>
      )}
    </div>
  );
}
