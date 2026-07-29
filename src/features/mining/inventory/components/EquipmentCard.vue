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
         <span><i class="fa-solid fa-location-dot"></i>{{ equipment.locationName ?? 'Unassigned' }}</span>
         <i class="fa-solid fa-chevron-right"></i>
      </footer>
   </article>
</template>

<style scoped lang="scss">
.equipment-card {
   display:flex;min-height:422px;flex-direction:column;gap:14px;padding:15px;border:1px solid var(--color-border);border-radius:var(--radius-sm);outline:none;background:var(--color-bg-tertiary);cursor:pointer;transition:border-color var(--duration-fast),box-shadow var(--duration-fast),background var(--duration-fast);
   &:hover,&:focus-visible { border-color:var(--color-text-muted);box-shadow:var(--shadow-md); }
   &--selected { border-color:var(--color-accent);background:linear-gradient(rgba(108,99,255,.08),rgba(108,99,255,.02)),var(--color-bg-tertiary);box-shadow:0 0 16px rgba(108,99,255,.11); }
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
</style>
