"use client";

import { useEffect } from "react";
import { PixelBadge } from "@/components/ui/PixelBadge";

export type Celebration = {
  key: number;
  name: string;
  xp: number;
  /** Set when this completion crossed into a new level. */
  levelUp?: number;
} | null;

type Props = {
  toast: Celebration;
  onDone: () => void;
};

export function CelebrationToast({ toast, onDone }: Props) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  if (!toast) return null;

  return (
    <div
      key={toast.key}
      role="status"
      aria-live="polite"
      className="pixel-card pixel-toast bottom-20 z-20 px-5 py-4 text-center lg:bottom-8"
    >
      <p className="font-pixel text-xs mb-2">
        {toast.levelUp ? "🎉 LEVEL UP!" : "✨ NICE!"}
      </p>
      <p className="text-sm font-extrabold mb-2">
        {toast.name} +{toast.xp} XP
      </p>
      {toast.levelUp ? (
        <PixelBadge>⭐ LEVEL {toast.levelUp}</PixelBadge>
      ) : (
        <PixelBadge>🔥 STREAK +1</PixelBadge>
      )}
    </div>
  );
}
