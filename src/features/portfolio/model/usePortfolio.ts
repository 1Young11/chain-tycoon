import { reactive } from 'vue'
import { portfolioAssets, portfolioTransactions } from './portfolio.data'
import type { PortfolioAsset, PortfolioPeriod, TradeMode } from './portfolio.types'

const USER_CASH = 4033.33

export const formatCurrency = (value: number, maximumFractionDigits = 2) => {
   const normalizedFractionDigits = Math.min(Math.max(Math.trunc(maximumFractionDigits), 0), 20)

   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: Math.min(2, normalizedFractionDigits),
      maximumFractionDigits: normalizedFractionDigits,
   }).format(value)
}

export const usePortfolio = () => {
   const state = reactive({
      activePeriod: '7D' as PortfolioPeriod,
      isBalanceHidden: false,
      isTradePanelOpen: false,
      tradeMode: 'buy' as TradeMode,
      selectedAsset: portfolioAssets[0] as PortfolioAsset,
      investedValue: portfolioAssets.reduce((total, asset) => total + asset.price * asset.holdings, 0),
      portfolioValue: 8420.35,
      totalPnl: portfolioAssets.reduce(
         (total, asset) => total + (asset.price - asset.avgBuy) * asset.holdings,
         0,
      ),
   })

   const openTrade = (asset: PortfolioAsset = portfolioAssets[0], mode: TradeMode = 'buy') => {
      state.selectedAsset = asset
      state.tradeMode = mode
      state.isTradePanelOpen = true
   }

   const closeTrade = () => {
      state.isTradePanelOpen = false
   }

   return {
      assets: portfolioAssets,
      transactions: portfolioTransactions,
      userCash: USER_CASH,
      state,
      openTrade,
      closeTrade,
   }
}
