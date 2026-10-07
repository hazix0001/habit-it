"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Archive, Pause, Play, Trash2 } from "lucide-react";
import { useHabits } from "@/store/habits";
import { getHabitStats, todayKey, weekdayOf } from "@/lib/habit-logic";
import { WEEKDAY_SHORT } from "@/lib/constants";
import { HabitForm } from "@/components/habits/HabitForm";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelBadge } from "@/components/ui/PixelBadge";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";
import { PixelStatCard } from "@/components/ui/PixelStatCard";
import { cn } from "@/lib/utils";

export default function HabitDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    ready,
    habits,
    completions,
    setPaused,
    setArchived,
    removeHabit,
  } = useHabits();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!ready) {
    return (
      <PixelCard title="HABIT DETAIL">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  const habit = habits.find((h) => h.id === params.id);
  if (!habit) {
    return (
      <PixelCard className="text-center">
        <p className="mb-3 text-4xl">🗺️</p>
        <p className="font-pixel mb-2 text-xs">HABIT NOT FOUND</p>
        <p className="mb-5 text-sm font-bold opacity-70">
          It may have been deleted. Let&apos;s try again!
        </p>
        <Link href="/habits">
          <PixelButton variant="secondary">BACK TO HABITS</PixelButton>
        </Link>
      </PixelCard>
    );
  }

  const today = todayKey();
  const stats = getHabitStats(habit, completions[habit.id] ?? [], today);
  const doneScheduled30 = stats.last30.filter((d) => d.scheduled && d.done).length;
  const totalScheduled30 = stats.last30.filter((d) => d.scheduled).length;

  const statBlocks = [
    { label: "STREAK", value: `🔥 ${stats.currentStreak}` },
    { label: "BEST", value: `🏆 ${stats.longestStreak}` },
    { label: "30-DAY RATE", value: `${stats.rate30}%` },
    { label: "TOTAL DONE", value: `${stats.total}` },
    { label: "XP EARNED", value: `+${stats.xpEarned}` },
  ];

  return (
    <>
      <Link
        href="/habits"
        className="mb-4 inline-flex items-center gap-2 text-sm font-extrabold hover:underline"
      >
        <ArrowLeft size={16} strokeWidth={3} aria-hidden="true" />
        Back to habits
      </Link>

      <PixelCard className="mb-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-14 w-14 items-center justify-center border-[3px] border-[var(--color-ink)] text-3xl dark:border-black"
            style={{ backgroundColor: `${habit.color}33` }}
            aria-hidden="true"
          >
            {habit.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-extrabold">{habit.name}</h1>
            <p className="text-xs font-bold opacity-60">
              {habit.category} · {habit.frequency} · +{habit.xpReward} XP
              {habit.reminder ? ` · ⏰ ${habit.reminder}` : ""}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {habit.paused ? <PixelBadge>PAUSED</PixelBadge> : null}
          {habit.archived ? <PixelBadge>ARCHIVED</PixelBadge> : null}
          <PixelBadge>
            {doneScheduled30}/{totalScheduled30} LAST 30 DAYS
          </PixelBadge>
        </div>
      </PixelCard>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {statBlocks.map((s) => (
          <PixelStatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <PixelCard title="WEEKLY PROGRESS" className="mb-5">
        <div className="grid grid-cols-7 gap-1">
          {stats.last7.map((mark) => (
            <div key={mark.key} className="text-center">
              <div className="mb-1 text-[10px] font-extrabold opacity-60">
                {WEEKDAY_SHORT[weekdayOf(mark.key)]}
              </div>
              <div
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center border-[3px] text-sm font-black",
                  mark.scheduled && mark.done &&
                    "border-[var(--color-ink)] bg-[var(--color-mint)] dark:border-black",
                  mark.scheduled && !mark.done &&
                    "border-[var(--color-ink)] bg-white dark:border-black dark:bg-[#100e18]",
                  !mark.scheduled && "border-transparent opacity-25"
                )}
              >
                {mark.scheduled ? (mark.done ? "✓" : "○") : "·"}
              </div>
            </div>
          ))}
        </div>
      </PixelCard>

      <PixelCard title="MONTHLY PROGRESS" className="mb-5">
        <div className="grid grid-cols-7 gap-1 sm:grid-cols-10">
          {stats.last30.map((mark) => (
            <div
              key={mark.key}
              title={`${mark.key}: ${mark.scheduled ? (mark.done ? "done" : "open") : "not scheduled"}`}
              className={cn(
                "flex aspect-square items-center justify-center border-[3px] text-xs font-black",
                mark.scheduled && mark.done &&
                  "border-[var(--color-ink)] bg-[var(--color-mint)] dark:border-black",
                mark.scheduled && !mark.done &&
                  "border-[var(--color-ink)] bg-white dark:border-black dark:bg-[#100e18]",
                !mark.scheduled && "border-transparent opacity-20"
              )}
            >
              {mark.scheduled ? (mark.done ? "✓" : "") : ""}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <PixelProgressBar
            value={doneScheduled30}
            max={Math.max(totalScheduled30, 1)}
            label={`${stats.rate30}% completion (30 days)`}
          />
        </div>
      </PixelCard>

      <div className="flex flex-wrap gap-2">
        <PixelButton variant="secondary" onClick={() => setEditing(true)}>
          EDIT HABIT
        </PixelButton>
        <button
          type="button"
          onClick={() => setPaused(habit.id, !habit.paused)}
          className="pixel-option flex items-center gap-1 text-xs"
        >
          {habit.paused ? (
            <Play size={14} aria-hidden="true" />
          ) : (
            <Pause size={14} aria-hidden="true" />
          )}
          {habit.paused ? "Resume" : "Pause"}
        </button>
        {!habit.archived && (
          <button
            type="button"
            onClick={() => {
              setArchived(habit.id, true);
              router.push("/habits");
            }}
            className="pixel-option flex items-center gap-1 text-xs"
          >
            <Archive size={14} aria-hidden="true" /> Archive
          </button>
        )}
        {confirming ? (
          <>
            <button
              type="button"
              onClick={() => {
                removeHabit(habit.id);
                router.push("/habits");
              }}
              className="pixel-option bg-[#ff6b6b] text-xs text-white"
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
            className="pixel-option flex items-center gap-1 text-xs"
          >
            <Trash2 size={14} aria-hidden="true" /> Delete
          </button>
        )}
      </div>

      {editing && <HabitForm initial={habit} onClose={() => setEditing(false)} />}
    </>
  );
}
