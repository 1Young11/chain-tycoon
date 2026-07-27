<script setup lang="ts">
import type { PortfolioAsset } from '../model/portfolio.types'
import { formatCurrency } from '../model/usePortfolio'

defineProps<{ assets: PortfolioAsset[] }>()
const emit = defineEmits<{ trade: [asset: PortfolioAsset] }>()

const pnl = (asset: PortfolioAsset) => (asset.price - asset.avgBuy) * asset.holdings
const sparklinePoints = (values: number[]) => values.map((value, index) => `${index * 14},${value}`).join(' ')
</script>

<template>
   <section class="top-holdings" aria-labelledby="top-holdings-title">
      <header class="top-holdings__header">
         <h2 id="top-holdings-title">Top Holdings</h2>
         <span>Largest positions</span>
      </header>

      <div class="top-holdings__grid">
         <button
            v-for="asset in assets.slice(0, 3)"
            :key="asset.ticker"
            class="holding-card portfolio-card"
            type="button"
            @click="emit('trade', asset)"
         >
            <span class="holding-card__top">
               <span class="holding-card__identity">
                  <span
                     class="holding-card__icon"
                     :style="{ color: asset.color, backgroundColor: `rgba(${asset.colorRgb}, .14)` }"
                  >{{ asset.icon }}</span>
                  <span>
                     <strong>{{ asset.name }}</strong>
                     <small>{{ asset.ticker }}</small>
                  </span>
               </span>
               <i class="holding-card__arrow fa-solid fa-arrow-up-right-from-square"></i>
            </span>

            <span class="holding-card__market">
               <span>
                  <strong class="holding-card__price text-mono">{{ formatCurrency(asset.price) }}</strong>
                  <small
                     class="holding-card__change text-mono"
                     :class="asset.change >= 0 ? 'holding-card__change--profit' : 'holding-card__change--loss'"
                  >{{ asset.change >= 0 ? '+' : '' }}{{ asset.change.toFixed(2) }}%</small>
               </span>
               <svg class="holding-card__sparkline" viewBox="0 0 70 22" aria-hidden="true">
                  <polyline
                     :points="sparklinePoints(asset.sparkline)"
                     :stroke="asset.change >= 0 ? 'var(--color-profit)' : 'var(--color-loss)'"
                  />
               </svg>
            </span>

            <span class="holding-card__footer">
               <span>
                  <small>Holdings</small>
                  <strong class="text-mono">{{ asset.holdings }} {{ asset.ticker }}</strong>
               </span>
               <span class="holding-card__total">
                  <strong class="text-mono">{{ formatCurrency(asset.holdings * asset.price) }}</strong>
                  <small
                     class="text-mono"
                     :class="pnl(asset) >= 0 ? 'holding-card__change--profit' : 'holding-card__change--loss'"
                  >{{ pnl(asset) >= 0 ? '+' : '' }}{{ formatCurrency(pnl(asset)) }}</small>
               </span>
            </span>
         </button>
      </div>
   </section>
</template>

<style scoped lang="scss">
.top-holdings {
   &__header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: var(--space-3);

      h2 { font-size: var(--text-sm); }
      span { color: var(--color-text-muted); font-size: 10px; }
   }

   &__grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-4);
   }
}

.holding-card {
   display: flex;
   width: 100%;
   flex-direction: column;
   gap: var(--space-4);
   text-align: left;
   transition: transform var(--duration-base) var(--ease-default), border-color var(--duration-base) var(--ease-default);

   &:hover,
   &:focus-visible {
      border-color: var(--color-text-muted);
      outline: none;
      transform: translateY(-2px);
   }

   &__top,
   &__market,
   &__footer,
   &__identity {
      display: flex;
      align-items: center;
   }

   &__top,
   &__market,
   &__footer { justify-content: space-between; gap: var(--space-3); }
   &__identity { gap: var(--space-2); }

   &__icon {
      display: grid;
      width: 34px;
      height: 34px;
      place-items: center;
      border-radius: 50%;
      font-family: var(--font-mono);
      font-weight: var(--font-bold);
   }

   &__identity strong,
   &__identity small,
   &__market span,
   &__footer span { display: grid; }
   &__identity strong { font-size: var(--text-xs); }
   &__identity small,
   &__footer small { color: var(--color-text-secondary); font-size: 10px; }
   &__arrow { color: var(--color-text-muted); font-size: 10px; }
   &__price { font-size: var(--text-sm); }
   &__change { margin-top: 2px; font-size: 10px; }
   &__change--profit { color: var(--color-profit) !important; }
   &__change--loss { color: var(--color-loss) !important; }

   &__sparkline {
      width: 70px;
      height: 22px;

      polyline { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2; }
   }

   &__footer strong { font-size: 11px; }
   &__total { text-align: right; }
}

@include lg {
   .top-holdings__grid { grid-template-columns: 1fr; }
}
</style>
