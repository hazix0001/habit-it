import type { Habit } from "@/types/index";
import { addDaysKey, isScheduledDay } from "./habit-logic";

export type GlobalStats = {
  /** Consecutive perfect days ending today (or yesterday if today is open). */
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  /** 0–100 over scheduled habit-days in the last 30 days. */
  completionRate: number;
  perfectDays30: number;
  scheduledDays30: number;
};

type Completions = Record<string, string[]>;

function activeHabits(habits: Habit[]): Habit[] {
  return habits.filter((h) => !h.archived && !h.paused);
}

/**
 * true  = every scheduled habit done (perfect day)
 * false = at least one scheduled habit open
 * null  = rest day — nothing scheduled, neither counts nor breaks
 */
export function perfectDay(
  habits: Habit[],
  completions: Completions,
  key: string
): boolean | null {
  const scheduled = activeHabits(habits).filter((h) =>
    isScheduledDay(h, key)
  );
  if (scheduled.length === 0) return null;
  return scheduled.every((h) => (completions[h.id] ?? []).includes(key));
}

export function getGlobalStats(
  habits: Habit[],
  completions: Completions,
  refKey: string
): GlobalStats {
  // Current streak — an open today doesn't break, it just doesn't count yet.
  let cursor = refKey;
  if (perfectDay(habits, completions, cursor) === false) {
    cursor = addDaysKey(cursor, -1);
  }
  let currentStreak = 0;
  for (let guard = 0; guard < 730; guard++) {
    const p = perfectDay(habits, completions, cursor);
    if (p === null) {
      cursor = addDaysKey(cursor, -1);
      continue;
    }
    if (!p) break;
    currentStreak++;
    cursor = addDaysKey(cursor, -1);
  }

  // Longest streak over the past year. Rest days are skipped, not reset.
  let longestStreak = 0;
  let run = 0;
  for (let i = 365; i >= 0; i--) {
    const p = perfectDay(habits, completions, addDaysKey(refKey, -i));
    if (p === null) continue;
    if (p) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
  }

  // Last-30-day rate + totals.
  let doneCount = 0;
  let scheduledCount = 0;
  let perfectDays30 = 0;
  let scheduledDays30 = 0;
  for (let i = 29; i >= 0; i--) {
    const key = addDaysKey(refKey, -i);
    const scheduled = activeHabits(habits).filter((h) =>
      isScheduledDay(h, key)
    );
    if (scheduled.length === 0) continue;
    scheduledDays30++;
    scheduledCount += scheduled.length;
    const doneToday = scheduled.filter((h) =>
      (completions[h.id] ?? []).includes(key)
    ).length;
    doneCount += doneToday;
    if (doneToday === scheduled.length) perfectDays30++;
  }

  const totalCompleted = Object.values(completions).reduce(
    (sum, keys) => sum + keys.length,
    0
  );

  return {
    currentStreak,
    longestStreak,
    totalCompleted,
    completionRate:
      scheduledCount > 0 ? Math.round((doneCount / scheduledCount) * 100) : 0,
    perfectDays30,
    scheduledDays30,
  };
}
