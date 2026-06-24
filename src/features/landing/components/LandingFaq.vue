<script setup lang="ts">
   import { ref } from 'vue';

   const activeItem = ref(0);

   const toggleItem = (index: number) => {
      activeItem.value = activeItem.value === index ? -1 : index;
   };
</script>

<template>
   <section class="landing-faq">
      <div class="landing-faq__container">
         <header class="landing-faq__header">
            <h2 class="landing-faq__title">Frequently Asked Questions</h2>
            <p class="landing-faq__description">
               Everything you need to know about the platform sandbox architecture.
            </p>
         </header>

         <div class="landing-faq__accordion">
            <article class="landing-faq__item" :class="{ 'landing-faq__item--active': activeItem === 0 }">
               <button class="landing-faq__button" type="button" @click="toggleItem(0)">
                  <span>Is this real money?</span>
                  <i class="fa-solid fa-plus landing-faq__icon"></i>
               </button>
               <div class="landing-faq__panel">
                  <p>No, Chain Tycoon is purely a simulation platform. You trade with virtual money provided at registration to experience trading without real financial risks.</p>
               </div>
            </article>

            <article class="landing-faq__item" :class="{ 'landing-faq__item--active': activeItem === 1 }">
               <button class="landing-faq__button" type="button" @click="toggleItem(1)">
                  <span>Where do prices come from?</span>
                  <i class="fa-solid fa-plus landing-faq__icon"></i>
               </button>
               <div class="landing-faq__panel">
                  <p>All core cryptocurrency quotes are accurate reflections streamed from real-world spot prices utilizing market data APIs.</p>
               </div>
            </article>

            <article class="landing-faq__item" :class="{ 'landing-faq__item--active': activeItem === 2 }">
               <button class="landing-faq__button" type="button" @click="toggleItem(2)">
                  <span>What is a mining farm?</span>
                  <i class="fa-solid fa-plus landing-faq__icon"></i>
               </button>
               <div class="landing-faq__panel">
                  <p>Mining farms are in-game assets you can purchase and optimize. They produce automated generation loops for your simulated account.</p>
               </div>
            </article>

            <article class="landing-faq__item" :class="{ 'landing-faq__item--active': activeItem === 3 }">
               <button class="landing-faq__button" type="button" @click="toggleItem(3)">
                  <span>Can I lose everything?</span>
                  <i class="fa-solid fa-plus landing-faq__icon"></i>
               </button>
               <div class="landing-faq__panel">
                  <p>Yes, bad trades or ignoring dangerous market events can drop your balance to zero. You can reset your sandbox and try again.</p>
               </div>
            </article>

            <article class="landing-faq__item" :class="{ 'landing-faq__item--active': activeItem === 4 }">
               <button class="landing-faq__button" type="button" @click="toggleItem(4)">
                  <span>How does leaderboard work?</span>
                  <i class="fa-solid fa-plus landing-faq__icon"></i>
               </button>
               <div class="landing-faq__panel">
                  <p>The leaderboard calculates global player metrics based on simulated net worth across cash, assets, and ecosystem equipment.</p>
               </div>
            </article>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.landing-faq {
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

   &__accordion {
      @include flex-col;
      gap: var(--space-3);
      max-width: 800px;
      margin: 0 auto;
   }

   &__item {
      overflow: hidden;

      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg-primary);

      &--active {
         .landing-faq__icon {
            transform: rotate(45deg);
         }

         .landing-faq__panel {
            max-height: 220px;
            padding: 0 var(--space-6) var(--space-5);
         }
      }
   }

   &__button {
      @include flex-between;
      width: 100%;
      gap: var(--space-4);
      padding: var(--space-5) var(--space-6);

      color: var(--color-text-primary);
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      text-align: left;
   }

   &__icon {
      flex: 0 0 auto;

      color: var(--color-accent);
      transition: transform var(--duration-base) var(--ease-default);
   }

   &__panel {
      max-height: 0;
      padding-inline: var(--space-6);
      overflow: hidden;

      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      transition:
         max-height var(--duration-base) var(--ease-default),
         padding var(--duration-base) var(--ease-default);
   }
}
</style>
