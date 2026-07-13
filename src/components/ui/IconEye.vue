<script setup lang="ts">
defineProps<{
   crossed?: boolean
}>()
</script>

<template>
   <svg class="auth-form__eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
         d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
         stroke="currentColor"
         stroke-width="1.8"
         stroke-linecap="round"
         stroke-linejoin="round"
      />
      <path
         d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
         stroke="currentColor"
         stroke-width="1.8"
         stroke-linecap="round"
         stroke-linejoin="round"
      />
      <path v-if="crossed" d="M4 20 20 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
   </svg>
</template>
