<!-- src/components/PromoBanners.vue -->
<script setup>
const props = defineProps({
  banners: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
            v-for="(banner, index) in banners"
            :key="index"
            class="relative rounded-xl overflow-hidden shadow-lg h-64 md:h-80"
        >
          <img
              :src="banner.imageUrl"
              :alt="banner.title"
              class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r" :class="index % 2 === 0 ? 'from-primary/80 to-transparent' : 'from-secondary/80 to-transparent'">
            <div class="p-8 h-full flex flex-col justify-center max-w-sm">
              <span class="badge badge-accent mb-3">{{ banner.badge }}</span>
              <h3 class="text-2xl font-bold text-white mb-3">{{ banner.title }}</h3>
              <p class="text-white/90 mb-6">{{ banner.description }}</p>
              <a :href="banner.buttonLink" class="btn btn-sm md:btn-md" :class="index % 2 === 0 ? 'btn-secondary' : 'btn-primary'">
                {{ banner.buttonText }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>