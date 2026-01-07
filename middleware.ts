import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type ProfileRow = {
  role: "builder" | "mentor" | "admin" | null;
  is_suspended?: boolean | null;
};

const publicRoutes = [
  "/", // marketing homepage
  "/events", // MVP: public events listing
  "/login",
  "/signup",
  "/auth/callback",
  "/suspended",
  "/sentry-example-page",
];

const authRoutes = ["/login", "/signup", "/reset-password", "/update-password", "/verification-pending"];

const isAssetOrApi = (path: string) =>
  path.startsWith("/_next") ||
  path.startsWith("/favicon") ||
  path.startsWith("/images") ||
  (path.startsWith("/api/") && !path.startsWith("/api/auth")) ||
  path.includes(".");

const safeReturnUrl = (value: string | null): string | null => {
  if (!value) return null;
  if (value.includes("://") || value.startsWith("//")) return null;
  if (!value.startsWith("/")) return null;
  return value;
};

// Only protect what you truly need protected in MVP.
// You can add more later (e.g., /builder-card, /account, etc.)
const needsAdminAccess = (path: string) => path.startsWith("/admin/");

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const res = NextResponse.next();

  if (isAssetOrApi(path)) return res;

  const returnUrl = safeReturnUrl(req.nextUrl.searchParams.get("returnUrl"));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env isn't set, don't hard-block public/auth routes
  if (!supabaseUrl || !supabaseAnonKey) {
    if (publicRoutes.includes(path) || authRoutes.includes(path)) return res;

    // If route is protected but env missing, send to login
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("returnUrl", encodeURIComponent(path));
    return NextResponse.redirect(redirectUrl);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createServerClient<any>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    // Allow public + auth routes
    if (publicRoutes.includes(path) || authRoutes.includes(path)) return res;

    // Only redirect to login for protected routes
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("returnUrl", encodeURIComponent(path));
    return NextResponse.redirect(redirectUrl);
  }

  // Logged in — only check profile for suspended/admin gating
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_suspended")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Middleware profile query error:", profileError);
  }

  if (profile?.is_suspended && path !== "/suspended") {
    return NextResponse.redirect(new URL("/suspended", req.url));
  }

  const isAdmin = profile?.role === "admin";

  // Admin routes require admin
  if (needsAdminAccess(path) && !isAdmin) {
    return NextResponse.redirect(new URL("/events", req.url));
  }

  // If user hits /login or /signup while already authed, send them to /events
  if (authRoutes.includes(path)) {
    // Respect returnUrl if present and safe
    if (returnUrl) return NextResponse.redirect(new URL(returnUrl, req.url));
    return NextResponse.redirect(new URL("/events", req.url));
  }

  // Otherwise allow (including / - homepage remains public for marketing)
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
