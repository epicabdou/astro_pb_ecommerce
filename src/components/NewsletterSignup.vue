<!-- src/components/NewsletterSignup.vue -->
<script setup>
import { ref } from 'vue';

const email = ref('');
const isSubmitting = ref(false);
const showSuccess = ref(false);
const errorMessage = ref('');

const handleSubmit = () => {
  // Reset states
  errorMessage.value = '';
  showSuccess.value = false;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address';
    return;
  }

  // Simulate API call
  isSubmitting.value = true;

  // In a real application, you would send this to your backend
  setTimeout(() => {
    isSubmitting.value = false;
    showSuccess.value = true;
    email.value = '';
  }, 1000);
};
</script>

<template>
  <section class="py-16 bg-gradient-to-r from-primary to-secondary text-white">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
        <p class="text-white/90 mb-8">
          Subscribe to our newsletter to receive updates, special offers, and exclusive discounts!
        </p>

        <form @submit.prevent="handleSubmit" class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
              v-model="email"
              type="email"
              placeholder="Your email address"
              class="input input-lg flex-1 text-base-content"
              :disabled="isSubmitting"
              required
          />
          <button
              type="submit"
              class="btn btn-accent btn-lg"
              :class="{ 'loading': isSubmitting }"
              :disabled="isSubmitting"
          >
            Subscribe
          </button>
        </form>

        <div v-if="errorMessage" class="mt-4 text-error bg-white/10 p-2 rounded">
          {{ errorMessage }}
        </div>

        <div v-if="showSuccess" class="mt-4 text-accent bg-white/10 p-2 rounded">
          Thank you for subscribing! We'll keep you updated with our latest news.
        </div>

        <p class="mt-6 text-white/80 text-sm">
          By subscribing, you agree to our Privacy Policy and to receive our promotional emails.
        </p>
      </div>
    </div>
  </section>
</template>