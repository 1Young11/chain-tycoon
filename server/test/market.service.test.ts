/// <reference types="node" />

import test from 'node:test'
import assert from 'node:assert/strict'
import { MarketAssetNotFoundError, MarketService } from '../src/modules/market/market.service'
import type { MarketProvider } from '../src/modules/market/providers/market-provider'
import type { MarketQuote, MarketHistory } from '../src/modules/market/market.types'

const quotes: MarketQuote[] = [
   {
      symbol: 'BTC',
      priceUsd: '100000.25',
      change24hPercent: '2.5',
      providerUpdatedAt: '2026-08-15T12:00:00.000Z',
      fetchedAt: '2026-08-15T12:00:01.000Z',
   },
]
const freshSnapshot = { quotes: quotes, isStale: false }
const history: MarketHistory = { symbol: 'BTC', period: '7d', points: [{ timestamp: 1_700_000_000_000, priceUsd: '100000.25' }], fetchedAt: '2026-08-15T12:00:01.000Z' }
const updatedHistory: MarketHistory = { symbol: 'BTC', period: '7d', points: [{ timestamp: 1_700_000_000_000, priceUsd: '100500.25' }], fetchedAt: '2026-08-15T12:05:01.000Z' }
const freshHistorySnapshot = { ...history, isStale: false }

test('reuses fresh cached quotes without calling provider again', async () => {
   let providerCalls = 0

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchQuotes() {
         providerCalls += 1
         return quotes
      },
      async fetchHistory() {
         throw new Error('fetchHistory should not be called in quote tests')
      },
   }

   const service = new MarketService(fakeProvider)

   const firstResult = await service.getQuotes()
   const secondResult = await service.getQuotes()

   assert.deepEqual(firstResult, freshSnapshot)
   assert.deepEqual(secondResult, freshSnapshot)
   assert.equal(providerCalls, 1)
})

test('refreshes quotes after the cache expires', async () => {
   let providerCalls = 0
   let currentTime = 1_000_000

   const now = () => currentTime

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchQuotes() {
         providerCalls += 1
         return quotes
      },
      async fetchHistory() {
         throw new Error('fetchHistory should not be called in quote tests')
      },
   }

   const service = new MarketService(fakeProvider, now)

   await service.getQuotes()

   currentTime += 60_000

   await service.getQuotes()

   assert.equal(providerCalls, 2)
})

test('shares one provider request between concurrent calls', async () => {
   let providerCalls = 0

   let completeProviderRequest: (result: MarketQuote[]) => void = () => {
      throw new Error('Provider request was not initialized')
   }

   const pendingProviderRequest = new Promise<MarketQuote[]>((resolve) => {
      completeProviderRequest = resolve
   })

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchQuotes() {
         providerCalls += 1
         return pendingProviderRequest
      },
      async fetchHistory() {
         throw new Error('fetchHistory should not be called in quote tests')
      },
   }

   const service = new MarketService(fakeProvider)

   const firstRequest = service.getQuotes()
   const secondRequest = service.getQuotes()

   assert.equal(providerCalls, 1)

   completeProviderRequest(quotes)

   const [firstResult, secondResult] = await Promise.all([
      firstRequest,
      secondRequest,
   ])

   assert.deepEqual(firstResult, freshSnapshot)
   assert.deepEqual(secondResult, freshSnapshot)
   assert.equal(providerCalls, 1)
})

test('returning an outdated cache on Provider error', async () => {
   let providerCalls = 0
   let currentTime = 1_000_000

   const now = () => currentTime

   const staleSnapshot = { quotes: quotes, isStale: true }

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchQuotes() {
         providerCalls += 1
         if (providerCalls === 2) {
            throw new Error('Provider unavailable')
         }
         return quotes
      },
      async fetchHistory() {
         throw new Error('fetchHistory should not be called in quote tests')
      },
   }

   const service = new MarketService(fakeProvider, now)

   await service.getQuotes()

   currentTime += 60_000

   const secondRequest = await service.getQuotes()

   assert.equal(providerCalls, 2)

   assert.deepEqual(secondRequest, staleSnapshot)
})

test('propagates provider error when no cached quotes exist', async () => {
   let providerCalls = 0

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchQuotes() {
         providerCalls += 1
         throw new Error('Provider unavailable')
      },
      async fetchHistory() {
         throw new Error('fetchHistory should not be called in quote tests')
      },
   }

   const service = new MarketService(fakeProvider)

   await assert.rejects(
      () => service.getQuotes(),
      /Provider unavailable/,
   )

   assert.equal(providerCalls, 1)
})

test('reuses fresh cached history without calling provider again', async () => {
   let providerCalls = 0
   const currentTime = 1_000_000

   const now = () => currentTime

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory() {
         providerCalls += 1
         return history
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }
   const service = new MarketService(fakeProvider, now)
   const firstResult = await service.getHistory('BTC', '7d')
   const secondResult = await service.getHistory('BTC', '7d')
   assert.deepEqual(firstResult, freshHistorySnapshot)
   assert.deepEqual(secondResult, freshHistorySnapshot)
   assert.equal(providerCalls, 1)
})

