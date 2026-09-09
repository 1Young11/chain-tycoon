export type MarketHistoryPeriod = '24h' | '7d' | '30d' | '1y'

export interface MarketAsset {
   providerId: string
   symbol: string
   name: string
   precision: number
}

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

export interface MarketHistoryPoint {
   timestamp: number
   priceUsd: string
}

export interface MarketHistory {
   symbol: string
   period: MarketHistoryPeriod
   points: MarketHistoryPoint[]
   fetchedAt: string
}

export interface MarketHistorySnapshot extends MarketHistory {
   isStale: boolean
}