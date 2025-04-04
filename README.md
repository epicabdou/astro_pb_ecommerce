# AjiMall E-Commerce Website

A modern e-commerce website built with Astro, Vue, and PocketBase.

## Features

- Product catalog with categories and tags
- Shopping cart functionality
- User authentication
- Order management
- Stripe payment integration
- Responsive design with TailwindCSS and DaisyUI

## Getting Started

1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Copy the environment variables template
```bash
cp .env.example .env
```

4. Update the `.env` file with your Stripe API keys:
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

5. Start the PocketBase server
```bash
cd backend
./pocketbase serve
```

6. In a new terminal, start the Astro development server
```bash
npm run dev
```

7. For testing Stripe webhooks locally, install the Stripe CLI and run:
```bash
stripe listen --forward-to http://localhost:4321/api/stripe/webhook
```

## Deployment

To build the project for production:

```bash
npm run build
```

## Technologies Used

- [Astro](https://astro.build/)
- [Vue.js](https://vuejs.org/)
- [PocketBase](https://pocketbase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Stripe](https://stripe.com/)
- [NanoStores](https://github.com/nanostores/nanostores)