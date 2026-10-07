import type { Habit } from "@/types/index";

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDaysKey(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return toDateKey(dt);
}

export function weekdayOf(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).getDay(); // 0 = Sunday
}

export function isScheduledDay(habit: Habit, key: string): boolean {
  const wd = weekdayOf(key);
  switch (habit.frequency) {
    case "daily":
      return true;
    case "weekdays":
      return wd >= 1 && wd <= 5;
    case "weekends":
      return wd === 0 || wd === 6;
    case "custom":
      return (habit.customDays ?? []).includes(wd);
  }
}

export type DayMark = {
  key: string;
  scheduled: boolean;
  done: boolean;
};

export type HabitStats = {
  total: number;
  xpEarned: number;
  currentStreak: number;
  longestStreak: number;
  /** 0–100 over the last 30 scheduled days */
  rate30: number;
  last7: DayMark[];
  last30: DayMark[];
};

function lastNDays(habit: Habit, done: Set<string>, refKey: string, n: number): DayMark[] {
  const out: DayMark[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const key = addDaysKey(refKey, -i);
    out.push({
      key,
      scheduled: isScheduledDay(habit, key),
      done: done.has(key),
    });
  }
  return out;
}

export function getHabitStats(
  habit: Habit,
  doneKeys: string[],
  refKey: string
): HabitStats {
  const done = new Set(doneKeys);
  const last30 = lastNDays(habit, done, refKey, 30);

  const scheduled30 = last30.filter((d) => d.scheduled);
  const doneScheduled30 = scheduled30.filter((d) => d.done).length;

  // Current streak: if today is scheduled but open, count ends yesterday.
  let cursor = refKey;
  if (isScheduledDay(habit, cursor) && !done.has(cursor)) {
    cursor = addDaysKey(cursor, -1);
  }
  let currentStreak = 0;
  for (let guard = 0; guard < 730; guard++) {
    if (!isScheduledDay(habit, cursor)) {
      cursor = addDaysKey(cursor, -1);
      continue;
    }
    if (!done.has(cursor)) break;
    currentStreak++;
    cursor = addDaysKey(cursor, -1);
  }

  // Longest streak over the past year of scheduled days.
  let longestStreak = 0;
  let run = 0;
  for (let i = 365; i >= 0; i--) {
    const key = addDaysKey(refKey, -i);
    if (!isScheduledDay(habit, key)) continue;
    if (done.has(key)) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
  }

  return {
    total: doneKeys.length,
    xpEarned: doneKeys.length * habit.xpReward,
    currentStreak,
    longestStreak,
    rate30:
      scheduled30.length > 0
        ? Math.round((doneScheduled30 / scheduled30.length) * 100)
        : 0,
    last7: lastNDays(habit, done, refKey, 7),
    last30,
  };
}
