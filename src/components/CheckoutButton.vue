<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import { cartItems } from '../stores/cartStore';
import { redirectToCheckout } from '../lib/checkoutService';
import { pb, isAuthenticated } from '../lib/pocketbase';
import AuthGuard from './AuthGuard.vue';

// Props
const props = defineProps({
  fullWidth: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  }
});

// State
const $cartItems = useStore(cartItems);
const loading = ref(false);
const error = ref('');
const loggedIn = ref(isAuthenticated());

// Methods
const handleCheckout = async () => {
  error.value = '';

  // Auth check temporarily removed

  if ($cartItems.value.length === 0) {
    error.value = 'Your cart is empty';
    return;
  }

  try {
    loading.value = true;
    
    // Navigate to the checkout page
    window.location.href = '/checkout';
  } catch (err) {
    console.error('Checkout error:', err);
    error.value = err.message || 'An error occurred during checkout';
  } finally {
    loading.value = false;
  }
};

// Listen for auth changes
onMounted(() => {
  // Set the initial value
  loggedIn.value = pb.authStore.isValid;
  
  // Add a listener to update the value when auth state changes
  pb.authStore.onChange(() => {
    loggedIn.value = pb.authStore.isValid;
  });
});
</script>

<template>
  <div>
    <button
      @click="handleCheckout"
      :class="[
        'btn btn-primary',
        fullWidth ? 'w-full' : '',
        `btn-${size}`,
        loading ? 'loading' : ''
      ]"
      :disabled="loading"
    >
      <span v-if="!loading">
        <slot>
          Checkout
        </slot>
      </span>
    </button>

    <div v-if="error" class="text-error text-sm mt-2">
      {{ error }}
    </div>
  </div>
</template>