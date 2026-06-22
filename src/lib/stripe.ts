import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      apiVersion: '2026-05-27.dahlia',
    })
  }
  return _stripe
}

export const stripe = {
  get checkout() { return getStripe().checkout },
  get webhooks() { return getStripe().webhooks },
  get subscriptions() { return getStripe().subscriptions },
}

export const PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    amount: 1999, // £19.99/month in pence
    label: 'Monthly',
    interval: 'month' as const,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    amount: 19999, // £199.99/year in pence
    label: 'Yearly',
    interval: 'year' as const,
  },
}

// Prize pool allocation from each subscription
export function calculatePoolContributions(amountPence: number) {
  const amount = amountPence / 100
  const charityMin = amount * 0.10      // 10% minimum to charity
  const prizePool = amount * 0.50       // 50% to prize pool
  const platform = amount - charityMin - prizePool
  return { charityMin, prizePool, platform }
}
