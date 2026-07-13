<template>
   <section class="landing-stats">
      <div class="landing-stats__container">
         <div class="landing-stats__grid">
            <div class="landing-stats__item">
               <div class="landing-stats__value">1,200+</div>
               <div class="landing-stats__label">Active Players</div>
            </div>
            <div class="landing-stats__item">
               <div class="landing-stats__value">$8.4M</div>
               <div class="landing-stats__label">Simulated Volume</div>
            </div>
            <div class="landing-stats__item">
               <div class="landing-stats__value">42K</div>
               <div class="landing-stats__label">Trades Practiced</div>
            </div>
            <div class="landing-stats__item">
               <div class="landing-stats__value">0</div>
               <div class="landing-stats__label">Real Dollars Risked</div>
            </div>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.landing-stats {
   padding-block: var(--space-16);

   border-block: 1px solid var(--color-border);
   background: var(--color-bg-primary);

   @include md {
      padding-block: var(--space-12);
   }

   &__container {
      @include container;
   }

   &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-6);

      text-align: center;

      @include lg {
         grid-template-columns: repeat(2, 1fr);
      }

      @include md {
         grid-template-columns: 1fr;
      }
   }

   &__value {
      margin-bottom: var(--space-2);

      color: var(--color-text-primary);
      font-family: var(--font-mono);
      font-size: 40px;
      font-weight: var(--font-bold);
      line-height: var(--leading-tight);

      @include md {
         font-size: var(--text-3xl);
      }
   }

   &__label {
      color: var(--color-text-muted);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      letter-spacing: var(--tracking-widest);
      text-transform: uppercase;
   }
}
</style>
