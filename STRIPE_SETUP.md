# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for your AjiMall e-commerce site.

## Prerequisites

1. A Stripe account (create one at [stripe.com](https://stripe.com) if you don't have one)
2. The Stripe CLI installed (optional, but helpful for testing webhooks)

## Setup Steps

### 1. Get Your API Keys

1. Log in to your Stripe Dashboard at [dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to Developers > API keys
3. Copy your "Publishable key" (starts with `pk_test_` in test mode)
4. Copy your "Secret key" (starts with `sk_test_` in test mode)

### 2. Set Up Environment Variables

1. Create a `.env` file in your project root (or copy from `.env.example`)
2. Add your Stripe API keys:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLIC_KEY=pk_test_your_publishable_key
SITE_URL=http://localhost:4321
```

### 3. Test Webhook Setup (Optional but Recommended)

Webhooks allow Stripe to notify your application when events happen in your account, such as successful payments.

1. Install the Stripe CLI following [Stripe's installation instructions](https://stripe.com/docs/stripe-cli#install)
2. Login to your Stripe account from the CLI:
   ```
   stripe login
   ```
3. Start forwarding webhooks to your local server:
   ```
   stripe listen --forward-to http://localhost:4321/api/stripe/webhook
   ```
4. The command will output a webhook signing secret. Copy this and add it to your `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
   ```

### 4. Start Your Application

```
npm run dev
```

### 5. Test the Payment Flow

1. Add items to your cart
2. Go to checkout
3. Enter shipping information
4. Complete payment with a test card (use `4242 4242 4242 4242` with any future expiration date and any CVC)

## Test Cards

Use these card numbers to test different payment scenarios:

- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

For more test cards, visit [Stripe's testing documentation](https://stripe.com/docs/testing#cards).

## Going Live

When you're ready to go live:

1. Switch to your live API keys in the Stripe Dashboard
2. Update your `.env` file with the live keys
3. Set up production webhooks in the Stripe Dashboard