import type { Request, Response } from 'express'
import type { MarketSnapshot, MarketHistorySnapshot, MarketHistoryPeriod } from './market.types'
import { MarketAssetNotFoundError } from './market.service'

interface MarketServiceContract {
   getQuotes(): Promise<MarketSnapshot>
   getHistory(symbol: string, period: MarketHistoryPeriod): Promise<MarketHistorySnapshot>
}

export function createMarketController(service: MarketServiceContract) {
   async function getQuotes(_req: Request, res: Response) {
      try {
         const data = await service.getQuotes()
         res.json({ success: true, data })
      } catch (error) {
         console.error('Failed to load market quotes', error)
         res.status(503).json({ success: false, error: 'Market data is temporarily unavailable' })
      }
   }
   async function getHistory(req: Request, res: Response) {
      const symbol = req.params.symbol
      const period = req.query.period ?? '30d'
      if (typeof symbol !== 'string' || symbol.trim().length === 0) {
         return res.status(400).json({ success: false, error: 'Invalid asset symbol' })
      }
      if (period !== '24h' && period !== '7d' && period !== '30d' && period !== '1y') {
         return res.status(400).json({ success: false, error: 'Invalid history period' })
      }
      try {
         const data = await service.getHistory(symbol, period)
         res.json({ success: true, data })
      } catch (error) {
         if (error instanceof MarketAssetNotFoundError) {
            return res.status(404).json({ success: false, error: error.message })
         }
         console.error('Failed to load market history', error)
         res.status(503).json({ success: false, error: 'Market history is temporarily unavailable' })
      }
   }
   return { getQuotes, getHistory }
}