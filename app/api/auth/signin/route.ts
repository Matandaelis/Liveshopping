import { NextRequest, NextResponse } from 'next/server';
// Prisma disabled - import removed to prevent build errors

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Mock authentication - database disabled during build
    // Will be enabled to use Stack Auth after DATABASE_URL is configured
    
    const mockToken = Buffer.from(JSON.stringify({ email, sub: 'user-' + Date.now() })).toString('base64');

    return NextResponse.json({
      success: true,
      token: mockToken,
      user: { email },
    });
  } catch (error) {
    console.error('[v0] Sign in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
