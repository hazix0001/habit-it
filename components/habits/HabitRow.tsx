"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, Pencil, Play, Pause, Trash2 } from "lucide-react";
import type { Habit } from "@/types/index";
import type { HabitStats } from "@/lib/habit-logic";
import { WEEKDAY_SHORT } from "@/lib/constants";
import { weekdayOf } from "@/lib/habit-logic";
import { PixelBadge } from "@/components/ui/PixelBadge";
import { cn } from "@/lib/utils";

type Props = {
  habit: Habit;
  stats: HabitStats;
  onEdit: () => void;
  onPause: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export function HabitRow({ habit, stats, onEdit, onPause, onArchive, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="border-[3px] border-[var(--color-ink)] bg-white p-4 dark:border-black dark:bg-[#100e18]">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center border-[3px] border-[var(--color-ink)] text-2xl dark:border-black"
          style={{ backgroundColor: `${habit.color}33` }}
          aria-hidden="true"
        >
          {habit.icon}
        </span>
        <Link href={`/habits/${habit.id}`} className="min-w-0 flex-1">
          <span className="block truncate font-extrabold hover:underline">
            {habit.name}
          </span>
          <span className="block text-xs font-bold opacity-60">
            {habit.category} · +{habit.xpReward} XP
          </span>
        </Link>
        {habit.paused ? <PixelBadge>PAUSED</PixelBadge> : null}
        <PixelBadge>🔥 {stats.currentStreak}</PixelBadge>
      </div>

      <div
        className="mt-3 grid grid-cols-7 gap-1"
        role="img"
        aria-label={`Last week: ${stats.last7.filter((d) => d.scheduled && d.done).length} of ${stats.last7.filter((d) => d.scheduled).length} scheduled days done`}
      >
        {stats.last7.map((mark) => {
          const wd = weekdayOf(mark.key);
          const state = !mark.scheduled ? "off" : mark.done ? "done" : "open";
          return (
            <div key={mark.key} className="text-center">
              <div className="mb-1 text-[10px] font-extrabold opacity-60">
                {WEEKDAY_SHORT[wd]}
              </div>
              <div
                className={cn(
                  "mx-auto flex h-7 w-7 items-center justify-center border-[3px] text-xs font-black",
                  state === "done" &&
                    "border-[var(--color-ink)] bg-[var(--color-mint)] dark:border-black",
                  state === "open" &&
                    "border-[var(--color-ink)] bg-white dark:border-black dark:bg-[#100e18]",
                  state === "off" && "border-transparent opacity-25"
                )}
              >
                {state === "done" ? "✓" : state === "open" ? "○" : "·"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${habit.name}`}
          className="pixel-option flex items-center gap-1 text-xs"
        >
          <Pencil size={14} aria-hidden="true" /> Edit
        </button>
        <button
          type="button"
          onClick={onPause}
          aria-label={habit.paused ? `Resume ${habit.name}` : `Pause ${habit.name}`}
          className="pixel-option flex items-center gap-1 text-xs"
        >
          {habit.paused ? (
            <Play size={14} aria-hidden="true" />
          ) : (
            <Pause size={14} aria-hidden="true" />
          )}
          {habit.paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={onArchive}
          aria-label={`Archive ${habit.name}`}
          className="pixel-option flex items-center gap-1 text-xs"
        >
          <Archive size={14} aria-hidden="true" /> Archive
        </button>
        {confirming ? (
          <>
            <button
              type="button"
              onClick={onDelete}
              className="pixel-option flex items-center gap-1 bg-[#ff6b6b] text-xs text-white"
            >
              Confirm delete?
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="pixel-option text-xs"
            >
              Keep
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Delete ${habit.name}`}
            className="pixel-option flex items-center gap-1 text-xs"
          >
            <Trash2 size={14} aria-hidden="true" /> Delete
          </button>
        )}
      </div>
    </li>
  );
}
