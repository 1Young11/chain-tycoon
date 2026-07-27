<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { PortfolioAsset, TradeMode } from '../model/portfolio.types'
import { formatCurrency } from '../model/usePortfolio'

const props = defineProps<{
   isOpen: boolean
   asset: PortfolioAsset
   mode: TradeMode
   availableCash: number
}>()

const emit = defineEmits<{
   close: []
   modeChange: [mode: TradeMode]
   confirm: [message: string]
}>()

const amount = ref(0.01)
const closeButton = ref<HTMLButtonElement | null>(null)

const estimatedValue = computed(() => Math.max(amount.value || 0, 0) * props.asset.price)
const fee = computed(() => estimatedValue.value * 0.002)
const total = computed(() => props.mode === 'buy' ? estimatedValue.value + fee.value : estimatedValue.value - fee.value)
const availableLabel = computed(() => props.mode === 'buy' ? 'Available Cash' : `Available ${props.asset.ticker}`)
const availableValue = computed(() => props.mode === 'buy' ? formatCurrency(props.availableCash) : `${props.asset.holdings} ${props.asset.ticker}`)

const applyPercentage = (percentage: number) => {
   const maxAmount = props.mode === 'buy' ? props.availableCash / props.asset.price : props.asset.holdings
   amount.value = Number((maxAmount * percentage).toFixed(4))
}

const confirmTrade = () => {
   const verb = props.mode === 'buy' ? 'Purchase' : 'Sale'
   emit('confirm', `${verb} preview: ${amount.value} ${props.asset.ticker} for ${formatCurrency(total.value)}`)
   emit('close')
}

const handleKeydown = (event: KeyboardEvent) => {
   if (event.key === 'Escape' && props.isOpen) emit('close')
}

watch(
   () => props.isOpen,
   async (isOpen) => {
      document.body.style.overflow = isOpen ? 'hidden' : ''
      if (isOpen) {
         amount.value = 0.01
         await nextTick()
         closeButton.value?.focus()
      }
   },
)

window.addEventListener('keydown', handleKeydown)
onBeforeUnmount(() => {
   window.removeEventListener('keydown', handleKeydown)
   document.body.style.overflow = ''
})
</script>

<template>
   <Teleport to="body">
      <Transition name="trade-fade">
         <button v-if="isOpen" class="trade-panel__overlay" type="button" aria-label="Close trade panel" @click="emit('close')"></button>
      </Transition>

      <Transition name="trade-slide">
         <aside v-if="isOpen" class="trade-panel" role="dialog" aria-modal="true" aria-labelledby="trade-panel-title">
            <header class="trade-panel__header">
               <div>
                  <span class="trade-panel__eyebrow">Quick trade</span>
                  <h2 id="trade-panel-title">{{ mode === 'buy' ? 'Buy' : 'Sell' }} {{ asset.name }}</h2>
               </div>
               <button ref="closeButton" class="trade-panel__close" type="button" aria-label="Close trade panel" @click="emit('close')">
                  <i class="fa-solid fa-xmark"></i>
               </button>
            </header>

            <div class="trade-panel__asset">
               <span class="trade-panel__asset-identity">
                  <span class="trade-panel__asset-icon" :style="{ color: asset.color, backgroundColor: `rgba(${asset.colorRgb}, .14)` }">{{ asset.icon }}</span>
                  <span><strong>{{ asset.name }}</strong><small>{{ asset.ticker }}</small></span>
               </span>
               <span class="trade-panel__asset-market">
                  <strong class="text-mono">{{ formatCurrency(asset.price) }}</strong>
                  <small class="text-mono" :class="asset.change >= 0 ? 'trade-panel__profit' : 'trade-panel__loss'">{{ asset.change >= 0 ? '+' : '' }}{{ asset.change.toFixed(2) }}%</small>
               </span>
            </div>

            <div class="trade-panel__tabs" role="tablist" aria-label="Trade action">
               <button :class="{ 'trade-panel__tab--active': mode === 'buy' }" class="trade-panel__tab" type="button" role="tab" :aria-selected="mode === 'buy'" @click="emit('modeChange', 'buy')">Buy</button>
               <button :class="{ 'trade-panel__tab--active': mode === 'sell' }" class="trade-panel__tab" type="button" role="tab" :aria-selected="mode === 'sell'" @click="emit('modeChange', 'sell')">Sell</button>
            </div>

            <div class="trade-panel__form">
               <label class="trade-panel__label" for="trade-amount">
                  <span>Amount</span>
                  <span>{{ availableLabel }} · <strong class="text-mono">{{ availableValue }}</strong></span>
               </label>
               <div class="trade-panel__input-wrap">
                  <input id="trade-amount" v-model.number="amount" min="0" step="0.0001" type="number" inputmode="decimal" />
                  <span>{{ asset.ticker }}</span>
               </div>

               <div class="trade-panel__percentages" aria-label="Quick amount selection">
                  <button v-for="percentage in [0.25, 0.5, 0.75, 1]" :key="percentage" type="button" @click="applyPercentage(percentage)">
                     {{ percentage === 1 ? 'MAX' : `${percentage * 100}%` }}
                  </button>
               </div>

               <dl class="trade-panel__breakdown">
                  <div><dt>Estimated Value</dt><dd class="text-mono">{{ formatCurrency(estimatedValue) }}</dd></div>
                  <div><dt>Trading Fee (0.2%)</dt><dd class="text-mono">{{ formatCurrency(fee) }}</dd></div>
                  <div class="trade-panel__total"><dt>{{ mode === 'buy' ? 'Total Cost' : 'You Receive' }}</dt><dd class="text-mono">{{ formatCurrency(total) }}</dd></div>
               </dl>
            </div>

            <button
               class="trade-panel__confirm"
               :class="{ 'trade-panel__confirm--sell': mode === 'sell' }"
               type="button"
               :disabled="amount <= 0"
               @click="confirmTrade"
            >
               Confirm {{ mode === 'buy' ? 'Purchase' : 'Sale' }}
            </button>
         </aside>
      </Transition>
   </Teleport>
