'use client';

import { useEffect } from 'react';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelCard } from '@/components/ui/PixelCard';

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PixelCard className="text-center">
      <p className="mb-3 text-4xl" aria-hidden="true">
        💥
      </p>
      <p className="font-pixel mb-2 text-xs">SECTION CRASHED</p>
      <p className="mb-5 text-sm font-bold opacity-70">
        Your sidebar stays put — just retry this section.
      </p>
      <PixelButton variant="secondary" onClick={() => retry()}>
        TRY AGAIN
      </PixelButton>
    </PixelCard>
  );
}
