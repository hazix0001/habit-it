import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function PixelCard({ title, children, className }: Props) {
  return (
    <section className={cn("pixel-card p-5", className)} aria-label={title}>
      {title ? (
        <h2 className="font-pixel text-xs mb-4 text-[var(--fg)]">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
