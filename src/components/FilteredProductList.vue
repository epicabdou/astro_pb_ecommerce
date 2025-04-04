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
  },
  initialFilters: {
    type: Object,
    default: () => ({
      search: '',
      category: '',
      tag: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      onSale: false,
      sort: 'newest'
    })
  }
});

// Define emits
const emit = defineEmits(['filter', 'paginate']);

// Setup reactive state
const products = ref(props.initialProducts);
const isLoading = ref(false);
const activeFilters = ref(0);
const openFilter = ref(null);
const view = ref('grid'); // grid or list

// Filter state - initialize from props
const filters = ref({...props.initialFilters});

// Define sorting options
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' }
];

// Count active filters
const updateActiveFilters = () => {
  let count = 0;
  if (filters.value.search) count++;
  if (filters.value.tag) count++;
  if (filters.value.minPrice) count++;
  if (filters.value.maxPrice) count++;
  if (filters.value.inStock) count++;
  if (filters.value.onSale) count++;
  if (filters.value.sort && filters.value.sort !== 'newest') count++;
  
  // Don't count category since we're on a category page
  activeFilters.value = count;
};

// Watch filters for changes
watch(filters, () => {
  updateActiveFilters();
}, { deep: true });

// Watch for external products updates
watch(() => props.initialProducts, (newProducts) => {
  products.value = newProducts;
});

// On component mount
onMounted(() => {
  updateActiveFilters();
});

// Toggle filter dropdown
const toggleFilter = (name) => {
  if (openFilter.value === name) {
    openFilter.value = null;
  } else {
    openFilter.value = name;
  }
};

// Apply filters
const applyFilters = () => {
  isLoading.value = true;
  openFilter.value = null;

  // Emit event to parent component which will handle the actual filtering
  emit('filter', { ...filters.value });

  // Simulate loading state
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
};

