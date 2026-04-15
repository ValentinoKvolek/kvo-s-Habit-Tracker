"use client";

import { useFormContext } from "react-hook-form";
import { TIME_SLOTS, TIME_SLOT_LABELS, type HabitInput } from "@/features/habits/schema";
import { cn } from "@/lib/cn";

export function TimeSlotSection() {
  const { watch, setValue } = useFormContext<HabitInput>();
  const timeSlot = watch("timeSlot");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-parchment-950">
        Horario <span className="text-parchment-500 font-normal">(opcional)</span>
      </label>
      <div className="flex gap-2">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => setValue("timeSlot", timeSlot === slot ? null : slot)}
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-150",
              timeSlot === slot
                ? "border-sienna-600 bg-sienna-50 text-sienna-700"
                : "border-parchment-300 bg-parchment-200 text-parchment-600 hover:bg-parchment-300"
            )}
          >
            {TIME_SLOT_LABELS[slot]}
          </button>
        ))}
      </div>
    </div>
  );
}
