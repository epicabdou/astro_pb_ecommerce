// This script is meant to be imported globally to check authentication
// for protected routes on the client side
import { initAuthCheck } from './authCheck';

// Initialize authentication check
initAuthCheck();

// Export nothing - this is just for side effects