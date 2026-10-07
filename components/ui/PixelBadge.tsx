import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function PixelBadge({ children, className }: Props) {
  return <span className={cn("pixel-badge", className)}>{children}</span>;
}
