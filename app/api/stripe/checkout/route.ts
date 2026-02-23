import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { planName, billingCycle, userId, email } = await request.json();

    if (!planName || !billingCycle || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Map plan names to Stripe price IDs
    const priceMap: Record<string, string> = {
      'pro-monthly': 'price_pro_monthly',
      'pro-annual': 'price_pro_annual',
      'premium-monthly': 'price_premium_monthly',
      'premium-annual': 'price_premium_annual',
    };

    const priceId = priceMap[`${planName.toLowerCase()}-${billingCycle}`];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan or billing cycle' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      customer_email: email,
      metadata: {
        userId,
        planName,
        billingCycle,
      },
      // Trial period for new customers
      subscription_data: {
        trial_period_days: 14,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[v0] Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
