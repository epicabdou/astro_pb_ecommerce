<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { pb, isAuthenticated } from '../lib/pocketbase';

// Props for component
const props = defineProps({
  redirectTo: {
    type: String,
    default: '/login'
  },
  redirectParam: {
    type: String,
    default: 'redirect'
  },
  checkOnMount: {
    type: Boolean,
    default: true
  }
});

// State
const isLoggedIn = ref(isAuthenticated());
const isChecking = ref(true);
const error = ref('');

// Method to check authentication status
const checkAuth = () => {
  isChecking.value = true;
  isLoggedIn.value = isAuthenticated();
  
  if (!isLoggedIn.value) {
    // Save current path to redirect back after login
    const returnPath = window.location.pathname;
    sessionStorage.setItem('redirect_after_login', returnPath);
    
    // Redirect to login with the current path as a query parameter
    const redirectUrl = props.redirectTo + 
      (props.redirectTo.includes('?') ? '&' : '?') + 
      `${props.redirectParam}=${encodeURIComponent(returnPath)}`;
    
    window.location.href = redirectUrl;
  }
  
  isChecking.value = false;
};

// Listen for auth changes
onMounted(() => {
  if (props.checkOnMount) {
    checkAuth();
  }
  
  pb.authStore.onChange(() => {
    isLoggedIn.value = pb.authStore.isValid;
    if (!isLoggedIn.value) {
      checkAuth();
    }
  });
});

// Expose method to parent components
defineExpose({ checkAuth });
</script>

<template>
  <div v-if="isChecking" class="flex justify-center py-4">
    <span class="loading loading-spinner"></span>
  </div>
  
  <div v-else-if="error" class="alert alert-error">
    {{ error }}
  </div>
  
  <slot v-else-if="isLoggedIn"></slot>
</template>