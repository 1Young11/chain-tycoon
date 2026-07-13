<script setup lang="ts">
defineProps<{
   to: string
}>()
</script>

<template>
   <RouterLink :to="to" class="app-logo">
      <span class="app-logo__mark" aria-hidden="true">
         <svg viewBox="0 0 48 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 2 36 8.5V21.5L24 28 12 21.5V8.5L24 2Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" />
            <path d="M12 15 24 21.5V34.5L12 40 2 34V21L12 15Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" />
            <path d="M36 15 46 21V34L36 40 24 34.5V21.5L36 15Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round" />
         </svg>
      </span>
      Chain Tycoon
   </RouterLink>
</template>
