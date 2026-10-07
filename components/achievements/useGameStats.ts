"use client";

import { useMemo } from "react";
import { useHabits } from "@/store/habits";
import { useTasks } from "@/store/tasks";
import type { GameStats } from "@/lib/achievements";
import { getGlobalStats } from "@/lib/streaks";
import { getTotalXp, levelProgress } from "@/lib/levels";
import { todayKey } from "@/lib/habit-logic";

export function useGameStats(): { ready: boolean; stats: GameStats } {
  const { ready: hr, habits, completions } = useHabits();
  const { ready: tr, tasks } = useTasks();
  return useMemo(() => {
    const ready = hr && tr;
    const totalHabitCompletions = Object.values(completions).reduce(
      (sum, keys) => sum + keys.length,
      0
    );
    const today = todayKey();
    const globalLongest = ready
      ? getGlobalStats(habits, completions, today).longestStreak
      : 0;
    const bestHabit = ready
      ? Math.max(
          0,
          ...habits.map(
            (h) =>
              getGlobalStats([h], { [h.id]: completions[h.id] ?? [] }, today)
                .longestStreak
          )
        )
      : 0;
    const level = ready
      ? levelProgress(getTotalXp(habits, completions, tasks)).level
      : 1;
    return {
      ready,
      stats: {
        totalHabitCompletions,
        longestStreak: Math.max(globalLongest, bestHabit),
        level,
      },
    };
  }, [hr, tr, habits, completions, tasks]);
}
