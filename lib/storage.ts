import type { Habit } from "@/types/index";

const KEY = "habit-it:v1";

export type Persisted = {
  habits: Habit[];
  /** habitId -> list of completed YYYY-MM-DD dates */
  completions: Record<string, string[]>;
};

/** Returns null when empty, unavailable (SSR), or corrupted. */
export function loadState(): Persisted | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (!parsed || !Array.isArray(parsed.habits)) return null;
    return {
      habits: parsed.habits,
      completions:
        parsed.completions && typeof parsed.completions === "object"
          ? parsed.completions
          : {},
    };
  } catch {
    return null;
  }
}

export function saveState(state: Persisted): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full / private mode — app keeps working in memory.
  }
}
