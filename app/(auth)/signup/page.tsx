"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelField } from "@/components/ui/PixelField";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        return;
      }
      // Email confirmation ON (Supabase default) → no session yet.
      if (!data.session) {
        setSent(true);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <PixelCard title="CHECK YOUR EMAIL">
        <p className="mb-4 flex items-start gap-3 text-sm font-bold">
          <MailCheck size={20} aria-hidden="true" className="shrink-0" />
          We sent a confirmation link to {email.trim()}. Click it to finish
          creating your account.
        </p>
        <Link href="/login" className="text-sm font-bold underline opacity-70">
          Back to log in
        </Link>
      </PixelCard>
    );
  }

  return (
    <PixelCard title="SIGN UP">
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
        <PixelField label="PASSWORD (MIN 6 CHARS)">
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

        {error ? (
          <p
            role="alert"
            className="mb-4 border-[3px] border-[var(--color-ink)] dark:border-black bg-red-100 dark:bg-red-950 p-3 text-sm font-bold"
          >
            {error}
          </p>
        ) : null}

        <PixelButton type="submit" disabled={loading} className="w-full">
          <UserPlus size={16} strokeWidth={3} aria-hidden="true" />
          {loading ? "SIGNING UP…" : "SIGN UP"}
        </PixelButton>
      </form>

      <p className="mt-5 text-center text-sm font-bold opacity-70">
        Have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </PixelCard>
  );
}
