"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHabits } from "@/store/habits";
import { isScheduledDay, todayKey } from "@/lib/habit-logic";
import {
  dayStatus,
  monthCells,
  monthSummary,
  type DayStatus,
} from "@/lib/calendar";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelBadge } from "@/components/ui/PixelBadge";
import { cn } from "@/lib/utils";

const WEEK_HEAD = ["M", "T", "W", "T", "F", "S", "S"];

const STATUS_STYLE: Record<DayStatus, string> = {
  perfect:
    "border-[var(--color-ink)] bg-[var(--color-mint)] dark:border-black",
  partial:
    "border-[var(--color-ink)] bg-[var(--color-sunny)] dark:border-black",
  missed: "border-[var(--color-ink)] bg-white dark:border-black dark:bg-[#100e18]",
  rest: "border-transparent opacity-30",
  future: "border-transparent opacity-30",
};

const STATUS_MARK: Record<DayStatus, string> = {
  perfect: "✓",
  partial: "◐",
  missed: "○",
  rest: "·",
  future: "·",
};

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function prettyDay(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export default function CalendarPage() {
  const { ready, habits, completions } = useHabits();
  // Viewed month resolves on mount: useState initializers would bake the
  // build-time month into static HTML (stale forever + hydration mismatch).
  const [view, setView] = useState<{ year: number; month: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- mount-only clock read. */
  useEffect(() => {
    const d = new Date();
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!ready || !view) {
    return (
      <PixelCard title="CALENDAR">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  const { year, month } = view;
  const today = todayKey();
  const cells = monthCells(year, month);
  const summary = monthSummary(habits, completions, year, month, today);

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() });
    setSelected(null);
  }

  const selectedHabits =
    selected != null
      ? habits.filter(
          (h) => !h.archived && !h.paused && isScheduledDay(h, selected)
        )
      : [];

  return (
    <>
      <div className="mb-5">
        <p className="font-pixel text-[0.65rem] opacity-70">HABIT IT</p>
        <h1 className="text-2xl font-extrabold">Calendar</h1>
        <p className="text-sm font-bold opacity-70">
          {summary.perfectDays} perfect day{summary.perfectDays === 1 ? "" : "s"} ·{" "}
          {summary.rate}% this month
        </p>
      </div>

      <PixelCard className="mb-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="pixel-option p-2"
          >
            <ChevronLeft size={18} strokeWidth={3} aria-hidden="true" />
          </button>
          <h2 className="font-pixel text-xs uppercase">{monthLabel(year, month)}</h2>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="pixel-option p-2"
          >
            <ChevronRight size={18} strokeWidth={3} aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1" role="grid" aria-label={monthLabel(year, month)}>
          {WEEK_HEAD.map((d, i) => (
            <div
              key={i}
              className="pb-1 text-center text-[11px] font-black opacity-60"
              aria-hidden="true"
            >
              {d}
            </div>
          ))}
          {cells.map((key, i) =>
            key === null ? (
              <div key={`pad-${i}`} aria-hidden="true" />
            ) : (
              <button
                key={key}
                type="button"
                role="gridcell"
                aria-label={`${prettyDay(key)}: ${dayStatus(habits, completions, key, today)}${key === today ? ", today" : ""}`}
                aria-selected={selected === key}
                onClick={() => setSelected((s) => (s === key ? null : key))}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center border-[3px] text-sm font-black",
                  STATUS_STYLE[dayStatus(habits, completions, key, today)],
                  selected === key && "outline-3 outline-[var(--color-primary)]",
                  key === today && "underline underline-offset-2"
                )}
              >
                <span>{Number(key.slice(8))}</span>
                <span className="text-[10px] leading-none" aria-hidden="true">
                  {STATUS_MARK[dayStatus(habits, completions, key, today)]}
                </span>
              </button>
            )
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
          <PixelBadge>✓ Done</PixelBadge>
          <PixelBadge>◐ Partial</PixelBadge>
          <PixelBadge>○ Missed</PixelBadge>
          <PixelBadge>· Rest</PixelBadge>
        </div>
      </PixelCard>

      {selected != null && (
        <PixelCard title={prettyDay(selected).toUpperCase()}>
          {selectedHabits.length === 0 ? (
            <p className="text-sm font-bold opacity-70">
              Rest day — nothing scheduled. Recharge! 🌱
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedHabits.map((h) => {
                const done = (completions[h.id] ?? []).includes(selected);
                return (
                  <li
                    key={h.id}
                    className="flex items-center gap-3 border-[3px] border-[var(--color-ink)] p-2.5 dark:border-black"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center border-[3px] border-[var(--color-ink)] text-sm font-black dark:border-black",
                        done && "bg-[var(--color-mint)]"
                      )}
                      aria-hidden="true"
                    >
                      {done ? "✓" : "○"}
                    </span>
                    <span className="text-xl" aria-hidden="true">
                      {h.icon}
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-bold",
                        done && "line-through opacity-60"
                      )}
                    >
                      {h.name}
                    </span>
                    <PixelBadge>+{h.xpReward} XP</PixelBadge>
                  </li>
                );
              })}
            </ul>
          )}
        </PixelCard>
      )}
    </>
  );
}
