<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMarketStore } from '../model/market.store'
import type { MarketQuote } from '../model/market.types'
import { formatChangePercent, formatProviderUpdatedAt, formatUsdPrice } from '../utils/market.formatters'
import { getAssetPresentation, getChangeDirection } from '../utils/market.presentation'

const marketStore = useMarketStore()

type MarketFilter = 'all' | 'gainers' | 'losers'
type MarketSort = 'default' | 'name' | 'price-desc' | 'price-asc' | 'change-desc' | 'change-asc' | 'updated'

const filters: ReadonlyArray<{ value: MarketFilter; label: string }> = [
   { value: 'all', label: 'All' },
   { value: 'gainers', label: 'Gainers' },
   { value: 'losers', label: 'Losers' },
]

const searchQuery = ref('')
const selectedFilter = ref<MarketFilter>('all')
const selectedSort = ref<MarketSort>('default')

const getChangePercentage = (quote: MarketQuote): number | null => {
   return quote.change24hPercent === null ? null : Number(quote.change24hPercent)
}

const getChangeModifier = (quote: MarketQuote): string => {
   const changeDirection = getChangeDirection(quote.change24hPercent)
   return changeDirection !== null ? `market-quotes__change--${changeDirection}` : ''
}

const visibleQuotes = computed(() => {
   const normalizedQuery = searchQuery.value.trim().toLowerCase()
   const quotes = marketStore.quotes.filter((quote) => {
      const change = getChangePercentage(quote)
      const matchesFilter =
         selectedFilter.value === 'all' ||
         (selectedFilter.value === 'gainers' && change !== null && change > 0) ||
         (selectedFilter.value === 'losers' && change !== null && change < 0)
      const asset = getAssetPresentation(quote.symbol)
      const matchesQuery =
         normalizedQuery.length === 0 ||
         quote.symbol.toLowerCase().includes(normalizedQuery) ||
         asset.name.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesQuery
   })

   if (selectedSort.value === 'default') return quotes

   return quotes.sort((left, right) => {
      switch (selectedSort.value) {
         case 'name':
            return getAssetPresentation(left.symbol).name.localeCompare(getAssetPresentation(right.symbol).name)
         case 'price-desc':
            return Number(right.priceUsd) - Number(left.priceUsd)
         case 'price-asc':
            return Number(left.priceUsd) - Number(right.priceUsd)
         case 'change-desc':
            return (getChangePercentage(right) ?? Number.NEGATIVE_INFINITY) -
               (getChangePercentage(left) ?? Number.NEGATIVE_INFINITY)
         case 'change-asc':
            return (getChangePercentage(left) ?? Number.POSITIVE_INFINITY) -
               (getChangePercentage(right) ?? Number.POSITIVE_INFINITY)
         case 'updated':
            return Date.parse(right.providerUpdatedAt) - Date.parse(left.providerUpdatedAt)

         default:
            return 0
      }
   })
})

const quoteRows = computed(() => {
   const quotes = visibleQuotes.value.map((quote) => {
      return { quote: quote, presentation: getAssetPresentation(quote.symbol) }
   })
   return quotes
})
</script>

