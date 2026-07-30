<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import EquipmentConditionBar from './EquipmentConditionBar.vue'
import EquipmentPlaceholder from './EquipmentPlaceholder.vue'
import EquipmentStatusBadge from './EquipmentStatusBadge.vue'
import { categoryLabels, formatInventoryCurrency, formatRuntime } from '../model/equipment.utils'
import type { EquipmentInstance } from '../model/equipment.types'

const props = defineProps<{ equipment: EquipmentInstance | null; open: boolean }>()
const emit = defineEmits<{
   close: []
   viewFarm: [equipment: EquipmentInstance]
   viewPerformance: [equipment: EquipmentInstance]
   replace: [equipment: EquipmentInstance]
   remove: [equipment: EquipmentInstance]
}>()

const panelRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
const isDrawer = ref(false)
let drawerMedia: MediaQueryList | undefined
let previousBodyOverflow = ''

const syncDrawer = () => { isDrawer.value = Boolean(drawerMedia?.matches) }

const syncBodyLock = () => {
   const shouldLock = props.open && isDrawer.value
   if (shouldLock) {
      if (document.body.style.overflow !== 'hidden') previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      void nextTick(() => closeButtonRef.value?.focus())
   } else {
      document.body.style.overflow = previousBodyOverflow
   }
}

const handleEscape = (event: KeyboardEvent) => {
   if (event.key === 'Escape' && props.open && isDrawer.value) emit('close')
   if (event.key !== 'Tab' || !props.open || !isDrawer.value || !panelRef.value) return

   const focusable = [...panelRef.value.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input, select, [tabindex]:not([tabindex="-1"])')]
   if (!focusable.length) return
   const first = focusable[0]
   const last = focusable[focusable.length - 1]
   if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
   } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
   }
}

watch([() => props.open, isDrawer], syncBodyLock, { flush: 'post' })

