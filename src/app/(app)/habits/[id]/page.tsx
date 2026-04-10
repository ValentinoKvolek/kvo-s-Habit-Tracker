import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { auth } from "@/lib/auth";
import { getHabitWithAllEntries } from "@/lib/queries/habit.queries";
import { HabitCalendar } from "@/components/habits/habit-calendar";
import { HabitStatCard } from "@/components/habits/habit-stat-card";
import { HabitIcons } from "@/components/habits/habit-icons";
import { getHabitColor } from "@/lib/utils/colors";
import { calculateCurrentStreak, calculateLongestStreak } from "@/lib/utils/streak";
import type { HabitColor } from "@/lib/db/schema";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HabitDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const data = await getHabitWithAllEntries(id, session.user.id);
  if (!data) notFound();

  const { habit, entries } = data;
  const allDates = entries.map((e) => e.date);
  const entryDateSet = new Set(allDates);
  const currentStreak = calculateCurrentStreak(allDates);
  const longestStreak = calculateLongestStreak(allDates);
  const colorData = getHabitColor(habit.color as HabitColor);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: colorData.hex + "20" }}
          >
            <HabitIcons icon={habit.icon} color={colorData.hex} size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">
              {habit.name}
            </h1>
            {habit.description && (
              <p className="text-sm text-white/40 mt-0.5">{habit.description}</p>
            )}
          </div>
        </div>
        <Link
          href={`/habits/${id}/edit`}
          className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/8 transition-colors"
        >
          <Pencil size={16} />
        </Link>
      </div>

      {/* Stats */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
          Estadísticas
        </h2>
        <HabitStatCard
          allDates={allDates}
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          color={habit.color as HabitColor}
        />
      </section>

      {/* Calendar */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
          Historial
        </h2>
        <HabitCalendar
          entryDates={entryDateSet}
          color={habit.color as HabitColor}
        />
      </section>

      {/* Danger zone */}
      <section className="mt-8 pt-6 border-t border-white/6">
        <Link
          href={`/habits/${id}/edit`}
          className="text-sm text-white/30 hover:text-white/60 transition-colors"
        >
          Editar o archivar este hábito →
        </Link>
      </section>
    </div>
  );
}
