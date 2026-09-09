import type { MarketAsset, MarketQuote, MarketHistory, MarketHistoryPeriod } from '../market.types'

export interface MarketProvider {
   readonly name: string
   fetchQuotes(assets: readonly MarketAsset[]): Promise<MarketQuote[]>
   fetchHistory(asset: Readonly<MarketAsset>, period: MarketHistoryPeriod): Promise<MarketHistory>
}