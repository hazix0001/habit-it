"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { KeyRound, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelField } from "@/components/ui/PixelField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        },
      );
      if (error) {
        setError(error.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <PixelCard title="CHECK YOUR EMAIL">
        <p className="mb-4 flex items-start gap-3 text-sm font-bold">
          <MailCheck size={20} aria-hidden="true" className="shrink-0" />
          If an account exists for {email.trim()}, a password-reset link is on
          its way. It expires in 1 hour.
        </p>
        <Link href="/login" className="text-sm font-bold underline opacity-70">
          Back to log in
        </Link>
      </PixelCard>
    );
  }

  return (
    <PixelCard title="RESET PASSWORD">
      <p className="mb-4 text-sm font-bold opacity-70">
        Enter your account email and we’ll send you a reset link.
      </p>
      <form onSubmit={onSubmit}>
        <PixelField label="EMAIL">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pixel-input"
            placeholder="you@example.com"
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
          <KeyRound size={16} strokeWidth={3} aria-hidden="true" />
          {loading ? "SENDING…" : "SEND RESET LINK"}
        </PixelButton>
      </form>

      <p className="mt-5 text-center text-sm font-bold opacity-70">
        Remembered it?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </PixelCard>
  );
}
