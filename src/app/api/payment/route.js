import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(
  'sk_test_51Q2x5FE3fJXwSucflCkSPvPZDc7TtzhkLZOiEjkhRmAtcbBW8TkYgekxf6VzUO8VROVRRWUKnsBgN506r0LG85Dn00kA9l4bFn'
);

export async function POST(req) {
  try {
    const { amount } = await req.json(); // Receive the amount from the request

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
