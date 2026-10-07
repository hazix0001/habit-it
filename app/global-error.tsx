'use client';

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  // global-error replaces the root layout, so it must be self-contained:
  // no imports of app CSS, fonts, or Pixel components here.
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff8e7',
          color: '#2d2a32',
          fontFamily: 'system-ui, sans-serif',
          padding: 16,
        }}
      >
        <div
          style={{
            background: '#fffdf6',
            border: '4px solid #2d2a32',
            boxShadow: '6px 6px 0 #2d2a32',
            padding: 24,
            maxWidth: 420,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>💥</p>
          <h1 style={{ fontSize: 16, margin: '0 0 8px' }}>
            HABIT IT CRASHED
          </h1>
          <p style={{ fontSize: 14, opacity: 0.7 }}>
            Please reload. Your habits are stored locally.
            {process.env.NODE_ENV !== 'production' && error.message
              ? ` (${error.message})`
              : null}
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 16,
              border: '4px solid #2d2a32',
              boxShadow: '4px 4px 0 #2d2a32',
              background: '#ffb347',
              padding: '12px 20px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            TRY AGAIN
          </button>
        </div>
      </body>
    </html>
  );
}
