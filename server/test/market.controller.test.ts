import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { createServer, type Server } from 'node:http'
import test from 'node:test'
import express from 'express'
import { createMarketController } from '../src/modules/market/market.controller'
import type { MarketSnapshot, MarketQuote } from '../src/modules/market/market.types'
import app from '../src/app'

const listen = async (expressApp: express.Express) => {
   const httpServer = createServer(expressApp)
   await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve))
   const address = httpServer.address() as AddressInfo
   return { httpServer, url: `http://127.0.0.1:${address.port}` }
}

const close = (httpServer: Server) => new Promise<void>((resolve, reject) => {
   httpServer.close((error) => error ? reject(error) : resolve())
})

const quotes: MarketQuote[] = [
   {
      symbol: 'BTC',
      priceUsd: '100000.25',
      change24hPercent: '2.5',
      providerUpdatedAt: '2026-08-15T12:00:00.000Z',
      fetchedAt: '2026-08-15T12:00:01.000Z',
   },
]

test('returns market snapshot with status 200', async () => {
   let counterServiceCalls = 0

   const testMarketSnapshot: MarketSnapshot = { quotes: quotes, isStale: false }

   const fakeService = {
      async getQuotes() {
         counterServiceCalls += 1
         return testMarketSnapshot
      },
   }

   const controller = createMarketController(fakeService);

   const testApplication = express()
   testApplication.get('/quotes', controller.getQuotes);

   const running = await listen(testApplication)

   try {
      const response = await fetch(`${running.url}/quotes`)
      const data = await response.json()
      assert.equal(response.status, 200)

      const expectedAnswer = { success: true, data: testMarketSnapshot }

      assert.deepEqual(data, expectedAnswer)
      assert.equal(counterServiceCalls, 1)
   } finally {
      await close(running.httpServer)
   }
})

test('returns status 503 when market service fails', async () => {
   let counterServiceCalls = 0

   const fakeService = {
      async getQuotes() {
         counterServiceCalls += 1
         throw new Error('Provider unavailable')
      },
   }

   const controller = createMarketController(fakeService);

   const testApplication = express()
   testApplication.get('/quotes', controller.getQuotes);

   const running = await listen(testApplication)

   try {
      const response = await fetch(`${running.url}/quotes`)
      const data = await response.json()
      assert.equal(response.status, 503)

      const expectedAnswer = { success: false, error: 'Market data is temporarily unavailable' }

      assert.deepEqual(data, expectedAnswer)
      assert.equal(counterServiceCalls, 1)
   } finally {
      await close(running.httpServer)
   }
})

test('rejects unauthenticated requests to GET /market/quotes', async () => {
   const running = await listen(app)

   try {
      const response = await fetch(`${running.url}/market/quotes`)
      const data = await response.json()
      assert.equal(response.status, 401)

      const expectedAnswer = { success: false, error: 'Authentication required' }

      assert.deepEqual(data, expectedAnswer)
   } finally {
      await close(running.httpServer)
   }
})