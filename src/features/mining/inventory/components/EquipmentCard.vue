<script setup lang="ts">
import { computed } from 'vue'
import EquipmentConditionBar from './EquipmentConditionBar.vue'
import EquipmentPlaceholder from './EquipmentPlaceholder.vue'
import EquipmentStatusBadge from './EquipmentStatusBadge.vue'
import { categoryLabels, formatInventoryCurrency } from '../model/equipment.utils'
import type { EquipmentInstance } from '../model/equipment.types'

const props = defineProps<{ equipment: EquipmentInstance; selected: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()

const metricLayout = computed<'compact-three' | 'balanced-two'>(() => {
   const equipment = props.equipment
   const needsMoreRoom =
      equipment.category === 'psu' ||
      equipment.category === 'base_system' ||
      equipment.status === 'broken' ||
      equipment.status === 'repairing'

   return needsMoreRoom ? 'balanced-two' : 'compact-three'
})

const cardMetrics = computed(() => [
   ...props.equipment.cardMetrics.slice(0, 2),
   { label: 'Value', value: formatInventoryCurrency(props.equipment.currentValueUsd) },
])
</script>

<template>
   <article
      class="equipment-card"
      :class="{ 'equipment-card--selected': selected }"
      role="button"
      tabindex="0"
      :data-equipment-id="equipment.id"
      :aria-label="`Select ${equipment.name}`"
      :aria-pressed="selected"
      @click="emit('select', equipment.id)"
      @keydown.enter="emit('select', equipment.id)"
      @keydown.space.prevent="emit('select', equipment.id)"
   >
      <header class="equipment-card__header">
         <span class="equipment-card__category">{{ categoryLabels[equipment.category] }}</span>
         <EquipmentStatusBadge :status="equipment.status" />
      </header>
      <EquipmentPlaceholder :category="equipment.category" :image-url="equipment.imageUrl" :name="equipment.name" />
      <div class="equipment-card__identity">
         <h3>{{ equipment.name }}</h3>
         <span class="text-mono">#{{ equipment.id }}</span>
      </div>
      <EquipmentConditionBar :condition="equipment.condition" />
      <dl class="equipment-card__metrics" :class="`equipment-card__metrics--${metricLayout}`">
         <div
            v-for="(metric, index) in cardMetrics"
            :key="metric.label"
            class="equipment-card__metric"
            :class="{ 'equipment-card__metric--featured': metricLayout === 'balanced-two' && index === cardMetrics.length - 1 }"
         >
            <dt class="equipment-card__metric-label">{{ metric.label }}</dt>
            <dd class="equipment-card__metric-value text-mono">{{ metric.value }}</dd>
         </div>
      </dl>
      <footer class="equipment-card__footer">
         <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ equipment.locationName ?? 'Unassigned' }}</span>
         <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </footer>
   </article>
</template>

<style scoped lang="scss">
.equipment-card {
   display:flex;min-height:422px;flex-direction:column;gap:14px;padding:15px;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg-tertiary);cursor:pointer;transition:transform var(--transition-base),border-color var(--transition-fast),box-shadow var(--transition-base),background-color var(--transition-fast);
   &:focus-visible { outline:var(--focus-ring);outline-offset:var(--focus-offset); }
   &:active { transform:translateY(1px); }
   &--selected { border-color:var(--color-accent);background:linear-gradient(rgba(108,99,255,.08),rgba(108,99,255,.08)),var(--color-bg-tertiary);box-shadow:0 8px 22px rgba(0,0,0,.2),0 0 0 1px rgba(108,99,255,.12); }
   &--selected:focus-visible { border-color:var(--color-accent-hover); }
   &__header { display:flex;min-height:22px;align-items:center;justify-content:space-between;gap:8px; }
   &__category { color:var(--color-text-secondary);font-size:var(--text-2xs);font-weight:var(--font-bold);letter-spacing:.08em;text-transform:uppercase; }
   &__identity { min-height:46px; }
   &__identity h3 { font-size:17px; }
   &__identity span { color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__metrics { display:grid;gap:1px;margin-top:auto;overflow:hidden;border:1px solid rgba(255,255,255,.05);border-radius:6px;background:rgba(255,255,255,.05); }
   &__metrics--compact-three { grid-template-columns:repeat(3,minmax(0,1fr)); }
   &__metrics--balanced-two { grid-template-columns:minmax(0,.82fr) minmax(0,1.18fr); }
   &__metric { display:flex;min-width:0;min-height:58px;flex-direction:column;align-items:flex-start;gap:4px;padding:9px;background:var(--color-bg-tertiary);text-align:left; }
   &__metrics--balanced-two &__metric { min-height:42px;gap:3px;padding:5px 2px; }
   &__metric--featured { grid-column:1/-1; }
   &__metric-label { color:var(--color-text-secondary);font-size:var(--text-2xs);line-height:1.2; }
   &__metric-value { max-width:100%;font-size:var(--text-xs);font-weight:var(--font-semibold);line-height:1.3;overflow-wrap:anywhere;white-space:normal; }
   &__footer { display:flex;align-items:center;justify-content:space-between;color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__footer span { display:flex;align-items:center;gap:5px; }
   &--selected &__footer > i { color:var(--color-accent); }
}
@media (hover:hover) and (pointer:fine) {
   .equipment-card:hover { transform:translateY(-2px);border-color:var(--color-text-muted);box-shadow:0 10px 24px rgba(0,0,0,.22); }
   .equipment-card--selected:hover { border-color:var(--color-accent-hover);box-shadow:0 10px 24px rgba(0,0,0,.24),0 0 0 1px rgba(108,99,255,.16); }
}
@media (prefers-reduced-motion:reduce) { .equipment-card { transition:none; }.equipment-card:hover,.equipment-card:active { transform:none; } }
</style>
