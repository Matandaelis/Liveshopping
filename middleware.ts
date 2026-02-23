import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For now, allow all public routes and API access
  // Bypass Keystone authentication for getting the app running
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico).*)",
  ],
};
