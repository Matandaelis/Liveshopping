import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Query Stack Auth user table
    // Note: In production, you would use proper password hashing verification
    // This is a simplified example - use bcrypt or similar in production
    
    // For now, return mock token (will be replaced with real auth)
    const mockToken = Buffer.from(JSON.stringify({ email, sub: '123' })).toString('base64');

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