<template>
   <section class="market-quotes" aria-labelledby="market-assets-title">
      <header class="market-quotes__header">
         <div class="market-quotes__heading">
            <h2 id="market-assets-title" class="market-quotes__title">
               Market Assets
               <span class="market-quotes__count">{{ marketStore.quotes.length }} total</span>
            </h2>
            <p class="market-quotes__description">Select an asset to explore its price history</p>
         </div>
      </header>

      <div class="market-quotes__toolbar">
         <label class="market-quotes__search">
            <span class="sr-only">Search assets</span>
            <i class="market-quotes__search-icon fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input v-model="searchQuery" class="market-quotes__search-input" type="search"
               placeholder="Search asset name or symbol..." />
         </label>

         <label class="market-quotes__sort-label">
            <span class="sr-only">Sort market assets</span>
            <select v-model="selectedSort" class="market-quotes__sort">
               <option value="default">Sort by: Default</option>
               <option value="name">Name</option>
               <option value="price-desc">Price: High to Low</option>
               <option value="price-asc">Price: Low to High</option>
               <option value="change-desc">24h Change: Gainers</option>
               <option value="change-asc">24h Change: Losers</option>
               <option value="updated">Last Updated</option>
            </select>
         </label>

         <div class="market-quotes__filters" aria-label="Filter market assets">
            <button v-for="filter in filters" :key="filter.value" class="market-quotes__filter"
               :class="{ 'market-quotes__filter--active': selectedFilter === filter.value }" type="button"
               :aria-pressed="selectedFilter === filter.value" @click="selectedFilter = filter.value">
               {{ filter.label }}
            </button>
         </div>
      </div>

      <div class="market-quotes__table-scroll">
         <table class="market-quotes__table">
            <colgroup>
               <col class="market-quotes__column market-quotes__column--asset" />
               <col class="market-quotes__column market-quotes__column--price" />
               <col class="market-quotes__column market-quotes__column--change" />
               <col class="market-quotes__column market-quotes__column--updated" />
               <!-- <col class="market-quotes__column market-quotes__column--action" /> -->
            </colgroup>
            <thead>
               <tr>
                  <th scope="col">Asset</th>
                  <th scope="col">Price</th>
                  <th scope="col">24h Change</th>
                  <th scope="col">Provider Updated</th>
                  <!-- <th scope="col"><span class="sr-only">Details</span></th> -->
               </tr>
            </thead>
            <tbody>
               <tr v-for="row in quoteRows" :key="row.quote.symbol" class="market-quotes__row">
                  <td>
                     <div class="market-quotes__asset">
                        <span class="market-quotes__asset-icon" :style="{
                           background: row.presentation.background,
                           color: row.presentation.foreground ?? '#fff',
                        }">
                           {{ row.presentation.glyph }}
                        </span>
                        <span class="market-quotes__asset-info">
                           <strong class="market-quotes__symbol text-mono">{{ row.quote.symbol }}</strong>
                           <small class="market-quotes__asset-name">{{ row.presentation.name }}</small>
                        </span>
                     </div>
                  </td>
                  <td class="market-quotes__price text-mono">{{ formatUsdPrice(row.quote.priceUsd) }}</td>
                  <td>
                     <span class="market-quotes__change text-mono" :class="getChangeModifier(row.quote)">
                        {{ formatChangePercent(row.quote.change24hPercent) }}
                     </span>
                  </td>
                  <td class="market-quotes__updated">{{ formatProviderUpdatedAt(row.quote.providerUpdatedAt) }}</td>
                  <!-- <td class="market-quotes__action">
                     <i class="market-quotes__chevron fa-solid fa-chevron-right" aria-hidden="true"></i>
                  </td> -->
               </tr>
               <tr v-if="marketStore.quotes.length === 0">
                  <td class="market-quotes__empty" colspan="4">No market data available.</td>
               </tr>
               <tr v-if="quoteRows.length === 0 && marketStore.quotes.length !== 0">
                  <td class="market-quotes__empty" colspan="4">No assets match the selected filters.</td>
               </tr>
            </tbody>
         </table>
      </div>

      <footer class="market-quotes__footer">
         <span>{{ visibleQuotes.length }} assets shown</span>
         <span>Simulated market environment · Educational purpose</span>
      </footer>
   </section>
</template>

