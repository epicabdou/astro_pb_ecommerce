<!-- src/components/Testimonials.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
  testimonials: {
    type: Array,
    required: true
  }
});

const swiperContainer = ref(null);
const swiper = ref(null);

onMounted(() => {
  // Initialize Swiper
  swiper.value = new Swiper(swiperContainer.value, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 32,
    navigation: true,
    pagination: {
      clickable: true
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    }
  });
});
</script>

<template>
  <section class="bg-base-200 py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <p class="max-w-2xl mx-auto text-base-content/70">
          Don't just take our word for it - hear from some of our satisfied customers!
        </p>
      </div>

      <div ref="swiperContainer" class="swiper">
        <div class="swiper-wrapper">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="swiper-slide h-auto">
            <div class="card bg-base-100 shadow-lg h-full">
              <div class="card-body">
                <div class="flex items-center mb-4">
                  <div class="rating rating-sm">
                    <input
                        v-for="star in 5"
                        :key="star"
                        type="radio"
                        class="mask mask-star-2 bg-orange-400"
                        :checked="star === testimonial.rating"
                        disabled
                    />
                  </div>
                </div>

                <p class="mb-6 italic relative">
                  <span class="text-4xl absolute -top-4 -left-2 text-primary opacity-20">"</span>
                  {{ testimonial.text }}
                  <span class="text-4xl absolute -bottom-8 -right-2 text-primary opacity-20">"</span>
                </p>

                <div class="flex items-center mt-auto">
                  <div class="avatar mr-4">
                    <div class="w-12 h-12 rounded-full">
                      <img :src="testimonial.avatarUrl" :alt="testimonial.name" />
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold">{{ testimonial.name }}</h4>
                    <p class="text-sm text-base-content/70">{{ testimonial.title }}</p>
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
  </section>
</template>

<style scoped>
.swiper-pagination {
  position: relative;
  margin-top: 2rem;
}

.swiper-button-next,
.swiper-button-prev {
  color: var(--primary);
  top: auto;
  bottom: 0;
}
</style>