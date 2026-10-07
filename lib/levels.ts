import type { Habit, Task } from "@/types/index";

/**
 * Level curve — single tunable constant, no hardcoded tables.
 *
 * Band widths grow by LEVEL_STEP per level:
 *   L1: 0–99, L2: 100–249, L3: 250–449, L4: 450–699, …
 * Change LEVEL_STEP to rebalance the whole game.
 */
export const LEVEL_STEP = 50;

/** Total XP required to REACH `level` (level 1 starts at 0). */
export function xpToReach(level: number): number {
  if (level <= 1) return 0;
  return LEVEL_STEP * ((level * (level + 1)) / 2 - 1);
}

/** Level for a given total XP (iterative — levels stay small). */
export function levelForXp(xp: number): number {
  const safe = Math.max(0, Math.floor(xp));
  let level = 1;
  while (xpToReach(level + 1) <= safe) level++;
  return level;
}

export type LevelProgress = {
  level: number;
  /** XP earned inside the current level. */
  intoLevel: number;
  /** XP width of the current level band. */
  needed: number;
  totalXp: number;
};

export function levelProgress(totalXp: number): LevelProgress {
  const safe = Math.max(0, Math.floor(totalXp));
  const level = levelForXp(safe);
  const base = xpToReach(level);
  return {
    level,
    intoLevel: safe - base,
    needed: xpToReach(level + 1) - base,
    totalXp: safe,
  };
}

/**
 * Lifetime XP across the whole app.
 * Habit XP uses the habit's CURRENT reward (MVP simplification —
 * per-completion snapshots arrive with XPTransaction history if needed).
 */
export function getTotalXp(
  habits: Habit[],
  completions: Record<string, string[]>,
  tasks: Task[]
): number {
  const habitXp = habits.reduce(
    (sum, h) => sum + (completions[h.id]?.length ?? 0) * h.xpReward,
    0
  );
  const taskXp = tasks
    .filter((t) => t.done)
    .reduce((sum, t) => sum + t.xpReward, 0);
  return habitXp + taskXp;
}
