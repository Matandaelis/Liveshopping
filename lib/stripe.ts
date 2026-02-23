import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { createUserSubscription, updateUserStats } from './subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by stripe customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user && subscription.items.data[0]) {
          const priceId = subscription.items.data[0].price.id;
          
          // Map price ID to plan - this assumes you have price IDs stored somewhere
          // For now, we'll determine based on the amount
          const amount = subscription.items.data[0].price.unit_amount || 0;
          let planTier = 'FREE';
          
          if (amount === 999) planTier = 'PRO';
          else if (amount === 1999) planTier = 'PREMIUM';

          const plan = await prisma.subscriptionPlan.findUnique({
            where: { tier: planTier },
          });

          if (plan) {
            await createUserSubscription(
              user.id,
              plan.id,
              subscription.id,
              subscription.customer as string
            );
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Cancel subscription in database
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'CANCELED' },
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Record payment transaction
        const subscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: invoice.subscription as string },
        });

        if (subscription) {
          await prisma.paymentTransaction.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency?.toUpperCase() || 'USD',
              status: 'COMPLETED',
              stripePaymentIntentId: invoice.payment_intent as string,
              stripeInvoiceId: invoice.id,
              completedAt: new Date(),
            },
          });

          // Update subscription renewal date
          if (invoice.next_payment_attempt) {
            await prisma.subscription.update({
              where: { id: subscription.id },
              data: { renewalDate: new Date(invoice.next_payment_attempt * 1000) },
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Record failed payment
        const subscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: invoice.subscription as string },
        });

        if (subscription) {
          await prisma.paymentTransaction.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency?.toUpperCase() || 'USD',
              status: 'FAILED',
              stripePaymentIntentId: invoice.payment_intent as string,
              stripeInvoiceId: invoice.id,
            },
          });
        }
        break;
      }
    }

    return { received: true };
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
}

export async function createCheckoutSession(
  userId: string,
  planTier: string,
  billingPeriod: 'MONTHLY' | 'ANNUAL'
): Promise<string> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true },
    });

    if (!user?.email) {
      throw new Error('User email not found');
    }

    // Get price from Stripe or use a mapping
    const priceMap: Record<string, string> = {
      'PRO_MONTHLY': process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      'PRO_ANNUAL': process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
      'PREMIUM_MONTHLY': process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
      'PREMIUM_ANNUAL': process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
    };

    const priceId = priceMap[`${planTier}_${billingPeriod}`];

    if (!priceId) {
      throw new Error(`Invalid plan tier or billing period: ${planTier} ${billingPeriod}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      customer_email: !user.stripeCustomerId ? user.email : undefined,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        userId,
        planTier,
        billingPeriod,
      },
    });

    return session.id;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}

export async function createPortalSession(userId: string): Promise<string> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      throw new Error('User does not have a Stripe customer ID');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/subscription`,
    });

    return session.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }
  return secret;
}
