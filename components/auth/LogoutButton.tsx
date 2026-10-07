"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold border-[3px] border-transparent hover:border-[var(--color-ink)] hover:bg-[var(--color-cream)] dark:hover:bg-[#100e18] focus-visible:outline-3 focus-visible:outline-[var(--color-sunny)] disabled:opacity-60"
    >
      <LogOut size={18} aria-hidden="true" />
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
