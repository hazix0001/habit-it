import type { Task } from "@/types/index";

const KEY = "habit-it:tasks:v1";

export const TASK_XP = 5;

export function loadTasks(): Task[] | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (t): t is Task =>
        t && typeof t.id === "string" && typeof t.title === "string"
    );
  } catch {
    return null;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    // Storage full / private mode — app keeps working in memory.
  }
}

/** First-run demo tasks so the page doesn't open empty. */
export function seedTasks(): Task[] {
  const now = new Date().toISOString();
  const d = new Date();
  const fmt = (dt: Date) =>
    `${dt.getFullYear()}-${`${dt.getMonth() + 1}`.padStart(2, "0")}-${`${dt.getDate()}`.padStart(2, "0")}`;
  const today = fmt(d);
  const tomorrow = fmt(new Date(d.getTime() + 86400000));
  return [
    {
      id: "t-seed-1",
      title: "Buy groceries",
      done: false,
      deadline: today,
      xpReward: TASK_XP,
      createdAt: now,
    },
    {
      id: "t-seed-2",
      title: "Finish report",
      done: false,
      deadline: tomorrow,
      xpReward: TASK_XP,
      createdAt: now,
    },
    {
      id: "t-seed-3",
      title: "Reply email",
      done: true,
      deadline: today,
      xpReward: TASK_XP,
      createdAt: now,
    },
    {
      id: "t-seed-4",
      title: "Clean room",
      done: false,
      xpReward: TASK_XP,
      createdAt: now,
    },
  ];
}