onMounted(() => {
   drawerMedia = window.matchMedia('(max-width: 1180px)')
   syncDrawer()
   drawerMedia.addEventListener('change', syncDrawer)
   window.addEventListener('keydown', handleEscape)
})
onBeforeUnmount(() => {
   drawerMedia?.removeEventListener('change', syncDrawer)
   window.removeEventListener('keydown', handleEscape)
   document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
   <Transition name="equipment-overlay">
      <button v-if="open && isDrawer" class="equipment-details__overlay" type="button" aria-label="Dismiss equipment details" @click="emit('close')"></button>
   </Transition>
   <aside v-if="equipment" ref="panelRef" class="equipment-details" :class="{ 'equipment-details--open': open }" :role="isDrawer && open ? 'dialog' : 'complementary'" :aria-modal="isDrawer && open ? 'true' : undefined" aria-labelledby="equipment-details-title">
      <header class="equipment-details__header">
         <span id="equipment-details-title">Equipment Details</span>
         <button ref="closeButtonRef" type="button" aria-label="Close equipment details" @click="emit('close')"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </header>
      <div class="equipment-details__scroll">
         <EquipmentPlaceholder :category="equipment.category" :image-url="equipment.imageUrl" :name="equipment.name" />
         <div class="equipment-details__identity">
            <span>{{ categoryLabels[equipment.category] }}</span>
            <h2>{{ equipment.name }}</h2>
            <small class="text-mono">Instance ID: #{{ equipment.id }}</small>
            <EquipmentStatusBadge :status="equipment.status" />
         </div>

         <section class="equipment-details__section">
            <h3>Status & Health</h3>
            <EquipmentConditionBar :condition="equipment.condition" />
            <dl>
               <div><dt>Location</dt><dd>{{ equipment.locationName ?? 'Unassigned' }}</dd></div>
               <div><dt>Farm</dt><dd>{{ equipment.farmName ?? '—' }}</dd></div>
            </dl>
         </section>

         <section class="equipment-details__section">
            <h3>Performance Matrix</h3>
            <dl>
               <div v-for="metric in equipment.performance" :key="metric.algorithmOrCoin"><dt>{{ metric.algorithmOrCoin }}</dt><dd class="text-mono">{{ metric.value }}</dd></div>
               <div v-if="equipment.performance.length === 0"><dt>Mining performance</dt><dd>Not applicable</dd></div>
               <div><dt>Power Consumption</dt><dd class="text-mono">{{ equipment.powerWatts === null ? '—' : `${equipment.powerWatts} W` }}</dd></div>
            </dl>
         </section>

         <section class="equipment-details__section">
            <h3>Financials & History</h3>
            <dl>
               <div><dt>Purchase Price</dt><dd class="text-mono">{{ formatInventoryCurrency(equipment.purchasePriceUsd) }}</dd></div>
               <div><dt>Current Value</dt><dd class="text-mono">{{ formatInventoryCurrency(equipment.currentValueUsd) }}</dd></div>
               <div><dt>Lifetime Revenue</dt><dd class="equipment-details__profit text-mono">{{ formatInventoryCurrency(equipment.lifetimeRevenueUsd) }}</dd></div>
               <div><dt>Runtime</dt><dd class="text-mono">{{ formatRuntime(equipment.runtimeHours) }}</dd></div>
            </dl>
         </section>
      </div>

      <footer class="equipment-details__actions">
         <button class="equipment-details__button equipment-details__button--primary" type="button" :disabled="!equipment.farmId" @click="emit('viewFarm', equipment)">View Farm</button>
         <button class="equipment-details__button" type="button" @click="emit('viewPerformance', equipment)">View Performance</button>
         <button class="equipment-details__button" type="button" @click="emit('replace', equipment)">Replace Equipment</button>
         <button class="equipment-details__button equipment-details__button--danger" type="button" @click="emit('remove', equipment)">Remove Equipment</button>
      </footer>
   </aside>
</template>

<style scoped lang="scss">
.equipment-details {
   position:sticky;top:76px;display:flex;width:100%;height:calc(100vh - 96px);min-height:600px;flex-direction:column;overflow:hidden;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg-secondary);box-shadow:var(--shadow-lg);
   &__overlay { display:none; }
   &__header { display:flex;flex:0 0 auto;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--color-border);font-size:var(--text-xs);font-weight:var(--font-bold);letter-spacing:.06em;text-transform:uppercase; }
   &__header button { display:none;width:32px;height:32px;place-items:center;border-radius:6px;color:var(--color-text-secondary);font-size:var(--text-sm);transition:color var(--transition-fast),background-color var(--transition-fast),transform var(--transition-fast); }
   &__header button:hover { background:var(--color-bg-elevated);color:var(--color-text-primary); }
   &__header button:active { transform:translateY(1px); }
   &__header button:focus-visible { outline:var(--focus-ring);outline-offset:var(--focus-offset); }
   &__scroll { display:flex;min-height:0;flex:1;flex-direction:column;gap:20px;padding:16px;overflow-y:auto;@include custom-scrollbar; }
   &__identity { display:grid;gap:5px; }
   &__identity>span:first-child { color:var(--color-accent);font-size:var(--text-2xs);font-weight:var(--font-bold);letter-spacing:.1em;text-transform:uppercase; }
   &__identity h2 { font-size:var(--text-xl); }
   &__identity small { margin-bottom:8px;color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__section { padding-top:18px;border-top:1px solid rgba(255,255,255,.06); }
   &__section h3 { margin-bottom:12px;color:var(--color-text-secondary);font-size:var(--text-2xs);letter-spacing:.08em;text-transform:uppercase; }
   &__section dl { display:grid;gap:11px;margin-top:12px; }
   &__section dl div { display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:var(--text-xs); }
   &__section dt { color:var(--color-text-secondary); }
   &__section dd { font-weight:var(--font-semibold);text-align:right; }
   &__profit { color:var(--color-profit); }
   &__actions { display:grid;flex:0 0 auto;grid-template-columns:1fr 1fr;gap:8px;padding:14px;border-top:1px solid var(--color-border);background:var(--color-bg-secondary); }
   &__button { min-height:40px;padding:8px;border:1px solid var(--color-border);border-radius:6px;background:var(--color-bg-elevated);color:var(--color-text-secondary);font-size:var(--text-2xs);font-weight:var(--font-semibold);transition:color var(--transition-fast),background-color var(--transition-fast),border-color var(--transition-fast),transform var(--transition-fast); }
   &__button:hover { border-color:var(--color-text-muted);background:#2b2b39;color:var(--color-text-primary); }
   &__button:active { transform:translateY(1px); }
   &__button:focus-visible { outline:var(--focus-ring);outline-offset:var(--focus-offset); }
   &__button--primary { border-color:var(--color-accent);background:var(--color-accent);color:#fff; }
   &__button--primary:hover { border-color:var(--color-accent-hover);background:var(--color-accent-hover);color:#fff; }
   &__button--primary:active { background:var(--color-accent-active); }
   &__button--danger { border-color:rgba(255,83,112,.35);background:transparent;color:var(--color-loss); }
   &__button--danger:hover { border-color:rgba(255,83,112,.55);background:var(--color-loss-subtle);color:var(--color-loss); }
   &__button:disabled { border-color:var(--color-border);background:var(--color-bg-elevated);color:var(--color-text-muted);opacity:.55;cursor:not-allowed;transform:none; }
}

@media (max-width:1180px) {
   .equipment-details { position:fixed;top:0;right:0;z-index:calc(var(--z-modal) + 1);width:min(380px,100%);height:100vh;min-height:0;border-radius:0;transform:translateX(100%);visibility:hidden;transition:transform var(--transition-slow),visibility var(--transition-slow); }
   .equipment-details--open { transform:translateX(0); }
   .equipment-details--open { visibility:visible; }
   .equipment-details__header button { display:grid; }
   .equipment-details__overlay { position:fixed;inset:0;z-index:var(--z-modal);display:block;background:rgba(4,4,9,.68); }
}
@media(max-width:768px){.equipment-details{width:100%;}}
.equipment-overlay-enter-active,.equipment-overlay-leave-active{transition:opacity var(--transition-base);}.equipment-overlay-enter-from,.equipment-overlay-leave-to{opacity:0;}
@media(prefers-reduced-motion:reduce){.equipment-details,.equipment-details__button,.equipment-details__header button,.equipment-overlay-enter-active,.equipment-overlay-leave-active{transition:none!important;}}
</style>
