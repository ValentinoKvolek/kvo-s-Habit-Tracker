import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, isNotNull } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { habit } from "@/lib/db/schema";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ReminderChecker } from "@/components/habits/reminder-checker";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  // Lightweight query: only habits with a reminder time set
  const habitsWithReminders = await db
    .select({ id: habit.id, name: habit.name, reminderTime: habit.reminderTime })
    .from(habit)
    .where(
      and(
        eq(habit.userId, session.user.id),
        eq(habit.isArchived, false),
        isNotNull(habit.reminderTime)
      )
    );

  return (
    <div className="min-h-screen">
      <Sidebar />
      <ReminderChecker habits={habitsWithReminders as { id: string; name: string; reminderTime: string }[]} />
      {/* Main content — offset for sidebar on desktop */}
      <main className="md:pl-56 pb-36 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
