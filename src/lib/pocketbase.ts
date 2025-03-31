// src/lib/pocketbase.js
import PocketBase from 'pocketbase';

// Initialize PocketBase client
// In production, you'd want to use environment variables for the URL
export const pb = new PocketBase('http://127.0.0.1:8090');

// Auth functions
export const authStore = pb.authStore;

export async function login(email, password) {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        return { user: authData.record, token: authData.token };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function register(userData) {
    try {
        const user = await pb.collection('users').create(userData);
        // After registration, log the user in
        await login(userData.email, userData.password);
        return user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export function logout() {
    pb.authStore.clear();
}

export async function updateUser(userId, data) {
    return await pb.collection('users').update(userId, data);
}

// Products functions
export async function getProducts(page = 1, perPage = 20, filters = {}) {
    const filterString = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' && ');

    return await pb.collection('products').getList(page, perPage, {
        filter: filterString || undefined,
        sort: '-created',
        expand: 'category,tags',
    });
}

export async function getProductBySlug(slug) {
    try {
        const product = await pb.collection('products').getFirstListItem(`slug="${slug}"`);
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function getFeaturedProducts(limit = 8) {
    return await pb.collection('products').getList(1, limit, {
        filter: 'isFeatured=true',
        sort: '-created',
        expand: 'category',
    });
}

// Categories functions
export async function getCategories() {
    return await pb.collection('categories').getFullList({
        sort: 'name',
    });
}

export async function getCategoryBySlug(slug) {
    try {
        return await pb.collection('categories').getFirstListItem(`slug="${slug}"`);
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

// Tags functions
export async function getTags() {
    return await pb.collection('tags').getFullList({
        sort: 'name',
    });
}

// Reviews functions
export async function getProductReviews(productId) {
    return await pb.collection('reviews').getList(1, 100, {
        filter: `product="${productId}"`,
        sort: '-created',
        expand: 'user',
    });
}

export async function createReview(data) {
    return await pb.collection('reviews').create(data);
}

// Orders functions
export async function createOrder(orderData, orderItems, shippingAddress) {
    // Create order
    const order = await pb.collection('orders').create(orderData);

    // Create order items and link them to the order
    const itemPromises = orderItems.map((item) => {
        return pb.collection('orderItems').create({
            order: order.id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
        });
    });

    await Promise.all(itemPromises);

    // Create shipping address
    if (shippingAddress) {
        await pb.collection('shippingAddresses').create({
            ...shippingAddress,
            order: order.id,
            user: orderData.user,
        });
    }

    return order;
}

export async function getUserOrders(userId) {
    return await pb.collection('orders').getList(1, 50, {
        filter: `user="${userId}"`,
        sort: '-created',
        expand: 'user',
    });
}

export async function getOrderDetails(orderId) {
    try {
        const order = await pb.collection('orders').getOne(orderId, {
            expand: 'user',
        });

        const items = await pb.collection('orderItems').getList(1, 100, {
            filter: `order="${orderId}"`,
            expand: 'product',
        });

        const shippingAddress = await pb.collection('shippingAddresses').getFirstListItem(`order="${orderId}"`);

        return { order, items: items.items, shippingAddress };
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
}

// Wishlist functions
export async function getUserWishlist(userId) {
    return await pb.collection('wishlists').getList(1, 100, {
        filter: `user="${userId}"`,
        expand: 'product',
    });
}

export async function addToWishlist(userId, productId) {
    return await pb.collection('wishlists').create({
        user: userId,
        product: productId,
    });
}

export async function removeFromWishlist(wishlistId) {
    return await pb.collection('wishlists').delete(wishlistId);
}

// Helper function to check if user is authenticated
export function isAuthenticated() {
    return pb.authStore.isValid;
}

// Helper function to check if user is admin
export function isAdmin() {
    return pb.authStore.isValid && pb.authStore.record?.isAdmin;
}