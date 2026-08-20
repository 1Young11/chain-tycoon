import type { MarketProvider } from './market-provider'
import type { MarketAsset, MarketQuote } from '../market.types'

const COINGECKO_SIMPLE_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price'
const COINGECKO_TIMEOUT_MS = 5_000

const isRecord = (value: unknown): value is Record<string, unknown> => {
   return (typeof value === 'object' && value !== null && !Array.isArray(value))
}

const getCoinGeckoApiKey = (): string => {
   const apiKey = process.env.COINGECKO_DEMO_API_KEY

   if (!apiKey) throw new Error('COINGECKO_DEMO_API_KEY is not configured')

   return apiKey
}

export class CoinGeckoProvider implements MarketProvider {
   readonly name = 'coingecko'
   private readonly fetcher: typeof fetch

   constructor(fetcher: typeof fetch = globalThis.fetch) {
      this.fetcher = fetcher
   }

   async fetchQuotes(assets: readonly MarketAsset[]): Promise<MarketQuote[]> {
      if (assets.length === 0) return []

      const apiKey = getCoinGeckoApiKey()

      const providerIds = assets.map((asset) => asset.providerId)
      const ids = providerIds.join(',')

      const params = new URLSearchParams()
      params.set('ids', ids)
      params.set('vs_currencies', 'usd')
      params.set('include_24hr_change', 'true')
      params.set('include_last_updated_at', 'true')
      params.set('precision', 'full')
      const requestUrl = `${COINGECKO_SIMPLE_PRICE_URL}?${params.toString()}`
      const response = await this.fetcher(requestUrl, {
         headers: {
            'x-cg-demo-api-key': apiKey,
         },
         signal: AbortSignal.timeout(COINGECKO_TIMEOUT_MS),
      })

      if (!response.ok) {
         throw new Error(`CoinGecko request failed with status ${response.status}`)
      }
      const body: unknown = await response.json()
      if (!isRecord(body)) {
         throw new Error('CoinGecko returned an invalid response body')
      }

      const quotes: MarketQuote[] = []
      const fetchedAt = new Date().toISOString()

      for (const asset of assets) {
         const providerQuote = body[asset.providerId]

         if (!isRecord(providerQuote)) {
            throw new Error(`CoinGecko returned invalid data for ${asset.providerId}`)
         }

         const usd = providerQuote['usd']
         if (typeof usd !== 'number' || !Number.isFinite(usd) || usd <= 0) {
            throw new Error(`CoinGecko returned invalid USD price for ${asset.providerId}`)
         }

         const rawChange24h = providerQuote['usd_24h_change']
         if (rawChange24h !== null && rawChange24h !== undefined && (typeof rawChange24h !== 'number' || !Number.isFinite(rawChange24h))) {
            throw new Error(`CoinGecko returned invalid 24h change for ${asset.providerId}`)
         }
         const change24hPercent = rawChange24h === null || rawChange24h === undefined ? null : String(rawChange24h)

         const rawUpdatedAt = providerQuote['last_updated_at']
         if (typeof rawUpdatedAt !== 'number' || !Number.isFinite(rawUpdatedAt) || rawUpdatedAt <= 0) {
            throw new Error(`CoinGecko returned invalid update time for ${asset.providerId}`)
         }
         const updatedAtDate = new Date(rawUpdatedAt * 1000)
         if (Number.isNaN(updatedAtDate.getTime())) {
            throw new Error(`CoinGecko returned invalid update date for ${asset.providerId}`)
         }
         const providerUpdatedAt = updatedAtDate.toISOString()

         quotes.push({
            symbol: asset.symbol,
            priceUsd: String(usd),
            change24hPercent,
            providerUpdatedAt,
            fetchedAt,
         })
      }

      return quotes
   }
}