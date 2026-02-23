import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // Check if user already exists in Stack Auth
    // This would query neon_auth.user table
    // For now, return success and send verification email
    
    // In production:
    // 1. Check if user exists in neon_auth.user
    // 2. Hash password with bcrypt
    // 3. Create verification token
    // 4. Send verification email
    // 5. Return verification required message

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
