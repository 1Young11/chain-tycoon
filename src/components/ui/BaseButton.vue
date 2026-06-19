<template>
   <button type="button" class="base-button" :class="`base-button--${variant}`" :disabled="isLoading || disabled">
      <span v-if="isLoading">Loading...</span>
      <slot v-else></slot>
   </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
   variant?: 'primary' | 'secondary' | 'ghost'
   isLoading?: boolean
   disabled?: boolean
}>(), {
   variant: 'primary',
   isLoading: false,
   disabled: false,
})
</script>

<style lang="scss" scoped>
.base-button {
   width: 100%;
   padding: 0.5rem 1rem;

   &--primary {
      background-color: var(--color-accent);
      color: white;
   }

   &--secondary {
      background-color: transparent;
      border: 1px solid var(--color-border);
      color: var(--color-text-primary);
   }

   &--ghost {
      background-color: transparent;
      color: var(--color-accent);
   }

   &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
   }
}
</style>