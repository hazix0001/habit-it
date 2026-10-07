"use client";

import { evaluate } from "@/lib/achievements";
import { useGameStats } from "@/components/achievements/useGameStats";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelBadge } from "@/components/ui/PixelBadge";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const { ready, stats } = useGameStats();

  if (!ready) {
    return (
      <PixelCard title="ACHIEVEMENTS">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  const evaluated = evaluate(stats);
  const unlockedCount = evaluated.filter((e) => e.unlocked).length;

  return (
    <>
      <div className="mb-5">
        <p className="font-pixel text-[0.65rem] opacity-70">HABIT IT</p>
        <h1 className="text-2xl font-extrabold">Achievements</h1>
        <p className="text-sm font-bold opacity-70">
          {unlockedCount} of {evaluated.length} unlocked
          {unlockedCount === evaluated.length
            ? " — legendary! 🌟"
            : " — your journey continues! 🌱"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {evaluated.map(({ def, progress, unlocked }) => (
          <PixelCard
            key={def.id}
            className={cn("text-center", !unlocked && "opacity-80")}
          >
            <div
              className={cn("mb-3 text-5xl", !unlocked && "grayscale")}
              role="img"
              aria-label={`${def.name} ${unlocked ? "unlocked" : "locked"}`}
            >
              {unlocked ? def.icon : "🔒"}
            </div>
            <h2 className="font-pixel mb-2 text-[0.65rem]">{def.name}</h2>
            <p className="mb-3 text-sm font-bold opacity-70">{def.desc}</p>
            {unlocked ? (
              <PixelBadge>UNLOCKED 🎉</PixelBadge>
            ) : (
              <PixelProgressBar
                value={Math.min(progress, def.target)}
                max={def.target}
                label={`${Math.min(progress, def.target)} / ${def.target}`}
              />
            )}
          </PixelCard>
        ))}
      </div>
    </>
  );
}
