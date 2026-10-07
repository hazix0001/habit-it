import Link from 'next/link';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelCard } from '@/components/ui/PixelCard';

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-10">
      <PixelCard className="text-center">
        <p className="mb-3 text-4xl" aria-hidden="true">
          🗺️
        </p>
        <p className="font-pixel mb-2 text-xs">PAGE NOT FOUND</p>
        <p className="mb-5 text-sm font-bold opacity-70">
          This quest doesn&apos;t exist. Let&apos;s head back!
        </p>
        <Link href="/dashboard">
          <PixelButton variant="secondary">BACK TO DASHBOARD</PixelButton>
        </Link>
      </PixelCard>
    </main>
  );
}
