<script setup lang="ts">
import EquipmentConditionBar from './EquipmentConditionBar.vue'
import EquipmentStatusBadge from './EquipmentStatusBadge.vue'
import { categoryLabels, formatInventoryCurrency } from '../model/equipment.utils'
import type { EquipmentInstance } from '../model/equipment.types'

defineProps<{ equipment: EquipmentInstance[]; selectedId: string | null }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
   <div class="equipment-table-wrap">
      <table class="equipment-table">
         <thead><tr><th>Equipment</th><th>Category</th><th>Status</th><th>Condition</th><th>Location</th><th>Farm</th><th>Power</th><th>Value</th></tr></thead>
         <tbody>
            <tr v-for="item in equipment" :key="item.id" :class="{ 'equipment-table__row--selected': selectedId === item.id }" :data-equipment-id="item.id" :aria-selected="selectedId === item.id" tabindex="0" @click="emit('select', item.id)" @keydown.enter="emit('select', item.id)" @keydown.space.prevent="emit('select', item.id)">
               <td><strong>{{ item.name }}</strong><small class="text-mono">#{{ item.id }}</small></td>
               <td>{{ categoryLabels[item.category] }}</td>
               <td><EquipmentStatusBadge :status="item.status" /></td>
               <td><EquipmentConditionBar :condition="item.condition" compact /></td>
               <td>{{ item.locationName ?? 'Unassigned' }}</td>
               <td>{{ item.farmName ?? '—' }}</td>
               <td class="text-mono">{{ item.powerWatts === null ? '—' : `${item.powerWatts} W` }}</td>
               <td class="text-mono equipment-table__value">{{ formatInventoryCurrency(item.currentValueUsd) }}</td>
            </tr>
         </tbody>
      </table>
   </div>
</template>

<style scoped lang="scss">
.equipment-table-wrap { overflow-x:auto;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg-tertiary);@include custom-scrollbar; }
.equipment-table { width:100%;min-width:980px;border-collapse:collapse;font-size:var(--text-xs);white-space:nowrap; }
.equipment-table th { padding:12px 14px;border-bottom:1px solid var(--color-border);color:var(--color-text-secondary);font-size:var(--text-2xs);font-weight:var(--font-semibold);text-align:left;text-transform:uppercase; }
.equipment-table td { padding:14px;border-bottom:1px solid rgba(255,255,255,.045);color:var(--color-text-secondary); }
.equipment-table tbody tr { cursor:pointer;transition:background-color var(--transition-fast),box-shadow var(--transition-fast); }
.equipment-table tbody tr:hover { background:rgba(255,255,255,.025); }
.equipment-table tbody tr:focus-visible { outline:var(--focus-ring);outline-offset:-2px; }
.equipment-table__row--selected { background:var(--color-accent-subtle)!important;box-shadow:inset 2px 0 var(--color-accent); }
.equipment-table td:first-child strong,.equipment-table td:first-child small{display:block;}.equipment-table td:first-child strong{color:var(--color-text-primary);font-size:var(--text-sm);}.equipment-table td:first-child small{color:var(--color-text-muted);font-size:var(--text-2xs);}.equipment-table__value{color:var(--color-text-primary)!important;font-weight:var(--font-semibold);}
</style>
