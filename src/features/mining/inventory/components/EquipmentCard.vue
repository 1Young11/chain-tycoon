<script setup lang="ts">
import EquipmentConditionBar from './EquipmentConditionBar.vue'
import EquipmentPlaceholder from './EquipmentPlaceholder.vue'
import EquipmentStatusBadge from './EquipmentStatusBadge.vue'
import { categoryLabels, formatInventoryCurrency } from '../model/equipment.utils'
import type { EquipmentInstance } from '../model/equipment.types'

defineProps<{ equipment: EquipmentInstance; selected: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
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
      <dl class="equipment-card__metrics">
         <div v-for="metric in equipment.cardMetrics.slice(0, 2)" :key="metric.label"><dt>{{ metric.label }}</dt><dd class="text-mono">{{ metric.value }}</dd></div>
         <div><dt>Value</dt><dd class="text-mono">{{ formatInventoryCurrency(equipment.currentValueUsd) }}</dd></div>
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
   &__metrics { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:auto;border:1px solid rgba(255,255,255,.05);border-radius:6px;background:rgba(255,255,255,.018); }
   &__metrics div { display:grid;gap:3px;padding:10px;border-right:1px solid rgba(255,255,255,.05); }
   &__metrics div:last-child{border-right:0;}
   &__metrics dt { color:var(--color-text-secondary);font-size:var(--text-2xs); }
   &__metrics dd { overflow:hidden;font-size:var(--text-xs);font-weight:var(--font-semibold);text-overflow:ellipsis;white-space:nowrap; }
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
