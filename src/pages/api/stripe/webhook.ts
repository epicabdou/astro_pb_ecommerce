import type { APIRoute } from 'astro';
import { stripe } from '../../../lib/stripe';
import { pb, createOrder } from '../../../lib/pocketbase';

// Get the webhook secret from environment variables
const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET || 'your_webhook_secret_key';

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err instanceof Error ? err.message : err);
    return new Response(
      JSON.stringify({
        error: {
          message: 'Webhook signature verification failed',
        },
      }),
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment Intent succeeded:', paymentIntent.id);
      break;
      
    // Add other event types as needed
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};

async function handleCheckoutSessionCompleted(session: any) {
  try {
    // Get metadata from the session
    const metadata = session.metadata;
    const userId = metadata.userId;
    const orderItems = JSON.parse(metadata.orderItems || '[]');
    const shippingAddress = metadata.shippingAddress ? JSON.parse(metadata.shippingAddress) : null;
    
    // Get shipping details from the session
    const shipping = session.shipping_details || {};
    
    // Get payment info
    const paymentInfo = {
      stripePaymentId: session.payment_intent,
      amount: session.amount_total / 100, // Convert from cents
      currency: session.currency,
      paymentMethod: session.payment_method_types?.[0] || 'card',
      status: 'completed'
    };
    
    // Create shipping address if not already provided
    const finalShippingAddress = shippingAddress || {
      name: shipping.name,
      line1: shipping.address?.line1,
      line2: shipping.address?.line2 || '',
      city: shipping.address?.city,
      state: shipping.address?.state,
      postalCode: shipping.address?.postal_code,
      country: shipping.address?.country,
      phone: shipping.phone || ''
    };
    
    // Create order data
    const orderData = {
      user: userId,
      status: 'pending',
      total: paymentInfo.amount,
      paymentId: session.id,
      paymentStatus: 'paid',
      shippingMethod: session.shipping_cost?.display_name || 'Standard Shipping',
      shippingCost: (session.shipping_cost?.amount || 0) / 100, // Convert from cents
    };
    
    // Create payment record in PocketBase
    const payment = await pb.collection('payments').create({
      stripePaymentId: paymentInfo.stripePaymentId,
      amount: paymentInfo.amount,
      currency: paymentInfo.currency,
      method: paymentInfo.paymentMethod,
      status: paymentInfo.status,
    });
    
    // Update the order data with the payment ID
    orderData.paymentId = payment.id;
    
    // Format order items
    const formattedOrderItems = orderItems.map(item => ({
      product: item.id,
      quantity: item.quantity,
      price: item.price,
    }));
    
    // Create the order in PocketBase
    const order = await createOrder(orderData, formattedOrderItems, finalShippingAddress);
    
    console.log('Order created successfully:', order.id);
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
}