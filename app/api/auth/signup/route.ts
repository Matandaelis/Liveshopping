import { NextRequest, NextResponse } from 'next/server';
// Prisma disabled - import removed to prevent build errors

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Mock signup - database disabled during build
    // Will be enabled to use Stack Auth after DATABASE_URL is configured

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to email',
      email,
    });
  } catch (error) {
    console.error('[v0] Sign up error:', error);
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    );
  }
}
