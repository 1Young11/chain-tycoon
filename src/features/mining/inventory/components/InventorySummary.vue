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
.inventory-summary { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 12px; }
.summary-tile {
   display: flex;
   min-width: 0;
   align-items: center;
   min-height: 80px;
   gap: 12px;
   padding: 13px 15px;
   border: 1px solid var(--color-border);
   border-radius: var(--radius-sm);
   background: var(--color-bg-tertiary);

   &__icon { display:grid;width:35px;height:35px;flex:0 0 auto;place-items:center;border-radius:8px;background:var(--color-bg-elevated);color:var(--color-accent);font-size:14px; }
   > span:last-child { display:grid;min-width:0; }
   small { overflow:hidden;color:var(--color-text-secondary);font-size:var(--text-xs);text-overflow:ellipsis;white-space:nowrap; }
   strong { margin-top:3px;font-size:var(--text-display-sm); }
   &--attention .summary-tile__icon,
   &--attention strong { color:var(--color-warning); }
   &--value { border-color:rgba(108,99,255,.3);background:linear-gradient(135deg,rgba(108,99,255,.08),var(--color-bg-tertiary)); }
}
@include xl { .inventory-summary { grid-template-columns:repeat(3,1fr); } }
@include md { .inventory-summary { grid-template-columns:repeat(2,1fr); } .summary-tile--value { grid-column:1/-1; } }
</style>
