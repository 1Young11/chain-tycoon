<script setup lang="ts">
import type { PortfolioTransaction } from '../model/portfolio.types'
import { formatCurrency } from '../model/usePortfolio'

defineProps<{ transactions: PortfolioTransaction[] }>()
const emit = defineEmits<{ explore: [] }>()

const iconByType: Record<PortfolioTransaction['type'], string> = {
   buy: 'fa-arrow-down',
   sell: 'fa-arrow-up',
   mining: 'fa-microchip',
   reward: 'fa-gift',
}
</script>

<template>
   <section class="portfolio-activity">
      <article class="transactions portfolio-card">
         <header class="portfolio-card__header">
            <div>
               <h2 class="portfolio-card__title">Recent Transactions</h2>
               <p class="portfolio-card__subtitle">Latest portfolio activity</p>
            </div>
            <span class="transactions__count">{{ transactions.length }} entries</span>
         </header>

         <ul class="transactions__list">
            <li v-for="transaction in transactions" :key="transaction.id" class="transactions__item">
               <span class="transactions__info">
                  <span class="transactions__icon" :class="`transactions__icon--${transaction.type}`">
                     <i class="fa-solid" :class="iconByType[transaction.type]"></i>
                  </span>
                  <span>
                     <strong>{{ transaction.title }}</strong>
                     <small>{{ transaction.details }}</small>
                  </span>
               </span>
               <strong
                  class="transactions__amount text-mono"
                  :class="transaction.amount >= 0 ? 'transactions__amount--profit' : 'transactions__amount--loss'"
               >{{ transaction.amount >= 0 ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}</strong>
            </li>
         </ul>
      </article>

      <article class="insight portfolio-card">
         <div>
            <header class="insight__header">
               <span class="insight__mark"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
               <div>
                  <h2 class="portfolio-card__title">Portfolio Insight</h2>
                  <p class="portfolio-card__subtitle">Automated risk analysis</p>
               </div>
            </header>

            <p class="insight__lead">Bitcoin represents 43% of your invested capital.</p>
            <p class="insight__copy">Your portfolio is moderately concentrated. Diversifying into one additional asset could reduce market-event risk.</p>

            <dl class="insight__metrics">
               <div><dt>Risk Level</dt><dd class="insight__warning">Medium</dd></div>
               <div><dt>Diversification</dt><dd class="text-mono">72/100</dd></div>
               <div><dt>Best Performer</dt><dd class="insight__profit text-mono">ETH +9.97%</dd></div>
            </dl>
         </div>

         <button class="portfolio-button portfolio-button--primary insight__button" type="button" @click="emit('explore')">
            Explore Market <i class="fa-solid fa-arrow-right"></i>
         </button>
      </article>
   </section>
</template>

<style scoped lang="scss">
.portfolio-activity {
   display: grid;
   grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.8fr);
   gap: var(--space-5);
}

.transactions {
   &__count {
      padding: 4px 8px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      color: var(--color-text-secondary);
      font-size: 9px;
      text-transform: uppercase;
   }

   &__list { display: grid; }
   &__item,
   &__info { display: flex; align-items: center; }

   &__item {
      justify-content: space-between;
      gap: var(--space-4);
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);

      &:last-child { padding-bottom: 0; border-bottom: 0; }
   }

   &__info { min-width: 0; gap: 10px; }
   &__info > span:last-child { display: grid; min-width: 0; }
   &__info strong { font-size: 11px; }
   &__info small { overflow: hidden; color: var(--color-text-secondary); font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }

   &__icon {
      display: grid;
      width: 28px;
      height: 28px;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 7px;
      font-size: 10px;

      &--buy { background: var(--color-profit-subtle); color: var(--color-profit); }
      &--sell { background: var(--color-loss-subtle); color: var(--color-loss); }
      &--mining { background: var(--color-warning-subtle); color: var(--color-warning); }
      &--reward { background: var(--color-info-subtle); color: var(--color-info); }
   }

   &__amount { font-size: 11px; white-space: nowrap; }
   &__amount--profit { color: var(--color-profit); }
   &__amount--loss { color: var(--color-loss); }
}

.insight {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   overflow: hidden;
   background: linear-gradient(145deg, rgba(108, 99, 255, 0.12), rgba(30, 30, 42, 0.9) 48%);

   &::before {
      position: absolute;
      top: -80px;
      right: -70px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: rgba(108, 99, 255, 0.11);
      content: '';
      filter: blur(2px);
   }

   &__header { position: relative; display: flex; align-items: center; gap: 10px; margin-bottom: var(--space-5); }
   &__mark { display: grid; width: 32px; height: 32px; place-items: center; border: 1px solid rgba(108, 99, 255, 0.3); border-radius: 9px; background: rgba(108, 99, 255, 0.12); color: var(--color-accent); }
   &__lead { margin-bottom: var(--space-2); font-size: var(--text-sm); font-weight: var(--font-semibold); line-height: 1.45; }
   &__copy { color: var(--color-text-secondary); font-size: 10px; line-height: 1.65; }
   &__metrics { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: var(--space-5); padding: var(--space-3) 0; border-top: 1px solid rgba(255, 255, 255, 0.06); border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
   &__metrics div { display: grid; gap: 4px; padding: 0 10px; border-right: 1px solid var(--color-border); }
   &__metrics div:first-child { padding-left: 0; }
   &__metrics div:last-child { padding-right: 0; border-right: 0; }
   &__metrics dt { color: var(--color-text-secondary); font-size: 9px; }
   &__metrics dd { font-size: 10px; font-weight: var(--font-semibold); }
   &__warning { color: var(--color-warning); }
   &__profit { color: var(--color-profit); }
   &__button { position: relative; width: 100%; margin-top: var(--space-5); }
}

@include lg {
   .portfolio-activity { grid-template-columns: 1fr; }
}
</style>
