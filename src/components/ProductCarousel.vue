<!-- src/components/ProductCarousel.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from './ProductCard.vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Featured Products'
  },
  description: {
    type: String,
    default: ''
  },
  products: {
    type: Object,
    required: true
  },
  viewAllLink: {
    type: String,
    default: '/products'
  }
});

const swiperContainer = ref(null);
const swiper = ref(null);

onMounted(() => {
  // Initialize Swiper with responsive breakpoints
  swiper.value = new Swiper(swiperContainer.value, {
    modules: [Navigation, Pagination],
    slidesPerView: 1.2,
    spaceBetween: 16,
    navigation: true,
    pagination: {
      clickable: true
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      }
    }
  });
});

// Extract product items from the pocketbase response
const productItems = props.products.items || [];
</script>

<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl md:text-3xl font-bold">{{ title }}</h2>
          <p v-if="description" class="text-base-content/70 mt-2">{{ description }}</p>
        </div>
        <a :href="viewAllLink" class="btn btn-outline btn-sm">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </a>
      </div>

      <div v-if="productItems.length === 0" class="text-center py-12">
        <p class="text-base-content/70">No products available at the moment.</p>
      </div>

      <div v-else ref="swiperContainer" class="swiper">
        <div class="swiper-wrapper">
          <div v-for="product in productItems" :key="product.id" class="swiper-slide h-auto">
            <ProductCard :product="product" />
          </div>
        </div>
        <!--div class="swiper-pagination"></div-->
        <!--div class="swiper-button-next"></div-->
        <!--div class="swiper-button-prev"></div-->
      </div>
    </div>
  </section>
</template>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: var(--primary);
  background: var(--base-100);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-button-disabled {
  opacity: 0.5;
}
</style>