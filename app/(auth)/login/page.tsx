"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelField } from "@/components/ui/PixelField";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "link-expired"
      ? "That email link expired or is invalid. Please try again."
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
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
      <PixelField label="PASSWORD">
        <input
          type="password"
          required
          autoComplete="current-password"
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
        <LogIn size={16} strokeWidth={3} aria-hidden="true" />
        {loading ? "LOGGING IN…" : "LOG IN"}
      </PixelButton>
    </form>
  );
}

export default function LoginPage() {
  return (
    <PixelCard title="LOG IN">
      <Suspense>
        <LoginForm />
      </Suspense>

      <div className="mt-5 flex flex-col gap-2 text-center text-sm font-bold">
        <Link href="/forgot-password" className="underline opacity-70">
          Forgot password?
        </Link>
        <p className="opacity-70">
          No account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </PixelCard>
  );
}
