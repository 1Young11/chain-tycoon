<script setup lang="ts">
import { useMarketStore } from '../model/market.store'
import { formatChangePercent, formatLastFetchedAt } from '../utils/market.formatters'
import { getChangeDirection } from '../utils/market.presentation'

const marketStore = useMarketStore()
</script>

<template>
   <ul class="market-summary" aria-label="Market summary">
      <li class="market-summary__card">
         <span class="market-summary__title">Tracked assets</span>
         <div class="market-summary__value-group">
            <strong class="market-summary__value text-mono">{{ marketStore.quotes.length }}</strong>
         </div>
      </li>
      <li class="market-summary__card">
         <span class="market-summary__title">Top gainer</span>
         <div class="market-summary__value-group">
            <strong class="market-summary__value text-mono">{{ marketStore.topGainer?.symbol ?? '—' }}</strong>
            <span class="market-summary__change text-mono" v-if="marketStore.topGainer"
               :class="`market-summary__change--${getChangeDirection(marketStore.topGainer?.change24hPercent ?? null)}`">
               {{ formatChangePercent(marketStore.topGainer?.change24hPercent ?? null) }}
            </span>
         </div>
      </li>
      <li class="market-summary__card">
         <span class="market-summary__title">Top loser</span>
         <div class="market-summary__value-group">
            <strong class="market-summary__value text-mono">{{ marketStore.topLoser?.symbol ?? '—' }}</strong>
            <span class="market-summary__change text-mono"
               :class="`market-summary__change--${getChangeDirection(marketStore.topLoser?.change24hPercent ?? null)}`"
               v-if="marketStore.topLoser">
               {{ formatChangePercent(marketStore.topLoser?.change24hPercent ?? null) }}
            </span>
         </div>
      </li>
      <li class="market-summary__card">
         <span class="market-summary__title">Last sync</span>
         <div class="market-summary__value-group">
            <strong class="market-summary__value text-mono">
               {{ formatLastFetchedAt(marketStore.lastFetchedAt) }}
            </strong>
         </div>
      </li>
   </ul>
</template>

<style scoped lang="scss">
.market-summary {
   display: grid;
   grid-template-columns: repeat(4, minmax(0, 1fr));
   gap: var(--space-4);

   &__card {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 6px;
      padding: 18px 20px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg-secondary);
   }

   &__title {
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
   }

   &__value-group {
      display: flex;
      min-width: 0;
      align-items: baseline;
      gap: var(--space-2);
   }

   &__value {
      overflow: hidden;
      color: var(--color-text-primary);
      font-size: var(--text-display-sm);
      font-weight: var(--font-bold);
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   &__change {
      font-size: var(--text-base);
      font-weight: var(--font-bold);

      &--positive {
         color: var(--color-profit);
      }

      &--negative {
         color: var(--color-loss);
      }

      &--neutral {
         color: var(--color-text-primary);
      }
   }
}

@media (max-width: 1024px) {
   .market-summary {
      grid-template-columns: repeat(2, minmax(0, 1fr));
   }
}

@media (max-width: 640px) {
   .market-summary {
      grid-template-columns: minmax(0, 1fr);
   }
}
</style>
