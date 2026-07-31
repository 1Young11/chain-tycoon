<script setup lang="ts">
import { computed } from 'vue'
import EquipmentConditionBar from './EquipmentConditionBar.vue'
import EquipmentPlaceholder from './EquipmentPlaceholder.vue'
import EquipmentStatusBadge from './EquipmentStatusBadge.vue'
import { formatInventoryCurrency } from '../model/equipment.utils'
import type { EquipmentCategory, EquipmentInstance } from '../model/equipment.types'

const props = defineProps<{ equipment: EquipmentInstance; selected: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()

const cardCategoryLabels: Record<EquipmentCategory, string> = {
   gpu: 'GPU',
   psu: 'PSU',
   case: 'Case / Frame',
   base_system: 'Base System',
   cooling: 'Cooling',
   accessory: 'Accessory',
}

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
         <span class="equipment-card__category">{{ cardCategoryLabels[equipment.category] }}</span>
         <EquipmentStatusBadge :status="equipment.status" />
      </header>
      <div class="equipment-card__main">
         <div class="equipment-card__visual">
            <EquipmentPlaceholder compact :category="equipment.category" :image-url="equipment.imageUrl" :name="equipment.name" />
         </div>
         <div class="equipment-card__info">
            <div class="equipment-card__identity">
               <h3>{{ equipment.name }}</h3>
               <span class="text-mono">#{{ equipment.id }}</span>
            </div>
            <EquipmentConditionBar class="equipment-card__condition" compact :condition="equipment.condition" />
         </div>
      </div>
      <div class="equipment-card__bottom">
         <dl class="equipment-card__metrics">
            <div v-for="metric in cardMetrics" :key="metric.label" class="equipment-card__metric">
               <dd class="equipment-card__metric-value text-mono">{{ metric.value }}</dd>
               <dt class="equipment-card__metric-label">{{ metric.label }}</dt>
            </div>
         </dl>
         <footer class="equipment-card__footer">
            <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i><b>{{ equipment.farmName ?? equipment.locationName ?? 'Unassigned' }}</b></span>
            <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
         </footer>
      </div>
   </article>
</template>

<style scoped lang="scss">
.equipment-card {
   display:flex;min-height:440px;flex-direction:column;gap:14px;padding:15px;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg-tertiary);cursor:pointer;transition:transform var(--transition-base),border-color var(--transition-fast),box-shadow var(--transition-base),background-color var(--transition-fast);
   &:focus-visible { outline:var(--focus-ring);outline-offset:var(--focus-offset); }
   &:active { transform:translateY(1px); }
   &--selected { border-color:var(--color-accent);background:linear-gradient(rgba(108,99,255,.08),rgba(108,99,255,.08)),var(--color-bg-tertiary);box-shadow:0 8px 22px rgba(0,0,0,.2),0 0 0 1px rgba(108,99,255,.12); }
   &--selected:focus-visible { border-color:var(--color-accent-hover); }
   &__header { display:flex;min-height:26px;align-items:flex-start;justify-content:space-between;gap:10px; }
   &__header :deep(.equipment-status) { flex:0 0 auto; }
   &__category { min-width:0;flex:1 1 auto;overflow:hidden;color:var(--color-text-secondary);font-size:var(--text-2xs);font-weight:var(--font-bold);letter-spacing:.08em;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap; }
   &__main { display:grid;min-height:190px;grid-template-columns:minmax(96px,38%) minmax(0,62%);gap:14px;align-items:stretch; }
   &__visual { display:flex;min-width:0;aspect-ratio:1.3/1;align-items:center;align-self:start;justify-content:center;overflow:hidden; }
   &__visual :deep(.equipment-visual) { width:100%;height:100%; }
   &__info { display:flex;width:100%;min-width:0;flex-direction:column;padding:4px 2px 4px 0; }
   &__info > * { max-width:100%; }
   &__identity { min-width:0; }
   &__identity h3 { display:-webkit-box;min-height:38px;overflow:hidden;font-size:16px;line-height:1.2;overflow-wrap:break-word;-webkit-box-orient:vertical;-webkit-line-clamp:2; }
   &__identity span { display:block;overflow:hidden;color:var(--color-text-muted);font-size:var(--text-2xs);text-overflow:ellipsis;white-space:nowrap; }
   &__condition { margin-top:auto; }
   &__bottom { display:flex;margin-top:auto;flex-direction:column; }
   &__metrics { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-block:1px solid rgba(255,255,255,.06); }
   &__metric { display:flex;min-width:0;min-height:66px;flex-direction:column;align-items:flex-start;justify-content:center;gap:4px;padding:12px 13px;text-align:left; }
   &__metric + &__metric { border-left:1px solid rgba(255,255,255,.08); }
   &__metric-label { color:var(--color-text-secondary);font-size:11px;line-height:1.2; }
   &__metric-value { max-width:100%;font-size:12px;font-weight:var(--font-semibold);line-height:1.25;overflow-wrap:break-word;white-space:normal; }
   &__footer { display:flex;min-height:48px;align-items:center;justify-content:space-between;gap:10px;color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__footer span { display:flex;min-width:0;align-items:center;gap:5px; }
   &__footer span b { min-width:0;overflow:hidden;font-weight:inherit;text-overflow:ellipsis;white-space:nowrap; }
   &__footer > i { flex:0 0 auto; }
   &--selected &__footer > i { color:var(--color-accent); }
}
@media(max-width:1360px) and (min-width:1181px){.equipment-card__main{grid-template-columns:minmax(88px,38%) minmax(0,62%);gap:10px;}.equipment-card__metric{padding-inline:9px;}}
@media (hover:hover) and (pointer:fine) {
   .equipment-card:hover { transform:translateY(-2px);border-color:var(--color-text-muted);box-shadow:0 10px 24px rgba(0,0,0,.22); }
   .equipment-card--selected:hover { border-color:var(--color-accent-hover);box-shadow:0 10px 24px rgba(0,0,0,.24),0 0 0 1px rgba(108,99,255,.16); }
}
@media (prefers-reduced-motion:reduce) { .equipment-card { transition:none; }.equipment-card:hover,.equipment-card:active { transform:none; } }
</style>
