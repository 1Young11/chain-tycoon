import type { MarketAsset } from './market.types'

export const MARKET_ASSETS: MarketAsset[] = [
   { providerId: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', precision: 8 },
   { providerId: 'ethereum', symbol: 'ETH', name: 'Ethereum', precision: 8 },
   { providerId: 'solana', symbol: 'SOL', name: 'Solana', precision: 6 },
   { providerId: 'binancecoin', symbol: 'BNB', name: 'BNB', precision: 6 },
   { providerId: 'cardano', symbol: 'ADA', name: 'Cardano', precision: 6 },
]
