import { getCompletionRate } from "@/lib/utils/streak";
import { getHabitColor } from "@/lib/utils/colors";
import type { HabitColor } from "@/lib/db/schema";

interface HabitStatCardProps {
  allDates: string[];
  currentStreak: number;
  longestStreak: number;
  color: HabitColor;
}

export function HabitStatCard({
  allDates,
  currentStreak,
  longestStreak,
  color,
}: HabitStatCardProps) {
  const colorData = getHabitColor(color);
  const rate7 = getCompletionRate(allDates, 7);
  const rate30 = getCompletionRate(allDates, 30);

  const stats = [
    { label: "Racha actual", value: currentStreak, unit: currentStreak === 1 ? "día" : "días" },
    { label: "Mejor racha", value: longestStreak, unit: longestStreak === 1 ? "día" : "días" },
    { label: "Últimos 7 días", value: `${rate7}%`, unit: "" },
    { label: "Últimos 30 días", value: `${rate30}%`, unit: "" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, unit }) => (
        <div
          key={label}
          className="bg-white/4 border border-white/8 rounded-2xl p-4"
        >
          <p className="text-xs text-white/40 mb-1">{label}</p>
          <p className="text-2xl font-bold" style={{ color: colorData.hex }}>
            {value}
            {unit && <span className="text-sm font-normal text-white/40 ml-1">{unit}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}
