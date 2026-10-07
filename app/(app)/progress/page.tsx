"use client";

import { useHabits } from "@/store/habits";
import { useTasks } from "@/store/tasks";
import { isScheduledDay, todayKey } from "@/lib/habit-logic";
import { getGlobalStats } from "@/lib/streaks";
import { getTotalXp, levelProgress } from "@/lib/levels";
import { monthSummary, weekCompletion } from "@/lib/calendar";
import { weekdayOf } from "@/lib/habit-logic";
import { WEEKDAY_SHORT } from "@/lib/constants";
import { useGameStats } from "@/components/achievements/useGameStats";
import { evaluate } from "@/lib/achievements";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelStatCard } from "@/components/ui/PixelStatCard";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const { ready: hr, habits, completions } = useHabits();
  const { ready: tr, tasks } = useTasks();
  const { ready: gr, stats: game } = useGameStats();
  const ready = hr && tr && gr;

  if (!ready) {
    return (
      <PixelCard title="PROGRESS">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  const today = todayKey();
  const now = new Date();

  // Today
  const scheduledToday = habits.filter(
    (h) => !h.archived && !h.paused && isScheduledDay(h, today)
  );
  const doneToday = scheduledToday.filter((h) =>
    (completions[h.id] ?? []).includes(today)
  ).length;

  // Week + month
  const week = weekCompletion(habits, completions, today);
  const month = monthSummary(habits, completions, now.getFullYear(), now.getMonth(), today);

  // Lifetime
  const global = getGlobalStats(habits, completions, today);
  const totalXp = getTotalXp(habits, completions, tasks);
  const level = levelProgress(totalXp);
  const unlocked = evaluate(game).filter((e) => e.unlocked).length;

  const chartLabel = week.bars
    .map(
      (b) =>
        `${b.key}: ${b.pct === null ? "rest day" : `${b.pct} percent`}`
    )
    .join(", ");

  return (
    <>
      <div className="mb-5">
        <p className="font-pixel text-[0.65rem] opacity-70">HABIT IT</p>
        <h1 className="text-2xl font-extrabold">Progress</h1>
        <p className="text-sm font-bold opacity-70">
          Small habits. Big changes. 📈
        </p>
      </div>

      <PixelCard title="TODAY" className="mb-5">
        <p className="mb-3 text-3xl font-extrabold">
          {doneToday} / {scheduledToday.length}{" "}
          <span className="text-base font-bold">completed</span>
        </p>
        <PixelProgressBar
          value={doneToday}
          max={Math.max(scheduledToday.length, 1)}
          label={
            scheduledToday.length > 0
              ? `${Math.round((doneToday / scheduledToday.length) * 100)}%`
              : "Rest day — nothing scheduled 🌱"
          }
        />
      </PixelCard>

      <PixelCard title="THIS WEEK" className="mb-5">
        <p className="mb-4 text-sm font-extrabold" aria-live="polite">
          {week.rate}% completion
        </p>
        <figure>
          <div className="pixel-chart" role="img" aria-label={`Weekly completion: ${chartLabel}`}>
            {week.bars.map((bar) => (
              <div key={bar.key} className="flex h-full flex-col">
                <div className="mb-1 h-5 text-center text-[11px] font-black">
                  {bar.pct === null ? "·" : `${bar.pct}%`}
                </div>
                <div
                  className="pixel-bar-track flex-1"
                  data-rest={bar.pct === null}
                  aria-hidden="true"
                >
                  {bar.pct !== null && (
                    <div
                      className="pixel-bar-fill"
                      style={{ height: `${Math.max(bar.pct, 4)}%` }}
                    />
                  )}
                </div>
                <div className="mt-1 text-center text-[11px] font-black opacity-60">
                  {WEEKDAY_SHORT[weekdayOf(bar.key)]}
                </div>
              </div>
            ))}
          </div>
        </figure>
      </PixelCard>

      <PixelCard title="THIS MONTH" className="mb-5">
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <PixelStatCard label="RATE" value={`${month.rate}%`} />
          <PixelStatCard label="PERFECT DAYS" value={`${month.perfectDays}`} />
          <PixelStatCard
            label="SCHEDULED DAYS"
            value={`${month.scheduledDays}`}
          />
        </div>
        <PixelProgressBar
          value={month.rate}
          max={100}
          label={`${month.rate}% completion`}
        />
      </PixelCard>

      <h2 className="font-pixel mb-4 text-xs">LIFETIME</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <PixelStatCard label="STREAK" value={`🔥 ${global.currentStreak}`} />
        <PixelStatCard label="BEST" value={`🏆 ${global.longestStreak}`} />
        <PixelStatCard label="LEVEL" value={`⭐ ${level.level}`} />
        <PixelStatCard label="TOTAL XP" value={`+${totalXp}`} />
        <PixelStatCard label="COMPLETED" value={`${global.totalCompleted}`} />
        <PixelStatCard label="30-DAY RATE" value={`${global.completionRate}%`} />
        <PixelStatCard label="PERFECT / 30D" value={`${global.perfectDays30}`} />
        <PixelStatCard label="TROPHIES" value={`${unlocked} / 5`} />
      </div>

      <p className={cn("mt-5 text-center text-sm font-bold opacity-70")}>
        {global.currentStreak > 0
          ? "Your journey continues — keep it up! 🔥"
          : "Tomorrow is another day 🌱"}
      </p>
    </>
  );
}
