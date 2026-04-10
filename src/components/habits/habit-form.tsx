"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, type HabitInput, HABIT_COLORS, HABIT_ICONS } from "@/lib/validations/habit.schema";
import { createHabit, updateHabit } from "@/lib/actions/habit.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HabitIcons } from "./habit-icons";
import { getHabitColor } from "@/lib/utils/colors";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";
import type { HabitColor, HabitIcon } from "@/lib/db/schema";

interface HabitFormProps {
  mode: "create" | "edit";
  habitId?: string;
  defaultValues?: Partial<HabitInput>;
}

const COLOR_LABELS: Record<string, string> = {
  violet: "Violeta",
  blue: "Azul",
  teal: "Teal",
  green: "Verde",
  amber: "Ámbar",
  rose: "Rosa",
  orange: "Naranja",
  indigo: "Índigo",
};

export function HabitForm({ mode, habitId, defaultValues }: HabitFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      color: "violet",
      icon: "star",
      frequency: "daily",
      targetCount: 1,
      ...defaultValues,
    },
  });

  const selectedColor = watch("color") as HabitColor;
  const selectedIcon = watch("icon") as HabitIcon;
  const colorData = getHabitColor(selectedColor);

  async function onSubmit(data: HabitInput) {
    setIsLoading(true);
    try {
      if (mode === "create") {
        await createHabit(data);
        toast.success("¡Hábito creado! Empezá hoy.");
        router.push("/dashboard");
      } else if (habitId) {
        await updateHabit(habitId, data);
        toast.success("Hábito actualizado.");
        router.push(`/habits/${habitId}`);
      }
      router.refresh();
    } catch {
      toast.error("Algo salió mal. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Name */}
      <Input
        label="Nombre del hábito"
        placeholder="Ej: Leer 20 minutos"
        error={errors.name?.message}
        {...register("name")}
      />

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">
          Descripción{" "}
          <span className="text-white/30 font-normal">(opcional)</span>
        </label>
        <textarea
          className={cn(
            "w-full h-20 rounded-xl px-3.5 py-2.5 text-sm resize-none",
            "bg-white/6 border border-white/10",
            "text-white placeholder:text-white/30",
            "focus:outline-none focus:border-violet-500/60 focus:bg-white/8",
            "transition-all duration-150"
          )}
          placeholder="Por qué es importante este hábito para vos..."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-rose-400">{errors.description.message}</p>
        )}
      </div>

      {/* Icon picker */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/70">Ícono</label>
        <div className="flex flex-wrap gap-2">
          {HABIT_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue("icon", icon)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150",
                selectedIcon === icon
                  ? "border-2 scale-110"
                  : "bg-white/6 border border-white/10 hover:bg-white/10"
              )}
              style={
                selectedIcon === icon
                  ? { background: colorData.hex + "20", borderColor: colorData.hex }
                  : {}
              }
              title={icon}
            >
              <HabitIcons
                icon={icon}
                color={selectedIcon === icon ? colorData.hex : "rgba(255,255,255,0.5)"}
                size={18}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/70">Color</label>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => {
            const cd = getHabitColor(c as HabitColor);
            return (
              <button
                key={c}
                type="button"
                onClick={() => setValue("color", c)}
                className={cn(
                  "w-8 h-8 rounded-full transition-all duration-150",
                  selectedColor === c ? "scale-125 ring-2 ring-offset-2 ring-offset-[#0d0d14]" : "hover:scale-110"
                )}
                style={{ background: cd.hex }}
                title={COLOR_LABELS[c]}
              />
            );
          })}
        </div>
      </div>

      {/* Frequency */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/70">Frecuencia</label>
        <div className="flex gap-2">
          {(["daily", "weekly"] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setValue("frequency", freq)}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-150",
                watch("frequency") === freq
                  ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/8"
              )}
            >
              {freq === "daily" ? "Diario" : "Semanal"}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        isLoading={isLoading}
        className="w-full mt-2"
      >
        {mode === "create" ? "Crear hábito" : "Guardar cambios"}
      </Button>
    </form>
  );
}
