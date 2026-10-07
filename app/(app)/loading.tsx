import { PixelCard } from '@/components/ui/PixelCard';

export default function AppLoading() {
  return (
    <PixelCard title="LOADING">
      <p className="font-pixel animate-pulse text-xs">LOADING…</p>
    </PixelCard>
  );
}
