import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // Buat Supabase client
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Semak status user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Senarai halaman yang perlukan login
  const protectedRoutes = ["/dashboard", "/sejarah", "/kursus"];

  // Kalau user tak log masuk & cuba buka protected route
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Tentukan halaman yang akan trigger middleware ini
export const config = {
  matcher: ["/dashboard/:path*", "/sejarah/:path*", "/kursus/:path*"],
};