test('refreshes history after the cache expires', async () => {
   let providerCalls = 0
   let currentTime = 300_000

   const now = () => currentTime

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory() {
         providerCalls += 1
         if (providerCalls === 1) {
            return history
         } else {
            return updatedHistory
         }
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }
   const service = new MarketService(fakeProvider, now)
   const firstResult = await service.getHistory('BTC', '7d')
   currentTime = 600_000
   const secondResult = await service.getHistory('BTC', '7d')
   assert.deepEqual(firstResult, freshHistorySnapshot)
   assert.deepEqual(secondResult, { ...updatedHistory, isStale: false })
   assert.equal(providerCalls, 2)
})

test('shares one history provider request between concurrent calls', async () => {
   let providerCalls = 0

   let completeProviderRequest: (result: MarketHistory) => void = () => {
      throw new Error('Provider request was not initialized')
   }
   const pendingProviderRequest = new Promise<MarketHistory>((resolve) => {
      completeProviderRequest = resolve
   })

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory() {
         providerCalls += 1
         return pendingProviderRequest
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }
   const service = new MarketService(fakeProvider)

   const firstRequest = service.getHistory('BTC', '7d')
   const secondRequest = service.getHistory('BTC', '7d')
   assert.equal(providerCalls, 1)

   completeProviderRequest(history)

   const [firstResult, secondResult] = await Promise.all([
      firstRequest,
      secondRequest,
   ])

   assert.deepEqual(firstResult, freshHistorySnapshot)
   assert.deepEqual(secondResult, freshHistorySnapshot)
   assert.equal(providerCalls, 1)
})

test('returns stale history when refresh fails', async () => {
   let providerCalls = 0
   let currentTime = 1_000_000

   const now = () => currentTime

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory() {
         providerCalls += 1
         if (providerCalls === 2) {
            throw new Error('Provider unavailable')
         }
         return history
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }

   const service = new MarketService(fakeProvider, now)

   await service.getHistory('BTC', '7d')

   currentTime += 300_000

   const staleResult = await service.getHistory('BTC', '7d')

   assert.equal(providerCalls, 2)
   assert.deepEqual(staleResult, { ...history, isStale: true })
})

test('retries history after a provider error when no cache exists', async () => {
   let providerCalls = 0

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory() {
         providerCalls += 1
         if (providerCalls === 1) {
            throw new Error('Provider unavailable')
         }
         return history
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }

   const service = new MarketService(fakeProvider)

   await assert.rejects(
      () => service.getHistory('BTC', '7d'),
      /Provider unavailable/,
   )

   const retryResult = await service.getHistory('BTC', '7d')

   assert.equal(providerCalls, 2)
   assert.deepEqual(retryResult, freshHistorySnapshot)
})

test('caches history separately for different assets', async () => {
   const providerRequests: string[] = []

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory(asset, period) {
         providerRequests.push(`${asset.symbol}:${period}`)
         return { ...history, symbol: asset.symbol, period }
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }

   const service = new MarketService(fakeProvider)

   const bitcoinHistory = await service.getHistory('BTC', '7d')
   const ethereumHistory = await service.getHistory('ETH', '7d')
   const cachedBitcoinHistory = await service.getHistory('BTC', '7d')
   const cachedEthereumHistory = await service.getHistory('ETH', '7d')

   assert.deepEqual(providerRequests, ['BTC:7d', 'ETH:7d'])
   assert.deepEqual(bitcoinHistory, { ...history, symbol: 'BTC', isStale: false })
   assert.deepEqual(ethereumHistory, { ...history, symbol: 'ETH', isStale: false })
   assert.deepEqual(cachedBitcoinHistory, bitcoinHistory)
   assert.deepEqual(cachedEthereumHistory, ethereumHistory)
})

test('caches history separately for different periods', async () => {
   const providerRequests: string[] = []

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory(asset, period) {
         providerRequests.push(`${asset.symbol}:${period}`)
         return { ...history, symbol: asset.symbol, period }
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }

   const service = new MarketService(fakeProvider)

   const sevenDayHistory = await service.getHistory('BTC', '7d')
   const thirtyDayHistory = await service.getHistory('BTC', '30d')
   const cachedSevenDayHistory = await service.getHistory('BTC', '7d')
   const cachedThirtyDayHistory = await service.getHistory('BTC', '30d')

   assert.deepEqual(providerRequests, ['BTC:7d', 'BTC:30d'])
   assert.deepEqual(sevenDayHistory, { ...history, period: '7d', isStale: false })
   assert.deepEqual(thirtyDayHistory, { ...history, period: '30d', isStale: false })
   assert.deepEqual(cachedSevenDayHistory, sevenDayHistory)
   assert.deepEqual(cachedThirtyDayHistory, thirtyDayHistory)
})

test('normalizes history symbols before reading the cache', async () => {
   let providerCalls = 0

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory() {
         providerCalls += 1
         return history
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }

   const service = new MarketService(fakeProvider)

   const firstResult = await service.getHistory('BTC', '7d')
   const normalizedResult = await service.getHistory(' btc ', '7d')

   assert.equal(providerCalls, 1)
   assert.deepEqual(normalizedResult, firstResult)
})

test('rejects unknown history symbols without calling the provider', async () => {
   let providerCalls = 0

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchHistory() {
         providerCalls += 1
         return history
      },
      async fetchQuotes() {
         throw new Error('fetchQuotes should not be called in history tests')
      },
   }

   const service = new MarketService(fakeProvider)

   await assert.rejects(
      () => service.getHistory('UNKNOWN', '7d'),
      MarketAssetNotFoundError,
   )

   assert.equal(providerCalls, 0)
})
