<script setup lang="ts">
import { portfolioPeriods } from '../model/portfolio.data'
import { formatCurrency } from '../model/usePortfolio'
import type { PortfolioPeriod } from '../model/portfolio.types'

defineProps<{
   portfolioValue: number
   availableCash: number
   investedValue: number
   totalPnl: number
   activePeriod: PortfolioPeriod
   isBalanceHidden: boolean
}>()

const emit = defineEmits<{
   periodChange: [period: PortfolioPeriod]
   balanceToggle: []
   buy: []
   sell: []
}>()
</script>

<template>
   <section class="portfolio-summary portfolio-card" aria-labelledby="portfolio-balance-label">
      <div class="portfolio-summary__balance-panel">
         <div>
            <div class="portfolio-summary__label-row">
               <span id="portfolio-balance-label" class="portfolio-summary__label">Total portfolio value</span>
               <button
                  class="portfolio-summary__visibility"
                  type="button"
                  :aria-label="isBalanceHidden ? 'Show portfolio balance' : 'Hide portfolio balance'"
                  @click="emit('balanceToggle')"
               >
                  <i class="fa-regular" :class="isBalanceHidden ? 'fa-eye-slash' : 'fa-eye'"></i>
               </button>
            </div>

            <div class="portfolio-summary__value text-mono">
               {{ isBalanceHidden ? '••••••••' : formatCurrency(portfolioValue) }}
            </div>
            <div class="portfolio-summary__pnl text-mono">
               <span>+$731.20</span>
               <span>(+9.51% all time)</span>
            </div>
         </div>

         <div class="portfolio-summary__periods" aria-label="Portfolio period">
            <button
               v-for="period in portfolioPeriods"
               :key="period"
               class="portfolio-summary__period"
               :class="{ 'portfolio-summary__period--active': activePeriod === period }"
               type="button"
               @click="emit('periodChange', period)"
            >
               {{ period }}
            </button>
         </div>
      </div>

      <div class="portfolio-summary__details">
         <dl class="portfolio-summary__metrics">
            <div class="portfolio-summary__metric">
               <dt>Available Cash</dt>
               <dd class="text-mono">{{ formatCurrency(availableCash) }}</dd>
            </div>
            <div class="portfolio-summary__metric">
               <dt>Invested</dt>
               <dd class="text-mono">{{ formatCurrency(investedValue) }}</dd>
            </div>
            <div class="portfolio-summary__metric">
               <dt>Assets Owned</dt>
               <dd class="text-mono">4</dd>
            </div>
            <div class="portfolio-summary__metric">
               <dt>Today's PnL</dt>
               <dd class="portfolio-summary__metric-value--profit text-mono">+{{ formatCurrency(342.4) }}</dd>
            </div>
         </dl>

         <div class="portfolio-summary__actions">
            <button class="portfolio-button portfolio-button--primary" type="button" @click="emit('buy')">
               <i class="fa-solid fa-plus"></i>
               Buy Asset
            </button>
            <button class="portfolio-button portfolio-button--secondary" type="button" @click="emit('sell')">
               <i class="fa-solid fa-minus"></i>
               Sell Asset
            </button>
         </div>
      </div>
   </section>
</template>

<style scoped lang="scss">
.portfolio-summary {
   display: grid;
   grid-template-columns: minmax(0, 1fr) minmax(360px, 1.15fr);
   padding: 0;
   overflow: hidden;

   &__balance-panel,
   &__details {
      display: flex;
      min-height: 194px;
      flex-direction: column;
      justify-content: space-between;
      padding: 22px 24px;
   }

   &__balance-panel {
      border-right: 1px solid var(--color-border);
   }

   &__label-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
   }

   &__label {
      color: var(--color-text-secondary);
      font-size: 11px;
      font-weight: var(--font-semibold);
      letter-spacing: 0.06em;
      text-transform: uppercase;
   }

   &__visibility {
      display: grid;
      width: 24px;
      height: 24px;
      place-items: center;
      border-radius: var(--radius-sm);
      color: var(--color-text-muted);

      &:hover,
      &:focus-visible {
         background: var(--color-bg-elevated);
         color: var(--color-text-primary);
      }
   }

   &__value {
      margin-top: var(--space-3);
      font-size: 32px;
      font-weight: var(--font-bold);
      letter-spacing: -0.04em;
      line-height: 1;
   }

   &__pnl {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-top: var(--space-2);
      color: var(--color-profit);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
   }

   &__periods {
      display: flex;
      width: fit-content;
      gap: 2px;
      padding: 3px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-sm);
      background: var(--color-bg-elevated);
   }

   &__period {
      padding: 5px 10px;
      border-radius: 6px;
      color: var(--color-text-secondary);
      font-size: 11px;
      font-weight: var(--font-semibold);

      &:hover { color: var(--color-text-primary); }

      &--active {
         background: var(--color-accent);
         color: #fff;
      }
   }

   &__metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 24px;
   }

   &__metric {
      display: grid;
      gap: 4px;

      dt {
         color: var(--color-text-secondary);
         font-size: 11px;
      }

      dd {
         font-size: var(--text-base);
         font-weight: var(--font-semibold);
      }
   }

   &__metric-value--profit { color: var(--color-profit); }

   &__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
      padding-top: var(--space-3);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
   }
}

@include md {
   .portfolio-summary {
      grid-template-columns: 1fr;

      &__balance-panel { border-right: 0; border-bottom: 1px solid var(--color-border); }
      &__balance-panel,
      &__details { min-height: 180px; padding: var(--space-5); }
   }
}
</style>
