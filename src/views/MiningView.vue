<template>
   <div class="mining-section">
      <nav class="mining-section__nav" aria-label="Mining navigation">
         <RouterLink :to="{ name: 'mining-overview' }" class="mining-section__link" active-class="mining-section__link--active" exact-active-class="mining-section__link--active">
            <i class="fa-solid fa-gauge-high"></i> Overview
         </RouterLink>
         <RouterLink :to="{ name: 'mining-inventory' }" class="mining-section__link" active-class="mining-section__link--active">
            <i class="fa-solid fa-boxes-stacked"></i> Inventory
         </RouterLink>
      </nav>
      <RouterView />
   </div>
</template>

<style scoped lang="scss">
.mining-section {
   min-width: 0;

   &__nav {
      display: flex;
      min-height: 38px;
      align-items: flex-end;
      gap: var(--space-5);
      padding: 0 var(--space-8);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg-secondary);
   }

   &__link {
      display: flex;
      height: 38px;
      align-items: center;
      gap: 7px;
      border-bottom: 2px solid transparent;
      color: var(--color-text-secondary);
      font-size: 10px;
      font-weight: var(--font-semibold);

      i { font-size: 9px; }
      &:hover { color: var(--color-text-primary); }
      &--active { border-bottom-color: var(--color-accent); color: var(--color-text-primary); }
   }
}

@include md {
   .mining-section__nav { padding-inline: var(--space-4); }
}
</style>
