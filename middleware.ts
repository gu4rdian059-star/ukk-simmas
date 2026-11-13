import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let role: string | null = null;
  let isAuthenticated = false;

  // 1. Check Supabase Auth session via cookies
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://rqdoeuuzschrwzmwslcq.supabase.co";
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      isAuthenticated = true;
      role =
        (user.app_metadata?.role as string) ||
        (user.email?.includes("admin")
          ? "admin"
          : user.email?.includes("guru")
          ? "guru"
          : "siswa");
    }
  } catch {
    // Supabase check failed, fall through to demo session
  }

  // 2. Check Demo session cookie
  if (!isAuthenticated) {
    const demoCookie = request.cookies.get("simmas_demo_session");
    if (demoCookie?.value) {
      try {
        const parsed = JSON.parse(demoCookie.value);
        if (parsed?.role) {
          isAuthenticated = true;
          role = parsed.role;
        }
      } catch {
        // invalid cookie
      }
    }
  }

  // 3. Route Protection & Redirects
  const isAdminRoute = pathname.startsWith("/admin");
  const isGuruRoute = pathname.startsWith("/guru");
  const isSiswaRoute = pathname.startsWith("/siswa");
  const isProtected = isAdminRoute || isGuruRoute || isSiswaRoute;

  // If not authenticated and trying to access protected route -> Redirect to /login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and visiting /login -> Redirect to role dashboard
  if (pathname === "/login" && isAuthenticated && role) {
    const target =
      role === "admin"
        ? "/admin/dashboard"
        : role === "guru"
        ? "/guru/dashboard"
        : "/siswa/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Role-Based Access Control (RBAC) enforcement
  if (isAuthenticated && role) {
    if (isAdminRoute && role !== "admin") {
      const redirectPath =
        role === "guru" ? "/guru/dashboard" : "/siswa/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    if (isGuruRoute && role !== "guru") {
      const redirectPath =
        role === "admin" ? "/admin/dashboard" : "/siswa/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    if (isSiswaRoute && role !== "siswa") {
      const redirectPath =
        role === "admin" ? "/admin/dashboard" : "/guru/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/guru/:path*",
    "/siswa/:path*",
    "/login",
  ],
};

