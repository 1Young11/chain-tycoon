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