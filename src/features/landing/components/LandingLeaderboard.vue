<template>
   <section class="landing-leaderboard">
      <div class="landing-leaderboard__container">
         <header class="landing-leaderboard__header">
            <h2 class="landing-leaderboard__title">Top Tycoons</h2>
            <p class="landing-leaderboard__description">
               See who is optimizing the highest yield performance profiles right now.
            </p>
         </header>

         <div class="landing-leaderboard__board">
            <div class="landing-leaderboard__row landing-leaderboard__row--top">
               <div class="landing-leaderboard__player">
                  <div class="landing-leaderboard__rank landing-leaderboard__rank--top">
                     <i class="fa-solid fa-crown"></i> 1
                  </div>
                  <div class="landing-leaderboard__avatar">S</div>
                  <span class="landing-leaderboard__name">Satoshi99</span>
                  <span class="landing-leaderboard__level">Lvl 42 Tycoon</span>
               </div>
               <div class="landing-leaderboard__balance landing-leaderboard__balance--top">$5,423,912</div>
            </div>

            <div class="landing-leaderboard__row">
               <div class="landing-leaderboard__player">
                  <div class="landing-leaderboard__rank">2</div>
                  <div class="landing-leaderboard__avatar landing-leaderboard__avatar--purple">W</div>
                  <span class="landing-leaderboard__name">WhaleHunter</span>
                  <span class="landing-leaderboard__level">Lvl 38 Expert</span>
               </div>
               <div class="landing-leaderboard__balance">$3,110,450</div>
            </div>

            <div class="landing-leaderboard__row">
               <div class="landing-leaderboard__player">
                  <div class="landing-leaderboard__rank">3</div>
                  <div class="landing-leaderboard__avatar landing-leaderboard__avatar--blue">G</div>
                  <span class="landing-leaderboard__name">GigaChad_Trader</span>
                  <span class="landing-leaderboard__level">Lvl 35 Expert</span>
               </div>
               <div class="landing-leaderboard__balance">$1,985,200</div>
            </div>

            <div class="landing-leaderboard__row">
               <div class="landing-leaderboard__player">
                  <div class="landing-leaderboard__rank">4</div>
                  <div class="landing-leaderboard__avatar landing-leaderboard__avatar--pink">B</div>
                  <span class="landing-leaderboard__name">BullRunCEO</span>
                  <span class="landing-leaderboard__level">Lvl 31 Investor</span>
               </div>
               <div class="landing-leaderboard__balance">$1,240,115</div>
            </div>

            <div class="landing-leaderboard__row">
               <div class="landing-leaderboard__player">
                  <div class="landing-leaderboard__rank">5</div>
                  <div class="landing-leaderboard__avatar landing-leaderboard__avatar--green">N</div>
                  <span class="landing-leaderboard__name">NoPaperHands</span>
                  <span class="landing-leaderboard__level">Lvl 29 Investor</span>
               </div>
               <div class="landing-leaderboard__balance">$985,400</div>
            </div>
         </div>

         <p class="landing-leaderboard__footer">
            Your rank: <span class="landing-leaderboard__rank-value">-</span> | Join over 1,200+ active players
         </p>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.landing-leaderboard {
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

   &__board {
      overflow: hidden;
      max-width: 800px;
      margin: 0 auto var(--space-6);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-primary);
   }

   &__row {
      @include flex-between;
      gap: var(--space-6);
      padding: 18px var(--space-8);

      border-bottom: 1px solid var(--color-border);

      &:last-child {
         border-bottom: 0;
      }

      &--top {
         background: rgba(255, 181, 71, 0.03);
      }

      @include md {
         align-items: flex-start;
         flex-direction: column;
         gap: var(--space-3);
         padding: var(--space-4);
      }
   }

   &__player {
      display: flex;
      align-items: center;
      gap: var(--space-5);
      min-width: 0;

      @include md {
         flex-wrap: wrap;
         gap: var(--space-3);
      }
   }

   &__rank {
      width: 24px;

      color: var(--color-text-muted);
      font-size: var(--text-base);
      font-weight: var(--font-bold);

      &--top {
         color: var(--color-warning);
      }
   }

   &__avatar {
      @include flex-center;
      flex: 0 0 auto;
      width: 40px;
      height: 40px;

      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #4f46e5, #7c3aed);

      font-size: var(--text-sm);
      font-weight: var(--font-bold);

      &--purple {
         background: #7c3aed;
      }

      &--blue {
         background: #2563eb;
      }

      &--pink {
         background: #db2777;
      }

      &--green {
         background: #059669;
      }
   }

   &__name {
      font-weight: var(--font-semibold);
   }

   &__level {
      padding: 2px var(--space-2);

      border-radius: 4px;
      background: var(--color-border);

      color: var(--color-text-secondary);
      font-size: 11px;
   }

   &__balance {
      flex: 0 0 auto;

      font-family: var(--font-mono);
      font-size: var(--text-base);
      font-weight: var(--font-bold);

      &--top {
         color: var(--color-profit);
      }
   }

   &__footer {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      text-align: center;
   }

   &__rank-value {
      color: var(--color-accent-hover);
      font-family: var(--font-mono);
   }
}
</style>
