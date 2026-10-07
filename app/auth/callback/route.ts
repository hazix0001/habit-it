import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Handles email-link flows: signup confirmation + password recovery.
 * Supabase redirects here with ?code=..., we exchange it for a session,
 * then send the user to ?next=... (defaults to /dashboard).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabaseResponse = NextResponse.redirect(`${origin}${next}`);
      const { url, key } = getSupabaseEnv();
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return supabaseResponse;
    } catch {
      // Misconfigured server (e.g. missing env vars) — fall through to login.
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link-expired`);
}
