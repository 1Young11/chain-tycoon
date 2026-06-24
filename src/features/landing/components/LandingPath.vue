<template>
   <section class="landing-path">
      <div class="landing-path__container">
         <header class="landing-path__header">
            <h2 class="landing-path__title">Learning Path</h2>
            <p class="landing-path__description">
               Unlock structured advanced tools as your tier level improves across the roadmap.
            </p>
         </header>

         <div class="landing-path__scroll">
            <div class="landing-path__roadmap">
               <article class="landing-path__stage">
                  <div class="landing-path__icon"><i class="fa-solid fa-baby"></i></div>
                  <h3 class="landing-path__stage-title">Rookie</h3>
                  <p class="landing-path__stage-description">Spot Trading, Basic Wallets</p>
                  <div class="landing-path__xp">0 XP Required</div>
               </article>
               <article class="landing-path__stage landing-path__stage--active">
                  <div class="landing-path__icon"><i class="fa-solid fa-seedling"></i></div>
                  <h3 class="landing-path__stage-title">Trader</h3>
                  <p class="landing-path__stage-description">Leverage, Order books</p>
                  <div class="landing-path__xp">1,500 XP</div>
               </article>
               <article class="landing-path__stage">
                  <div class="landing-path__icon"><i class="fa-solid fa-gem"></i></div>
                  <h3 class="landing-path__stage-title">Investor</h3>
                  <p class="landing-path__stage-description">Mining Farms, Indexing</p>
                  <div class="landing-path__xp">5,000 XP</div>
               </article>
               <article class="landing-path__stage">
                  <div class="landing-path__icon"><i class="fa-solid fa-layer-group"></i></div>
                  <h3 class="landing-path__stage-title">DeFi Expert</h3>
                  <p class="landing-path__stage-description">Liquidity Pools, Staking</p>
                  <div class="landing-path__xp">12,000 XP</div>
               </article>
               <article class="landing-path__stage">
                  <div class="landing-path__icon"><i class="fa-solid fa-crown"></i></div>
                  <h3 class="landing-path__stage-title">Tycoon</h3>
                  <p class="landing-path__stage-description">Hedge Funds, Macro Control</p>
                  <div class="landing-path__xp">30,000 XP</div>
               </article>
            </div>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.landing-path {
   padding-block: var(--space-24);
   background: var(--color-bg-secondary);

   @include md {
      padding-block: var(--space-16);
   }

   &__container {
      @include container;
   }

   &__header {
      max-width: 700px;
      margin: 0 auto var(--space-12);

      text-align: center;
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
      color: var(--color-text-secondary);
      font-size: var(--text-lg);

      @include md {
         font-size: var(--text-base);
      }
   }

   &__scroll {
      overflow-x: auto;
      padding-block: var(--space-10);

      @include custom-scrollbar;
   }

   &__roadmap {
      position: relative;

      display: flex;
      justify-content: space-between;
      min-width: 900px;
      padding-bottom: var(--space-5);

      &::before {
         content: "";
         position: absolute;
         z-index: var(--z-base);
         top: 35px;
         left: 0;

         width: 100%;
         height: 2px;

         background: var(--color-border);
      }
   }

   &__stage {
      position: relative;
      z-index: 1;

      width: 18%;

      text-align: center;

      &--active {
         .landing-path__icon {
            border-color: var(--color-accent);
            background: var(--color-bg-primary);
            color: var(--color-accent-hover);
            box-shadow: var(--shadow-accent);
         }
      }
   }

   &__icon {
      @include flex-center;
      width: 70px;
      height: 70px;
      margin: 0 auto var(--space-5);

      border: 2px solid var(--color-border);
      border-radius: var(--radius-full);
      background: var(--color-bg-primary);

      color: var(--color-text-secondary);
      font-size: var(--text-xl);
      transition: all var(--duration-base) var(--ease-default);
   }

   &__stage-title {
      margin-bottom: var(--space-2);

      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
   }

   &__stage-description {
      margin-bottom: var(--space-2);

      color: var(--color-text-secondary);
      font-size: 13px;
   }

   &__xp {
      color: var(--color-text-muted);
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: var(--font-semibold);
   }
}
</style>