<style lang="scss" scoped>
.market-quotes {
   display: flex;
   flex-direction: column;
   border: 1px solid var(--color-border);
   border-radius: var(--radius-lg);
   background: var(--color-bg-secondary);
   overflow: hidden;
   box-shadow: var(--shadow-md);

   &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-6) var(--space-6) var(--space-4);
   }

   &__heading {
      min-width: 0;
   }

   &__title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--text-display-sm);
      font-weight: var(--font-bold);
   }

   &__count {
      padding: 2px var(--space-2);
      border-radius: var(--radius-full);
      background: var(--color-bg-elevated);
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      white-space: nowrap;
   }

   &__description {
      margin-top: var(--space-1);
      color: var(--color-text-secondary);
      font-size: 13px;
   }

   &__toolbar {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: 0 var(--space-6) var(--space-5);
   }

   &__search {
      position: relative;
      flex: 1;
      min-width: 180px;
   }

   &__search-icon {
      position: absolute;
      top: 50%;
      left: 14px;
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      pointer-events: none;
      transform: translateY(-50%);
   }

   &__search-input,
   &__sort {
      height: var(--control-height-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
      font: inherit;
      font-size: var(--text-sm);
      outline: none;
      transition: border-color var(--transition-base), box-shadow var(--transition-base);

      &:focus-visible {
         border-color: var(--color-accent);
         box-shadow: 0 0 0 2px var(--color-accent-subtle);
      }
   }

   &__search-input {
      width: 100%;
      padding: 0 14px 0 40px;
   }

   &__sort-label {
      flex: 0 0 auto;
   }

   &__sort {
      min-width: 190px;
      padding: 0 36px 0 var(--space-4);
      cursor: pointer;
   }

   &__filters {
      display: flex;
      flex: 0 0 auto;
      gap: 2px;
      padding: 3px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg-primary);
   }

   &__filter {
      min-height: 32px;
      padding: 0 14px;
      border-radius: 6px;
      color: var(--color-text-secondary);
      font-size: 13px;
      font-weight: var(--font-semibold);
      transition: background-color var(--transition-base), color var(--transition-base);

      &:hover {
         color: var(--color-text-primary);
      }

      &--active {
         background: var(--color-accent);
         color: #fff;
      }
   }

   &__table-scroll {
      max-height: 520px;
      border-block: 1px solid var(--color-border);
      overflow: auto;
      scrollbar-color: var(--color-bg-elevated) var(--color-bg-secondary);
      scrollbar-width: thin;
   }

   &__table {
      width: 100%;
      min-width: 760px;
      border-collapse: collapse;
      table-layout: fixed;

      th {
         position: sticky;
         z-index: 2;
         top: 0;
         padding: 14px var(--space-6);
         border-bottom: 1px solid var(--color-border);
         background: var(--color-bg-secondary);
         color: var(--color-text-secondary);
         font-size: var(--text-xs);
         font-weight: var(--font-semibold);
         letter-spacing: var(--tracking-wide);
         text-align: left;
         text-transform: uppercase;
      }

      td {
         padding: var(--space-4) var(--space-6);
         border-bottom: 1px solid var(--color-border-subtle);
         font-size: var(--text-sm);
         text-align: left;
      }
   }

   &__column {
      &--asset {
         width: 38%;
      }

      &--price {
         width: 18%;
      }

      &--change {
         width: 18%;
      }

      &--updated {
         width: 20%;
      }

      &--action {
         width: 6%;
      }
   }

   &__row {
      transition: background-color var(--transition-fast);

      &:hover {
         background: var(--color-accent-subtle);
      }

      &:last-child td {
         border-bottom: 0;
      }
   }

   &__asset {
      display: flex;
      align-items: center;
      gap: var(--space-3);
   }

   &__asset-icon {
      display: grid;
      width: 32px;
      height: 32px;
      flex: 0 0 auto;
      place-items: center;
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: var(--font-bold);
   }

   &__asset-info {
      display: flex;
      min-width: 0;
      flex-direction: column;
   }

   &__symbol {
      color: var(--color-text-primary);
      font-weight: var(--font-bold);
   }

   &__asset-name,
   &__updated {
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
   }

   &__price {
      font-weight: var(--font-semibold);
   }

   &__change {
      display: inline-flex;
      align-items: center;
      padding: var(--space-1) var(--space-2);
      border-radius: 6px;
      font-size: 13px;
      font-weight: var(--font-semibold);

      &--positive {
         background: var(--color-profit-subtle);
         color: var(--color-profit);
      }

      &--negative {
         background: var(--color-loss-subtle);
         color: var(--color-loss);
      }

      &--neutral {
         background: var(--color-bg-elevated);
         color: var(--color-text-secondary);
      }
   }

   &__action {
      text-align: right;
   }

   &__chevron {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      transition: color var(--transition-base), transform var(--transition-base);
   }

   &__row:hover &__chevron {
      color: var(--color-accent);
      transform: translateX(2px);
   }

   &__empty {
      padding: var(--space-8) !important;
      color: var(--color-text-secondary);
      text-align: center !important;
   }

   &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      padding: 14px var(--space-6);
      background: rgba(255, 255, 255, 0.015);
      color: var(--color-text-secondary);
      font-size: 13px;
   }
}

@media (max-width: 1024px) {
   .market-quotes {
      &__toolbar {
         flex-wrap: wrap;
      }

      &__search {
         flex-basis: 100%;
      }

      &__sort-label {
         flex: 1;
      }

      &__sort {
         width: 100%;
      }
   }
}

@media (max-width: 640px) {
   .market-quotes {
      &__header {
         padding: var(--space-5) var(--space-4) var(--space-4);
      }

      &__toolbar {
         align-items: stretch;
         gap: var(--space-3);
         padding: 0 var(--space-4) var(--space-4);
      }

      &__sort-label {
         flex-basis: 100%;
      }

      &__filters {
         width: 100%;
      }

      &__filter {
         flex: 1;
         padding-inline: var(--space-2);
      }

      &__footer {
         align-items: flex-start;
         flex-direction: column;
         padding-inline: var(--space-4);
      }
   }
}
</style>
