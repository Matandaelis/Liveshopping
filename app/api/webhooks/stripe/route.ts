import { headers } from 'next/headers';
import Stripe from 'stripe';
import { handleStripeWebhook, getStripeWebhookSecret } from '@/lib/stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret()
    );

    await handleStripeWebhook(event);

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
}
