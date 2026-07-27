<script setup lang="ts">
import { computed } from 'vue'
import type { PortfolioAsset } from '../model/portfolio.types'
import { formatCurrency } from '../model/usePortfolio'

const props = defineProps<{ assets: PortfolioAsset[]; investedValue: number }>()

const allocations = computed(() => {
   const total = props.assets.reduce((sum, asset) => sum + asset.price * asset.holdings, 0)
   return props.assets.map((asset) => ({
      ...asset,
      value: asset.price * asset.holdings,
      percentage: Math.round(((asset.price * asset.holdings) / total) * 100),
   }))
})

const donutStyle = computed(() => {
   let start = 0
   const stops = allocations.value.map((asset) => {
      const end = start + asset.percentage
      const stop = `${asset.color} ${start}% ${end}%`
      start = end
      return stop
   })
   return { background: `conic-gradient(${stops.join(', ')})` }
})
</script>

<template>
   <article class="allocation portfolio-card">
      <header class="portfolio-card__header">
         <div>
            <h2 class="portfolio-card__title">Asset Allocation</h2>
            <p class="portfolio-card__subtitle">{{ assets.length }} assets held</p>
         </div>
      </header>

      <div class="allocation__chart" :style="donutStyle">
         <div class="allocation__center">
            <strong class="text-mono">{{ formatCurrency(investedValue, 0) }}</strong>
            <span>Invested</span>
         </div>
      </div>

      <ul class="allocation__legend">
         <li v-for="asset in allocations" :key="asset.ticker" class="allocation__item">
            <span class="allocation__identity">
               <i class="allocation__dot" :style="{ backgroundColor: asset.color }"></i>
               {{ asset.name }}
               <small>{{ asset.percentage }}%</small>
            </span>
            <span class="allocation__amount text-mono">{{ formatCurrency(asset.value) }}</span>
         </li>
      </ul>
   </article>
</template>

<style scoped lang="scss">
.allocation {
   display: flex;
   flex-direction: column;
   align-items: center;

   .portfolio-card__header { width: 100%; }

   &__chart {
      position: relative;
      width: 146px;
      height: 146px;
      margin: 2px auto 18px;
      border-radius: 50%;

      &::after {
         position: absolute;
         inset: 16px;
         border-radius: inherit;
         background: var(--color-bg-tertiary);
         content: '';
      }
   }

   &__center {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      strong { font-size: var(--text-sm); }
      span { color: var(--color-text-secondary); font-size: 10px; }
   }

   &__legend {
      display: grid;
      width: 100%;
      gap: 8px;
   }

   &__item,
   &__identity {
      display: flex;
      align-items: center;
   }

   &__item {
      justify-content: space-between;
      gap: var(--space-3);
      font-size: 11px;
   }

   &__identity { gap: 7px; }
   &__dot { width: 8px; height: 8px; border-radius: 50%; }
   &__identity small { color: var(--color-text-muted); font-size: 10px; }
   &__amount { color: var(--color-text-secondary); }
}
</style>
