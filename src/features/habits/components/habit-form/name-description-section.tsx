"use client";

import { useFormContext } from "react-hook-form";
import type { HabitInput } from "@/features/habits/schema";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export function NameDescriptionSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HabitInput>();

  return (
    <>
      <Input
        label="Nombre del hábito"
        placeholder="Ej: Leer 20 minutos"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-parchment-950">
          Descripción{" "}
          <span className="text-parchment-500 font-normal">(opcional)</span>
        </label>
        <textarea
          className={cn(
            "w-full h-20 rounded-xl px-3.5 py-2.5 text-sm resize-none",
            "bg-parchment-200 border border-parchment-300",
            "text-parchment-950 placeholder:text-parchment-400",
            "focus:outline-none focus:border-sienna-600 focus:bg-parchment-100",
            "transition-all duration-150"
          )}
          placeholder="Por qué es importante este hábito para vos..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>
    </>
  );
}