</template>

<style scoped lang="scss">
.trade-panel {
   position: fixed;
   top: 0;
   right: 0;
   z-index: calc(var(--z-modal) + 1);
   display: flex;
   width: min(390px, 100%);
   height: 100vh;
   flex-direction: column;
   padding: var(--space-5);
   border-left: 1px solid var(--color-border);
   background: var(--color-bg-secondary);
   box-shadow: -16px 0 48px rgba(0, 0, 0, 0.55);

   &__overlay {
      position: fixed;
      inset: 0;
      z-index: var(--z-modal);
      background: rgba(3, 3, 8, 0.68);
      backdrop-filter: blur(3px);
      cursor: default;
   }

   &__header,
   &__asset,
   &__asset-identity,
   &__label,
   &__breakdown div { display: flex; align-items: center; justify-content: space-between; }
   &__header { padding-bottom: var(--space-5); border-bottom: 1px solid var(--color-border); }
   &__eyebrow { color: var(--color-accent); font-size: 9px; font-weight: var(--font-bold); letter-spacing: 0.1em; text-transform: uppercase; }
   &__header h2 { margin-top: 3px; font-size: var(--text-base); }
   &__close { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-elevated); color: var(--color-text-secondary); }
   &__close:hover,
   &__close:focus-visible { color: var(--color-text-primary); outline: 1px solid var(--color-accent); }

   &__asset { margin: var(--space-5) 0; padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-tertiary); }
   &__asset-identity { gap: 10px; }
   &__asset-identity > span:last-child,
   &__asset-market { display: grid; }
   &__asset-identity strong { font-size: var(--text-xs); }
   &__asset-identity small,
   &__asset-market small { color: var(--color-text-secondary); font-size: 9px; }
   &__asset-icon { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; font-weight: var(--font-bold); }
   &__asset-market { text-align: right; }
   &__asset-market strong { font-size: var(--text-xs); }
   &__profit { color: var(--color-profit) !important; }
   &__loss { color: var(--color-loss) !important; }

   &__tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; padding: 3px; border-radius: var(--radius-sm); background: var(--color-bg-primary); }
   &__tab { padding: 8px; border-radius: 6px; color: var(--color-text-secondary); font-size: var(--text-xs); font-weight: var(--font-semibold); }
   &__tab--active { background: var(--color-bg-elevated); color: var(--color-text-primary); box-shadow: var(--shadow-sm); }
   &__form { flex: 1; padding-top: var(--space-6); }
   &__label { margin-bottom: 7px; color: var(--color-text-secondary); font-size: 10px; }
   &__label strong { color: var(--color-text-primary); }
   &__input-wrap { position: relative; }
   &__input-wrap input { width: 100%; height: 48px; padding: 0 64px 0 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); outline: none; background: var(--color-bg-tertiary); color: var(--color-text-primary); font-family: var(--font-mono); font-size: var(--text-sm); }
   &__input-wrap input:focus { border-color: var(--color-accent); box-shadow: 0 0 0 3px var(--color-accent-subtle); }
   &__input-wrap > span { position: absolute; top: 50%; right: 14px; transform: translateY(-50%); color: var(--color-text-secondary); font-family: var(--font-mono); font-size: var(--text-xs); }
   &__percentages { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: var(--space-2); }
   &__percentages button { padding: 6px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-bg-tertiary); color: var(--color-text-secondary); font-size: 10px; font-weight: var(--font-semibold); }
   &__percentages button:hover { border-color: var(--color-accent); color: var(--color-text-primary); }
   &__breakdown { display: grid; gap: 10px; margin-top: var(--space-6); padding: var(--space-4); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); font-size: 10px; }
   &__breakdown dt { color: var(--color-text-secondary); }
   &__total { margin-top: 3px; padding-top: var(--space-3); border-top: 1px solid var(--color-border); font-size: var(--text-xs); font-weight: var(--font-semibold); }
   &__total dt { color: var(--color-text-primary); }
   &__confirm { width: 100%; padding: 12px; border-radius: var(--radius-sm); background: var(--color-accent); color: #fff; font-size: var(--text-xs); font-weight: var(--font-bold); }
   &__confirm--sell { background: var(--color-profit); color: #07150e; }
   &__confirm:disabled { opacity: 0.45; cursor: not-allowed; }
}

.trade-fade-enter-active,
.trade-fade-leave-active,
.trade-slide-enter-active,
.trade-slide-leave-active { transition: all var(--duration-base) var(--ease-default); }
.trade-fade-enter-from,
.trade-fade-leave-to { opacity: 0; }
.trade-slide-enter-from,
.trade-slide-leave-to { transform: translateX(100%); }
</style>
