import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Renamed from `middleware` to `proxy` per Next.js 16 convention.
// Keeps the Supabase auth session cookie fresh on every request.
// Admin authorization itself is enforced server-side in the (admin) layout
// and re-checked inside every server action — never trusted here.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm|ico|css|js|json|html|txt|xml|pdf|woff|woff2)).*)",
  ],
};
