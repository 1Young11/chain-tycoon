import type { PortfolioAsset, PortfolioPeriod, PortfolioTransaction } from './portfolio.types'

export const portfolioPeriods: PortfolioPeriod[] = ['24H', '7D', '1M', '3M', 'ALL']

export const portfolioAssets: PortfolioAsset[] = [
   {
      ticker: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      price: 64250,
      holdings: 0.0524,
      avgBuy: 61310,
      change: 1.52,
      color: '#f7931a',
      colorRgb: '247, 147, 26',
      sparkline: [15, 12, 18, 8, 10, 2],
   },
   {
      ticker: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      price: 3420,
      holdings: 0.665,
      avgBuy: 3110,
      change: 0.82,
      color: '#627eea',
      colorRgb: '98, 126, 234',
      sparkline: [18, 14, 10, 12, 6, 4],
   },
   {
      ticker: 'SOL',
      name: 'Solana',
      icon: 'S',
      price: 142.8,
      holdings: 10,
      avgBuy: 145.95,
      change: -0.64,
      color: '#14f195',
      colorRgb: '20, 241, 149',
      sparkline: [4, 8, 6, 14, 12, 18],
   },
   {
      ticker: 'USDT',
      name: 'Tether',
      icon: '₮',
      price: 1,
      holdings: 675,
      avgBuy: 1,
      change: 0.01,
      color: '#26a17b',
      colorRgb: '38, 161, 123',
      sparkline: [10, 9, 10, 9, 10, 9],
   },
]

export const portfolioTransactions: PortfolioTransaction[] = [
   { id: 1, type: 'buy', title: 'Bought Bitcoin', details: '0.012 BTC at $63,820 · Today, 09:15', amount: -765.84 },
   { id: 2, type: 'sell', title: 'Sold Ethereum', details: '0.10 ETH at $3,420 · Today, 12:45', amount: 342 },
   { id: 3, type: 'mining', title: 'Mining Income', details: 'Alpha Rig and Beta Station · Today, 14:00', amount: 49 },
   { id: 4, type: 'buy', title: 'Bought Solana', details: '4 SOL at $144.10 · Yesterday, 18:30', amount: -576.4 },
   { id: 5, type: 'reward', title: 'Event Reward', details: 'ETF Approval · Yesterday, 21:10', amount: 520 },
]
