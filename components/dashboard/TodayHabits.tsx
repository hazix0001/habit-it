"use client";

import type { MockHabit } from "@/lib/constants";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelCheckbox } from "@/components/ui/PixelCheckbox";
import { PixelBadge } from "@/components/ui/PixelBadge";

type Props = {
  habits: MockHabit[];
  /** True when the user owns habits but none are scheduled/paused-filtered today. */
  hasHabits?: boolean;
  onToggle: (habit: MockHabit) => void;
};

export function TodayHabits({ habits, hasHabits = false, onToggle }: Props) {
  return (
    <PixelCard title="TODAY">
      {habits.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-4xl mb-3">🐰</p>
          {hasHabits ? (
            <>
              <p className="font-pixel text-xs mb-2">REST DAY VIBES</p>
              <p className="text-sm font-bold opacity-70">
                Nothing scheduled today — recharge, your journey continues! 🌱
              </p>
            </>
          ) : (
            <>
              <p className="font-pixel text-xs mb-2">YOUR JOURNEY STARTS HERE</p>
              <p className="text-sm font-bold opacity-70">
                Create your first habit and earn your first XP!
              </p>
            </>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center gap-3 border-[3px] border-[var(--color-ink)] dark:border-black p-3 bg-white dark:bg-[#100e18]"
            >
              <PixelCheckbox
                checked={habit.done}
                onChange={() => onToggle(habit)}
                label={habit.done ? `Mark ${habit.name} as not done` : `Complete ${habit.name}`}
              />
              <span className="text-2xl" aria-hidden="true">
                {habit.icon}
              </span>
              <span
                className={
                  habit.done
                    ? "flex-1 font-bold line-through opacity-60"
                    : "flex-1 font-bold"
                }
              >
                {habit.name}
              </span>
              <PixelBadge>+{habit.xp} XP</PixelBadge>
            </li>
          ))}
        </ul>
      )}
    </PixelCard>
  );
}
