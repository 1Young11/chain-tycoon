<script setup lang="ts">
import { formatInventoryCurrency } from '../model/equipment.utils'

defineProps<{
   total: number
   storage: number
   installed: number
   attention: number
   value: number
}>()

const items = [
   { key: 'total', label: 'Total Equipment', icon: 'fa-layer-group' },
   { key: 'storage', label: 'In Storage', icon: 'fa-box-archive' },
   { key: 'installed', label: 'Installed', icon: 'fa-screwdriver-wrench' },
   { key: 'attention', label: 'Needs Attention', icon: 'fa-triangle-exclamation' },
] as const
</script>

<template>
   <section class="inventory-summary" aria-label="Inventory summary">
      <article v-for="item in items" :key="item.key" class="summary-tile" :class="{ 'summary-tile--attention': item.key === 'attention' }">
         <span class="summary-tile__icon"><i class="fa-solid" :class="item.icon"></i></span>
         <span>
            <small>{{ item.label }}</small>
            <strong class="text-mono">{{ { total, storage, installed, attention }[item.key] }}</strong>
         </span>
      </article>
      <article class="summary-tile summary-tile--value">
         <span class="summary-tile__icon"><i class="fa-solid fa-dollar-sign"></i></span>
         <span><small>Inventory Value</small><strong class="text-mono">{{ formatInventoryCurrency(value) }}</strong></span>
      </article>
   </section>
</template>

<style scoped lang="scss">
.inventory-summary { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 10px; }
.summary-tile {
   display: flex;
   min-width: 0;
   align-items: center;
   gap: 10px;
   padding: 12px;
   border: 1px solid var(--color-border);
   border-radius: var(--radius-sm);
   background: var(--color-bg-tertiary);

   &__icon { display:grid;width:30px;height:30px;flex:0 0 auto;place-items:center;border-radius:7px;background:var(--color-bg-elevated);color:var(--color-accent);font-size:11px; }
   > span:last-child { display:grid;min-width:0; }
   small { overflow:hidden;color:var(--color-text-secondary);font-size:9px;text-overflow:ellipsis;white-space:nowrap; }
   strong { margin-top:2px;font-size:var(--text-sm); }
   &--attention .summary-tile__icon,
   &--attention strong { color:var(--color-warning); }
   &--value { border-color:rgba(108,99,255,.3);background:linear-gradient(135deg,rgba(108,99,255,.08),var(--color-bg-tertiary)); }
}
@include xl { .inventory-summary { grid-template-columns:repeat(3,1fr); } }
@include md { .inventory-summary { grid-template-columns:repeat(2,1fr); } .summary-tile--value { grid-column:1/-1; } }
</style>
