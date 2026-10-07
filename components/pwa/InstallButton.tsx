"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download } from "lucide-react";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelBadge } from "@/components/ui/PixelBadge";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

function subscribeStandalone(onChange: () => void): () => void {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** True when the app runs as an installed PWA (no hydration mismatch). */
function useIsInstalled(): boolean {
  return useSyncExternalStore(
    subscribeStandalone,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );
}

/** Install button driven by beforeinstallprompt, with graceful fallback. */
export function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const installed = useIsInstalled();

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed) {
    return <PixelBadge>APP INSTALLED ✓</PixelBadge>;
  }

  if (deferred) {
    return (
      <PixelButton
        variant="primary"
        onClick={() => {
          try {
            const result = deferred.prompt() as unknown;
            // Older browsers return undefined instead of a promise.
            if (result instanceof Promise) {
              result.catch(() => {
                // Dismissed — the fallback hint takes over below.
              });
            }
          } catch {
            // Prompt unavailable — the fallback hint takes over below.
          }
          setDeferred(null);
        }}
      >
        <Download size={16} strokeWidth={3} aria-hidden="true" />
        INSTALL APP
      </PixelButton>
    );
  }

  return (
    <p className="text-xs font-bold opacity-60">
      To install: open the browser menu → “Install Habit It” or “Add to Home
      Screen”.
    </p>
  );
}
