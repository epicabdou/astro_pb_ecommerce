/**
 * Service for handling checkout and payment-related functionality
 */

/**
 * Creates a checkout session with Stripe
 * @param cartItems - Array of items in the cart
 * @param shippingAddress - Optional shipping address information
 * @returns The checkout session data with URL
 */
export async function createCheckoutSession(cartItems, shippingAddress = null) {
  try {
    // Call our API endpoint to create a checkout session
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems,
        shippingAddress,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Redirects the user to the Stripe checkout
 * @param cartItems - Array of items in the cart
 * @param shippingAddress - Optional shipping address information
 */
export async function redirectToCheckout(cartItems, shippingAddress = null) {
  try {
    const { url } = await createCheckoutSession(cartItems, shippingAddress);
    
    if (url) {
      // Redirect to Stripe checkout
      window.location.href = url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}

/**
 * Gets the Stripe public key from the server
 * @returns The Stripe public key and authentication status
 */
export async function getStripeConfig() {
  try {
    const response = await fetch('/api/stripe/config');
    if (!response.ok) {
      throw new Error('Failed to fetch Stripe configuration');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Stripe configuration:', error);
    throw error;
  }
}