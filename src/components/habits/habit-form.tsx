"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, type HabitInput, HABIT_COLORS, HABIT_ICONS, HABIT_CATEGORIES, CATEGORY_LABELS, TIME_SLOTS, TIME_SLOT_LABELS } from "@/lib/validations/habit.schema";
import { SPORT_TYPES, SPORT_LABELS, type SportType } from "@/lib/validations/workout.schema";
import { createHabit, updateHabit } from "@/lib/actions/habit.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HabitIcons } from "./habit-icons";
import { getHabitColor } from "@/lib/utils/colors";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";
import { Dumbbell, PersonStanding, Bike, Waves, MoreHorizontal, Star, BookOpen, Heart } from "lucide-react";
import type { HabitColor, HabitIcon } from "@/lib/db/schema";

interface HabitFormProps {
  mode: "create" | "edit";
  habitId?: string;
  defaultValues?: Partial<HabitInput>;
}

const SPORT_ICONS: Record<SportType, React.ElementType> = {
  gym: Dumbbell,
  running: PersonStanding,
  cycling: Bike,
  swimming: Waves,
  other: MoreHorizontal,
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  general: Star,
  sport: Dumbbell,
  study: BookOpen,
  health: Heart,
};

const DOW_LABELS = ["D", "L", "M", "X", "J", "V", "S"]; // índice = getDay() (0=Dom)

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
      category: "general",
      sportType: undefined,
      ...defaultValues,
    },
  });

  const selectedColor = watch("color") as HabitColor;
  const selectedIcon = watch("icon") as HabitIcon;
  const category = watch("category");
  const sportType = watch("sportType") as SportType | undefined;
  const frequency = watch("frequency");
  const frequencyDays = watch("frequencyDays");
  const timeSlot = watch("timeSlot");
  const colorData = getHabitColor(selectedColor);

  function toggleDay(idx: number) {
    const current = frequencyDays ? frequencyDays.split(",").map(Number) : [];
    const next = current.includes(idx)
      ? current.filter((d) => d !== idx)
      : [...current, idx].sort((a, b) => a - b);
    setValue("frequencyDays", next.length > 0 ? next.join(",") : undefined);
  }

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

      {/* Icon picker */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-parchment-950">Ícono</label>
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
                  : "bg-parchment-200 border border-parchment-300 hover:bg-parchment-300"
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
                color={selectedIcon === icon ? colorData.hex : "#8d7a62"}
                size={18}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-parchment-950">Color</label>
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
                  selectedColor === c ? "scale-125 ring-2 ring-offset-2 ring-offset-parchment-100" : "hover:scale-110"
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

        {/* Day-of-week picker — only when weekly */}
        {frequency === "weekly" && (
          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-xs text-parchment-500">Días de la semana</span>
            <div className="flex gap-1.5">
              {DOW_LABELS.map((label, idx) => {
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

      {/* Time slot */}
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

      {/* Category selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-parchment-950">Categoría</label>
        <div className="grid grid-cols-2 gap-2">
          {HABIT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setValue("category", cat);
                  if (cat !== "sport") setValue("sportType", undefined);
                }}
                className={cn(
                  "flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-150",
                  isSelected
                    ? "border-sienna-600 bg-sienna-50 text-sienna-700"
                    : "border-parchment-300 bg-parchment-200 text-parchment-600 hover:bg-parchment-300"
                )}
              >
                <Icon size={15} />
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {/* Sport type sub-selector */}
        {category === "sport" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {SPORT_TYPES.map((type) => {
              const Icon = SPORT_ICONS[type];
              const isSelected = sportType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue("sportType", type)}
                  className={cn(
                    "flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-150",
                    isSelected
                      ? "border-sienna-600 bg-sienna-50 text-sienna-700"
                      : "border-parchment-300 bg-parchment-200 text-parchment-600 hover:bg-parchment-300"
                  )}
                >
                  <Icon size={15} />
                  {SPORT_LABELS[type]}
                </button>
              );
            })}
          </div>
        )}

        {errors.sportType && (
          <p className="text-xs text-rose-600">{errors.sportType.message as string}</p>
        )}
      </div>

      {/* Reminder time */}
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

      {/* Daily repetitions stepper */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-parchment-950">
          Repeticiones diarias
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue("targetCount", Math.max(1, watch("targetCount") - 1))}
            className="w-8 h-8 rounded-lg border border-parchment-300 bg-parchment-200 hover:bg-parchment-300 text-parchment-700 font-bold text-lg flex items-center justify-center transition-colors"
          >
            −
          </button>
          <span className="w-6 text-center font-semibold text-parchment-950">
            {watch("targetCount")}
          </span>
          <button
            type="button"
            onClick={() => setValue("targetCount", Math.min(99, watch("targetCount") + 1))}
            className="w-8 h-8 rounded-lg border border-parchment-300 bg-parchment-200 hover:bg-parchment-300 text-parchment-700 font-bold text-lg flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-xs text-parchment-500">
          Cuántas veces por día para marcar el hábito como completado
        </p>
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
