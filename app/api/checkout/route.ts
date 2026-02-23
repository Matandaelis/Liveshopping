import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { userId, planTier, billingPeriod } = await req.json();

    if (!userId || !planTier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sessionId = await createCheckoutSession(
      userId,
      planTier,
      billingPeriod || 'MONTHLY'
    );

    return NextResponse.json({ sessionId });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
