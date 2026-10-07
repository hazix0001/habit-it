import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AchievementToaster } from "@/components/achievements/AchievementToaster";

/**
 * Shared shell (sidebar + bottom nav) for all authenticated-app screens.
 * Landing page (app/page.tsx) stays outside this group on purpose.
 */
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      {children}
      <AchievementToaster />
    </AppShell>
  );
}
