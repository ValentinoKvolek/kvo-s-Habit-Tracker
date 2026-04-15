"use client";

import { useFormContext } from "react-hook-form";
import { HABIT_COLORS, HABIT_ICONS, type HabitInput } from "@/features/habits/schema";
import { HabitIcons } from "@/features/habits/components/habit-icons";
import { getHabitColor } from "@/lib/colors";
import { cn } from "@/lib/cn";
import type { HabitColor, HabitIcon } from "@/db/schema";

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

export function IconColorSection() {
  const { watch, setValue } = useFormContext<HabitInput>();
  const selectedColor = watch("color") as HabitColor;
  const selectedIcon = watch("icon") as HabitIcon;
  const colorData = getHabitColor(selectedColor);

  return (
    <>
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
                  selectedColor === c
                    ? "scale-125 ring-2 ring-offset-2 ring-offset-parchment-100"
                    : "hover:scale-110"
                )}
                style={{ background: cd.hex }}
                title={COLOR_LABELS[c]}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
