import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isClerkConfigured } from "@/lib/clerk-env";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const clerkIntlMiddleware = clerkMiddleware(async (_auth, req) => intlMiddleware(req));

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) {
    return intlMiddleware(req);
  }

  return clerkIntlMiddleware(req, event);
}

export const config = {
  matcher: [
    // Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Internationalized pathnames
    "/(vi|en)/:path*"
  ],
};
