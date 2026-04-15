import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getHabitsForDate } from "@/features/habits/queries";
import { isHabitScheduledForDate } from "@/features/habits/logic";
import { TimeSlotTree } from "@/features/habits/components/time-slot-tree";
import { HabitTree } from "@/features/habits/components/habit-tree";
import { EmptyState } from "@/features/habits/components/empty-state";
import { DateNavigator } from "@/features/dashboard/components/date-navigator";
import { formatDisplayDate, getTodayString } from "@/lib/dates";
import { getQuoteOfDay } from "@/lib/quotes";
import { QuoteOfDay, QuoteOfDayInline } from "@/features/dashboard/components/quote-of-day";

export const metadata = {
  title: "Dashboard — Constantia",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const today = getTodayString();
  const { date } = await searchParams;
  // Only accept past dates or today; silently clamp future dates to today
  const viewDate = date && date <= today ? date : today;
  const isReadOnly = viewDate < today;

  const allHabits = await getHabitsForDate(session.user.id, viewDate);
  const habits = allHabits.filter((h) => isHabitScheduledForDate(h, viewDate));
  const useTimeSlots = habits.some((h) => h.timeSlot !== null);
  const completedCount = habits.filter((h) => h.isCompletedToday).length;
  const totalCount = habits.length;

  const greeting = getGreeting();
  const quote = getQuoteOfDay(today);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-parchment-500">
            {formatDisplayDate(viewDate, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <DateNavigator currentDate={viewDate} />
        </div>

        {!isReadOnly && (
          <h1 className="text-2xl font-bold text-parchment-950 tracking-tight">
            {greeting}, {session.user.name.split(" ")[0]}
          </h1>
        )}

        {isReadOnly && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-parchment-300 border border-parchment-400 text-xs text-parchment-600">
            Solo lectura
          </div>
        )}

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
      ) : useTimeSlots ? (
        <TimeSlotTree habits={habits} readOnly={isReadOnly} />
      ) : (
        <HabitTree habits={habits} readOnly={isReadOnly} />
      )}

      {/* Frase del día — inline en mobile, flotante en desktop */}
      {!isReadOnly && <QuoteOfDayInline quote={quote} />}
      {!isReadOnly && <QuoteOfDay quote={quote} />}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}
