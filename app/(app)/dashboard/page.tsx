"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CharacterCard, type Mood } from "@/components/dashboard/CharacterCard";
import { TodayProgress } from "@/components/dashboard/TodayProgress";
import { TodayHabits } from "@/components/dashboard/TodayHabits";
import {
  CelebrationToast,
  type Celebration,
} from "@/components/dashboard/CelebrationToast";
import { HabitForm } from "@/components/habits/HabitForm";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { useHabits } from "@/store/habits";
import { useTasks } from "@/store/tasks";
import { isScheduledDay, todayKey } from "@/lib/habit-logic";
import { getGlobalStats } from "@/lib/streaks";
import { getTotalXp, levelForXp, levelProgress } from "@/lib/levels";
import type { MockHabit } from "@/lib/constants";

export default function DashboardPage() {
  const { ready, habits, completions, isDoneOn, toggleToday } = useHabits();
  const { ready: tasksReady, tasks } = useTasks();
  const [toast, setToast] = useState<Celebration>(null);
  const [sessionXp, setSessionXp] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const toastKey = useRef(0);

  if (!ready || !tasksReady) {
    return (
      <PixelCard title="DASHBOARD">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  const today = todayKey();
  const todayHabits: MockHabit[] = habits
    .filter((h) => !h.archived && !h.paused && isScheduledDay(h, today))
    .map((h) => ({
      id: h.id,
      icon: h.icon,
      name: h.name,
      xp: h.xpReward,
      done: isDoneOn(h.id, today),
    }));

  const done = todayHabits.filter((h) => h.done).length;
  const streakDays = getGlobalStats(habits, completions, today).currentStreak;
  const totalXp = getTotalXp(habits, completions, tasks);
  const progress = levelProgress(totalXp);
  const hour = new Date().getHours();
  const sleepy = hour >= 22 || hour < 6;
  const mood: Mood =
    todayHabits.length > 0 && done / todayHabits.length >= 0.6
      ? "happy"
      : "neutral";

  function toggle(habit: MockHabit) {
    const result = toggleToday(habit.id);
    if (result.done) {
      setSessionXp((xp) => xp + result.xp);
      const after = totalXp + result.xp;
      const leveled = levelForXp(after) > progress.level ? levelForXp(after) : undefined;
      setToast({ key: ++toastKey.current, name: habit.name, xp: result.xp, levelUp: leveled });
    }
  }

  return (
    <>
      <Header />
      <div className="grid gap-5 md:grid-cols-2 mb-5">
        <CharacterCard
          mood={mood}
          streakDays={streakDays}
          level={progress.level}
          xpInto={progress.intoLevel}
          xpNeed={progress.needed}
          sleepy={sleepy}
        />
        <TodayProgress
          done={done}
          total={todayHabits.length}
          sessionXp={sessionXp}
        />
      </div>
      <div className="mb-5">
        <TodayHabits
          habits={todayHabits}
          hasHabits={habits.some((h) => !h.archived)}
          onToggle={toggle}
        />
      </div>
      <PixelButton variant="secondary" onClick={() => setShowForm(true)}>
        <Plus size={16} strokeWidth={3} aria-hidden="true" />
        ADD HABIT
      </PixelButton>
      {showForm && <HabitForm onClose={() => setShowForm(false)} />}
      <CelebrationToast toast={toast} onDone={() => setToast(null)} />
    </>
  );
}
