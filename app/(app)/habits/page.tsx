"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useHabits } from "@/store/habits";
import { getHabitStats, todayKey } from "@/lib/habit-logic";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitRow } from "@/components/habits/HabitRow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import type { Habit } from "@/types/index";

export default function HabitsPage() {
  const {
    ready,
    habits,
    completions,
    setPaused,
    setArchived,
    removeHabit,
  } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  if (!ready) {
    return (
      <PixelCard title="MY HABITS">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  const today = todayKey();
  const active = habits.filter((h) => !h.archived);
  const archived = habits.filter((h) => h.archived);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-pixel text-[0.65rem] opacity-70">HABIT IT</p>
          <h1 className="text-2xl font-extrabold">My Habits</h1>
        </div>
        <PixelButton variant="secondary" onClick={() => setShowForm(true)}>
          <Plus size={16} strokeWidth={3} aria-hidden="true" />
          ADD HABIT
        </PixelButton>
      </div>

      {active.length === 0 ? (
        <PixelCard className="text-center">
          <p className="mb-3 text-4xl">🐰</p>
          <p className="font-pixel mb-2 text-xs">YOUR JOURNEY STARTS HERE</p>
          <p className="mb-5 text-sm font-bold opacity-70">
            Create your first habit and earn your first XP!
          </p>
          <PixelButton variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={16} strokeWidth={3} aria-hidden="true" />
            CREATE HABIT
          </PixelButton>
        </PixelCard>
      ) : (
        <ul className="flex flex-col gap-4">
          {active.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              stats={getHabitStats(habit, completions[habit.id] ?? [], today)}
              onEdit={() => setEditing(habit)}
              onPause={() => setPaused(habit.id, !habit.paused)}
              onArchive={() => setArchived(habit.id, true)}
              onDelete={() => removeHabit(habit.id)}
            />
          ))}
        </ul>
      )}

      {archived.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowArchived((s) => !s)}
            className="pixel-option text-sm"
            aria-expanded={showArchived}
          >
            {showArchived ? "Hide" : "Show"} archived ({archived.length})
          </button>
          {showArchived && (
            <ul className="mt-3 flex flex-col gap-2">
              {archived.map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center gap-3 border-[3px] border-[var(--color-ink)] p-3 opacity-70 dark:border-black"
                >
                  <span className="text-xl" aria-hidden="true">
                    {habit.icon}
                  </span>
                  <span className="flex-1 font-bold">{habit.name}</span>
                  <button
                    type="button"
                    onClick={() => setArchived(habit.id, false)}
                    className="pixel-option text-xs"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHabit(habit.id)}
                    className="pixel-option text-xs"
                    aria-label={`Delete ${habit.name} permanently`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showForm && <HabitForm onClose={() => setShowForm(false)} />}
      {editing && (
        <HabitForm initial={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
