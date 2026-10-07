'use client';

import { useEffect } from 'react';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelCard } from '@/components/ui/PixelCard';

export default function Error({
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
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-10">
      <PixelCard className="text-center">
        <p className="mb-3 text-4xl" aria-hidden="true">
          💥
        </p>
        <p className="font-pixel mb-2 text-xs">SOMETHING WENT WRONG</p>
        <p className="mb-5 text-sm font-bold opacity-70">
          The save data is safe in this browser. Try again!
        </p>
        {process.env.NODE_ENV !== 'production' ? (
          <p className="mx-auto mb-5 max-w-md truncate text-xs font-bold opacity-50">
            {error.message}
            {error.digest ? ` (digest: ${error.digest})` : null}
          </p>
        ) : null}
        <PixelButton variant="secondary" onClick={() => retry()}>
          TRY AGAIN
        </PixelButton>
      </PixelCard>
    </main>
  );
}
