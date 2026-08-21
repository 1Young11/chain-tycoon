/// <reference types="node" />

import test from 'node:test'
import assert from 'node:assert/strict'
import { MarketService } from '../src/modules/market/market.service'
import type { MarketProvider } from '../src/modules/market/providers/market-provider'
import type { MarketQuote } from '../src/modules/market/market.types'

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

test('reuses fresh cached quotes without calling provider again', async () => {
   let providerCalls = 0

   const fakeProvider: MarketProvider = {
      name: 'fake',

      async fetchQuotes() {
         providerCalls += 1
         return quotes
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
   }

   const service = new MarketService(fakeProvider)

   await assert.rejects(
      () => service.getQuotes(),
      /Provider unavailable/,
   )

   assert.equal(providerCalls, 1)
})