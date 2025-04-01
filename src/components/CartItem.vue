<!-- src/components/CartItem.vue -->
<script setup>
import { ref, computed } from 'vue';
import { updateCartItemQuantity, removeFromCart } from '../stores/cartStore';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  baseUrl: {
    type: String,
    default: 'http://127.0.0.1:8090'
  }
});

const quantity = ref(props.item.quantity);

// Compute item subtotal
const subtotal = computed(() => {
  return props.item.price * quantity.value;
});

// Format price as currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Get image URL with a fallback
const imageUrl = computed(() => {
  return props.item.image
      ? `${props.baseUrl}/api/files/products/${props.item.id}/${props.item.image}`
      : '/placeholder.png';
});

// Update quantity when input changes
const updateQuantity = (e) => {
  const newQuantity = parseInt(e.target.value);
  if (newQuantity > 0) {
    quantity.value = newQuantity;
    updateCartItemQuantity(props.item.id, newQuantity);
  }
};

// Increment quantity
const increment = () => {
  quantity.value += 1;
  updateCartItemQuantity(props.item.id, quantity.value);
};

// Decrement quantity
const decrement = () => {
  if (quantity.value > 1) {
    quantity.value -= 1;
    updateCartItemQuantity(props.item.id, quantity.value);
  }
};

// Remove item from cart
const removeItem = () => {
  removeFromCart(props.item.id);
};
</script>

<template>
  <div class="card card-side bg-base-100 shadow-sm mb-4 relative">
    <!-- Remove button (absolute positioned) -->
    <button
        @click="removeItem"
        class="btn btn-circle btn-sm btn-error absolute -top-2 -right-2 z-10"
        title="Remove item"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Product image -->
    <figure class="w-24 h-24 p-2">
      <img :src="imageUrl" :alt="item.name" class="object-cover h-full w-full rounded-lg" />
    </figure>

    <!-- Product details -->
    <div class="card-body p-4">
      <div class="flex flex-col sm:flex-row gap-2 justify-between">
        <!-- Product name and price -->
        <div class="flex-1">
          <a :href="`/products/${item.slug}`" class="card-title text-base link-hover">{{ item.name }}</a>
          <p class="text-sm font-semibold">{{ formatPrice(item.price) }}</p>
        </div>

        <!-- Quantity controls -->
        <div class="flex items-center">
          <div class="join">
            <button @click="decrement" class="btn join-item btn-xs btn-outline" :disabled="quantity <= 1">-</button>
            <input
                v-model="quantity"
                @change="updateQuantity"
                type="number"
                min="1"
                class="join-item input input-xs input-bordered w-12 text-center"
            />
            <button @click="increment" class="btn join-item btn-xs btn-outline">+</button>
          </div>
        </div>

        <!-- Subtotal -->
        <div class="text-right min-w-24">
          <p class="text-sm opacity-70">Subtotal</p>
          <p class="font-bold">{{ formatPrice(subtotal) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>