<!-- src/components/AddToCartButton.vue -->
<script setup>
import { ref } from 'vue';
import { addToCart } from '../stores/cartStore';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showQuantity: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    default: 'Add to Cart'
  },
  buttonClass: {
    type: String,
    default: 'btn-primary'
  },
  size: {
    type: String,
    default: '' // '', 'btn-sm', 'btn-lg'
  }
});

const localQuantity = ref(props.quantity);
const isAdding = ref(false);

const handleAddToCart = () => {
  isAdding.value = true;

  // Add product to cart with current quantity
  addToCart(props.product, localQuantity.value);

  // Show success animation
  setTimeout(() => {
    isAdding.value = false;
  }, 600);
};

const increment = () => {
  if (props.product.stock) {
    localQuantity.value = Math.min(localQuantity.value + 1, props.product.stock);
  } else {
    localQuantity.value += 1;
  }
};

const decrement = () => {
  if (localQuantity.value > 1) {
    localQuantity.value -= 1;
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Quantity selector -->
    <div v-if="showQuantity" class="join">
      <button
          @click="decrement"
          class="btn join-item btn-square btn-sm"
          type="button"
          :disabled="disabled || localQuantity <= 1"
      >-</button>
      <input
          v-model="localQuantity"
          class="join-item input input-bordered input-sm w-14 text-center"
          type="number"
          :min="1"
          :max="product.stock || undefined"
          :disabled="disabled"
      />
      <button
          @click="increment"
          class="btn join-item btn-square btn-sm"
          type="button"
          :disabled="disabled || (product.stock && localQuantity >= product.stock)"
      >+</button>
    </div>

    <!-- Add to cart button -->
    <button
        @click="handleAddToCart"
        :class="['btn', buttonClass, size, { 'loading': isAdding }]"
        :disabled="disabled || (product.stock !== undefined && product.stock === 0)"
    >
      <svg v-if="!isAdding" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {{ buttonText }}
    </button>
  </div>
</template>