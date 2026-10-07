import type { Habit } from "@/types/index";
import { addDaysKey, isScheduledDay } from "./habit-logic";
import { perfectDay } from "./streaks";

export type DayStatus = "future" | "rest" | "perfect" | "partial" | "missed";

/** YYYY-MM-DD keys compare lexically — safe for zero-padded ISO dates. */
export function dayStatus(
  habits: Habit[],
  completions: Record<string, string[]>,
  key: string,
  today: string
): DayStatus {
  if (key > today) return "future";
  const p = perfectDay(habits, completions, key);
  if (p === null) return "rest";
  if (p) return "perfect";
  const someDone = habits
    .filter((h) => !h.archived && !h.paused && isScheduledDay(h, key))
    .some((h) => (completions[h.id] ?? []).includes(key));
  return someDone ? "partial" : "missed";
}

/** Monday-first grid cells for a month (0-based). Null = padding. */
export function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const m = `${month + 1}`.padStart(2, "0");
    const day = `${d}`.padStart(2, "0");
    cells.push(`${year}-${m}-${day}`);
  }
  return cells;
}

export type WeekBar = {
  key: string;
  /** 0–100, or null for rest days (nothing scheduled). */
  pct: number | null;
};

export function weekCompletion(
  habits: Habit[],
  completions: Record<string, string[]>,
  refKey: string
): { bars: WeekBar[]; rate: number } {
  const bars: WeekBar[] = [];
  let doneTotal = 0;
  let scheduledTotal = 0;
  for (let i = 6; i >= 0; i--) {
    const key = addDaysKey(refKey, -i);
    const scheduled = habits.filter(
      (h) => !h.archived && !h.paused && isScheduledDay(h, key)
    );
    if (scheduled.length === 0) {
      bars.push({ key, pct: null });
      continue;
    }
    const done = scheduled.filter((h) =>
      (completions[h.id] ?? []).includes(key)
    ).length;
    doneTotal += done;
    scheduledTotal += scheduled.length;
    bars.push({ key, pct: Math.round((done / scheduled.length) * 100) });
  }
  return {
    bars,
    rate: scheduledTotal > 0 ? Math.round((doneTotal / scheduledTotal) * 100) : 0,
  };
}
export type MonthSummary = {
  perfectDays: number;
  scheduledDays: number;
  rate: number; // 0–100 over scheduled habit-days (past + today only)
};

export function monthSummary(
  habits: Habit[],
  completions: Record<string, string[]>,
  year: number,
  month: number,
  today: string
): MonthSummary {
  let doneCount = 0;
  let scheduledCount = 0;
  let perfectDays = 0;
  let scheduledDays = 0;
  for (const key of monthCells(year, month)) {
    if (!key || key > today) continue;
    const scheduled = habits.filter(
      (h) => !h.archived && !h.paused && isScheduledDay(h, key)
    );
    if (scheduled.length === 0) continue;
    scheduledDays++;
    const doneToday = scheduled.filter((h) =>
      (completions[h.id] ?? []).includes(key)
    ).length;
    doneCount += doneToday;
    scheduledCount += scheduled.length;
    if (doneToday === scheduled.length) perfectDays++;
  }
  return {
    perfectDays,
    scheduledDays,
    rate: scheduledCount > 0 ? Math.round((doneCount / scheduledCount) * 100) : 0,
  };
}
