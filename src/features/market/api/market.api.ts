import { apiRequest } from '@/shared/api/client'
import type { MarketResponse } from '../model/market.types'

export const getMarketQuotes = () => apiRequest<MarketResponse>('/market/quotes')