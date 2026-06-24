<template>
   <header class="header">
      <div class="header__container">
         <a href="/" class="header__logo">
            <i class="fa-solid fa-cubes"></i> Chain Tycoon
         </a>
         <a href="#cta" class="header__action landing-button-outline">Play Free</a>
      </div>
   </header>
</template>

<style lang="scss" scoped>
.header {
   position: sticky;
   top: 0;
   z-index: var(--z-sticky);

   padding-block: var(--space-5);

   background: rgba(15, 15, 19, 0.8);
   backdrop-filter: blur(12px);
   border-bottom: 1px solid var(--color-border-subtle);

   &__container {
      @include container;
      @include flex-between;
   }

   &__logo {
      display: flex;
      align-items: center;
      gap: var(--space-2);

      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      color: var(--color-text-primary);

      i {
         color: var(--color-accent);
      }
   }

   &__action {
      padding-inline: var(--space-4);
      padding-block: var(--space-2);

      border-radius: var(--radius-sm);

      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      line-height: var(--leading-normal);
      transition: all var(--duration-base) var(--ease-default);
   }
}
</style>
