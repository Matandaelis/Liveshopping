import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const portalUrl = await createPortalSession(userId);

    return NextResponse.json({ portalUrl });
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
