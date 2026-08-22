import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware'
import { CoinGeckoProvider } from './providers/coingecko.provider'
import { MarketService } from './market.service'
import { createMarketController } from './market.controller'

const provider = new CoinGeckoProvider();
const service = new MarketService(provider);
const controller = createMarketController(service);

const router = Router();
router.get('/quotes', requireAuth, controller.getQuotes)

export default router