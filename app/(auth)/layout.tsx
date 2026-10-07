import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="font-pixel text-sm mb-8" aria-label="Habit It home">
        HABIT&nbsp;IT
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
