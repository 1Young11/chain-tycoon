<script setup lang="ts">
import type { MarketQuote } from '../model/market.types'

const props = defineProps<{
   quote: MarketQuote
}>()
const emit = defineEmits<{
   'back': []
}>()

const handleBackToMarket = () => {
   emit('back')
}
</script>

<template>
   <article class="market-asset-details">
      <div class="market-asset-details__actions">
         <button class="market-asset-details__back-button" type="button" @click="handleBackToMarket">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            Back to Market
         </button>
      </div>

      <header class="market-asset-details__asset-header">
         <div class="market-asset-details__identity">
            <span class="market-asset-details__asset-icon" aria-hidden="true">₿</span>
            <div class="market-asset-details__titles">
               <h2 class="market-asset-details__name">
                  Bitcoin
                  <span class="market-asset-details__symbol">BTC</span>
               </h2>
               <p class="market-asset-details__description">
                  Explore Bitcoin’s virtual market price and historical movement.
               </p>
            </div>
         </div>

         <div class="market-asset-details__price-summary">
            <div class="market-asset-details__price-row">
               <strong class="market-asset-details__price text-mono">$64,280.50</strong>
               <span class="market-asset-details__change market-asset-details__change--positive text-mono">
                  +2.14%
               </span>
            </div>
            <span class="market-asset-details__price-caption">Bitcoin is up 2.14% over the last 24 hours.</span>
         </div>
      </header>

      <section class="market-asset-details__summary" aria-label="Bitcoin quote summary">
         <article class="market-asset-details__summary-card">
            <span class="market-asset-details__summary-title">Current price</span>
            <strong class="market-asset-details__summary-value text-mono">$64,280.50</strong>
         </article>
         <article class="market-asset-details__summary-card">
            <span class="market-asset-details__summary-title">24h change</span>
            <strong class="market-asset-details__summary-value market-asset-details__summary-value--positive text-mono">
               +2.14%
            </strong>
         </article>
         <article class="market-asset-details__summary-card">
            <span class="market-asset-details__summary-title">Provider updated</span>
            <strong class="market-asset-details__summary-value text-mono">12 seconds ago</strong>
         </article>
         <article class="market-asset-details__summary-card">
            <span class="market-asset-details__summary-title">Last sync</span>
            <strong class="market-asset-details__summary-value text-mono">Just now</strong>
         </article>
      </section>

      <div class="market-asset-details__analytics">
         <section class="market-asset-details__chart-card" aria-labelledby="price-history-title">
            <header class="market-asset-details__chart-header">
               <div class="market-asset-details__chart-heading">
                  <h3 id="price-history-title" class="market-asset-details__chart-title">Price History</h3>
                  <div class="market-asset-details__period-stats">
                     <strong class="market-asset-details__chart-price text-mono">$64,280.50</strong>
                     <span class="market-asset-details__period-change text-mono">+6.42% (30D)</span>
                  </div>
               </div>

               <div class="market-asset-details__periods" aria-label="Price history period">
                  <button class="market-asset-details__period" type="button">24H</button>
                  <button class="market-asset-details__period" type="button">7D</button>
                  <button class="market-asset-details__period market-asset-details__period--active" type="button"
                     aria-pressed="true">
                     30D
                  </button>
                  <button class="market-asset-details__period" type="button">1Y</button>
                  <button class="market-asset-details__period" type="button">ALL</button>
               </div>
            </header>

            <div class="market-asset-details__chart">
               <div class="market-asset-details__tooltip" aria-hidden="true">
                  <span class="market-asset-details__tooltip-date">24 Aug 2026</span>
                  <strong class="market-asset-details__tooltip-value text-mono">$64,280.50</strong>
               </div>

               <svg class="market-asset-details__chart-svg" viewBox="0 0 800 320" preserveAspectRatio="none" role="img"
                  aria-label="Demonstration of Bitcoin price growth over thirty days">
                  <defs>
                     <linearGradient id="market-details-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#6c63ff" stop-opacity="0.35" />
                        <stop offset="100%" stop-color="#6c63ff" stop-opacity="0" />
                     </linearGradient>
                  </defs>

                  <g class="market-asset-details__chart-grid">
                     <line x1="40" y1="40" x2="780" y2="40" />
                     <text x="35" y="44" text-anchor="end">$68k</text>
                     <line x1="40" y1="110" x2="780" y2="110" />
                     <text x="35" y="114" text-anchor="end">$64k</text>
                     <line x1="40" y1="180" x2="780" y2="180" />
                     <text x="35" y="184" text-anchor="end">$60k</text>
                     <line x1="40" y1="250" x2="780" y2="250" />
                     <text x="35" y="254" text-anchor="end">$56k</text>
                  </g>

                  <path class="market-asset-details__chart-area"
                     d="M 40,220 C 120,240 160,190 220,200 C 280,210 320,150 400,160 C 480,170 520,120 600,105 C 680,90 720,130 780,70 L 780,280 L 40,280 Z" />
                  <path class="market-asset-details__chart-line"
                     d="M 40,220 C 120,240 160,190 220,200 C 280,210 320,150 400,160 C 480,170 520,120 600,105 C 680,90 720,130 780,70" />

                  <g class="market-asset-details__chart-axis">
                     <text x="50" y="305">26 Jul</text>
                     <text x="200" y="305">02 Aug</text>
                     <text x="350" y="305">09 Aug</text>
                     <text x="500" y="305">16 Aug</text>
                     <text x="650" y="305">23 Aug</text>
                     <text x="760" y="305" text-anchor="end">Today</text>
                  </g>
                  <circle class="market-asset-details__chart-point" cx="600" cy="105" r="6" />
               </svg>
            </div>
         </section>

         <aside class="market-asset-details__insights" aria-label="Market insights">
            <section class="market-asset-details__insight-card">
               <h3 class="market-asset-details__insight-title">Period Movement</h3>
               <dl class="market-asset-details__info-list">
                  <div class="market-asset-details__info-row">
                     <dt>Direction</dt>
                     <dd class="market-asset-details__info-value--positive">Rising ↑</dd>
                  </div>
                  <div class="market-asset-details__info-row">
                     <dt>Change</dt>
                     <dd class="market-asset-details__info-value--positive text-mono">+6.42%</dd>
                  </div>
                  <div class="market-asset-details__info-row">
                     <dt>Period</dt>
                     <dd>30 days</dd>
                  </div>
               </dl>
            </section>

            <section class="market-asset-details__insight-card">
               <h3 class="market-asset-details__insight-title">Data Information</h3>
               <dl class="market-asset-details__info-list">
                  <div class="market-asset-details__info-row">
                     <dt>First point</dt>
                     <dd class="text-mono">$60,400.00</dd>
                  </div>
                  <div class="market-asset-details__info-row">
                     <dt>Latest point</dt>
                     <dd class="text-mono">$64,280.50</dd>
                  </div>
                  <div class="market-asset-details__info-row">
                     <dt>Last fetched</dt>
                     <dd>12s ago</dd>
                  </div>
                  <div class="market-asset-details__info-row">
                     <dt>Data status</dt>
                     <dd><span class="market-asset-details__fresh-status">Fresh</span></dd>
                  </div>
               </dl>
            </section>

            <aside class="market-asset-details__note">
               <i class="market-asset-details__note-icon fa-regular fa-lightbulb" aria-hidden="true"></i>
               <p>
                  Price history shows how an asset changed over time. Past movement does not predict future results.
               </p>
            </aside>
         </aside>
      </div>

      <section class="market-asset-details__education" aria-label="Chart information">
         <article class="market-asset-details__education-card">
            <span class="market-asset-details__education-icon" aria-hidden="true">
               <i class="fa-solid fa-chart-column"></i>
            </span>
            <div>
               <h3>How to read this chart</h3>
               <p>
                  The horizontal axis shows time, while the vertical axis shows price. Hover or tap on any point along
                  the curve to see the precise valuation at that specific moment.
               </p>
            </div>
         </article>

         <article class="market-asset-details__education-card">
            <span class="market-asset-details__education-icon" aria-hidden="true">
               <i class="fa-solid fa-shield-halved"></i>
            </span>
            <div>
               <h3>Virtual Market Data</h3>
               <p>
                  All prices, balances, and portfolio values in Chain Tycoon are part of a virtual educational
                  simulation designed for risk-free market learning.
               </p>
            </div>
         </article>
      </section>
   </article>
