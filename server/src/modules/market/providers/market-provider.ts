import type { MarketAsset, MarketQuote } from '../market.types'

export interface MarketProvider {
   readonly name: string
   fetchQuotes(assets: readonly MarketAsset[]): Promise<MarketQuote[]>
}