import Stripe from 'stripe';

// Get API keys from environment variables
const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key';
const STRIPE_PUBLIC_KEY = import.meta.env.STRIPE_PUBLIC_KEY || 'your_stripe_public_key';
const SITE_URL = import.meta.env.SITE_URL || 'http://localhost:4321';
const CURRENCY = 'usd';
const MODE = 'payment';
const SUCCESS_URL = `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
const CANCEL_URL = `${SITE_URL}/checkout/cancel`;

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest API version
});

export { stripe, STRIPE_PUBLIC_KEY, CURRENCY, MODE, SUCCESS_URL, CANCEL_URL };