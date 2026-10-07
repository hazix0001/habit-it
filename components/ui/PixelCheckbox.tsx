"use client";

import { Check } from "lucide-react";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
};

export function PixelCheckbox({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      data-checked={checked}
      className="pixel-checkbox"
      onClick={() => onChange(!checked)}
    >
      {checked ? <Check size={18} strokeWidth={4} aria-hidden="true" /> : null}
    </button>
  );
}
