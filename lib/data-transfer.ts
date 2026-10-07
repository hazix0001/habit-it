import type { Habit, HabitCompletion, Task } from "@/types/index";
import type { Settings } from "@/store/settings";

export const DATA_KEYS = [
  "habit-it:v1",
  "habit-it:tasks:v1",
  "habit-it:achievements:v1",
  "habit-it:settings:v1",
] as const;

export type Backup = {
  app: "habit-it";
  version: 1;
  exportedAt: string;
  habits: Habit[];
  completions: Record<string, HabitCompletion[] | string[]>;
  tasks: Task[];
  achievements: string[];
  settings: Settings;
};

function readKey(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export function buildBackup(): Backup {
  const main = (readKey("habit-it:v1") ?? {}) as {
    habits?: Habit[];
    completions?: Backup["completions"];
  };
  return {
    app: "habit-it",
    version: 1,
    exportedAt: new Date().toISOString(),
    habits: Array.isArray(main.habits) ? main.habits : [],
    completions:
      main.completions && typeof main.completions === "object"
        ? main.completions
        : {},
    tasks: (readKey("habit-it:tasks:v1") ?? []) as Task[],
    achievements: (readKey("habit-it:achievements:v1") ?? []) as string[],
    settings: (readKey("habit-it:settings:v1") ?? {}) as Settings,
  };
}

/** Null when the file is not a Habit It backup (never throws). */
export function validateBackup(json: unknown): Backup | null {
  if (!json || typeof json !== "object") return null;
  const b = json as Partial<Backup>;
  if (b.app !== "habit-it" || b.version !== 1) return null;
  if (!Array.isArray(b.habits) || !Array.isArray(b.tasks)) return null;
  if (!Array.isArray(b.achievements)) return null;
  if (!b.completions || typeof b.completions !== "object") return null;
  if (!b.settings || typeof b.settings !== "object") return null;
  if (
    !b.habits.every(
      (h): h is Habit =>
        !!h && typeof h.id === "string" && typeof h.name === "string"
    )
  )
    return null;
  return b as Backup;
}

export function restoreBackup(backup: Backup): void {
  localStorage.setItem(
    "habit-it:v1",
    JSON.stringify({ habits: backup.habits, completions: backup.completions })
  );
  localStorage.setItem("habit-it:tasks:v1", JSON.stringify(backup.tasks));
  localStorage.setItem(
    "habit-it:achievements:v1",
    JSON.stringify(backup.achievements)
  );
  localStorage.setItem(
    "habit-it:settings:v1",
    JSON.stringify(backup.settings)
  );
}

export function clearAllData(): void {
  for (const key of DATA_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Best effort — a failed key just means stale data survives.
    }
  }
}

export function backupFileName(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `habit-it-backup-${y}-${m}-${d}.json`;
}
