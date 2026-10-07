// Data model placeholders for Phase 1.
// Full fields + calculations arrive in Phase 4 (habits) / Phase 6 (streaks).

export type Habit = {
  id: string;
  name: string;
  icon: string;
  category: string;
  color: string;
  frequency: "daily" | "weekdays" | "weekends" | "custom";
  customDays?: number[]; // 0 = Sunday … 6 = Saturday
  xpReward: number;
  reminder?: string; // "HH:MM" — stored only until Phase 11 notifications
  paused: boolean;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};

export type HabitCompletion = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completedAt: string;
  xpEarned: number;
};

export type Task = {
  id: string;
  title: string;
  done: boolean;
  deadline?: string; // YYYY-MM-DD, optional
  xpReward: number;
  createdAt: string;
};

export type CharacterStats = {
  level: number;
  xp: number;
  xpForNext: number;
  streakDays: number;
  mood: "happy" | "neutral" | "sleepy";
};
