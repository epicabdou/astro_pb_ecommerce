// src/stores/cartStore.ts
import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';

// Export the cartStore object for components that need the complete store
export const cartStore = {
  items: persistentAtom('cart-items', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
  })
};

// Create a persistent store for the cart
export const cartItems = persistentAtom('cart-items', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

// Add an item to the cart
export function addToCart(product, quantity = 1) {
    const cart = cartItems.get();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        cartItems.set(updatedCart);
    } else {
        // Item doesn't exist, add it
        cartItems.set([
            ...cart,
            {
                id: product.id,
                name: product.name,
                price: product.promoPrice || product.price,
                image: product.image,
                slug: product.slug,
                quantity,
            },
        ]);
    }
}

// Remove an item from the cart
export function removeFromCart(productId) {
    const cart = cartItems.get();
    cartItems.set(cart.filter(item => item.id !== productId));
}

// Update quantity for an item in the cart
export function updateCartItemQuantity(productId, quantity) {
    const cart = cartItems.get();

    if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        removeFromCart(productId);
        return;
    }

    const updatedCart = cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
    );
    cartItems.set(updatedCart);
}

// Clear the cart
export function clearCart() {
    cartItems.set([]);
}

// Computed store for cart total
export const cartTotal = computed(cartItems, (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Computed store for cart item count
export const cartCount = computed(cartItems, (items) => {
    return items.reduce((count, item) => count + item.quantity, 0);
});