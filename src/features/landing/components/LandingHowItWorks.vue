<template>
   <section id="how" class="how-it-works">
      <div class="how-it-works__container">
         <header class="how-it-works__header">
            <h2 class="how-it-works__title">How Chain Tycoon Works</h2>
            <p class="how-it-works__description">
               Start with virtual capital, make real market decisions, and learn crypto concepts safely.
            </p>
         </header>

         <div class="how-it-works__grid">
            <article class="how-it-works__card">
               <span class="how-it-works__number">01</span>
               <i class="fa-solid fa-wallet how-it-works__icon"></i>
               <h3 class="how-it-works__card-title">Get Virtual Capital</h3>
               <p class="how-it-works__text">
                  Begin with a sandbox balance and explore market mechanics without risking real money.
               </p>
               <div class="how-it-works__tip">
                  <i class="fa-solid fa-lightbulb"></i>
                  Learn wallet basics
               </div>
            </article>

            <article class="how-it-works__card">
               <span class="how-it-works__number">02</span>
               <i class="fa-solid fa-chart-line how-it-works__icon"></i>
               <h3 class="how-it-works__card-title">Trade Live Prices</h3>
               <p class="how-it-works__text">
                  Practice spot trades, timing, volatility awareness, and portfolio allocation.
               </p>
               <div class="how-it-works__tip">
                  <i class="fa-solid fa-lightbulb"></i>
                  Understand market moves
               </div>
            </article>

            <article class="how-it-works__card">
               <span class="how-it-works__number">03</span>
               <i class="fa-solid fa-industry how-it-works__icon"></i>
               <h3 class="how-it-works__card-title">Build Your Ecosystem</h3>
               <p class="how-it-works__text">
                  Unlock mining farms, staking paths, and automated income systems as you progress.
               </p>
               <div class="how-it-works__tip">
                  <i class="fa-solid fa-lightbulb"></i>
                  Connect game actions to crypto
               </div>
            </article>

            <article class="how-it-works__card">
               <span class="how-it-works__number">04</span>
               <i class="fa-solid fa-trophy how-it-works__icon"></i>
               <h3 class="how-it-works__card-title">Climb the Rankings</h3>
               <p class="how-it-works__text">
                  Improve net worth, learn from mistakes, and compare your progress with other players.
               </p>
               <div class="how-it-works__tip">
                  <i class="fa-solid fa-lightbulb"></i>
                  Learn by repeating safely
               </div>
            </article>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.how-it-works {
   padding-block: var(--space-24);
   background: var(--color-bg-secondary);

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

   &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-6);

      @include lg {
         grid-template-columns: repeat(2, 1fr);
      }

      @include md {
         grid-template-columns: 1fr;
      }
   }

   &__card {
      position: relative;

      padding: 36px var(--space-6);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-primary);
   }

   &__number {
      position: absolute;
      top: var(--space-4);
      right: var(--space-6);

      color: rgba(108, 99, 255, 0.08);
      font-size: 54px;
      font-weight: var(--font-bold);
      line-height: var(--leading-none);
      user-select: none;
   }

   &__icon {
      margin-bottom: var(--space-6);

      color: var(--color-accent);
      font-size: var(--text-2xl);
   }

   &__card-title {
      margin-bottom: var(--space-3);

      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
   }

   &__text {
      margin-bottom: var(--space-4);

      color: var(--color-text-secondary);
      font-size: var(--text-sm);
   }

   &__tip {
      display: flex;
      gap: var(--space-2);
      padding-top: var(--space-3);

      border-top: 1px solid var(--color-border);

      color: var(--color-text-muted);
      font-size: var(--text-xs);
   }
}
</style>