// Reset filters
const resetFilters = () => {
  filters.value = {
    ...props.initialFilters,
    search: '',
    tag: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    onSale: false,
    sort: 'newest'
  };
  
  // Keep the category filter from the initial filters (since we're on a category page)
  
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
</script>

<template>
  <div class="w-full">
    <!-- Filters bar -->
    <div class="bg-base-200 rounded-box p-4 shadow-sm mb-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Filter buttons and active filters count -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Search field -->
          <div class="relative">
            <div class="join">
              <input 
                v-model="filters.search" 
                type="text" 
                placeholder="Search products..." 
                class="input input-bordered join-item"
                @keyup.enter="applyFilters"
              />
              <button class="btn join-item" @click="applyFilters">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filter dropdowns -->
          <div class="relative">
            <button @click="toggleFilter('tags')" class="btn btn-outline">
              Tags
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            <div v-if="openFilter === 'tags'" class="absolute left-0 top-full mt-2 w-60 bg-base-100 shadow-xl z-30 rounded-box p-4">
              <div class="flex flex-col gap-2 max-h-60 overflow-y-auto">
                <label v-for="tag in tags" :key="tag.id" class="label cursor-pointer justify-start gap-2">
                  <input 
                    type="radio" 
                    :value="tag.slug" 
                    v-model="filters.tag" 
                    class="radio radio-sm" 
                    :checked="filters.tag === tag.slug"
                  />
                  <span>{{ tag.name }}</span>
                </label>
                <label class="label cursor-pointer justify-start gap-2">
                  <input 
                    type="radio" 
                    value="" 
                    v-model="filters.tag" 
                    class="radio radio-sm" 
                    :checked="filters.tag === ''"
                  />
                  <span>All Tags</span>
                </label>
              </div>
              <div class="divider my-2"></div>
              <button @click="applyFilters" class="btn btn-primary btn-sm w-full">Apply</button>
            </div>
          </div>

          <div class="relative">
            <button @click="toggleFilter('price')" class="btn btn-outline">
              Price
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            <div v-if="openFilter === 'price'" class="absolute left-0 top-full mt-2 w-60 bg-base-100 shadow-xl z-30 rounded-box p-4">
              <div class="flex flex-col gap-2">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Min Price</span>
                  </label>
                  <input 
                    v-model="filters.minPrice" 
                    type="number" 
                    placeholder="Min" 
                    class="input input-bordered w-full" 
                    min="0"
                  />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Max Price</span>
                  </label>
                  <input 
                    v-model="filters.maxPrice" 
                    type="number" 
                    placeholder="Max" 
                    class="input input-bordered w-full" 
                    min="0"
                  />
                </div>
              </div>
              <div class="divider my-2"></div>
              <button @click="applyFilters" class="btn btn-primary btn-sm w-full">Apply</button>
            </div>
          </div>

          <div class="relative">
            <button @click="toggleFilter('options')" class="btn btn-outline">
              Options
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            <div v-if="openFilter === 'options'" class="absolute left-0 top-full mt-2 w-60 bg-base-100 shadow-xl z-30 rounded-box p-4">
              <div class="flex flex-col gap-2">
                <label class="label cursor-pointer justify-start gap-2">
                  <input v-model="filters.inStock" type="checkbox" class="checkbox checkbox-sm" />
                  <span>In Stock Only</span>
                </label>
                <label class="label cursor-pointer justify-start gap-2">
                  <input v-model="filters.onSale" type="checkbox" class="checkbox checkbox-sm" />
                  <span>On Sale Only</span>
                </label>
              </div>
              <div class="divider my-2"></div>
              <button @click="applyFilters" class="btn btn-primary btn-sm w-full">Apply</button>
            </div>
          </div>

          <!-- Active filters -->
          <div v-if="activeFilters > 0" class="badge badge-primary">{{ activeFilters }} active</div>
          <button v-if="activeFilters > 0" @click="resetFilters" class="btn btn-ghost btn-sm">
            Reset
          </button>
        </div>

        <!-- Sort and view options -->
        <div class="flex items-center gap-2">
          <select v-model="filters.sort" @change="applyFilters" class="select select-bordered select-sm">
            <option 
              v-for="option in sortOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <div class="join">
            <button @click="view = 'grid'" :class="['btn btn-sm join-item', view === 'grid' ? 'btn-active' : '']">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>
            <button @click="view = 'list'" :class="['btn btn-sm join-item', view === 'list' ? 'btn-active' : '']">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Empty state -->
    <div v-else-if="products.length === 0" class="text-center py-12 bg-base-100 rounded-box shadow-sm">
      <h3 class="text-xl font-semibold mb-2">No products found</h3>
      <p class="mb-4">Try adjusting your filters for different results</p>
      <button @click="resetFilters" class="btn btn-primary">
        Reset Filters
      </button>
    </div>

    <!-- Product grid view -->
    <div v-else-if="view === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Product list view -->
    <div v-else class="flex flex-col gap-4">
      <div 
        v-for="product in products" 
        :key="product.id" 
        class="card card-side bg-base-100 shadow-sm overflow-hidden h-48"
      >
        <figure class="w-1/3 max-w-48">
          <img 
            :src="`http://127.0.0.1:8090/api/files/products/${product.id}/${product.images.split(',')[0]}`" 
            :alt="product.name"
            class="h-full w-full object-cover"
          />
        </figure>
        <div class="card-body p-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="card-title line-clamp-1">{{ product.name }}</h2>
              <div class="flex items-baseline mt-1 gap-2">
                <span class="text-lg font-semibold" :class="{'text-error': product.promoPrice > 0}">
                  {{ product.promoPrice > 0 ? `$${product.promoPrice}` : `$${product.price}` }}
                </span>
                <span v-if="product.promoPrice > 0" class="text-sm line-through opacity-60">
                  ${{ product.price }}
                </span>
              </div>
            </div>
            <div class="badge badge-outline" v-if="product.stock <= 0">Out of stock</div>
          </div>
          <p class="text-sm opacity-80 line-clamp-2 mt-1">{{ product.description }}</p>
          <div class="card-actions justify-end mt-auto">
            <button class="btn btn-primary btn-sm">Add to Cart</button>
            <button class="btn btn-outline btn-sm">Details</button>
          </div>
        </div>
      </div>
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
</template>