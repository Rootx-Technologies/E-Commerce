import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

export async function createPaymentIntent(
  amount: number,
  currency = "pkr",
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to smallest unit
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

export async function retrievePaymentIntent(
  id: string
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(id);
}
