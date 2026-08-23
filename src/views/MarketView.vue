<script setup lang="ts">
import { onMounted } from 'vue'
import { useMarketStore } from '@/features/market'

const marketStore = useMarketStore()

onMounted(async () => {
   await marketStore.loadQuotes()
})
</script>

<template>
   <div class="view">
      <h1>MarketView</h1>
      <p v-if="!marketStore.hasQuotes && marketStore.loading">Loading market data.......</p>
      <p v-else-if="!marketStore.hasQuotes && marketStore.error">
         {{ marketStore.error }}
         <button type="button" @click="marketStore.loadQuotes()">Reload</button>
      </p>
      <div v-else-if="marketStore.hasQuotes">
         <p v-if="marketStore.isStale">Showing cached market data</p>
         <p v-if="marketStore.error">{{ marketStore.error }}</p>
         <button type="button" :disabled="marketStore.loading" @click="marketStore.loadQuotes()">
            {{ marketStore.loading ? 'Refreshing....' : 'Reload' }}
         </button>
         <ul>
            <li v-for="quote in marketStore.quotes" :key="quote.symbol">
               <b>{{ quote.symbol }}: </b>{{ quote.change24hPercent }} - {{ quote.fetchedAt }} -
               ${{ quote.priceUsd }} - {{ quote.providerUpdatedAt }}
            </li>
         </ul>
      </div>
      <div v-else-if="marketStore.isInitialized">No market data available</div>
   </div>
</template>
