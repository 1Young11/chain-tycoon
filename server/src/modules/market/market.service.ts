import { MARKET_ASSETS } from './market.catalog'
import type { MarketQuote, MarketSnapshot } from './market.types'
import type { MarketProvider } from './providers/market-provider'

const MARKET_CACHE_TTL_MS = 60_000

type Clock = () => number

export class MarketService {
   private readonly provider: MarketProvider
   private readonly now: Clock
   private cachedQuotes: MarketQuote[] | null = null
   private cacheExpiresAt = 0
   private refreshRequest: Promise<MarketSnapshot> | null = null

   constructor(provider: MarketProvider, now: Clock = Date.now) {
      this.provider = provider
      this.now = now
   }

   private getFreshCachedQuotes(): MarketQuote[] | null {
      if (this.cachedQuotes === null) {
         return null
      }

      if (this.now() >= this.cacheExpiresAt) {
         return null
      }

      return this.cachedQuotes
   }

   private refreshQuotes(): Promise<MarketSnapshot> {
      if (this.refreshRequest) {
         return this.refreshRequest
      }

      const refreshRequest = this.provider
         .fetchQuotes(MARKET_ASSETS)
         .then((quotes) => {
            this.cachedQuotes = quotes
            this.cacheExpiresAt = this.now() + MARKET_CACHE_TTL_MS

            return { quotes: quotes, isStale: false }
         })
         .catch((error) => {
            if (this.cachedQuotes === null) {
               throw error;
            }
            return { quotes: this.cachedQuotes, isStale: true }
         })
         .finally(() => {
            this.refreshRequest = null
         })

      this.refreshRequest = refreshRequest;

      return refreshRequest
   }

   async getQuotes(): Promise<MarketSnapshot> {
      const cachedQuotes = this.getFreshCachedQuotes()

      if (cachedQuotes) {
         return { quotes: cachedQuotes, isStale: false }
      }

      return this.refreshQuotes()
   }
}