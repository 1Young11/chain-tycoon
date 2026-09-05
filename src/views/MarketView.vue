<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MarketSummary from '../features/market/components/MarketSummary.vue'
import MarketQuotesTable from '../features/market/components/MarketQuotesTable.vue'
import MarketAssetDetails from '../features/market/components/MarketAssetDetails.vue'
import MarketToolbar from '../features/market/components/MarketToolbar.vue'
import { useMarketStore } from '@/features/market'
import type { MarketQuote } from '../features/market/model/market.types'

const marketStore = useMarketStore()

const selectedQuote = ref<MarketQuote | null>(null)

const handleQuoteSelect = (quote: MarketQuote) => {
   selectedQuote.value = quote
}

const handleDetailsBack = () => {
   selectedQuote.value = null
}

onMounted(async () => {
   await marketStore.loadQuotes()
})
</script>

<template>
   <div class="market-view">
      <Transition name="market-content" mode="out-in">
         <div v-if="!selectedQuote && marketStore.loading && !marketStore.hasQuotes" class="market-view__initial-loading" key="initial-loading">
            Loading market data...
         </div>
         <section
            class="market-view__error"
            v-else-if="!selectedQuote && !marketStore.loading && !marketStore.hasQuotes && marketStore.error"
            key="error"
            role="alert"
            aria-atomic="true"
         >
            <h2 class="market-view__error-title">Unable to load market data</h2>
            <p class="market-view__error-message">{{ marketStore.error }}</p>
            <button class="market-view__retry-button" type="button" @click="marketStore.loadQuotes()">Try again</button>
         </section>
         <section
            v-else-if="!selectedQuote && marketStore.isInitialized && !marketStore.loading && !marketStore.hasQuotes && !marketStore.error"
            class="market-view__empty"
            key="empty"
            aria-labelledby="market-empty-title"
         >
            <h2 id="market-empty-title" class="market-view__empty-title">No market data available</h2>
            <button class="market-view__retry-button" type="button" @click="marketStore.loadQuotes()">Refresh</button>
         </section>
         <div v-else-if="!selectedQuote && marketStore.hasQuotes" class="market-view__overview" key="overview">
            <MarketToolbar />
            <div v-if="marketStore.error" class="market-view__refresh-error" role="alert" aria-atomic="true">
               <strong class="market-view__refresh-error-title">Unable to refresh market data.</strong>
               <span class="market-view__refresh-error-message">{{ marketStore.error }}</span>
            </div>
            <MarketSummary />
            <MarketQuotesTable @select-quote="handleQuoteSelect" />
         </div>
         <MarketAssetDetails @back="handleDetailsBack" :quote="selectedQuote" key="details" v-else-if="selectedQuote" />
      </Transition>
   </div>
</template>

<style scoped lang="scss">
.market-view {
   width: 100%;
   min-width: 0;
   padding: var(--space-6) var(--space-8);

   &__overview {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: var(--space-6);
   }

   &__initial-loading {
      font-size: 22px;
   }

   &__error,
   &__empty {
      display: flex;
      min-height: 240px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: var(--space-3);
      padding: var(--space-6);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-secondary);
      text-align: center;
   }

   &__error-title,
   &__empty-title {
      color: var(--color-text-primary);
      font-size: var(--text-xl);
   }

   &__error-message {
      max-width: 560px;
      color: var(--color-text-secondary);
      line-height: 1.5;
   }

   &__refresh-error {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--color-warning);
      border-radius: var(--radius-sm);
      background: var(--color-warning-subtle);
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      line-height: 1.5;
   }

   &__refresh-error-title {
      flex: 0 0 auto;
      color: var(--color-warning);
   }

   &__refresh-error-message {
      min-width: 0;
      overflow-wrap: anywhere;
   }

   &__retry-button {
      min-height: var(--control-height-md);
      margin-top: var(--space-2);
      padding: 0 var(--space-5);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-sm);
      background: var(--color-accent);
      color: #fff;
      font-weight: var(--font-semibold);
      transition:
         background-color var(--transition-base),
         border-color var(--transition-base);

      &:hover {
         border-color: var(--color-accent-hover);
         background: var(--color-accent-hover);
      }

      &:focus-visible {
         outline: var(--focus-ring);
         outline-offset: var(--focus-offset);
      }
   }
}

@media (max-width: 640px) {
   .market-view {
      padding: var(--space-4);

      &__refresh-error {
         flex-direction: column;
      }
   }
}

.market-content-enter-active {
   transition:
      opacity 220ms ease-out,
      transform 220ms ease-out;
}

.market-content-leave-active {
   transition:
      opacity 160ms ease-in,
      transform 160ms ease-in;
}

.market-content-enter-from {
   opacity: 0;
   transform: translateY(8px);
}

.market-content-leave-to {
   opacity: 0;
   transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
   .market-content-enter-active,
   .market-content-leave-active {
      transition: none;
   }
}
</style>
