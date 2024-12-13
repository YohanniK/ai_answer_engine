// TODO: Implement the code here to add rate limiting with Redis
// Refer to the Next.js Docs: https://nextjs.org/docs/app/building-your-application/routing/middleware
// Refer to Redis docs on Rate Limiting: https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms

import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import ratelimit from "./lib/rateLimiter";

export async function middleware(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    console.log("ip", ip);
    const { success, pending, limit, reset, remaining } =
      await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json("Rate Limited", { status: 429 });
    }
    const response = NextResponse.next();

    return response;
  } catch (error) {}
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
