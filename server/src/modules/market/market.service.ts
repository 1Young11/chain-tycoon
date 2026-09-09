import { MARKET_ASSETS } from './market.catalog'
import type { MarketQuote, MarketSnapshot, MarketHistory, MarketHistorySnapshot, MarketAsset, MarketHistoryPeriod } from './market.types'
import type { MarketProvider } from './providers/market-provider'

const MARKET_CACHE_TTL_MS = 60_000
const MARKET_HISTORY_CACHE_TTL_MS = 300_000

type Clock = () => number

interface MarketHistoryCacheEntry {
   history: MarketHistory
   expiresAt: number
}

export class MarketService {
   private readonly provider: MarketProvider
   private readonly now: Clock
   private cachedQuotes: MarketQuote[] | null = null
   private cacheExpiresAt = 0
   private refreshRequest: Promise<MarketSnapshot> | null = null
   private readonly historyCache: Map<string, MarketHistoryCacheEntry> = new Map()
   private readonly historyRefreshRequests: Map<string, Promise<MarketHistorySnapshot>> = new Map()

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

   private getFreshCachedHistory(cacheKey: string): MarketHistory | null {
      const cachedEntry = this.historyCache.get(cacheKey)
      if (cachedEntry === undefined) return null
      if (this.now() >= cachedEntry.expiresAt) return null
      return cachedEntry.history
   }

   private refreshHistory(asset: Readonly<MarketAsset>, period: MarketHistoryPeriod): Promise<MarketHistorySnapshot> {
      const cacheKey = `${asset.symbol}:${period}`
      const existingRequest = this.historyRefreshRequests.get(cacheKey)
      if (existingRequest !== undefined) {
         return existingRequest
      }
      const refreshRequest = this.provider.fetchHistory(asset, period)
         .then((history) => {
            this.historyCache.set(cacheKey, { history, expiresAt: this.now() + MARKET_HISTORY_CACHE_TTL_MS })
            return { ...history, isStale: false }
         })
         .catch((error) => {
            const cachedEntry = this.historyCache.get(cacheKey)
            if (cachedEntry === undefined) {
               throw error
            }
            return { ...cachedEntry.history, isStale: true }
         })
         .finally(() => {
            this.historyRefreshRequests.delete(cacheKey)
         })

      this.historyRefreshRequests.set(cacheKey, refreshRequest)
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