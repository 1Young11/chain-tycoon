import { defineStore } from 'pinia'
import type { MarketState } from './market.types'
import { getMarketQuotes } from '../api/market.api'

export const useMarketStore = defineStore('market', {
   state: (): MarketState => ({
      quotes: [],
      loading: false,
      error: '',
      isStale: false,
      isInitialized: false
   }),

   getters: {
      hasQuotes: (state): boolean => state.quotes.length > 0
   },

   actions: {
      async loadQuotes(): Promise<boolean> {
         this.error = ''
         this.loading = true

         try {
            const response = await getMarketQuotes()
            this.quotes = response.data.quotes
            this.isStale = response.data.isStale
            return true
         } catch (error) {
            if (error instanceof Error) {
               this.error = error.message
            } else {
               this.error = "Unable to load market data"
            }
            return false
         } finally {
            this.loading = false
            this.isInitialized = true
         }
      }
   },
})
