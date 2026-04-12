import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getHabitsWithTodayEntries } from "@/lib/queries/habit.queries";
import { HabitTree } from "@/components/habits/habit-tree";
import { EmptyState } from "@/components/habits/empty-state";
import { formatDisplayDate, getTodayString } from "@/lib/utils/dates";
import { getQuoteOfDay } from "@/lib/utils/quotes";
import { QuoteOfDay, QuoteOfDayInline } from "@/components/dashboard/quote-of-day";

export const metadata = {
  title: "Dashboard — Constantia",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const habits = await getHabitsWithTodayEntries(session.user.id);
  const today = getTodayString();
  const completedCount = habits.filter((h) => h.isCompletedToday).length;
  const totalCount = habits.length;

  const greeting = getGreeting();
  const quote = getQuoteOfDay(today);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-parchment-500 mb-1">
          {formatDisplayDate(today, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="text-2xl font-bold text-parchment-950 tracking-tight">
          {greeting}, {session.user.name.split(" ")[0]}
        </h1>

        {/* Progress summary */}
        {totalCount > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-parchment-300 overflow-hidden">
              <div
                className="h-full rounded-full bg-sienna-700 transition-all duration-700"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-parchment-500 flex-shrink-0">
              {completedCount}/{totalCount} completados
            </span>
          </div>
        )}
      </div>

      {/* Habits tree */}
      {habits.length === 0 ? (
        <EmptyState />
      ) : (
        <HabitTree habits={habits} />
      )}

      {/* Frase del día — inline en mobile, flotante en desktop */}
      <QuoteOfDayInline quote={quote} />
      <QuoteOfDay quote={quote} />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}
