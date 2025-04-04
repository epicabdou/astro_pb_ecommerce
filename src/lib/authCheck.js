import { pb, isAuthenticated } from './pocketbase';

/**
 * Client-side authentication check utility
 * This can be added to pages that need authentication to provide an extra layer of security
 * beyond server-side checks
 */

// List of paths that require authentication
const protectedPaths = [
  '/checkout',
  '/account',
  '/orders',
  '/profile',
  '/wishlist'
];

// Check if the current path requires authentication
export function pathRequiresAuth(path) {
  return protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
}

// Check auth status and redirect if needed
export function checkAuthAndRedirect() {
  // Get current path
  const currentPath = window.location.pathname;
  
  // Check if this path requires authentication
  if (pathRequiresAuth(currentPath)) {
    // Verify authentication
    if (!isAuthenticated()) {
      // Save the current path to redirect back after login
      sessionStorage.setItem('redirect_after_login', currentPath);
      
      // Redirect to login
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
  }
  
  return true;
}

// Initialize auth check
export function initAuthCheck() {
  document.addEventListener('DOMContentLoaded', () => {
    checkAuthAndRedirect();
    
    // Also listen for auth state changes
    pb.authStore.onChange(() => {
      checkAuthAndRedirect();
    });
  });
}

// Export default function for direct script usage
export default function() {
  initAuthCheck();
}