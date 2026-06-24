<template>
   <section id="cta" class="landing-cta">
      <div class="landing-cta__container">
         <div class="landing-cta__panel">
            <h2 class="landing-cta__title">Ready to learn crypto the fun way?</h2>
            <p class="landing-cta__description">Free forever. No real money. Just real knowledge.</p>
            <a href="/register" class="landing-cta__button">Create Free Account</a>
            <span class="landing-cta__note">Join 1,200+ players already learning</span>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.landing-cta {
   padding-block: var(--space-24);

   @include md {
      padding-block: var(--space-16);
   }

   &__container {
      @include container;
   }

   &__panel {
      @include flex-col;
      align-items: center;
      padding: var(--space-20) var(--space-6);

      border: 1px solid var(--color-border-accent);
      border-radius: var(--radius-xl);
      background:
         radial-gradient(circle at top, rgba(108, 99, 255, 0.18), transparent 45%),
         var(--color-bg-secondary);

      text-align: center;

      @include md {
         padding: var(--space-12) var(--space-5);
      }
   }

   &__title {
      margin-bottom: var(--space-4);

      font-size: var(--text-3xl);
      font-weight: var(--font-bold);

      @include md {
         font-size: var(--text-2xl);
      }
   }

   &__description {
      margin-bottom: var(--space-8);

      color: var(--color-text-secondary);
      font-size: var(--text-lg);

      @include md {
         font-size: var(--text-base);
      }
   }

   &__button {
      padding: var(--space-3) var(--space-8);

      border-radius: var(--radius-md);
      background: var(--color-text-primary);

      color: var(--color-bg-primary);
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      line-height: var(--leading-normal);
      transition: all var(--duration-fast) var(--ease-default);

      &:hover {
         transform: translateY(-2px);
         box-shadow: var(--shadow-accent);
      }

      @include md {
         width: 100%;
      }
   }

   &__note {
      margin-top: var(--space-4);

      color: var(--color-text-muted);
      font-size: var(--text-xs);
   }
}
</style>
