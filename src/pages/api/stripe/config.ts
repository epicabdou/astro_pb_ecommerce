import type { APIRoute } from 'astro';
import { STRIPE_PUBLIC_KEY } from '../../../lib/stripe';
import { isAuthenticated } from '../../../lib/pocketbase';

export const GET: APIRoute = async () => {
  // Check if user is authenticated
  const isLoggedIn = isAuthenticated();

  return new Response(
    JSON.stringify({
      publicKey: STRIPE_PUBLIC_KEY,
      isLoggedIn
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};