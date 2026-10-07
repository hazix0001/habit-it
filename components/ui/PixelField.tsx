import type { ReactNode } from "react";

export function PixelField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <span className="font-pixel mb-2 block text-[0.6rem]">{label}</span>
      {children}
    </div>
  );
}
