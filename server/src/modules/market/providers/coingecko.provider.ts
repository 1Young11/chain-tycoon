import type { MarketProvider } from './market-provider'
import type { MarketAsset, MarketQuote, MarketHistory, MarketHistoryPeriod, MarketHistoryPoint } from '../market.types'

const COINGECKO_SIMPLE_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price'
const COINGECKO_TIMEOUT_MS = 5_000
const COINGECKO_COINS_URL = 'https://api.coingecko.com/api/v3/coins'

const MARKET_HISTORY_DAYS_BY_PERIOD: Readonly<Record<MarketHistoryPeriod, number>> = {
   '24h': 1,
   '7d': 7,
   '30d': 30,
   '1y': 365,
}

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

   async fetchHistory(asset: Readonly<MarketAsset>, period: MarketHistoryPeriod): Promise<MarketHistory> {
      const apiKey = getCoinGeckoApiKey()
      const historyDays = MARKET_HISTORY_DAYS_BY_PERIOD[period].toString()

      const params = new URLSearchParams()
      params.set('vs_currency', 'usd')
      params.set('days', historyDays)
      params.set('precision', 'full')
      const requestUrl = `${COINGECKO_COINS_URL}/${encodeURIComponent(asset.providerId)}/market_chart?${params.toString()}`
      const response = await this.fetcher(requestUrl, {
         headers: {
            'x-cg-demo-api-key': apiKey,
         },
         signal: AbortSignal.timeout(COINGECKO_TIMEOUT_MS),
      })
      if (!response.ok) {
         throw new Error(`CoinGecko history request failed ${response.status}`)
      }
      const body: unknown = await response.json()
      if (!isRecord(body)) {
         throw new Error('CoinGecko returned an invalid history response body')
      }

      const rawPrices = body.prices
      if (!Array.isArray(rawPrices)) {
         throw new Error('CoinGecko returned an invalid history prices array')
      }

      const points: MarketHistoryPoint[] = []
      for (const rawPoint of rawPrices) {
         if (!Array.isArray(rawPoint) || rawPoint.length !== 2) {
            throw new Error('CoinGecko returned an invalid history point')
         }
         const rawTimestamp = rawPoint[0]
         if (typeof rawTimestamp !== 'number' || !Number.isFinite(rawTimestamp) || rawTimestamp <= 0) {
            throw new Error('CoinGecko returned an invalid history timestamp')
         }
         const rawPrice = rawPoint[1]
         if (typeof rawPrice !== 'number' || !Number.isFinite(rawPrice) || rawPrice <= 0) {
            throw new Error('CoinGecko returned an invalid history price')
         }
         points.push({
            timestamp: rawTimestamp,
            priceUsd: String(rawPrice)
         })
      }
      const fetchedAt = new Date().toISOString()
      return { symbol: asset.symbol, period: period, points: points, fetchedAt: fetchedAt }
   }
}