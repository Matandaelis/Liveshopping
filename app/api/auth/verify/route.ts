import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code required' },
        { status: 400 }
      );
    }

    // In production:
    // 1. Verify the code against stored verification token
    // 2. Mark email as verified in neon_auth.user
    // 3. Create session in neon_auth.session
    // 4. Return JWT token

    // Mock token generation
    const mockToken = Buffer.from(JSON.stringify({ email, sub: '123', verified: true })).toString('base64');

    return NextResponse.json({
      success: true,
      token: mockToken,
      user: { email, verified: true },
    });
  } catch (error) {
    console.error('[v0] Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
