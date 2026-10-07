import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28 lg:pb-10">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
