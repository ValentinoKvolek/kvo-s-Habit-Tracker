/**
 * Returns today's date as "YYYY-MM-DD" in local time.
 * Using local time intentionally — habit dates are user-local.
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns a date string "YYYY-MM-DD" for a given offset from today.
 * Negative offsets go back in time.
 */
export function getDateString(offsetDays: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a "YYYY-MM-DD" string into a human-readable display string.
 */
export function formatDisplayDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  }
): string {
  // Parse as local date by appending T00:00:00 (avoids UTC offset issues)
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

/**
 * Formats a "YYYY-MM-DD" string as a short month+day label.
 */
export function formatShortDate(dateStr: string): string {
  return formatDisplayDate(dateStr, { month: "short", day: "numeric" });
}

/**
 * Returns the day-of-week index (0=Sun, 6=Sat) for a "YYYY-MM-DD" string.
 */
export function getDayOfWeek(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00`).getDay();
}

/**
 * Returns an array of "YYYY-MM-DD" strings for every day in a given month.
 */
export function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    days.push(`${y}-${m}-${d}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/**
 * Returns true if the given "YYYY-MM-DD" string is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}
