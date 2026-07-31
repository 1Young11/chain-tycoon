<script setup lang="ts">
import { computed } from 'vue'
import EquipmentConditionBar from './EquipmentConditionBar.vue'
import EquipmentPlaceholder from './EquipmentPlaceholder.vue'
import EquipmentStatusBadge from './EquipmentStatusBadge.vue'
import { categoryLabels, formatInventoryCurrency } from '../model/equipment.utils'
import type { EquipmentInstance } from '../model/equipment.types'

const props = defineProps<{ equipment: EquipmentInstance; selected: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()

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
      <div class="equipment-card__main">
         <EquipmentPlaceholder compact :category="equipment.category" :image-url="equipment.imageUrl" :name="equipment.name" />
         <div class="equipment-card__overview">
            <div class="equipment-card__identity">
               <h3>{{ equipment.name }}</h3>
               <span class="text-mono">#{{ equipment.id }}</span>
            </div>
            <EquipmentConditionBar :condition="equipment.condition" />
         </div>
      </div>
      <dl class="equipment-card__metrics">
         <div v-for="metric in cardMetrics" :key="metric.label" class="equipment-card__metric">
            <dd class="equipment-card__metric-value text-mono">{{ metric.value }}</dd>
            <dt class="equipment-card__metric-label">{{ metric.label }}</dt>
         </div>
      </dl>
      <footer class="equipment-card__footer">
         <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ equipment.farmName ?? equipment.locationName ?? 'Unassigned' }}</span>
         <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </footer>
   </article>
</template>

<style scoped lang="scss">
.equipment-card {
   display:flex;min-height:292px;flex-direction:column;gap:13px;padding:15px;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg-tertiary);cursor:pointer;transition:transform var(--transition-base),border-color var(--transition-fast),box-shadow var(--transition-base),background-color var(--transition-fast);
   &:focus-visible { outline:var(--focus-ring);outline-offset:var(--focus-offset); }
   &:active { transform:translateY(1px); }
   &--selected { border-color:var(--color-accent);background:linear-gradient(rgba(108,99,255,.08),rgba(108,99,255,.08)),var(--color-bg-tertiary);box-shadow:0 8px 22px rgba(0,0,0,.2),0 0 0 1px rgba(108,99,255,.12); }
   &--selected:focus-visible { border-color:var(--color-accent-hover); }
   &__header { display:flex;min-height:22px;align-items:center;justify-content:space-between;gap:8px; }
   &__category { color:var(--color-text-secondary);font-size:var(--text-2xs);font-weight:var(--font-bold);letter-spacing:.08em;text-transform:uppercase; }
   &__main { display:grid;grid-template-columns:112px minmax(0,1fr);gap:14px;align-items:stretch; }
   &__overview { display:flex;min-width:0;flex-direction:column;justify-content:space-between;gap:12px;padding:4px 0; }
   &__identity { min-width:0;min-height:48px; }
   &__identity h3 { font-size:17px;line-height:1.25;overflow-wrap:anywhere; }
   &__identity span { color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__metrics { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:auto;border-block:1px solid rgba(255,255,255,.06); }
   &__metric { display:flex;min-width:0;min-height:58px;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;padding:8px 10px;text-align:left; }
   &__metric + &__metric { border-left:1px solid rgba(255,255,255,.08); }
   &__metric-label { color:var(--color-text-secondary);font-size:var(--text-2xs);line-height:1.2; }
   &__metric-value { max-width:100%;font-size:var(--text-xs);font-weight:var(--font-semibold);line-height:1.3;overflow-wrap:anywhere;white-space:normal; }
   &__footer { display:flex;align-items:center;justify-content:space-between;color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__footer span { display:flex;align-items:center;gap:5px; }
   &--selected &__footer > i { color:var(--color-accent); }
}
@media(max-width:1360px) and (min-width:1181px){.equipment-card__main{grid-template-columns:92px minmax(0,1fr);gap:10px;}.equipment-card__metric{padding-inline:7px;}}
@media (hover:hover) and (pointer:fine) {
   .equipment-card:hover { transform:translateY(-2px);border-color:var(--color-text-muted);box-shadow:0 10px 24px rgba(0,0,0,.22); }
   .equipment-card--selected:hover { border-color:var(--color-accent-hover);box-shadow:0 10px 24px rgba(0,0,0,.24),0 0 0 1px rgba(108,99,255,.16); }
}
@media (prefers-reduced-motion:reduce) { .equipment-card { transition:none; }.equipment-card:hover,.equipment-card:active { transform:none; } }
</style>
