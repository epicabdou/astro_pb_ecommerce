<!-- src/components/CategoryShowcase.vue -->
<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
});

// Format image URL with fallback
const getImageUrl = (category) => {
  return category.image
      ? `http://127.0.0.1:8090/api/files/categories/${category.id}/${category.image}`
      : '/placeholder.png';
};
</script>

<template>
  <section class="bg-base-200 py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Shop by Category</h2>
        <p class="max-w-2xl mx-auto text-base-content/70">
          Explore our wide range of products across multiple categories to find exactly what you're looking for.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <a
            v-for="category in categories"
            :key="category.id"
            :href="`/products?category=${category.slug}`"
            class="group relative rounded-lg overflow-hidden bg-base-100 shadow-lg h-48 md:h-64 hover:shadow-xl transition-all duration-300"
        >
          <img
              :src="getImageUrl(category)"
              :alt="category.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div class="p-4 w-full">
              <h3 class="font-bold text-white text-lg md:text-xl">{{ category.name }}</h3>
              <p class="text-white/80 text-sm mt-1">{{ category.description || 'Explore products' }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>