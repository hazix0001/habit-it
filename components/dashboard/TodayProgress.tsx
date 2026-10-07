import { PixelCard } from "@/components/ui/PixelCard";
import { PixelProgressBar } from "@/components/ui/PixelProgressBar";

type Props = {
  done: number;
  total: number;
  sessionXp: number;
};

export function TodayProgress({ done, total, sessionXp }: Props) {
  return (
    <PixelCard title="TODAY'S PROGRESS">
      <p className="text-3xl font-extrabold mb-1">
        {done} / {total} <span className="text-base font-bold">completed</span>
      </p>
      <p className="text-sm font-extrabold text-[var(--color-primary-dark)] mb-3" aria-live="polite">
        +{sessionXp} XP today
      </p>
      <PixelProgressBar
        value={done}
        max={total}
        label={`${total > 0 ? Math.round((done / total) * 100) : 0}%`}
      />
    </PixelCard>
  );
}
