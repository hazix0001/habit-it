"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelField } from "@/components/ui/PixelField";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <PixelCard title="NEW PASSWORD">
      <p className="mb-4 text-sm font-bold opacity-70">
        Choose a new password for your account.
      </p>
      <form onSubmit={onSubmit}>
        <PixelField label="NEW PASSWORD (MIN 6 CHARS)">
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pixel-input"
            placeholder="••••••••"
          />
        </PixelField>
        <PixelField label="CONFIRM PASSWORD">
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="pixel-input"
            placeholder="••••••••"
          />
        </PixelField>

        {error ? (
          <p
            role="alert"
            className="mb-4 border-[3px] border-[var(--color-ink)] dark:border-black bg-red-100 dark:bg-red-950 p-3 text-sm font-bold"
          >
            {error}
          </p>
        ) : null}

        <PixelButton type="submit" disabled={loading} className="w-full">
          <ShieldCheck size={16} strokeWidth={3} aria-hidden="true" />
          {loading ? "SAVING…" : "SET NEW PASSWORD"}
        </PixelButton>
      </form>
    </PixelCard>
  );
}
