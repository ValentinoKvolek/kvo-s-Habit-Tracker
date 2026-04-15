"use client";

import { useFormContext } from "react-hook-form";
import { HABIT_CATEGORIES, CATEGORY_LABELS, type HabitInput } from "@/features/habits/schema";
import { SPORT_TYPES, SPORT_LABELS, type SportType } from "@/features/workouts/schema";
import { SPORT_ICONS, CATEGORY_ICONS } from "@/features/habits/constants";
import { cn } from "@/lib/cn";

export function CategorySection() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<HabitInput>();
  const category = watch("category");
  const sportType = watch("sportType") as SportType | undefined;

  return (
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
  );
}
