import type { APIRoute } from 'astro';
import { stripe, CURRENCY, MODE, SUCCESS_URL, CANCEL_URL } from '../../../lib/stripe';
import { pb, isAuthenticated, updateUser } from '../../../lib/pocketbase';

export const POST: APIRoute = async ({ request }) => {
  // Verify that the user is authenticated
  if (!isAuthenticated()) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'You must be logged in to checkout',
        },
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    // Get the cart items from the request
    const { cartItems, shippingAddress } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({
          error: {
            message: 'Cart is empty or invalid',
          },
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get the user ID for metadata
    const userId = pb.authStore.model?.id;

    // Format the items for Stripe
    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: item.name,
            description: item.description || '',
            images: item.image ? [item.image] : [],
            metadata: {
              productId: item.id,
            },
          },
          unit_amount: Math.round((item.promoPrice || item.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Calculate order total
    const orderTotal = cartItems.reduce(
      (total, item) => total + (item.promoPrice || item.price) * item.quantity,
      0
    );

    // Create metadata for shipping and order details
    const metadata = {
      userId,
      orderItems: JSON.stringify(
        cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.promoPrice || item.price,
          quantity: item.quantity,
        }))
      ),
      orderTotal: orderTotal.toFixed(2),
    };

    // Add shipping address if available
    if (shippingAddress) {
      metadata.shippingAddress = JSON.stringify(shippingAddress);
    }

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: MODE,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      metadata,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'FR'], // Add countries as needed
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500, // $5.00 in cents
              currency: CURRENCY,
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15.00 in cents
              currency: CURRENCY,
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 2,
              },
            },
          },
        },
      ],
    });

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: 'Failed to create checkout session',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};