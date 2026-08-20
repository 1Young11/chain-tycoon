/// <reference types="node" />

import test from 'node:test'
import assert from 'node:assert/strict'
import { CoinGeckoProvider } from '../src/modules/market/providers/coingecko.provider'

test('returns empty quotes without calling fetch', async () => {
   let fetchCalls = 0

   const fakeFetch: typeof fetch = async () => {
      fetchCalls += 1
      throw new Error('Fake fetch should not be called')
   }

   const provider = new CoinGeckoProvider(fakeFetch)
   const quotes = await provider.fetchQuotes([])

   assert.deepEqual(quotes, [])
   assert.equal(fetchCalls, 0)
})

test('normalizes a successful CoinGecko response', async (t) => {
   const previousApiKey = process.env.COINGECKO_DEMO_API_KEY
   process.env.COINGECKO_DEMO_API_KEY = 'test-api-key'

   t.after(() => {
      if (previousApiKey === undefined) {
         delete process.env.COINGECKO_DEMO_API_KEY
      } else {
         process.env.COINGECKO_DEMO_API_KEY = previousApiKey
      }
   })

   const fakeFetch: typeof fetch = async (input, init) => {
      const requestUrl = new URL(String(input))
      const headers = new Headers(init?.headers)

      assert.equal(requestUrl.searchParams.get('ids'), 'bitcoin')
      assert.equal(requestUrl.searchParams.get('vs_currencies'), 'usd')
      assert.equal(requestUrl.searchParams.get('include_24hr_change'), 'true')
      assert.equal(requestUrl.searchParams.get('include_last_updated_at'), 'true')
      assert.equal(requestUrl.searchParams.get('precision'), 'full')
      assert.equal(headers.get('x-cg-demo-api-key'), 'test-api-key')

      return new Response(
         JSON.stringify({
            bitcoin: {
               usd: 100000.25,
               usd_24h_change: 2.5,
               last_updated_at: 1_700_000_000,
            },
         }),
         {
            status: 200,
            headers: {
               'Content-Type': 'application/json',
            },
         },
      )
   }

   const provider = new CoinGeckoProvider(fakeFetch)

   const quotes = await provider.fetchQuotes([
      {
         providerId: 'bitcoin',
         symbol: 'BTC',
         name: 'Bitcoin',
         precision: 8,
      },
   ])

   assert.equal(quotes.length, 1)

   const quote = quotes[0]
   assert.ok(quote)

   assert.equal(quote.symbol, 'BTC')
   assert.equal(quote.priceUsd, '100000.25')
   assert.equal(quote.change24hPercent, '2.5')
   assert.equal(
      quote.providerUpdatedAt,
      new Date(1_700_000_000 * 1000).toISOString(),
   )
   assert.equal(Number.isNaN(Date.parse(quote.fetchedAt)), false)
})

test('rejects an unsuccessful CoinGecko response', async (t) => {
   const previousApiKey = process.env.COINGECKO_DEMO_API_KEY
   process.env.COINGECKO_DEMO_API_KEY = 'test-api-key'

   t.after(() => {
      if (previousApiKey === undefined) {
         delete process.env.COINGECKO_DEMO_API_KEY
      } else {
         process.env.COINGECKO_DEMO_API_KEY = previousApiKey
      }
   })

   const fakeFetch: typeof fetch = async () => {
      return new Response(
         JSON.stringify({
            error: 'Rate limit exceeded',
         }),
         {
            status: 429,
            headers: {
               'Content-Type': 'application/json',
            },
         },
      )
   }

   const provider = new CoinGeckoProvider(fakeFetch)

   const assets = [
      {
         providerId: 'bitcoin',
         symbol: 'BTC',
         name: 'Bitcoin',
         precision: 8,
      },
   ]

   await assert.rejects(
      () => provider.fetchQuotes(assets),
      /CoinGecko request failed with status 429/,
   )
})

test('rejects a response without the requested asset', async (t) => {
   const previousApiKey = process.env.COINGECKO_DEMO_API_KEY
   process.env.COINGECKO_DEMO_API_KEY = 'test-api-key'

   t.after(() => {
      if (previousApiKey === undefined) {
         delete process.env.COINGECKO_DEMO_API_KEY
      } else {
         process.env.COINGECKO_DEMO_API_KEY = previousApiKey
      }
   })

   const fakeFetch: typeof fetch = async () => {
      return new Response(JSON.stringify({}), {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }

   const provider = new CoinGeckoProvider(fakeFetch)

   const assets = [
      {
         providerId: 'bitcoin',
         symbol: 'BTC',
         name: 'Bitcoin',
         precision: 8,
      },
   ]

   await assert.rejects(
      () => provider.fetchQuotes(assets),
      /CoinGecko returned invalid data for bitcoin/,
   )
})