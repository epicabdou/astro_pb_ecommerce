// src/utils/cartRenderer.js
import { cartItems } from '../stores/cartStore';
import { createApp, h } from 'vue';
import CartItem from '../components/CartItem.vue';

/**
 * Renders the cart items on the cart page
 * This utility helps bridge Astro and Vue components
 */
export function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    if (!cartContainer) return;

    const items = cartItems.get();

    // Clear container
    cartContainer.innerHTML = '';

    if (items.length === 0) {
        // Show empty state
        cartContainer.innerHTML = `
      <div class="card bg-base-100 shadow-lg py-16">
        <div class="card-body items-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 class="card-title">Your cart is empty</h2>
          <p class="mb-4">Looks like you haven't added any products to your cart yet.</p>
          <a href="/products" class="btn btn-primary">
            Browse Products
          </a>
        </div>
      </div>
    `;
        return;
    }

    // Create an element for items heading
    const headingEl = document.createElement('div');
    headingEl.className = 'flex justify-between items-center mb-4';
    headingEl.innerHTML = `
    <h2 class="text-xl font-semibold">Your Items (${items.length})</h2>
  `;
    cartContainer.appendChild(headingEl);

    // Mount each cart item as a Vue component
    items.forEach(item => {
        const itemContainer = document.createElement('div');
        cartContainer.appendChild(itemContainer);

        // Create Vue app for item
        const app = createApp({
            render() {
                return h(CartItem, { item });
            }
        });

        app.mount(itemContainer);
    });
}