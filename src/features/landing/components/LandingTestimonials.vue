<template>
   <section class="landing-testimonials">
      <div class="landing-testimonials__container">
         <header class="landing-testimonials__header">
            <h2 class="landing-testimonials__title">Real Learning. Safe Environment.</h2>
            <p class="landing-testimonials__description">
               Read experiences from platform users who built real financial intuition risk-free.
            </p>
         </header>

         <div class="landing-testimonials__grid">
            <article class="landing-testimonials__card">
               <div class="landing-testimonials__user">
                  <div class="landing-testimonials__avatar landing-testimonials__avatar--orange">M</div>
                  <div class="landing-testimonials__user-info">
                     <h3 class="landing-testimonials__name">Marcus V.</h3>
                     <span class="landing-testimonials__level">Lvl 14 Trader</span>
                  </div>
               </div>
               <p class="landing-testimonials__quote">
                  "I didn't understand what staking was. After 2 weeks of playing I confidently explained the mechanic clearly to my friends."
               </p>
            </article>

            <article class="landing-testimonials__card">
               <div class="landing-testimonials__user">
                  <div class="landing-testimonials__avatar landing-testimonials__avatar--green">D</div>
                  <div class="landing-testimonials__user-info">
                     <h3 class="landing-testimonials__name">Dani K.</h3>
                     <span class="landing-testimonials__level">Lvl 22 Investor</span>
                  </div>
               </div>
               <p class="landing-testimonials__quote">
                  "Lost my first $10k virtual cash allocation in 3 days. Best lesson ever. Now I'm consistently profitable for 3 weeks straight."
               </p>
            </article>

            <article class="landing-testimonials__card">
               <div class="landing-testimonials__user">
                  <div class="landing-testimonials__avatar landing-testimonials__avatar--purple">E</div>
                  <div class="landing-testimonials__user-info">
                     <h3 class="landing-testimonials__name">Elena R.</h3>
                     <span class="landing-testimonials__level">Lvl 19 Trader</span>
                  </div>
               </div>
               <p class="landing-testimonials__quote">
                  "Finally understand what DeFi structures actually mean. The modular popup tips tracking after each deployment choice are gold."
               </p>
            </article>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.landing-testimonials {
   padding-block: var(--space-24);

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
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-6);

      @include lg {
         grid-template-columns: repeat(2, 1fr);
      }

      @include md {
         grid-template-columns: 1fr;
      }
   }

   &__card {
      padding: var(--space-8);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-primary);
   }

   &__user {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
   }

   &__avatar {
      @include flex-center;
      flex: 0 0 auto;
      width: 40px;
      height: 40px;

      border-radius: var(--radius-full);

      font-size: var(--text-sm);
      font-weight: var(--font-bold);

      &--orange {
         background: #ea580c;
      }

      &--green {
         background: #16a34a;
      }

      &--purple {
         background: #9333ea;
      }
   }

   &__name {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
   }

   &__level {
      display: inline-flex;
      padding: 2px var(--space-2);

      border-radius: 4px;
      background: var(--color-border);

      color: var(--color-text-secondary);
      font-size: 11px;
   }

   &__quote {
      color: var(--color-text-secondary);
      font-size: var(--text-base);
      font-style: italic;
   }
}
</style>
