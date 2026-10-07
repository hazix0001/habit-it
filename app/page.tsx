import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroArt } from "@/components/landing/HeroArt";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelBadge } from "@/components/ui/PixelBadge";

export const metadata: Metadata = {
  title: "Habit It — Build Better Habits",
  description:
    "Track habits, build streaks and grow your pixel companion. Small habits. Big changes.",
};

const XP_EXAMPLES = [
  { icon: "💧", name: "Drink Water", xp: "+10 XP" },
  { icon: "💪", name: "Workout", xp: "+20 XP" },
  { icon: "📖", name: "Read", xp: "+10 XP" },
  { icon: "🧘", name: "Meditate", xp: "+15 XP" },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNav />

      <main className="mx-auto w-full max-w-5xl px-4 pb-16">
        {/* Hero */}
        <section className="grid gap-8 items-center py-10 md:grid-cols-2 md:py-16">
          <div>
            <p className="font-pixel text-[0.65rem] mb-4 text-[var(--color-primary)]">
              SMALL HABITS. BIG CHANGES.
            </p>
            <h1 className="font-pixel text-2xl leading-relaxed mb-4 sm:text-3xl">
              HABIT IT
            </h1>
            <p className="text-xl font-extrabold mb-3">
              Build better habits, one pixel at a time.
            </p>
            <p className="text-base font-bold opacity-70 mb-6">
              Track your habits, build streaks and grow your little companion.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <PixelButton variant="primary">
                  START YOUR JOURNEY
                  <ArrowRight size={16} strokeWidth={3} aria-hidden="true" />
                </PixelButton>
              </Link>
              <Link href="/dashboard">
                <PixelButton variant="secondary">
                  <Eye size={16} strokeWidth={3} aria-hidden="true" />
                  VIEW DEMO
                </PixelButton>
              </Link>
            </div>
          </div>
          <HeroArt />
        </section>

        {/* XP strip */}
        <section aria-label="Example XP rewards" className="mb-12">
          <PixelCard title="EVERY HABIT EARNS XP">
            <ul className="grid gap-3 sm:grid-cols-2">
              {XP_EXAMPLES.map((h) => (
                <li
                  key={h.name}
                  className="flex items-center gap-3 border-[3px] border-[var(--color-ink)] dark:border-black p-3 bg-white dark:bg-[#100e18]"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {h.icon}
                  </span>
                  <span className="flex-1 font-bold">{h.name}</span>
                  <PixelBadge>{h.xp}</PixelBadge>
                </li>
              ))}
            </ul>
          </PixelCard>
        </section>

        {/* Features */}
        <section aria-label="Features" className="mb-12">
          <h2 className="font-pixel text-sm mb-5">HOW IT WORKS</h2>
          <FeatureGrid />
        </section>

        {/* CTA */}
        <section aria-label="Get started">
          <PixelCard className="text-center">
            <p className="text-4xl mb-3" aria-hidden="true">
              🌱
            </p>
            <h2 className="font-pixel text-sm mb-3">READY, PLAYER ONE?</h2>
            <p className="text-sm font-bold opacity-70 mb-5">
              Tomorrow is another day — your journey continues!
            </p>
            <Link href="/dashboard">
              <PixelButton variant="accent">
                START YOUR JOURNEY
                <ArrowRight size={16} strokeWidth={3} aria-hidden="true" />
              </PixelButton>
            </Link>
          </PixelCard>
        </section>

        <footer className="mt-10 text-center">
          <p className="font-pixel text-[0.6rem] opacity-60">
            HABIT IT — SMALL HABITS. BIG CHANGES.
          </p>
        </footer>
      </main>
    </div>
  );
}
