export type AchievementDef = {
  id: string;
  icon: string;
  name: string;
  desc: string;
  target: number;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first-habit",
    icon: "🏆",
    name: "First Habit",
    desc: "Complete your first habit.",
    target: 1,
  },
  {
    id: "streak-7",
    icon: "🔥",
    name: "7 Day Streak",
    desc: "Maintain a 7-day streak.",
    target: 7,
  },
  {
    id: "streak-30",
    icon: "💪",
    name: "30 Day Streak",
    desc: "Maintain a 30-day streak.",
    target: 30,
  },
  {
    id: "habits-100",
    icon: "⭐",
    name: "100 Habits",
    desc: "Complete 100 habits.",
    target: 100,
  },
  {
    id: "level-10",
    icon: "🌟",
    name: "Level 10",
    desc: "Reach level 10.",
    target: 10,
  },
];

export type GameStats = {
  totalHabitCompletions: number;
  longestStreak: number;
  level: number;
};

export function progressOf(def: AchievementDef, stats: GameStats): number {
  switch (def.id) {
    case "first-habit":
    case "habits-100":
      return stats.totalHabitCompletions;
    case "streak-7":
    case "streak-30":
      return stats.longestStreak;
    case "level-10":
      return stats.level;
    default:
      return 0;
  }
}

export type EvaluatedAchievement = {
  def: AchievementDef;
  progress: number;
  unlocked: boolean;
};

export function evaluate(stats: GameStats): EvaluatedAchievement[] {
  return ACHIEVEMENTS.map((def) => {
    const progress = progressOf(def, stats);
    return { def, progress, unlocked: progress >= def.target };
  });
}
