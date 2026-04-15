import { getCompletionRate } from "@/features/entries/logic";
import { getHabitColor } from "@/lib/colors";
import type { HabitColor } from "@/db/schema";

interface HabitStatCardProps {
  allDates: string[];
  currentStreak: number;
  longestStreak: number;
  color: HabitColor;
}

const HABIT_THRESHOLD = 21;

export function HabitStatCard({
  allDates,
  currentStreak,
  longestStreak,
  color,
}: HabitStatCardProps) {
  const colorData = getHabitColor(color);
  const rate7 = getCompletionRate(allDates, 7);
  const rate30 = getCompletionRate(allDates, 30);

  const totalDays = allDates.length;
  const daysLeft = Math.max(0, HABIT_THRESHOLD - totalDays);
  const progress = Math.min(100, (totalDays / HABIT_THRESHOLD) * 100);
  const isFormed = totalDays >= HABIT_THRESHOLD;

  const stats = [
    { label: "Racha actual", value: currentStreak, unit: currentStreak === 1 ? "día" : "días" },
    { label: "Mejor racha", value: longestStreak, unit: longestStreak === 1 ? "día" : "días" },
    { label: "Últimos 7 días", value: `${rate7}%`, unit: "" },
    { label: "Últimos 30 días", value: `${rate30}%`, unit: "" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, unit }) => (
          <div
            key={label}
            className="bg-parchment-200 border border-parchment-300 rounded-2xl p-4"
          >
            <p className="text-xs text-parchment-500 mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color: colorData.hex }}>
              {value}
              {unit && <span className="text-sm font-normal text-parchment-500 ml-1">{unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* 21-day habit formation card */}
      <div className="bg-parchment-200 border border-parchment-300 rounded-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-parchment-950">
              {isFormed ? "¡Hábito formado! 🎉" : `${daysLeft} días para formar el hábito`}
            </p>
            <p className="text-xs text-parchment-500 mt-0.5">
              {totalDays} de {HABIT_THRESHOLD} días completados
            </p>
          </div>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: colorData.hex }}
          >
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-parchment-300 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: colorData.hex,
            }}
          />
        </div>

        {/* Milestone markers */}
        <div className="flex justify-between mb-4">
          {[7, 14, 21].map((milestone) => {
            const reached = totalDays >= milestone;
            return (
              <div key={milestone} className="flex flex-col items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full border"
                  style={{
                    background: reached ? colorData.hex : "transparent",
                    borderColor: reached ? colorData.hex : "#b09a7e",
                  }}
                />
                <span className="text-[10px] text-parchment-500">{milestone}d</span>
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div className="bg-parchment-100 border border-parchment-300 rounded-xl p-3">
          <p className="text-[11px] text-parchment-600 leading-relaxed">
            <span className="font-semibold text-parchment-800">¿Por qué 21 días?</span>{" "}
            El Dr. Maxwell Maltz observó en 1960 que sus pacientes tardaban al menos 21 días en adaptarse a un cambio.
            James Clear retoma este concepto en{" "}
            <span className="italic">Hábitos Atómicos</span> para explicar que la repetición
            constante es lo que convierte una acción en un comportamiento automático.
          </p>
        </div>
      </div>
    </div>
  );
}
