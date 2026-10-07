"use client";

import { useRef, useState } from "react";
import { Download, Moon, Sun, Monitor, Upload, Trash2, User } from "lucide-react";
import { useSettings, type Appearance, type PixelTheme } from "@/store/settings";
import {
  backupFileName,
  buildBackup,
  clearAllData,
  restoreBackup,
  validateBackup,
} from "@/lib/data-transfer";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { InstallButton } from "@/components/pwa/InstallButton";
import { cn } from "@/lib/utils";

const APPEARANCES: { value: Appearance; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const THEMES: { value: PixelTheme; label: string; desc: string }[] = [
  { value: "classic", label: "Pixel Classic", desc: "The original chunky look." },
  { value: "soft", label: "Soft Pixel", desc: "Rounder, gentler pixels." },
  { value: "night", label: "Night Pixel", desc: "Starry night — always dark." },
];

export default function SettingsPage() {
  const { ready, settings, update } = useSettings();
  const [status, setStatus] = useState("");
  const [confirmingReset, setConfirmingReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!ready) {
    return (
      <PixelCard title="SETTINGS">
        <p className="font-pixel animate-pulse text-xs">LOADING…</p>
      </PixelCard>
    );
  }

  function exportData() {
    try {
      const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backupFileName(new Date());
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Backup downloaded! Keep it somewhere safe 💾");
    } catch {
      setStatus("Export failed — your data is still safe in this browser.");
    }
  }

  function importData(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = validateBackup(JSON.parse(String(reader.result)));
        if (!backup) {
          setStatus("That file is not a Habit It backup. Nothing changed 🌱");
          return;
        }
        restoreBackup(backup);
        setStatus("Backup restored! Reloading… 🎉");
        window.location.reload();
      } catch {
        setStatus("Could not read that file. Nothing changed 🌱");
      }
    };
    reader.onerror = () => {
      setStatus("Could not read that file. Nothing changed 🌱");
    };
    reader.readAsText(file);
  }

  function resetData() {
    clearAllData();
    window.location.reload();
  }

  return (
    <>
      <div className="mb-5">
        <p className="font-pixel text-[0.65rem] opacity-70">HABIT IT</p>
        <h1 className="text-2xl font-extrabold">Settings</h1>
      </div>

      <PixelCard title="APPEARANCE" className="mb-5">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Appearance">
          {APPEARANCES.map((a) => (
            <button
              key={a.value}
              type="button"
              role="radio"
              aria-checked={settings.appearance === a.value}
              data-active={settings.appearance === a.value}
              className="pixel-option flex flex-col items-center gap-1 py-3 text-xs"
              onClick={() => update({ appearance: a.value })}
            >
              <a.icon size={20} aria-hidden="true" />
              {a.label}
            </button>
          ))}
        </div>
      </PixelCard>

      <PixelCard title="PIXEL THEME" className="mb-5">
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Pixel theme">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={settings.theme === t.value}
              data-active={settings.theme === t.value}
              className={cn(
                "pixel-option px-3 py-2.5 text-left",
                settings.theme === t.value && "outline-3 outline-[var(--color-sunny)]"
              )}
              onClick={() => update({ theme: t.value })}
            >
              <span className="block text-sm">{t.label}</span>
              <span className="block text-xs font-bold opacity-60">{t.desc}</span>
            </button>
          ))}
        </div>
      </PixelCard>

      <PixelCard title="PROFILE" className="mb-5">
        <label className="mb-1 block text-sm font-extrabold" htmlFor="profile-name">
          <User size={14} className="mr-1 inline" aria-hidden="true" />
          Display name
        </label>
        <input
          id="profile-name"
          className="pixel-input"
          value={settings.name}
          maxLength={30}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Hazix"
        />
        <p className="mt-1 text-xs font-bold opacity-60">
          Shows in your dashboard greeting.
        </p>
      </PixelCard>

      <PixelCard title="NOTIFICATIONS" className="mb-5">
        <button
          type="button"
          role="switch"
          aria-checked={settings.reminders}
          onClick={() => update({ reminders: !settings.reminders })}
          className="pixel-option mb-3 w-full px-3 py-2.5 text-left text-sm"
        >
          {settings.reminders ? "🔔 Reminders ON" : "🔕 Reminders OFF"}
        </button>
        {settings.reminders && (
          <label className="block text-sm font-extrabold" htmlFor="reminder-time">
            Daily reminder
            <input
              id="reminder-time"
              type="time"
              className="pixel-input mt-2"
              value={settings.reminderTime}
              onChange={(e) => update({ reminderTime: e.target.value })}
            />
          </label>
        )}
        <p className="mt-2 text-xs font-bold opacity-60">
          Times are saved per habit. Browser push notifications arrive with
          the PWA phase — no fake alarms until then.
        </p>
      </PixelCard>

      <PixelCard title="DATA" className="mb-5">
        <div className="flex flex-wrap gap-2">
          <PixelButton variant="secondary" onClick={exportData}>
            <Download size={16} strokeWidth={3} aria-hidden="true" />
            EXPORT
          </PixelButton>
          <PixelButton variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload size={16} strokeWidth={3} aria-hidden="true" />
            IMPORT
          </PixelButton>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Import backup file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importData(file);
              e.target.value = "";
            }}
          />
        </div>
        <div className="mt-3">
          {confirmingReset ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold">
                Delete everything and start fresh?
              </span>
              <button
                type="button"
                onClick={resetData}
                className="pixel-option bg-[#ff6b6b] text-xs font-black text-white"
              >
                Yes, reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="pixel-option text-xs"
              >
                Keep my data
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="pixel-option flex items-center gap-1 text-xs"
            >
              <Trash2 size={14} aria-hidden="true" /> Reset all data
            </button>
          )}
        </div>
        {status ? (
          <p role="status" className="mt-3 text-sm font-extrabold">
            {status}
          </p>
        ) : null}
      </PixelCard>

      <PixelCard title="INSTALL APP" className="mb-5">
        <p className="mb-3 text-sm font-bold opacity-70">
          Add Habit It to your home screen for quick daily check-ins.
        </p>
        <InstallButton />
      </PixelCard>

      <PixelCard title="ACCOUNT" className="mb-5">
        <p className="text-sm font-bold">
          Signed in as <span className="font-black">Guest</span> (local only)
        </p>
        <p className="mt-1 text-xs font-bold opacity-60">
          MVP build: all data stays in this browser. Real accounts arrive
          later — your export file will carry over.
        </p>
      </PixelCard>
    </>
  );
}
