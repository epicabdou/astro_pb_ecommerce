<!-- src/components/CartSummary.vue -->
<script setup>
import { computed } from "vue";
import { useStore } from '@nanostores/vue';
import { cartItems, cartTotal, clearCart } from '../stores/cartStore';

const $cartItems = useStore(cartItems);
const $cartTotal = useStore(cartTotal);

// Format price as currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Compute shipping cost (free over $50)
const shippingCost = computed(() => {
  return $cartTotal.value >= 50 ? 0 : 5.99;
});

// Compute tax (8.5%)
const taxAmount = computed(() => {
  return $cartTotal.value * 0.085;
});

// Compute order total
const orderTotal = computed(() => {
  return $cartTotal.value + shippingCost.value + taxAmount.value;
});

// Handle clear cart
const handleClearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    clearCart();
  }
};
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title text-lg">Order Summary</h2>

      <!-- Item count -->
      <div class="text-sm mb-6">
        {{ $cartItems.length === 0 ? 'No items' : `${$cartItems.length} ${$cartItems.length === 1 ? 'item' : 'items'}` }}
      </div>

      <!-- Cost breakdown -->
      <div class="space-y-3">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ formatPrice($cartTotal) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Shipping</span>
          <span v-if="shippingCost === 0" class="text-success">Free</span>
          <span v-else>{{ formatPrice(shippingCost) }}</span>
        </div>

        <div v-if="$cartTotal >= 50" class="text-xs text-success">
          ✓ Free shipping on orders over $50
        </div>
        <div v-else class="text-xs">
          Add {{ formatPrice(50 - $cartTotal) }} more for free shipping
        </div>

        <div class="flex justify-between">
          <span>Tax (8.5%)</span>
          <span>{{ formatPrice(taxAmount) }}</span>
        </div>

        <div class="divider my-1"></div>

        <div class="flex justify-between font-bold">
          <span>Total</span>
          <span>{{ formatPrice(orderTotal) }}</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="card-actions mt-6">
        <button
            class="btn btn-primary w-full"
            :disabled="$cartItems.length === 0"
        >
          Proceed to Checkout
        </button>

        <button
            v-if="$cartItems.length > 0"
            @click="handleClearCart"
            class="btn btn-ghost btn-sm w-full mt-2"
        >
          Clear Cart
        </button>
      </div>
    </div>
  </div>
</template>