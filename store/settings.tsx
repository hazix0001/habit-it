"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Appearance = "light" | "dark" | "system";
export type PixelTheme = "classic" | "soft" | "night";

export type Settings = {
  name: string;
  appearance: Appearance;
  theme: PixelTheme;
  reminders: boolean;
  reminderTime: string; // "HH:MM"
};

export const SETTINGS_KEY = "habit-it:settings:v1";

export const DEFAULT_SETTINGS: Settings = {
  name: "Hazix",
  appearance: "system",
  theme: "classic",
  reminders: false,
  reminderTime: "08:00",
};

function loadSettings(): Settings {
  try {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      name:
        typeof parsed.name === "string" && parsed.name.trim()
          ? parsed.name.slice(0, 30)
          : DEFAULT_SETTINGS.name,
      appearance:
        parsed.appearance === "light" ||
        parsed.appearance === "dark" ||
        parsed.appearance === "system"
          ? parsed.appearance
          : DEFAULT_SETTINGS.appearance,
      theme:
        parsed.theme === "classic" ||
        parsed.theme === "soft" ||
        parsed.theme === "night"
          ? parsed.theme
          : DEFAULT_SETTINGS.theme,
      reminders: parsed.reminders === true,
      reminderTime:
        typeof parsed.reminderTime === "string" && /^\d{2}:\d{2}$/.test(parsed.reminderTime)
          ? parsed.reminderTime
          : DEFAULT_SETTINGS.reminderTime,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

type SettingsContextValue = {
  ready: boolean;
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  /* eslint-disable react-hooks/set-state-in-effect -- mount-only
     localStorage hydration (client-only data), same pattern as habits. */
  useEffect(() => {
    setSettings(loadSettings());
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist + apply to <html> (dark class, theme variant, system listener).
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        // Private mode — settings apply for this session only.
      }
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const nightForced = settings.theme === "night";
      const dark =
        nightForced ||
        settings.appearance === "dark" ||
        (settings.appearance === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.dataset.theme = settings.theme;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [ready, settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(
    () => ({ ready, settings, update }),
    [ready, settings, update]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