</template>

<style scoped lang="scss">
.market-asset-details {
   display: flex;
   width: 100%;
   min-width: 0;
   flex-direction: column;
   gap: var(--space-6);

   &__actions,
   &__identity,
   &__price-row,
   &__period-stats,
   &__periods,
   &__info-row,
   &__education-card {
      display: flex;
      align-items: center;
   }

   &__actions {
      justify-content: flex-start;
   }

   &__back-button {
      display: inline-flex;
      min-height: var(--control-height-sm);
      align-items: center;
      gap: var(--space-2);
      padding: 0 var(--space-4);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      color: var(--color-text-primary);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      transition:
         border-color var(--transition-base),
         background-color var(--transition-base),
         color var(--transition-base);

      &:hover,
      &:focus-visible {
         border-color: var(--color-accent);
         background: var(--color-bg-secondary);
         color: var(--color-accent-hover);
      }
   }

   &__asset-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-5);
      padding: var(--space-6) 28px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-secondary);
      box-shadow: var(--shadow-md);
   }

   &__identity {
      min-width: 0;
      gap: var(--space-4);
   }

   &__asset-icon {
      display: grid;
      width: 52px;
      height: 52px;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 50%;
      background: #f7931a;
      box-shadow: 0 0 20px rgba(247, 147, 26, 0.25);
      color: #fff;
      font-size: 26px;
      font-weight: 800;
   }

   &__titles {
      min-width: 0;
   }

   &__name {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      color: var(--color-text-primary);
      font-size: 26px;
      font-weight: 800;
      line-height: var(--leading-tight);
   }

   &__symbol {
      padding: 2px var(--space-2);
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--color-text-secondary);
      font-size: 13px;
      font-weight: var(--font-semibold);
   }

   &__description {
      margin-top: var(--space-1);
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
   }

   &__price-summary {
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      gap: var(--space-1);
      text-align: right;
   }

   &__price-row {
      gap: var(--space-3);
   }

   &__price {
      color: var(--color-text-primary);
      font-size: 32px;
      font-weight: 800;
      letter-spacing: var(--tracking-tight);
      line-height: var(--leading-tight);
   }

   &__change,
   &__period-change {
      display: inline-flex;
      align-items: center;
      border-radius: 6px;
      background: var(--color-profit-subtle);
      color: var(--color-profit);
      font-weight: var(--font-bold);
   }

   &__change {
      padding: var(--space-1) 10px;
      font-size: var(--text-sm);
   }

   &__price-caption {
      color: var(--color-text-secondary);
      font-size: 13px;
   }

   &__summary {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--space-4);
   }

   &__summary-card {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 6px;
      padding: 18px var(--space-5);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg-secondary);
   }

   &__summary-title {
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
   }

   &__summary-value {
      overflow: hidden;
      color: var(--color-text-primary);
      font-size: var(--text-xl);
      font-weight: var(--font-bold);
      text-overflow: ellipsis;
      white-space: nowrap;

      &--positive {
         color: var(--color-profit);
      }
   }

   &__analytics {
      display: grid;
      grid-template-columns: minmax(0, 72fr) minmax(260px, 28fr);
      gap: var(--space-5);
   }

   &__chart-card,
   &__insight-card {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-secondary);
   }

   &__chart-card {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: var(--space-5);
      padding: var(--space-6);
      box-shadow: var(--shadow-md);
   }

   &__chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-4);
   }

   &__chart-title {
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--text-lg);
      font-weight: var(--font-bold);
   }

   &__period-stats {
      gap: 10px;
      margin-top: 6px;
   }

   &__chart-price {
      color: var(--color-text-primary);
      font-size: 24px;
      font-weight: 800;
   }

   &__period-change {
      padding: 2px var(--space-2);
      border-radius: 4px;
      font-size: 13px;
   }

   &__periods {
      flex: 0 0 auto;
      gap: 2px;
      padding: var(--space-1);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg-primary);
      overflow-x: auto;
   }

   &__period {
      min-height: 30px;
      padding: 0 var(--space-3);
      border-radius: 6px;
      color: var(--color-text-secondary);
      font-size: 13px;
      font-weight: var(--font-semibold);
      white-space: nowrap;

      &:hover {
         color: var(--color-text-primary);
      }

      &--active {
         background: var(--color-accent);
         color: #fff;
      }
   }

   &__chart {
      position: relative;
      width: 100%;
      height: 380px;
      min-width: 0;
   }

   &__chart-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
   }

   &__chart-grid {
      line {
         stroke: rgba(42, 42, 58, 0.75);
         stroke-width: 1;
         stroke-dasharray: 4 4;
      }

      text {
         fill: var(--color-text-secondary);
         font-size: 11px;
      }
   }

   &__chart-area {
      fill: url('#market-details-gradient');
   }

   &__chart-line {
      fill: none;
      stroke: var(--color-accent);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 4px 12px var(--color-accent-glow));
   }

   &__chart-axis text {
      fill: var(--color-text-secondary);
      font-size: 11px;
   }

   &__chart-point {
      fill: var(--color-accent);
      stroke: #fff;
      stroke-width: 3;
      filter: drop-shadow(0 0 8px var(--color-accent));
   }

   &__tooltip {
      position: absolute;
      z-index: 1;
      top: 90px;
      left: 74%;
      display: flex;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-sm);
      background: rgba(22, 22, 29, 0.95);
      box-shadow: var(--shadow-md);
      flex-direction: column;
      gap: 2px;
      pointer-events: none;
      transform: translateX(-50%);
   }

   &__tooltip-date {
      color: var(--color-text-secondary);
      font-size: 11px;
   }

   &__tooltip-value {
      color: var(--color-text-primary);
      font-size: var(--text-sm);
   }

   &__insights {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: var(--space-4);
   }

   &__insight-card {
      display: flex;
      padding: var(--space-5);
      flex-direction: column;
      gap: var(--space-4);
   }

   &__insight-title {
      margin: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text-primary);
      font-size: var(--text-base);
      font-weight: var(--font-bold);
      letter-spacing: 0.02em;
   }

   &__info-list {
      display: flex;
      margin: 0;
      flex-direction: column;
      gap: var(--space-3);
   }

   &__info-row {
      justify-content: space-between;
      gap: var(--space-3);
      font-size: 13px;

      dt {
         color: var(--color-text-secondary);
      }

      dd {
         margin: 0;
         color: var(--color-text-primary);
         font-weight: var(--font-semibold);
         text-align: right;
      }

      .market-asset-details__info-value--positive {
         color: var(--color-profit);
      }
   }

   &__fresh-status {
      padding: 2px var(--space-2);
      border-radius: 4px;
      background: var(--color-profit-subtle);
      color: var(--color-profit);
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
   }

   &__note {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-4);
      border: 1px solid var(--color-border-accent);
      border-radius: var(--radius-md);
      background: var(--color-accent-subtle);

      p {
         color: var(--color-text-secondary);
         font-size: var(--text-xs);
         line-height: 1.5;
      }
   }

   &__note-icon {
      flex: 0 0 auto;
      margin-top: 2px;
      color: var(--color-warning);
      font-size: var(--icon-md);
   }

   &__education {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-4);
   }

   &__education-card {
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-5) var(--space-6);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-bg-secondary);

      h3 {
         margin: 0 0 6px;
         color: var(--color-text-primary);
         font-size: var(--text-base);
         font-weight: var(--font-bold);
      }

      p {
         color: var(--color-text-secondary);
         font-size: 13px;
         line-height: 1.5;
      }
   }

   &__education-icon {
      display: grid;
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      place-items: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.04);
      color: var(--color-accent-hover);
      font-size: var(--icon-md);
   }
}

