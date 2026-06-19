<script setup lang="ts">
withDefaults(defineProps<{
   type?: 'success' | 'warning' | 'danger' | 'info'
}>(), {
   type: 'info'
})
</script>

<template>
   <span class="base-badge" :class="`base-badge--${type}`">
      <slot></slot>
   </span>
</template>

<style lang="scss" scoped>
.base-badge {
   display: inline-block;
   padding: 0.25rem 0.5rem;
   border-radius: 4px;
   font-size: 0.75rem;
   font-weight: 500;
   color: white;

   &--success {
      background-color: var(--color-profit);
   }

   &--warning {
      background-color: var(--color-warning);
   }

   &--danger {
      background-color: var(--color-loss);
   }
}
</style>