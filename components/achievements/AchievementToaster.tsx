"use client";

import { useEffect, useState } from "react";
import { evaluate, type AchievementDef } from "@/lib/achievements";
import { loadUnlocked, saveUnlocked } from "@/lib/achievement-storage";
import { useGameStats } from "./useGameStats";
import { PixelBadge } from "@/components/ui/PixelBadge";

/**
 * Watches game stats everywhere in the app and announces newly
 * unlocked achievements exactly once (persisted in localStorage).
 */
export function AchievementToaster() {
  const { ready, stats } = useGameStats();
  const [queue, setQueue] = useState<AchievementDef[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect -- event-style unlock
     detection: persisted id list is external state, queue feeds the toast. */
  useEffect(() => {
    if (!ready) return;
    const stored = loadUnlocked();
    const newly = evaluate(stats)
      .filter((e) => e.unlocked && !stored.includes(e.def.id))
      .map((e) => e.def);
    if (newly.length > 0) {
      saveUnlocked([...stored, ...newly.map((d) => d.id)]);
      setQueue((prev) => [...prev, ...newly]);
    }
  }, [ready, stats]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (queue.length === 0) return;
    const t = setTimeout(() => setQueue((prev) => prev.slice(1)), 3000);
    return () => clearTimeout(t);
  }, [queue]);

  const current = queue[0];
  if (!current) return null;

  return (
    <div
      key={current.id}
      role="status"
      aria-live="polite"
      className="pixel-card pixel-toast bottom-20 z-20 px-5 py-4 text-center lg:bottom-8"
    >
      <div className="mb-2 text-4xl" aria-hidden="true">
        {current.icon}
      </div>
      <p className="font-pixel mb-2 text-xs">ACHIEVEMENT UNLOCKED!</p>
      <p className="mb-2 text-sm font-extrabold">{current.name}</p>
      <PixelBadge>{current.desc}</PixelBadge>
    </div>
  );
}
