import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/habits",
  "/tasks",
  "/calendar",
  "/progress",
  "/settings",
  "/achievements",
];

const GUEST_ONLY = ["/login", "/signup", "/forgot-password"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Never crash middleware: if Supabase env vars are missing (e.g. not yet
  // set on Vercel), let the request through instead of throwing a 500.
  let env: { url: string; key: string };
  try {
    env = getSupabaseEnv();
  } catch {
    return supabaseResponse;
  }

  const { url, key } = env;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && GUEST_ONLY.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // /reset-password needs a session (user arrives via the recovery email link).
  if (!user && pathname === "/reset-password") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
