import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature') || '';
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[v0] Subscription updated:', subscription.id);
        // TODO: Update user subscription status in database
        break;

      case 'customer.subscription.deleted':
        const canceledSub = event.data.object as Stripe.Subscription;
        console.log('[v0] Subscription canceled:', canceledSub.id);
        // TODO: Mark subscription as inactive in database
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[v0] Payment succeeded:', invoice.id);
        // TODO: Update invoice status in database
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('[v0] Payment failed:', failedInvoice.id);
        // TODO: Notify user of failed payment
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[v0] Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
