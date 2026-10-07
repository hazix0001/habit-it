import { CheckSquare, Flame, Sparkles, Heart } from "lucide-react";
import { PixelCard } from "@/components/ui/PixelCard";

const FEATURES = [
  {
    icon: CheckSquare,
    title: "TRACK HABITS",
    text: "Tick off daily habits with satisfying pixel checkboxes.",
  },
  {
    icon: Flame,
    title: "BUILD STREAKS",
    text: "Keep the fire alive — real date-based streak counting.",
  },
  {
    icon: Sparkles,
    title: "EARN XP",
    text: "Every habit pays XP. Level up from 0 to hero.",
  },
  {
    icon: Heart,
    title: "GROW BUDDY",
    text: "Your cute companion grows happier as you stay consistent.",
  },
] as const;

export function FeatureGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {FEATURES.map((f) => (
        <PixelCard key={f.title} title={f.title}>
          <f.icon size={28} strokeWidth={2.5} aria-hidden="true" />
          <p className="mt-3 text-sm font-bold opacity-80">{f.text}</p>
        </PixelCard>
      ))}
    </div>
  );
}
