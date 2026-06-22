import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan
      if (userId) {
        const amount = plan === 'yearly' ? 199.99 : 19.99
        const charityMin = amount * 0.10
        const prizePool = amount * 0.50

        await supabase.from('profiles').update({
          subscription_status: 'active',
          subscription_plan: plan,
          subscription_id: session.subscription as string,
        }).eq('id', userId)

        await supabase.from('subscription_payments').insert({
          user_id: userId,
          stripe_payment_id: session.payment_intent as string,
          amount,
          plan: plan || 'monthly',
          charity_contribution: charityMin,
          prize_pool_contribution: prizePool,
          status: 'paid',
        })
      }
      break
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (userId) {
        const status = sub.status === 'active' ? 'active' : sub.status === 'canceled' ? 'cancelled' : 'lapsed'
        await supabase.from('profiles').update({
          subscription_status: status,
          subscription_end_date: (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000).toISOString() : null,
        }).eq('id', userId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
