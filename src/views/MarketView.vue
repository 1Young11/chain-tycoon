<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MarketSummary from '../features/market/components/MarketSummary.vue'
import MarketQuotesTable from '../features/market/components/MarketQuotesTable.vue'
import MarketAssetDetails from '../features/market/components/MarketAssetDetails.vue'
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
         <div v-if="!selectedQuote" class="market-view__overview" key="overview">
            <MarketSummary />
            <MarketQuotesTable @select-quote="handleQuoteSelect" />
         </div>
         <MarketAssetDetails @back="handleDetailsBack" :quote="selectedQuote" key="details" v-else />
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
}

@media (max-width: 640px) {
   .market-view {
      padding: var(--space-4);
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
