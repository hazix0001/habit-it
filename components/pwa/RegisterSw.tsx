"use client";

import { useEffect } from "react";

/** Registers the service worker in production only (avoids dev HMR fights). */
export function RegisterSw() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is best-effort — the app works fine without it.
    });
  }, []);
  return null;
}
