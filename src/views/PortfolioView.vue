<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AssetAllocation from '@/features/portfolio/components/AssetAllocation.vue'
import AssetsTable from '@/features/portfolio/components/AssetsTable.vue'
import PortfolioActivity from '@/features/portfolio/components/PortfolioActivity.vue'
import PortfolioPerformance from '@/features/portfolio/components/PortfolioPerformance.vue'
import PortfolioSummary from '@/features/portfolio/components/PortfolioSummary.vue'
import TopHoldings from '@/features/portfolio/components/TopHoldings.vue'
import TradePanel from '@/features/portfolio/components/TradePanel.vue'
import { usePortfolio } from '@/features/portfolio'
import type { PortfolioPeriod, TradeMode } from '@/features/portfolio'

const router = useRouter()
const portfolio = usePortfolio()
const notification = ref('')
let notificationTimer: ReturnType<typeof setTimeout> | undefined

const setPeriod = (period: PortfolioPeriod) => {
   portfolio.state.activePeriod = period
}

const setTradeMode = (mode: TradeMode) => {
   portfolio.state.tradeMode = mode
}

const showNotification = (message: string) => {
   notification.value = message
   if (notificationTimer) clearTimeout(notificationTimer)
   notificationTimer = setTimeout(() => {
      notification.value = ''
   }, 4000)
}
</script>

<template>
   <div class="portfolio-page">
      <header class="portfolio-page__intro">
         <div>
            <span class="portfolio-page__eyebrow">Asset command center</span>
            <h1>Your Portfolio</h1>
            <p>Track performance, manage positions, and keep your strategy balanced.</p>
         </div>
         <span class="portfolio-page__updated"><i class="fa-solid fa-rotate"></i> Updated just now</span>
      </header>

      <PortfolioSummary
         :portfolio-value="portfolio.state.portfolioValue"
         :available-cash="portfolio.userCash"
         :invested-value="portfolio.state.investedValue"
         :total-pnl="portfolio.state.totalPnl"
         :active-period="portfolio.state.activePeriod"
         :is-balance-hidden="portfolio.state.isBalanceHidden"
         @period-change="setPeriod"
         @balance-toggle="portfolio.state.isBalanceHidden = !portfolio.state.isBalanceHidden"
         @buy="portfolio.openTrade(portfolio.assets[0], 'buy')"
         @sell="portfolio.openTrade(portfolio.assets[0], 'sell')"
      />

      <section class="portfolio-page__analytics" aria-label="Portfolio analytics">
         <PortfolioPerformance :period="portfolio.state.activePeriod" />
         <AssetAllocation :assets="portfolio.assets" :invested-value="portfolio.state.investedValue" />
      </section>

      <TopHoldings :assets="portfolio.assets" @trade="portfolio.openTrade($event, 'buy')" />
      <AssetsTable :assets="portfolio.assets" @trade="portfolio.openTrade($event, 'buy')" />
      <PortfolioActivity :transactions="portfolio.transactions" @explore="router.push({ name: 'market' })" />

      <TradePanel
         :is-open="portfolio.state.isTradePanelOpen"
         :asset="portfolio.state.selectedAsset"
         :mode="portfolio.state.tradeMode"
         :available-cash="portfolio.userCash"
         @close="portfolio.closeTrade"
         @mode-change="setTradeMode"
         @confirm="showNotification"
      />

      <Transition name="portfolio-toast">
         <div v-if="notification" class="portfolio-page__toast" role="status">
            <i class="fa-solid fa-circle-check"></i>
            {{ notification }}
         </div>
      </Transition>
   </div>
</template>

<style scoped lang="scss">
.portfolio-page {
   display: flex;
   min-width: 0;
   flex-direction: column;
   gap: var(--space-5);
   padding: var(--space-5) var(--space-8) var(--space-10);
   background-image: radial-gradient(rgba(42, 42, 58, 0.52) 1px, transparent 1px);
   background-size: 24px 24px;

   &__intro {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-5);
   }

   &__eyebrow {
      color: var(--color-accent);
      font-size: 9px;
      font-weight: var(--font-bold);
      letter-spacing: 0.12em;
      text-transform: uppercase;
   }

   &__intro h1 {
      margin-top: 4px;
      font-size: var(--text-xl);
      letter-spacing: -0.025em;
   }

   &__intro p {
      margin-top: 4px;
      color: var(--color-text-secondary);
      font-size: 11px;
   }

   &__updated {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--color-text-muted);
      font-size: 10px;
      white-space: nowrap;

      i { color: var(--color-profit); font-size: 9px; }
   }

   &__analytics {
      display: grid;
      grid-template-columns: minmax(0, 1.8fr) minmax(260px, 0.82fr);
      gap: var(--space-5);
   }

   &__toast {
      position: fixed;
      right: var(--space-6);
      bottom: var(--space-6);
      z-index: var(--z-toast);
      display: flex;
      max-width: min(420px, calc(100vw - 32px));
      align-items: center;
      gap: var(--space-2);
      padding: 12px 16px;
      border: 1px solid rgba(61, 214, 140, 0.3);
      border-radius: var(--radius-sm);
      background: #17271f;
      box-shadow: var(--shadow-lg);
      color: var(--color-text-primary);
      font-size: 11px;

      i { color: var(--color-profit); }
   }
}

.portfolio-toast-enter-active,
.portfolio-toast-leave-active { transition: all var(--duration-base) var(--ease-default); }
.portfolio-toast-enter-from,
.portfolio-toast-leave-to { opacity: 0; transform: translateY(12px); }

@include lg {
   .portfolio-page {
      padding-inline: var(--space-6);
      &__analytics { grid-template-columns: 1fr; }
   }
}

@include md {
   .portfolio-page {
      padding: var(--space-5) var(--space-4) var(--space-8);
      &__updated { display: none; }
   }
}
</style>
