<script setup>
import { ref, computed } from 'vue';
import { addToCart } from '../stores/cartStore';

// Define props for the component
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  baseUrl: {
    type: String,
    default: 'http://127.0.0.1:8090'
  }
});

// Animation state
const isAddingToCart = ref(false);

// Compute image URL with a fallback
const imageUrl = computed(() => {
  return props.product.image
      ? `${props.baseUrl}/api/files/products/${props.product.id}/${props.product.image}`
      : '/placeholder.png';
});

// Sanitize description text to avoid hydration mismatches
// This will escape backslashes that can cause hydration issues
const sanitizeText = (text) => {
  if (!text) return '';
  // Replace problematic escape sequences that might cause hydration issues
  return text.replace(/\\/g, '\\\\');
};

// Format price display
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Handle add to cart with animation
const handleAddToCart = (event) => {
  event.preventDefault();
  event.stopPropagation();

  isAddingToCart.value = true;

  addToCart(props.product, 1);

  setTimeout(() => {
    isAddingToCart.value = false;
  }, 600);
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl h-full hover:shadow-2xl transition-shadow duration-300">
    <!-- Product Image -->
    <figure class="px-4 pt-4 relative">
      <img
          :src="imageUrl"
          :alt="product.name"
          class="rounded-xl h-48 w-full object-cover"
      />

      <!-- Badge for featured products -->
      <div v-if="product.isFeatured" class="absolute top-6 right-6">
        <div class="badge badge-secondary">Featured</div>
      </div>

      <!-- Badge for promotional price -->
      <div v-if="product.promoPrice" class="absolute top-6 left-6">
        <div class="badge badge-accent">Sale</div>
      </div>
    </figure>

    <div class="card-body p-4">
      <!-- Product Category -->
      <div v-if="product.expand?.category?.length" class="flex flex-wrap gap-1 mb-1">
        <div
            v-for="cat in product.expand.category"
            :key="cat.id"
            class="badge badge-outline badge-sm"
        >
          {{ cat.name }}
        </div>
      </div>

      <!-- Product Name -->
      <h2 class="card-title text-lg">{{ product.name }}</h2>

      <!-- Product Description -->
      <p class="text-sm line-clamp-2 text-base-content/70" v-html="sanitizeText(product.shortDescription)"></p>

      <div class="mt-auto pt-2">
        <!-- Price Display -->
        <div class="flex items-baseline justify-between">
          <div class="flex items-baseline gap-2">
            <span v-if="product.promoPrice" class="text-lg font-bold">
              {{ formatPrice(product.promoPrice) }}
            </span>
            <span
                :class="product.promoPrice ? 'text-sm line-through opacity-70' : 'text-lg font-bold'"
            >
              {{ formatPrice(product.price) }}
            </span>
          </div>

          <!-- Stock Status -->
          <span
              :class="`badge ${product.stock === 0 ? 'badge-error' : 'badge-success'}`"
          >
            {{ product.stock === 0 ? 'Out of stock' : 'In stock' }}
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions justify-end mt-3">
          <a
              :href="`/products/${product.slug}`"
              class="btn btn-sm btn-outline"
          >
            View Details
          </a>
          <button
              @click="handleAddToCart"
              class="btn btn-sm btn-primary"
              :class="{ 'loading': isAddingToCart }"
              :disabled="product.stock === 0"
          >
            <svg v-if="!isAddingToCart" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>