<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import ProductCard from './ProductCard.vue';

// Define props for the component
const props = defineProps({
  initialProducts: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  },
  totalPages: {
    type: Number,
    default: 1
  },
  currentPage: {
    type: Number,
    default: 1
  }
});

// Define emits
const emit = defineEmits(['filter', 'paginate']);

// Setup reactive state
const products = ref(props.initialProducts);
const isLoading = ref(false);
const showFilters = ref(false);

// Filter state
const filters = ref({
  search: '',
  category: '',
  tag: '',
  minPrice: '',
  maxPrice: '',
  inStock: false,
  onSale: false,
  sort: 'newest'
});

// Define sorting options
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
];

// Watch for external products updates
watch(() => props.initialProducts, (newProducts) => {
  products.value = newProducts;
});

// Apply filters
const applyFilters = () => {
  isLoading.value = true;

  // Emit event to parent component which will handle the actual filtering
  emit('filter', { ...filters.value });

  // In a real implementation, you might want to close the mobile filters panel after applying
  if (window.innerWidth < 768) {
    showFilters.value = false;
  }

  // Simulate loading state
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

// Reset filters
const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    tag: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    onSale: false,
    sort: 'newest'
  };

  applyFilters();
};

// Handle pagination
const goToPage = (page) => {
  if (page < 1 || page > props.totalPages) return;

  isLoading.value = true;
  emit('paginate', page);

  // Simulate loading state
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

// Generate pagination array
const paginationItems = computed(() => {
  const items = [];
  const currentPage = props.currentPage;
  const totalPages = props.totalPages;

  // Always include first page
  items.push(1);

  // Calculate start and end pages to show
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    items.push('...');
  }

  // Add pages between start and end
  for (let i = startPage; i <= endPage; i++) {
    items.push(i);
  }

  // Add ellipsis before last page if needed
  if (endPage < totalPages - 1) {
    items.push('...');
  }

  // Add last page if there's more than one page
  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
});

// Check if we should show previous button
const showPrevious = computed(() => props.currentPage > 1);

// Check if we should show next button
const showNext = computed(() => props.currentPage < props.totalPages);

// Toggle mobile filters visibility
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};
</script>

<template>
  <div class="w-full">
    <!-- Mobile filter toggle button -->
    <div class="lg:hidden flex justify-end mb-4">
      <button @click="toggleFilters" class="btn btn-outline">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filters
      </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Filter sidebar -->
      <div
          :class="{
          'w-full lg:w-1/4 lg:max-w-xs': true,
          'hidden lg:block': !showFilters
        }"
      >
        <div class="bg-base-200 rounded-box p-4 shadow-md sticky top-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Filters</h3>
            <button @click="resetFilters" class="btn btn-sm btn-ghost">
              Reset
            </button>
          </div>

          <!-- Search -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Search</span>
            </label>
            <input
                v-model="filters.search"
                type="text"
                placeholder="Search products..."
                class="input input-bordered w-full"
            />
          </div>

          <!-- Category filter -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Category</span>
            </label>
            <select v-model="filters.category" class="select select-bordered w-full">
              <option value="">All Categories</option>
              <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.slug"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <!-- Tag filter -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Tag</span>
            </label>
            <select v-model="filters.tag" class="select select-bordered w-full">
              <option value="">All Tags</option>
              <option
                  v-for="tag in tags"
                  :key="tag.id"
                  :value="tag.slug"
              >
                {{ tag.name }}
              </option>
            </select>
          </div>

          <!-- Price range -->
          <div class="mb-4">
            <label class="label">
              <span class="label-text">Price Range</span>
            </label>
            <div class="flex items-center gap-2">
              <input
                  v-model="filters.minPrice"
                  type="number"
                  placeholder="Min"
                  class="input input-bordered w-full"
                  min="0"
              />
              <span>-</span>
              <input
                  v-model="filters.maxPrice"
                  type="number"
                  placeholder="Max"
                  class="input input-bordered w-full"
                  min="0"
              />
            </div>
          </div>

          <!-- Stock filter -->
          <div class="form-control mb-4">
            <label class="label cursor-pointer justify-start gap-2">
              <input v-model="filters.inStock" type="checkbox" class="checkbox" />
              <span class="label-text">In Stock Only</span>
            </label>
          </div>

          <!-- Sale filter -->
          <div class="form-control mb-4">
            <label class="label cursor-pointer justify-start gap-2">
              <input v-model="filters.onSale" type="checkbox" class="checkbox" />
              <span class="label-text">On Sale Only</span>
            </label>
          </div>

          <!-- Sort order -->
          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">Sort By</span>
            </label>
            <select v-model="filters.sort" class="select select-bordered w-full">
              <option
                  v-for="option in sortOptions"
                  :key="option.value"
                  :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Apply filters button -->
          <button
              @click="applyFilters"
              class="btn btn-primary w-full"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Product grid -->
      <div class="flex-1">
        <div v-if="isLoading" class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-12">
          <h3 class="text-xl font-semibold mb-2">No products found</h3>
          <p class="mb-4">Try adjusting your filters for different results</p>
          <button @click="resetFilters" class="btn btn-primary">
            Reset Filters
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <div class="join">
            <button
                v-if="showPrevious"
                @click="goToPage(currentPage - 1)"
                class="join-item btn"
            >
              «
            </button>

            <button
                v-for="(item, index) in paginationItems"
                :key="index"
                @click="typeof item === 'number' ? goToPage(item) : null"
                :class="{
                'join-item btn': true,
                'btn-disabled': typeof item !== 'number',
                'btn-active': item === currentPage
              }"
            >
              {{ item }}
            </button>

            <button
                v-if="showNext"
                @click="goToPage(currentPage + 1)"
                class="join-item btn"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>