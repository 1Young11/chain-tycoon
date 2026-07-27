<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PortfolioAsset } from '../model/portfolio.types'
import { formatCurrency } from '../model/usePortfolio'

const props = defineProps<{ assets: PortfolioAsset[] }>()
const emit = defineEmits<{ trade: [asset: PortfolioAsset] }>()

type SortOption = 'val-desc' | 'val-asc' | 'pnl-desc'

const query = ref('')
const sort = ref<SortOption>('val-desc')
const totalValue = computed(() => props.assets.reduce((sum, asset) => sum + asset.price * asset.holdings, 0))
const visibleAssets = computed(() => {
   const normalizedQuery = query.value.trim().toLowerCase()
   const list = props.assets.filter((asset) =>
      `${asset.name} ${asset.ticker}`.toLowerCase().includes(normalizedQuery),
   )

   return list.sort((first, second) => {
      const firstValue = first.price * first.holdings
      const secondValue = second.price * second.holdings
      const firstPnl = (first.price - first.avgBuy) * first.holdings
      const secondPnl = (second.price - second.avgBuy) * second.holdings

      if (sort.value === 'val-asc') return firstValue - secondValue
      if (sort.value === 'pnl-desc') return secondPnl - firstPnl
      return secondValue - firstValue
   })
})

const pnl = (asset: PortfolioAsset) => (asset.price - asset.avgBuy) * asset.holdings
const pnlPercent = (asset: PortfolioAsset) => ((asset.price - asset.avgBuy) / asset.avgBuy) * 100
const allocation = (asset: PortfolioAsset) => Math.round(((asset.price * asset.holdings) / totalValue.value) * 100)
</script>

<template>
   <section class="assets portfolio-card" aria-labelledby="assets-title">
      <header class="assets__header">
         <div>
            <h2 id="assets-title" class="portfolio-card__title">Your Assets</h2>
            <p class="portfolio-card__subtitle">Live positions and unrealized returns</p>
         </div>
         <div class="assets__controls">
            <label class="assets__search">
               <i class="fa-solid fa-magnifying-glass"></i>
               <span class="assets__sr-only">Search assets</span>
               <input v-model="query" type="search" placeholder="Search asset..." />
            </label>
            <label>
               <span class="assets__sr-only">Sort assets</span>
               <select v-model="sort" class="assets__select">
                  <option value="val-desc">Highest Value</option>
                  <option value="val-asc">Lowest Value</option>
                  <option value="pnl-desc">Highest PnL</option>
               </select>
            </label>
         </div>
      </header>

      <div class="assets__table-wrap">
         <table class="assets__table">
            <thead>
               <tr>
                  <th>Asset</th><th>Price</th><th>Holdings</th><th>Avg Buy</th><th>Allocation</th><th>PnL</th><th>Total Value</th><th><span class="assets__sr-only">Action</span></th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="asset in visibleAssets" :key="asset.ticker" @click="emit('trade', asset)">
                  <td>
                     <span class="assets__identity">
                        <span class="assets__icon" :style="{ color: asset.color, backgroundColor: `rgba(${asset.colorRgb}, .12)` }">{{ asset.icon }}</span>
                        <span><strong>{{ asset.ticker }}</strong><small>{{ asset.name }}</small></span>
                     </span>
                  </td>
                  <td class="text-mono">{{ formatCurrency(asset.price) }}</td>
                  <td class="text-mono">{{ asset.holdings }} {{ asset.ticker }}</td>
                  <td class="assets__muted text-mono">{{ formatCurrency(asset.avgBuy) }}</td>
                  <td>
                     <span class="assets__allocation">
                        <span class="text-mono">{{ allocation(asset) }}%</span>
                        <span class="assets__bar"><i :style="{ width: `${allocation(asset)}%`, backgroundColor: asset.color }"></i></span>
                     </span>
                  </td>
                  <td class="text-mono" :class="pnl(asset) >= 0 ? 'assets__profit' : 'assets__loss'">
                     {{ pnl(asset) >= 0 ? '+' : '' }}{{ formatCurrency(pnl(asset)) }} ({{ pnlPercent(asset).toFixed(2) }}%)
                  </td>
                  <td class="assets__total text-mono">{{ formatCurrency(asset.price * asset.holdings) }}</td>
                  <td><button class="assets__action" type="button" :aria-label="`Trade ${asset.name}`" @click.stop="emit('trade', asset)"><i class="fa-solid fa-ellipsis"></i></button></td>
               </tr>
               <tr v-if="visibleAssets.length === 0">
                  <td colspan="8" class="assets__empty">No assets match “{{ query }}”</td>
               </tr>
            </tbody>
         </table>
      </div>
   </section>
</template>

<style scoped lang="scss">
.assets {
   padding: var(--space-4);

   &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      margin-bottom: var(--space-3);
   }

   &__controls { display: flex; gap: var(--space-2); }
   &__search { position: relative; display: flex; align-items: center; }
   &__search i { position: absolute; left: 10px; color: var(--color-text-muted); font-size: 10px; }
   &__search input,
   &__select {
      height: 32px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      outline: none;
      background: var(--color-bg-elevated);
      color: var(--color-text-primary);
      font-size: 11px;
   }
   &__search input { width: 154px; padding: 0 10px 0 28px; }
   &__select { padding: 0 26px 0 10px; }
   &__search input:focus,
   &__select:focus { border-color: var(--color-accent); }
   &__table-wrap { overflow-x: auto; }

   &__table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      white-space: nowrap;

      th {
         padding: 9px 10px;
         border-top: 1px solid rgba(255, 255, 255, 0.05);
         border-bottom: 1px solid var(--color-border);
         color: var(--color-text-secondary);
         font-size: 10px;
         font-weight: var(--font-medium);
         text-align: left;
         text-transform: uppercase;
      }

      td { padding: 11px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.045); }
      tbody tr { cursor: pointer; transition: background var(--duration-fast) var(--ease-default); }
      tbody tr:hover { background: rgba(255, 255, 255, 0.025); }
   }

   &__identity { display: flex; align-items: center; gap: var(--space-2); }
   &__identity > span:last-child { display: flex; align-items: baseline; gap: 5px; }
   &__identity small { color: var(--color-text-secondary); font-size: 9px; }
   &__icon { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 50%; font-weight: var(--font-bold); }
   &__muted { color: var(--color-text-secondary); }
   &__profit { color: var(--color-profit); }
   &__loss { color: var(--color-loss); }
   &__total { font-weight: var(--font-semibold); }
   &__allocation { display: flex; align-items: center; gap: 7px; }
   &__bar { width: 48px; height: 4px; overflow: hidden; border-radius: var(--radius-full); background: var(--color-border); }
   &__bar i { display: block; height: 100%; border-radius: inherit; }
   &__action { display: grid; width: 26px; height: 26px; place-items: center; border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-secondary); }
   &__action:hover { background: var(--color-bg-elevated); color: var(--color-text-primary); }
   &__empty { height: 80px; color: var(--color-text-secondary); text-align: center; }
   &__sr-only { @include visually-hidden; }
}

@include md {
   .assets__header { align-items: flex-start; flex-direction: column; }
   .assets__controls { width: 100%; }
   .assets__search { flex: 1; }
   .assets__search input { width: 100%; }
}
</style>
