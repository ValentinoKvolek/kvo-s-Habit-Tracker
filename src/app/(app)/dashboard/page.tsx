import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getHabitsWithTodayEntries } from "@/lib/queries/habit.queries";
import { HabitCard } from "@/components/habits/habit-card";
import { EmptyState } from "@/components/habits/empty-state";
import { formatDisplayDate, getTodayString } from "@/lib/utils/dates";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Dashboard — Momentum",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const habits = await getHabitsWithTodayEntries(session.user.id);
  const today = getTodayString();
  const completedCount = habits.filter((h) => h.isCompletedToday).length;
  const totalCount = habits.length;

  const greeting = getGreeting();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-white/40 mb-1">
          {formatDisplayDate(today, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {greeting}, {session.user.name.split(" ")[0]}
        </h1>

        {/* Progress summary */}
        {totalCount > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-700"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-white/40 flex-shrink-0">
              {completedCount}/{totalCount} completados
            </span>
          </div>
        )}
      </div>

      {/* Habits list */}
      {habits.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((habit, i) => (
            <HabitCard key={habit.id} habit={habit} index={i} />
          ))}
        </div>
      )}

      {/* FAB for mobile - floating add button */}
      {habits.length > 0 && (
        <div className="fixed bottom-24 right-4 md:hidden">
          <Link
            href="/habits/new"
            className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center shadow-xl shadow-violet-900/50 active:scale-95 transition-transform"
          >
            <Plus size={24} className="text-white" />
          </Link>
        </div>
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}
