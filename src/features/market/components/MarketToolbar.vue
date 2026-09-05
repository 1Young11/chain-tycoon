<script setup lang="ts">
import { computed } from 'vue'

import { useMarketStore } from '@/features/market'
import { getDataStatusPresentation } from '../utils/market.presentation'
import { formatLastFetchedAt } from '../utils/market.formatters'

const marketStore = useMarketStore()
const dataStatusPresentation = computed(() => {
   return getDataStatusPresentation(marketStore.isStale)
})
</script>

<template>
   <div class="market-toolbar">
      <div class="market-toolbar__status" :class="`market-toolbar__status--${dataStatusPresentation.modifier}`">
         <span class="market-toolbar__status-dot" aria-hidden="true"></span>
         <span>{{ dataStatusPresentation.label }}</span>
      </div>
      <div class="market-toolbar__updated">Last updated: <strong>{{ formatLastFetchedAt(marketStore.lastFetchedAt) }}</strong></div>
      <button class="market-toolbar__refresh" type="button" @click="marketStore.loadQuotes()" :disabled="marketStore.loading">
         <svg
            class="market-toolbar__refresh-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
            focusable="false"
         >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
         </svg>
         {{ marketStore.loading ? 'Refreshing...' : 'Refresh' }}
      </button>
   </div>
</template>

<style scoped lang="scss">
.market-toolbar {
   display: flex;
   width: 100%;
   min-width: 0;
   align-items: center;
   justify-content: flex-end;
   gap: var(--space-4);

   &__status {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: 6px var(--space-3);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: rgba(22, 22, 29, 0.6);
      color: var(--color-text-primary);
      font-size: 13px;
      white-space: nowrap;
   }

   &__status-dot {
      width: 8px;
      height: 8px;
      flex: 0 0 auto;
      border-radius: 50%;
      background: var(--color-profit);
      box-shadow: 0 0 8px var(--color-profit);
   }

   &__status--cached &__status-dot {
      background: var(--color-warning);
      box-shadow: 0 0 8px var(--color-warning);
   }

   &__updated {
      color: var(--color-text-secondary);
      font-size: 13px;
      white-space: nowrap;

      strong {
         color: var(--color-text-primary);
         font-weight: var(--font-semibold);
      }
   }

   &__refresh {
      display: inline-flex;
      min-height: var(--control-height-sm);
      align-items: center;
      gap: 6px;
      padding: 0 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      font-size: 13px;
      font-weight: var(--font-semibold);
      transition:
         border-color var(--transition-base),
         color var(--transition-base);

      &:not(:disabled):hover,
      &:focus-visible {
         border-color: var(--color-accent);
         color: var(--color-accent-hover);
      }

      &:focus-visible {
         outline: var(--focus-ring);
         outline-offset: var(--focus-offset);
      }

      &:disabled {
         opacity: 0.5;
         cursor: not-allowed;
      }
   }

   &__refresh-icon {
      flex: 0 0 auto;
   }
}

@media (max-width: 640px) {
   .market-toolbar {
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: var(--space-3);

      &__updated {
         order: 3;
         width: 100%;
      }
   }
}
</style>
