export type TradeMode = 'buy' | 'sell'

export type PortfolioPeriod = '24H' | '7D' | '1M' | '3M' | 'ALL'

export type PortfolioAsset = {
   ticker: string
   name: string
   icon: string
   price: number
   holdings: number
   avgBuy: number
   change: number
   color: string
   colorRgb: string
   sparkline: number[]
}

export type PortfolioTransaction = {
   id: number
   type: 'buy' | 'sell' | 'mining' | 'reward'
   title: string
   details: string
   amount: number
}
