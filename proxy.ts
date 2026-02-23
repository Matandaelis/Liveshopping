import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  // Skip Keystone/Prisma auth checks during build and initial deployment
  // The User table doesn't exist yet - this will be enabled after migrations
  
  // For now, allow all requests to pass through without auth
  // TODO: Enable auth after database schema is properly initialized
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.svg (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.svg).*)',
  ],
};
