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
      <div v-if="!selectedQuote" class="market-view__overview">
         <MarketSummary />
         <MarketQuotesTable @select-quote="handleQuoteSelect" />
      </div>
      <MarketAssetDetails @back="handleDetailsBack" :quote="selectedQuote" v-else />
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
   .market-view { padding: var(--space-4); }
}
</style>
