import type { Request, Response } from 'express'
import type { MarketSnapshot } from './market.types'

interface MarketQuotesService {
   getQuotes(): Promise<MarketSnapshot>
}

export function createMarketController(service: MarketQuotesService) {
   async function getQuotes(_req: Request, res: Response) {
      try {
         const data = await service.getQuotes();
         res.json({ success: true, data })
      } catch (error) {
         console.error('Failed to load market quotes', error)
         res.status(503).json({ success: false, error: 'Market data is temporarily unavailable' })
      }
   }
   return { getQuotes }
}