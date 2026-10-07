"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Habit } from "@/types/index";
import { loadState, saveState } from "@/lib/storage";
import { addDaysKey, todayKey } from "@/lib/habit-logic";
import { MOCK_HABITS } from "@/lib/constants";

export type HabitInput = {
  name: string;
  icon: string;
  category: string;
  color: string;
  frequency: Habit["frequency"];
  customDays: number[];
  xpReward: number;
  reminder: string;
};

type HabitsContextValue = {
  ready: boolean;
  habits: Habit[];
  completions: Record<string, string[]>;
  addHabit: (input: HabitInput) => void;
  updateHabit: (id: string, input: HabitInput) => void;
  removeHabit: (id: string) => void;
  setPaused: (id: string, paused: boolean) => void;
  setArchived: (id: string, archived: boolean) => void;
  /** Toggle today's completion. Returns the new state + xp involved. */
  toggleToday: (id: string) => { done: boolean; xp: number };
  isDoneOn: (id: string, key: string) => boolean;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/** First-run demo seed so the dashboard, detail and calendar feel alive. */
function buildSeed(): { habits: Habit[]; completions: Record<string, string[]> } {
  const now = new Date().toISOString();
  const today = todayKey();
  const colors = ["#6C5CE7", "#FFB347", "#54B654", "#FF6B6B", "#6C5CE7"];
  const categories = ["Health", "Fitness", "Learning", "Fitness", "Mind"];

  const habits: Habit[] = MOCK_HABITS.map((m, i) => ({
    id: m.id,
    name: m.name,
    icon: m.icon,
    category: categories[i] ?? "Other",
    color: colors[i] ?? "#6C5CE7",
    frequency: "daily",
    customDays: [],
    xpReward: m.xp,
    reminder: "",
    paused: false,
    createdAt: now,
    updatedAt: now,
    archived: false,
  }));

  const completions: Record<string, string[]> = {};
  habits.forEach((h, j) => {
    const keys: string[] = [];
    // ~2 weeks of believable history. Recent days are perfect so the
    // global streak demo starts alive; older days follow a ~75% pattern.
    for (let i = 14; i >= 1; i--) {
      if (i <= 3 || (i + j) % 4 !== 0) keys.push(addDaysKey(today, -i));
    }
    if (MOCK_HABITS[j]?.done) keys.push(today);
    completions[h.id] = keys;
  });
  return { habits, completions };
}

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Record<string, string[]>>({});

  /* eslint-disable react-hooks/set-state-in-effect -- mount-only
     localStorage hydration (client-only data). Rendered output must not
     depend on prerender-time dates, so we load after mount. */
  useEffect(() => {
    const stored = loadState();
    if (stored) {
      setHabits(stored.habits);
      setCompletions(stored.completions);
    } else {
      const seed = buildSeed();
      setHabits(seed.habits);
      setCompletions(seed.completions);
    }
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (ready) saveState({ habits, completions });
  }, [ready, habits, completions]);

  const addHabit = useCallback((input: HabitInput) => {
    const now = new Date().toISOString();
    const habit: Habit = {
      id: newId(),
      name: input.name.trim(),
      icon: input.icon,
      category: input.category,
      color: input.color,
      frequency: input.frequency,
      customDays: input.customDays,
      xpReward: input.xpReward,
      reminder: input.reminder,
      paused: false,
      createdAt: now,
      updatedAt: now,
      archived: false,
    };
    setHabits((prev) => [...prev, habit]);
  }, []);

  const updateHabit = useCallback((id: string, input: HabitInput) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              name: input.name.trim(),
              icon: input.icon,
              category: input.category,
              color: input.color,
              frequency: input.frequency,
              customDays: input.customDays,
              xpReward: input.xpReward,
              reminder: input.reminder,
              updatedAt: new Date().toISOString(),
            }
          : h
      )
    );
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const setPaused = useCallback((id: string, paused: boolean) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, paused } : h)));
  }, []);

  const setArchived = useCallback((id: string, archived: boolean) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, archived } : h))
    );
  }, []);

  const toggleToday = useCallback(
    (id: string) => {
      const habit = habits.find((h) => h.id === id);
      if (!habit) return { done: false, xp: 0 };
      const key = todayKey();
      const list = completions[id] ?? [];
      const has = list.includes(key);
      setCompletions((prev) => ({
        ...prev,
        [id]: has
          ? (prev[id] ?? []).filter((k) => k !== key)
          : [...(prev[id] ?? []), key],
      }));
      return { done: !has, xp: habit.xpReward };
    },
    [habits, completions]
  );

  const isDoneOn = useCallback(
    (id: string, key: string) => (completions[id] ?? []).includes(key),
    [completions]
  );

  const value = useMemo(
    () => ({
      ready,
      habits,
      completions,
      addHabit,
      updateHabit,
      removeHabit,
      setPaused,
      setArchived,
      toggleToday,
      isDoneOn,
    }),
    [
      ready,
      habits,
      completions,
      addHabit,
      updateHabit,
      removeHabit,
      setPaused,
      setArchived,
      toggleToday,
      isDoneOn,
    ]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits(): HabitsContextValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used inside HabitsProvider");
  return ctx;
}
