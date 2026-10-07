import { PixelBadge } from "@/components/ui/PixelBadge";

/**
 * Placeholder pixel-art hero scene.
 * Emoji companion is temporary — swap with real sprite in
 * `public/assets/characters/` later without touching layout.
 */
export function HeroArt() {
  return (
    <div
      className="pixel-card relative overflow-hidden p-6 text-center"
      role="img"
      aria-label="Pixel rabbit companion with clouds, sun and grass"
    >
      <div className="pixel-dots absolute inset-x-0 top-0 h-16 opacity-60" aria-hidden="true" />
      <div
        className="absolute top-4 left-6 h-4 w-14 bg-white border-[3px] border-[var(--color-ink)] animate-[pixel-float_3s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div
        className="absolute top-8 right-8 h-4 w-10 bg-white border-[3px] border-[var(--color-ink)] animate-[pixel-float_4s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div
        className="absolute top-5 right-16 flex h-10 w-10 items-center justify-center bg-[var(--color-sunny)] border-[3px] border-[var(--color-ink)] font-pixel text-xs"
        aria-hidden="true"
      >
        ☀
      </div>

      <div className="text-7xl my-6 animate-[pixel-bounce_2s_ease-in-out_infinite]" aria-hidden="true">
        🐰
      </div>
      <p className="font-pixel text-xs mb-2">LEVEL 8</p>
      <p className="text-sm font-bold opacity-70 mb-4">720 / 1000 XP</p>
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        <PixelBadge>🔥 12 DAY STREAK</PixelBadge>
        <PixelBadge>+20 XP</PixelBadge>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-5 bg-[var(--color-mint)] border-t-4 border-[var(--color-ink)]"
        aria-hidden="true"
      />
    </div>
  );
}
