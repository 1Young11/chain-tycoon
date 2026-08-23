export interface MarketQuote {
   symbol: string
   priceUsd: string
   change24hPercent: string | null
   providerUpdatedAt: string
   fetchedAt: string
}

export interface MarketSnapshot {
   quotes: MarketQuote[]
   isStale: boolean
}

export interface MarketResponse {
   success: true
   data: MarketSnapshot
}

export interface MarketState {
   quotes: MarketQuote[]
   loading: boolean
   error: string
   isStale: boolean
   isInitialized: boolean
}