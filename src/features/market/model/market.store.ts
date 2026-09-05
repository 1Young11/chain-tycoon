import { defineStore } from 'pinia'
import type { MarketState, MarketQuote } from './market.types'
import { getMarketQuotes } from '../api/market.api'

const findQuoteByChange = (quotes: readonly MarketQuote[], direction: 'highest' | 'lowest'): MarketQuote | null => {
   return quotes.reduce<MarketQuote | null>((selectedQuote, quote) => {
      if (quote.change24hPercent === null) return selectedQuote
      if (selectedQuote === null) return quote

      const quoteChange = Number(quote.change24hPercent)
      const selectedChange = Number(selectedQuote.change24hPercent)

      const shouldReplace = direction === 'highest' ? quoteChange > selectedChange : quoteChange < selectedChange

      return shouldReplace ? quote : selectedQuote
   }, null)
}

export const useMarketStore = defineStore('market', {
   state: (): MarketState => ({
      quotes: [],
      loading: true,
      error: '',
      isStale: false,
      isInitialized: false
   }),

   getters: {
      hasQuotes: (state): boolean => state.quotes.length > 0,

      topGainer: (state): MarketQuote | null => findQuoteByChange(state.quotes, 'highest'),
      topLoser: (state): MarketQuote | null => findQuoteByChange(state.quotes, 'lowest'),

      lastFetchedAt(state): string | null {
         return state.quotes.reduce<string | null>((selectedFetchedAt, quote) => {
            if (selectedFetchedAt === null) return quote.fetchedAt
            const isQuoteLater = Date.parse(quote.fetchedAt) > Date.parse(selectedFetchedAt)
            return isQuoteLater ? quote.fetchedAt : selectedFetchedAt
         }, null)
      }
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