@media (max-width: 1100px) {
   .market-asset-details {
      &__analytics {
         grid-template-columns: minmax(0, 1fr);
      }

      &__insights {
         display: grid;
         grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      &__note {
         grid-column: 1 / -1;
      }
   }
}

@media (max-width: 768px) {
   .market-asset-details {
      &__asset-header {
         align-items: flex-start;
         padding: var(--space-5);
         flex-direction: column;
      }

      &__price-summary {
         align-items: flex-start;
         text-align: left;
      }

      &__summary {
         grid-template-columns: minmax(0, 1fr);
      }

      &__chart-header {
         flex-direction: column;
      }

      &__periods {
         width: 100%;
      }

      &__period {
         flex: 1;
      }

      &__chart {
         height: 320px;
      }

      &__insights,
      &__education {
         grid-template-columns: minmax(0, 1fr);
      }

      &__note {
         grid-column: auto;
      }
   }
}

@media (max-width: 520px) {
   .market-asset-details {
      gap: var(--space-4);

      &__asset-header,
      &__chart-card,
      &__education-card {
         padding: var(--space-4);
      }

      &__name {
         align-items: flex-start;
         flex-direction: column;
         gap: var(--space-1);
      }

      &__price-row {
         align-items: flex-start;
         flex-direction: column;
         gap: var(--space-2);
      }

      &__price {
         font-size: var(--text-2xl);
      }

      &__chart {
         height: 260px;
      }

      &__tooltip {
         display: none;
      }
   }
}
</style>
