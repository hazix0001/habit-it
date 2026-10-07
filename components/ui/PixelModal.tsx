"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function PixelModal({ title, onClose, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("input")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50"
      />
      <div
        ref={panelRef}
        className="pixel-card relative max-h-[90vh] w-full max-w-md overflow-y-auto p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-pixel text-xs">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="pixel-checkbox"
            data-checked="false"
          >
            <X size={16} strokeWidth={4} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
