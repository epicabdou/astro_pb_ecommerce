<!-- src/components/MiniCart.vue -->
<script setup>
import { useStore } from '@nanostores/vue';
import { cartItems, cartTotal, removeFromCart } from '../stores/cartStore';

const $cartItems = useStore(cartItems);
const $cartTotal = useStore(cartTotal);

// Format price as currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Get image URL with a fallback
const getImageUrl = (item) => {
  return item.image
      ? `http://127.0.0.1:8090/api/files/products/${item.id}/${item.image}`
      : '/placeholder.png';
};

// Remove item from cart
const handleRemoveItem = (itemId) => {
  removeFromCart(itemId);
};
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <div class="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span v-if="$cartItems.length > 0" class="badge badge-sm badge-primary indicator-item">{{ $cartItems.length }}</span>
      </div>
    </div>

    <div tabindex="0" class="mt-3 z-[1] card card-compact dropdown-content w-80 bg-base-100 shadow-xl">
      <div class="card-body">
        <div v-if="$cartItems.length === 0" class="flex flex-col items-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-base-content/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-sm text-center">Your cart is empty</p>
        </div>

        <div v-else>
          <span class="font-bold text-lg">{{ $cartItems.length }} {{ $cartItems.length === 1 ? 'Item' : 'Items' }}</span>
          <span class="text-info">{{ formatPrice($cartTotal) }}</span>

          <div class="max-h-60 overflow-y-auto pr-2 my-2 -mr-2">
            <div v-for="item in $cartItems" :key="item.id" class="flex items-center gap-2 mb-2 border-b pb-2">
              <img :src="getImageUrl(item)" :alt="item.name" class="h-12 w-12 object-cover rounded" />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm truncate">{{ item.name }}</p>
                <p class="text-xs text-base-content/70">{{ item.quantity }} × {{ formatPrice(item.price) }}</p>
              </div>
              <button
                  @click="handleRemoveItem(item.id)"
                  class="btn btn-circle btn-xs btn-ghost text-error"
                  title="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="divider my-1"></div>

          <div class="flex justify-between font-bold mb-2">
            <span>Subtotal:</span>
            <span>{{ formatPrice($cartTotal) }}</span>
          </div>

          <div class="card-actions">
            <a href="/cart" class="btn btn-primary btn-block">View Cart</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>