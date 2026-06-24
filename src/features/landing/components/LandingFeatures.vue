<template>
   <section class="landing-features">
      <div class="landing-features__container">
         <header class="landing-features__header">
            <h2 class="landing-features__title">What You Will Learn</h2>
            <p class="landing-features__description">
               Build real financial intuition through repeatable, risk-free game systems.
            </p>
         </header>

         <div class="landing-features__skills">
            <article class="landing-features__skill">
               <div class="landing-features__skill-top">
                  <span class="landing-features__badge landing-features__badge--beginner">Beginner</span>
                  <i class="fa-solid fa-wallet"></i>
               </div>
               <h3 class="landing-features__card-title">Wallets & Spot Trades</h3>
               <p class="landing-features__text">
                  Learn balances, direct purchases, allocation, and basic crypto ownership.
               </p>
               <div class="landing-features__progress">
                  <span>Course progress</span>
                  <div class="landing-features__progress-track">
                     <div class="landing-features__progress-fill landing-features__progress-fill--basic"></div>
                  </div>
               </div>
            </article>

            <article class="landing-features__skill">
               <div class="landing-features__skill-top">
                  <span class="landing-features__badge landing-features__badge--intermediate">Intermediate</span>
                  <i class="fa-solid fa-arrow-trend-up"></i>
               </div>
               <h3 class="landing-features__card-title">Volatility & Leverage</h3>
               <p class="landing-features__text">
                  Practice drawdowns, liquidation pressure, news events, and position sizing.
               </p>
               <div class="landing-features__progress">
                  <span>Course progress</span>
                  <div class="landing-features__progress-track">
                     <div class="landing-features__progress-fill landing-features__progress-fill--trading"></div>
                  </div>
               </div>
            </article>

            <article class="landing-features__skill">
               <div class="landing-features__skill-top">
                  <span class="landing-features__badge landing-features__badge--advanced">Advanced</span>
                  <i class="fa-solid fa-layer-group"></i>
               </div>
               <h3 class="landing-features__card-title">DeFi & Yield Systems</h3>
               <p class="landing-features__text">
                  Explore staking, mining farms, liquidity concepts, and compounding returns.
               </p>
               <div class="landing-features__progress">
                  <span>Course progress</span>
                  <div class="landing-features__progress-track">
                     <div class="landing-features__progress-fill landing-features__progress-fill--defi"></div>
                  </div>
               </div>
            </article>
         </div>

         <div class="landing-features__grid">
            <article class="landing-features__feature">
               <i class="fa-solid fa-shield-halved"></i>
               <h3 class="landing-features__card-title">Risk-Free Sandbox</h3>
               <p class="landing-features__text">All portfolio values are simulated, so mistakes become lessons.</p>
            </article>
            <article class="landing-features__feature">
               <i class="fa-solid fa-bolt"></i>
               <h3 class="landing-features__card-title">Market Events</h3>
               <p class="landing-features__text">React to headlines and learn how volatility affects decisions.</p>
            </article>
            <article class="landing-features__feature">
               <i class="fa-solid fa-ranking-star"></i>
               <h3 class="landing-features__card-title">Global Leaderboard</h3>
               <p class="landing-features__text">Compare strategy quality through simulated net worth rankings.</p>
            </article>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.landing-features {
   padding-block: var(--space-24);

   @include lg {
      padding-block: var(--space-20);
   }

   @include md {
      padding-block: var(--space-16);
   }

   &__container {
      @include container;
   }

   &__header {
      max-width: 700px;
      margin: 0 auto var(--space-16);

      text-align: center;

      @include md {
         margin-bottom: var(--space-10);
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
      color: var(--color-text-secondary);
      font-size: var(--text-lg);

      @include md {
         font-size: var(--text-base);
      }
   }

   &__skills,
   &__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-6);

      @include lg {
         grid-template-columns: repeat(2, 1fr);
      }

      @include md {
         grid-template-columns: 1fr;
      }
   }

   &__skills {
      margin-bottom: var(--space-10);
   }

   &__skill,
   &__feature {
      display: flex;
      flex-direction: column;
      padding: var(--space-8);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-primary);
   }

   &__feature {
      @include glass;
      gap: var(--space-4);

      i {
         color: var(--color-accent);
         font-size: var(--text-2xl);
      }
   }

   &__skill-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-5);

      i {
         color: var(--color-accent-hover);
         font-size: 26px;
      }
   }

   &__badge {
      display: inline-flex;
      padding: 6px 12px;

      border-radius: var(--radius-full);

      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;

      &--beginner {
         background: var(--color-profit-subtle);
         color: var(--color-profit);
      }

      &--intermediate {
         background: var(--color-warning-subtle);
         color: var(--color-warning);
      }

      &--advanced {
         background: var(--color-loss-subtle);
         color: var(--color-loss);
      }
   }

   &__card-title {
      margin-bottom: var(--space-3);

      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
   }

   &__text {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
   }

   &__skill &__text {
      margin-bottom: auto;
      padding-bottom: var(--space-6);
   }

   &__progress {
      color: var(--color-text-muted);
      font-size: var(--text-xs);
   }

   &__progress-track {
      overflow: hidden;
      width: 100%;
      height: 6px;
      margin-top: 6px;

      border-radius: var(--radius-full);
      background: var(--color-border);
   }

   &__progress-fill {
      height: 100%;

      border-radius: var(--radius-full);
      background: var(--color-accent);

      &--basic {
         width: 80%;
      }

      &--trading {
         width: 55%;
      }

      &--defi {
         width: 35%;
      }
   }
}
</style>
