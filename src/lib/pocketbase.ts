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
export async function getProducts(page = 1, perPage = 20, options = {}, sort = '-created') {
    let filterString = '';

    if (options.filter) {
        filterString = options.filter;
    }

    try {
        return await pb.collection('products').getList(page, perPage, {
            filter: filterString || undefined,
            sort: sort,
            expand: 'category,tags',
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        // Return empty results rather than throwing
        return {
            page: page,
            perPage: perPage,
            totalItems: 0,
            totalPages: 1,
            items: []
        };
    }
}

export async function getProductBySlug(slug) {
    try {
        const product = await pb.collection('products').getFirstListItem(`slug="${slug}"`);

        // Expand related data
        const expandedProduct = await pb.collection('products').getOne(product.id, {
            expand: 'category,tags',
        });

        return expandedProduct;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function getFeaturedProducts(limit = 8) {
    try {
        return await pb.collection('products').getList(1, limit, {
            filter: 'isFeatured=true',
            sort: '-created',
            expand: 'category',
        });
    } catch (error) {
        console.error('Error fetching featured products:', error);
        // Return empty results
        return {
            page: 1,
            perPage: limit,
            totalItems: 0,
            totalPages: 1,
            items: []
        };
    }
}

// Categories functions
export async function getCategories() {
    try {
        const categories = await pb.collection('categories').getFullList({
            sort: 'name',
        });

        // Process the categories to add useful properties
        return categories.map(category => {
            return {
                ...category,
                // Add a property to check if it's a parent category (no parent id)
                isParent: !category.parent
            };
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getCategoryBySlug(slug) {
    try {
        // Get the category
        const category = await pb.collection('categories').getFirstListItem(`slug="${slug}"`);

        // If it has a parent, expand the parent details
        if (category.parent) {
            try {
                const expandedCategory = await pb.collection('categories').getOne(category.id, {
                    expand: 'parent',
                });
                category.expand = expandedCategory.expand;
            } catch (error) {
                console.error('Error expanding category parent:', error);
            }
        }

        return category;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

export async function getSubcategories(parentId) {
    try {
        if (!parentId) return [];

        return await pb.collection('categories').getFullList({
            filter: `parent="${parentId}"`,
            sort: 'name',
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }
}

export async function getParentCategories() {
    try {
        return await pb.collection('categories').getFullList({
            filter: `parent=""`,
            sort: 'name',
        });
    } catch (error) {
        console.error('Error fetching parent categories:', error);
        return [];
    }
}

// Tags functions
export async function getTags() {
    try {
        return await pb.collection('tags').getFullList({
            sort: 'name',
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return [];
    }
}

// Reviews functions
export async function getProductReviews(productId) {
    try {
        return await pb.collection('reviews').getList(1, 100, {
            filter: `product="${productId}"`,
            sort: '-created',
            expand: 'user',
        });
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        return {
            page: 1,
            perPage: 100,
            totalItems: 0,
            totalPages: 1,
            items: []
        };
    }
}

export async function createReview(data) {
    try {
        return await pb.collection('reviews').create(data);
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
}

// Orders functions
export async function createOrder(orderData, orderItems, shippingAddress) {
    try {
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
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function getUserOrders(userId) {
    try {
        return await pb.collection('orders').getList(1, 50, {
            filter: `user="${userId}"`,
            sort: '-created',
            expand: 'user',
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return {
            page: 1,
            perPage: 50,
            totalItems: 0,
            totalPages: 1,
            items: []
        };
    }
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
    try {
        return await pb.collection('wishlists').getList(1, 100, {
            filter: `user="${userId}"`,
            expand: 'product',
        });
    } catch (error) {
        console.error('Error fetching user wishlist:', error);
        return {
            page: 1,
            perPage: 100,
            totalItems: 0,
            totalPages: 1,
            items: []
        };
    }
}

export async function addToWishlist(userId, productId) {
    try {
        return await pb.collection('wishlists').create({
            user: userId,
            product: productId,
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
}

export async function removeFromWishlist(wishlistId) {
    try {
        return await pb.collection('wishlists').delete(wishlistId);
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
}

// Helper function to check if user is authenticated
export function isAuthenticated() {
    return pb.authStore.isValid;
}

// Helper function to check if user is admin
export function isAdmin() {
    return pb.authStore.isValid && pb.authStore.record?.isAdmin;
}