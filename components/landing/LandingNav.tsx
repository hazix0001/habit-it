import Link from "next/link";
import { PixelButton } from "@/components/ui/PixelButton";

export function LandingNav() {
  return (
    <header className="mx-auto w-full max-w-5xl px-4 pt-5 flex items-center justify-between">
      <Link href="/" className="font-pixel text-sm" aria-label="Habit It home">
        HABIT&nbsp;IT
      </Link>
      <Link href="/dashboard">
        <PixelButton variant="secondary">VIEW DEMO</PixelButton>
      </Link>
    </header>
  );
}
