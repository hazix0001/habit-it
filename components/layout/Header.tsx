"use client";

import { formatDateLong, getGreeting } from "@/lib/utils";
import { useSettings } from "@/store/settings";

export function Header() {
  const { settings } = useSettings();
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const name = settings.name.trim() || "Friend";
  return (
    <header className="mb-6">
      <p className="font-pixel text-[0.65rem] opacity-70 mb-2">HABIT IT</p>
      <h1 className="text-2xl font-extrabold">
        {greeting}, {name}! 👋
      </h1>
      <p className="text-sm font-bold opacity-70">{formatDateLong(now)}</p>
    </header>
  );
}
