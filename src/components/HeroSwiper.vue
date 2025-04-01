<!-- src/components/HeroSwiper.vue -->
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const props = defineProps({
  slides: {
    type: Array,
    default: () => [],
  }
});

const swiperContainer = ref(null);
const swiper = ref(null);

onMounted(() => {
  // Initialize Swiper
  swiper.value = new Swiper(swiperContainer.value, {
    modules: [Navigation, Pagination, Autoplay, EffectFade],
    slidesPerView: 1,
    navigation: true,
    pagination: {
      clickable: true
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    loop: true
  });
});
</script>

<template>
  <div class="relative">
    <div ref="swiperContainer" class="swiper w-full h-[600px]">
      <div class="swiper-wrapper">
        <div v-for="(slide, index) in slides" :key="index" class="swiper-slide">
          <div class="relative w-full h-full">
            <img :src="slide.imageUrl" :alt="slide.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div class="container mx-auto px-6 md:px-12">
                <div class="max-w-xl text-white">
                  <h2 class="text-2xl md:text-4xl font-bold mb-4">{{ slide.title }}</h2>
                  <p class="mb-8 text-lg opacity-90">{{ slide.description }}</p>
                  <a :href="slide.buttonLink" class="btn btn-primary btn-lg">{{ slide.buttonText }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--div class="swiper-pagination"></div-->
      <!--div class="swiper-button-prev"></div-->
      <!--div class="swiper-button-next"></div-->
    </div>
  </div>
</template>

<style scoped>
.swiper-button-next,
.swiper-button-prev {
  color: white;
  background: rgba(0, 0, 0, 0.3);
  padding: 2rem;
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-pagination-bullet {
  background: white;
  opacity: 0.5;
}

.swiper-pagination-bullet-active {
  opacity: 1;
}
</style>