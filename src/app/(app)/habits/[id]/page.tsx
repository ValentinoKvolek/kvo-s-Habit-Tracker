import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { auth } from "@/lib/auth";
import { getHabitWithAllEntries } from "@/features/habits/queries";
import { getWorkoutLog, getWorkoutHistory } from "@/features/workouts/queries";
import { getStudyLog, getStudyHistory } from "@/features/study/queries";
import { HabitCalendar } from "@/features/habits/components/habit-calendar";
import { HabitStatCard } from "@/features/habits/components/habit-stat-card";
import { HabitIcons } from "@/features/habits/components/habit-icons";
import { CompletionButton } from "@/features/habits/components/completion-button";
import { WorkoutLogger } from "@/features/workouts/components/workout-logger";
import { WorkoutHistory } from "@/features/workouts/components/workout-history";
import { PomodoroTimer } from "@/features/study/components/pomodoro-timer";
import { StudyHistory } from "@/features/study/components/study-history";
import { getHabitColor } from "@/lib/colors";
import { calculateCurrentStreak, calculateLongestStreak } from "@/features/entries/logic";
import { getTodayString } from "@/lib/dates";
import type { HabitColor } from "@/db/schema";

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
  const today = getTodayString();
  const allDates = entries.map((e) => e.date);
  const entryDateSet = new Set(allDates);
  const currentStreak = calculateCurrentStreak(allDates);
  const longestStreak = calculateLongestStreak(allDates);
  const colorData = getHabitColor(habit.color as HabitColor);

  const todayEntry = entries.find((e) => e.date === today);
  const isCompletedToday = !!todayEntry;
  const todayCount = todayEntry?.count ?? 0;

  const isSport = habit.category === "sport";
  const isStudy = habit.category === "study";

  const [todayLog, workoutLogs, todayStudy, studyLogs] = await Promise.all([
    isSport ? getWorkoutLog(habit.id, today, session.user.id) : Promise.resolve(null),
    isSport ? getWorkoutHistory(habit.id, session.user.id) : Promise.resolve([]),
    isStudy ? getStudyLog(habit.id, today, session.user.id) : Promise.resolve(null),
    isStudy ? getStudyHistory(habit.id, session.user.id) : Promise.resolve([]),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl text-parchment-500 dark:text-parchment-400 hover:text-parchment-950 dark:hover:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-parchment-800 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: colorData.hex + "20" }}
          >
            <HabitIcons icon={habit.icon} color={colorData.hex} size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-parchment-950 dark:text-parchment-100 leading-tight truncate">
              {habit.name}
            </h1>
            {habit.description && (
              <p className="text-xs sm:text-sm text-parchment-500 dark:text-parchment-400 mt-0.5 truncate">{habit.description}</p>
            )}
          </div>
        </div>
        <Link
          href={`/habits/${id}/edit`}
          className="p-2 rounded-xl text-parchment-400 dark:text-parchment-500 hover:text-parchment-950 dark:hover:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-parchment-800 transition-colors flex-shrink-0"
        >
          <Pencil size={16} />
        </Link>
      </div>

      {/* Completion button — marcar hoy */}
      <div className="flex items-center justify-between bg-parchment-200 dark:bg-parchment-900 border border-parchment-300 dark:border-parchment-700 rounded-2xl p-4 mb-6">
        <div>
          <p className="text-sm font-medium text-parchment-950 dark:text-parchment-100">
            {isCompletedToday ? "Completado hoy" : "Marcar como hecho hoy"}
          </p>
          <p className="text-xs text-parchment-500 dark:text-parchment-400 mt-0.5">
            {isCompletedToday
              ? "¡Bien hecho! Podés desmarcar si fue un error."
              : "Registrá tu progreso de hoy."}
          </p>
        </div>
        <CompletionButton
          habitId={habit.id}
          isCompleted={isCompletedToday}
          currentStreak={currentStreak}
          color={habit.color as HabitColor}
          targetCount={habit.targetCount}
          todayCount={todayCount}
        />
      </div>

      {/* Stats */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-parchment-500 dark:text-parchment-400 uppercase tracking-wider mb-3">
          Estadísticas
        </h2>
        <HabitStatCard
          allDates={allDates}
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          color={habit.color as HabitColor}
        />
      </section>

      {/* Workout tracking — hábitos deportivos */}
      {isSport && habit.sportType && (
        <>
          <section className="mb-6">
            <WorkoutLogger
              habitId={habit.id}
              sportType={habit.sportType}
              date={today}
              initialData={todayLog}
              history={workoutLogs}
            />
          </section>
          <section className="mb-6">
            <WorkoutHistory
              logs={workoutLogs}
              sportType={habit.sportType}
            />
          </section>
        </>
      )}

      {/* Pomodoro — hábitos de estudio */}
      {isStudy && (
        <>
          <section className="mb-6">
            <PomodoroTimer
              habitId={habit.id}
              date={today}
              targetCount={habit.targetCount}
              todayCompletedSessions={todayStudy?.sessions ?? 0}
            />
          </section>
          <section className="mb-6">
            <StudyHistory sessions={studyLogs} />
          </section>
        </>
      )}

      {/* Calendar */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-parchment-500 dark:text-parchment-400 uppercase tracking-wider mb-3">
          Historial
        </h2>
        <HabitCalendar
          entryDates={entryDateSet}
          color={habit.color as HabitColor}
        />
      </section>

      {/* Edit link */}
      <section className="mt-8 pt-6 border-t border-parchment-300 dark:border-parchment-700">
        <Link
          href={`/habits/${id}/edit`}
          className="text-sm text-parchment-400 dark:text-parchment-500 hover:text-parchment-700 dark:hover:text-parchment-300 transition-colors"
        >
          Editar o archivar este hábito →
        </Link>
      </section>
    </div>
  );
}
