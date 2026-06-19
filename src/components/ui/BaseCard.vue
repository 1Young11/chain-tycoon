<script setup lang="ts">
withDefaults(defineProps<{
   padding?: string
   hoverable?: boolean
}>(), {
   padding: '1rem',
   hoverable: false,
})
</script>

<template>
   <div class="base-card" :style="{ '--padding': padding }" :class="{ 'base-card--hoverable': hoverable }">
      <slot></slot>
   </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.base-card {
   @include glass;
   padding: var(--padding);
   transition: box-shadow 0.3s ease;

   &--hoverable {
      cursor: pointer;

      &:hover {
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
   }
}
</style>