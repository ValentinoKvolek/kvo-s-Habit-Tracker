"use client";

import { useFormContext } from "react-hook-form";
import type { HabitInput } from "@/features/habits/schema";

export function ReminderSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HabitInput>();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-parchment-950">
        Recordatorio{" "}
        <span className="text-parchment-500 font-normal">(opcional)</span>
      </label>
      <input
        type="time"
        className="h-11 w-full rounded-sm px-3.5 text-sm font-sans bg-parchment-100 border border-parchment-400 text-parchment-950 focus:outline-none focus:border-sienna-600 focus:bg-parchment-50 transition-all duration-150"
        {...register("reminderTime")}
      />
      {errors.reminderTime && (
        <p className="text-xs text-rose-600">{errors.reminderTime.message as string}</p>
      )}
      <p className="text-xs text-parchment-500">
        Recibís una notificación del navegador a esta hora si tenés la pestaña abierta
      </p>
    </div>
  );
}
