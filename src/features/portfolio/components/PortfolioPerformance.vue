<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PortfolioPeriod } from '../model/portfolio.types'
import { formatCurrency } from '../model/usePortfolio'

const props = defineProps<{ period: PortfolioPeriod }>()

const activePoint = ref<number | null>(null)

const seriesByPeriod: Record<PortfolioPeriod, number[]> = {
   '24H': [8010, 8090, 8050, 8180, 8240, 8330, 8420],
   '7D': [7350, 7580, 7420, 7930, 8100, 7960, 8420],
   '1M': [6900, 7140, 7550, 7430, 7890, 8160, 8420],
   '3M': [6120, 6480, 7040, 6890, 7510, 7980, 8420],
   ALL: [5000, 5590, 6240, 6800, 7180, 7690, 8420],
}

const values = computed(() => seriesByPeriod[props.period] ?? seriesByPeriod['7D'])
const points = computed(() => {
   const min = Math.min(...values.value) - 150
   const max = Math.max(...values.value) + 150

   return values.value.map((value, index) => ({
      value,
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
      x: 34 + index * 74,
      y: 174 - ((value - min) / (max - min)) * 132,
   }))
})
const linePoints = computed(() => points.value.map((point) => `${point.x},${point.y}`).join(' '))
const areaPoints = computed(() => `34,180 ${linePoints.value} 478,180`)
const highest = computed(() => Math.max(...values.value))
const lowest = computed(() => Math.min(...values.value))
const growth = computed(() => values.value.at(-1)! - values.value[0])
</script>

<template>
   <article class="performance portfolio-card">
      <header class="portfolio-card__header">
         <div>
            <h2 class="portfolio-card__title">Portfolio Performance</h2>
            <p class="portfolio-card__subtitle">Total asset value over time · {{ period }}</p>
         </div>
         <span class="performance__live"><i class="fa-solid fa-circle"></i> Live</span>
      </header>

      <div class="performance__chart">
         <svg viewBox="0 0 512 210" role="img" :aria-label="`Portfolio value chart for ${period}`">
            <defs>
               <linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#6c63ff" stop-opacity="0.28" />
                  <stop offset="1" stop-color="#6c63ff" stop-opacity="0" />
               </linearGradient>
            </defs>
            <g class="performance__grid">
               <line x1="34" y1="42" x2="478" y2="42" />
               <line x1="34" y1="108" x2="478" y2="108" />
               <line x1="34" y1="174" x2="478" y2="174" />
            </g>
            <polygon :points="areaPoints" fill="url(#portfolioArea)" />
            <polyline class="performance__line" :points="linePoints" />
            <g v-for="(point, index) in points" :key="point.label">
               <circle
                  class="performance__point-hitbox"
                  :cx="point.x"
                  :cy="point.y"
                  r="15"
                  tabindex="0"
                  @mouseenter="activePoint = index"
                  @mouseleave="activePoint = null"
                  @focus="activePoint = index"
                  @blur="activePoint = null"
               />
               <circle class="performance__point" :cx="point.x" :cy="point.y" r="4" />
               <text class="performance__day" :x="point.x" y="202">{{ point.label }}</text>
            </g>
         </svg>
         <div
            v-if="activePoint !== null"
            class="performance__tooltip text-mono"
            :style="{ left: `${(points[activePoint].x / 512) * 100}%`, top: `${(points[activePoint].y / 210) * 100}%` }"
         >
            <strong>{{ points[activePoint].label }}</strong>
            {{ formatCurrency(points[activePoint].value, 0) }}
         </div>
      </div>

      <dl class="performance__stats">
         <div><dt>Highest</dt><dd class="text-mono">{{ formatCurrency(highest, 0) }}</dd></div>
         <div><dt>Lowest</dt><dd class="text-mono">{{ formatCurrency(lowest, 0) }}</dd></div>
         <div><dt>Net Growth</dt><dd class="performance__growth text-mono">+{{ formatCurrency(growth, 0) }}</dd></div>
      </dl>
   </article>
</template>

<style scoped lang="scss">
.performance {
   min-width: 0;

   &__live {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--color-profit);
      font-size: 10px;
      font-weight: var(--font-semibold);
      text-transform: uppercase;

      i { font-size: 5px; }
   }

   &__chart {
      position: relative;
      height: 230px;

      svg { width: 100%; height: 100%; overflow: visible; }
   }

   &__grid line {
      stroke: var(--color-border);
      stroke-dasharray: 4 5;
      stroke-width: 1;
   }

   &__line {
      fill: none;
      stroke: var(--color-accent);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2.5;
   }

   &__point {
      fill: var(--color-bg-tertiary);
      pointer-events: none;
      stroke: var(--color-accent);
      stroke-width: 2;
   }

   &__point-hitbox {
      fill: transparent;
      outline: none;
      cursor: crosshair;

      &:focus + .performance__point { fill: var(--color-accent); }
   }

   &__day {
      fill: var(--color-text-muted);
      font-family: var(--font-mono);
      font-size: 9px;
      text-anchor: middle;
   }

   &__tooltip {
      position: absolute;
      z-index: 2;
      display: grid;
      gap: 2px;
      padding: 7px 9px;
      transform: translate(-50%, calc(-100% - 12px));
      border: 1px solid var(--color-border);
      border-radius: 6px;
      background: var(--color-bg-elevated);
      box-shadow: var(--shadow-md);
      font-size: 10px;
      pointer-events: none;
      white-space: nowrap;
   }

   &__stats {
      display: flex;
      justify-content: space-between;
      gap: var(--space-3);
      padding-top: var(--space-3);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 11px;

      div { display: flex; gap: 6px; }
      dt { color: var(--color-text-secondary); }
      dd { font-weight: var(--font-semibold); }
   }

   &__growth { color: var(--color-profit); }
}
</style>
