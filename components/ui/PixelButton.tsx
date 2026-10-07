import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const VARIANTS: Record<Variant, string> = {
  primary: "pixel-btn-primary",
  secondary: "pixel-btn-secondary",
  accent: "pixel-btn-accent",
};

export function PixelButton({ variant = "primary", className, ...rest }: Props) {
  return (
    <button className={cn("pixel-btn", VARIANTS[variant], className)} {...rest} />
  );
}
