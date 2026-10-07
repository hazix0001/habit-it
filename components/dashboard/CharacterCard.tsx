import { PixelBadge } from "@/components/ui/PixelBadge";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";

export type Mood = "happy" | "neutral";

const MOODS: Record<Mood, { face: string; label: string }> = {
  happy: { face: "😊", label: "Happy" },
  neutral: { face: "😐", label: "Neutral" },
};

type Props = {
  mood: Mood;
  streakDays: number;
  level: number;
  xpInto: number;
  xpNeed: number;
  /** Late-night retro mode: the companion sleeps. */
  sleepy?: boolean;
};

export function CharacterCard({ mood, streakDays, level, xpInto, xpNeed, sleepy = false }: Props) {
  const m = sleepy ? { face: "😴", label: "Sleepy" } : MOODS[mood];
  return (
    <PixelCard title="COMPANION" className="text-center">
      <div className="text-6xl mb-2" role="img" aria-label={`Rabbit companion, ${m.label.toLowerCase()}`}>
        {sleepy ? "💤" : "🐰"}
      </div>
      <p className="text-sm font-extrabold mb-3" aria-live="polite">
        <span aria-hidden="true">{m.face}</span> {m.label}
      </p>
      <p className="font-pixel text-xs mb-3">LEVEL {level}</p>
      <PixelProgressBar value={xpInto} max={xpNeed} label={`${xpInto} / ${xpNeed} XP`} />
      <div className="mt-4">
        <PixelBadge>
          🔥 {streakDays} DAY STREAK{streakDays === 1 ? "" : "S"}
        </PixelBadge>
      </div>
    </PixelCard>
  );
}
