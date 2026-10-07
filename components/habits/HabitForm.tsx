"use client";

import { useState } from "react";
import type { Habit } from "@/types/index";
import { useHabits, type HabitInput } from "@/store/habits";
import { PixelModal } from "@/components/ui/PixelModal";
import { PixelField } from "@/components/ui/PixelField";
import { PixelButton } from "@/components/ui/PixelButton";
import {
  CATEGORIES,
  COLOR_CHOICES,
  ICON_CHOICES,
  WEEKDAY_SHORT,
  XP_CHOICES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  initial?: Habit | null;
  onClose: () => void;
};

const FREQUENCIES = [
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "custom", label: "Custom" },
] as const;

export function HabitForm({ initial, onClose }: Props) {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "💧");
  const [category, setCategory] = useState(initial?.category ?? "Health");
  const [color, setColor] = useState(initial?.color ?? COLOR_CHOICES[0].value);
  const [frequency, setFrequency] = useState<Habit["frequency"]>(
    initial?.frequency ?? "daily"
  );
  const [customDays, setCustomDays] = useState<number[]>(
    initial?.customDays ?? [1, 3, 5]
  );
  const [xpReward, setXpReward] = useState(initial?.xpReward ?? 10);
  const [reminder, setReminder] = useState(initial?.reminder ?? "");
  const [error, setError] = useState("");

  function toggleDay(d: number) {
    setCustomDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function submit() {
    if (name.trim().length === 0) {
      setError("Give your habit a name first 🌱");
      return;
    }
    if (!initial && reminder.trim().length === 0) {
      setError("Set a reminder time ⏰");
      return;
    }
    if (frequency === "custom" && customDays.length === 0) {
      setError("Pick at least one day for custom frequency.");
      return;
    }
    const input: HabitInput = {
      name,
      icon,
      category,
      color,
      frequency,
      customDays,
      xpReward,
      reminder,
    };
    if (initial) updateHabit(initial.id, input);
    else addHabit(input);
    onClose();
  }

  return (
    <PixelModal title={initial ? "EDIT HABIT" : "NEW HABIT"} onClose={onClose}>
      <PixelField label="HABIT NAME">
        <input
          className="pixel-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Drink 2L Water"
          maxLength={40}
        />
      </PixelField>

      <PixelField label="ICON">
        <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Icon">
          {ICON_CHOICES.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={icon === c}
              aria-label={`Icon ${c}`}
              data-active={icon === c}
              className="pixel-option text-xl"
              onClick={() => setIcon(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </PixelField>

      <div className="grid grid-cols-2 gap-3">
        <PixelField label="CATEGORY">
          <select
            className="pixel-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </PixelField>
        <PixelField label="COLOR">
          <div className="flex gap-2" role="radiogroup" aria-label="Color">
            {COLOR_CHOICES.map((c) => (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={color === c.value}
                aria-label={c.name}
                title={c.name}
                onClick={() => setColor(c.value)}
                className={cn(
                  "h-10 w-10 border-[3px] border-[var(--color-ink)] dark:border-black",
                  color === c.value && "outline-3 outline-[var(--color-sunny)]"
                )}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        </PixelField>
      </div>

      <PixelField label="FREQUENCY">
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Frequency">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={frequency === f.value}
              data-active={frequency === f.value}
              className="pixel-option text-sm"
              onClick={() => setFrequency(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {frequency === "custom" && (
          <div className="mt-2 flex gap-1.5" role="group" aria-label="Custom days">
            {WEEKDAY_SHORT.map((label, d) => (
              <button
                key={d}
                type="button"
                aria-pressed={customDays.includes(d)}
                data-active={customDays.includes(d)}
                className="pixel-option flex-1 text-sm"
                onClick={() => toggleDay(d)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </PixelField>

      <PixelField label="XP REWARD">
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="XP reward">
          {XP_CHOICES.map((x) => (
            <button
              key={x.xp}
              type="button"
              role="radio"
              aria-checked={xpReward === x.xp}
              data-active={xpReward === x.xp}
              className="pixel-option text-sm"
              onClick={() => setXpReward(x.xp)}
            >
              {x.label} +{x.xp}
            </button>
          ))}
        </div>
      </PixelField>

      <PixelField label={initial ? "REMINDER (OPTIONAL)" : "REMINDER *"}>
        <input
          type="time"
          required={!initial}
          aria-required={!initial}
          className="pixel-input"
          value={reminder}
          onChange={(e) => {
            setReminder(e.target.value);
            if (error) setError("");
          }}
        />
        <p className="mt-1 text-xs font-bold opacity-60">
          Time is saved only — notifications arrive in Phase 11.
        </p>
      </PixelField>

      {error ? (
        <p role="alert" className="mb-3 text-sm font-extrabold">
          {error}
        </p>
      ) : null}

      <PixelButton variant="primary" onClick={submit} className="w-full">
        {initial ? "SAVE CHANGES" : "CREATE HABIT"}
      </PixelButton>
    </PixelModal>
  );
}
