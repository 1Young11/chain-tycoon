<script setup lang="ts">
import { categoryLabels, statusLabels } from '../model/equipment.utils'
import type { EquipmentCategory, EquipmentStatus, InventorySortMode, InventoryViewMode } from '../model/equipment.types'

defineProps<{
   query: string
   category: EquipmentCategory | 'all'
   status: EquipmentStatus | 'all'
   location: string
   sort: InventorySortMode
   view: InventoryViewMode
   locations: string[]
}>()

const emit = defineEmits<{
   queryChange: [value: string]
   categoryChange: [value: EquipmentCategory | 'all']
   statusChange: [value: EquipmentStatus | 'all']
   locationChange: [value: string]
   sortChange: [value: InventorySortMode]
   viewChange: [value: InventoryViewMode]
   clear: []
}>()

const categories: Array<EquipmentCategory | 'all'> = ['all', 'gpu', 'psu', 'case', 'base_system', 'cooling', 'accessory']
const statuses: Array<EquipmentStatus | 'all'> = ['all', 'in_storage', 'installed', 'reserved', 'installing', 'broken', 'repairing', 'for_sale']
</script>

<template>
   <section class="inventory-toolbar" aria-label="Inventory filters">
      <div class="inventory-toolbar__primary">
         <div class="inventory-toolbar__tabs" role="tablist" aria-label="Equipment category">
            <button
               v-for="item in categories"
               :key="item"
               class="inventory-toolbar__tab"
               :class="{ 'inventory-toolbar__tab--active': category === item }"
               type="button"
               role="tab"
               :aria-selected="category === item"
               @click="emit('categoryChange', item)"
            >{{ item === 'all' ? 'All' : categoryLabels[item] }}</button>
         </div>
         <label class="inventory-toolbar__search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span class="inventory-toolbar__sr-only">Search equipment</span>
            <input :value="query" type="search" placeholder="Search equipment..." @input="emit('queryChange', ($event.target as HTMLInputElement).value)" />
         </label>
      </div>

      <div class="inventory-toolbar__filters">
         <div class="inventory-toolbar__filter-group">
            <label>
               <span class="inventory-toolbar__sr-only">Filter by status</span>
               <select :value="status" @change="emit('statusChange', ($event.target as HTMLSelectElement).value as EquipmentStatus | 'all')">
                  <option v-for="item in statuses" :key="item" :value="item">{{ item === 'all' ? 'All Statuses' : statusLabels[item] }}</option>
               </select>
            </label>
            <label>
               <span class="inventory-toolbar__sr-only">Filter by location</span>
               <select :value="location" @change="emit('locationChange', ($event.target as HTMLSelectElement).value)">
                  <option value="all">All Locations</option>
                  <option v-for="item in locations" :key="item" :value="item">{{ item }}</option>
               </select>
            </label>
            <button class="inventory-toolbar__clear" type="button" @click="emit('clear')"><i class="fa-solid fa-filter-circle-xmark"></i> Clear</button>
         </div>

         <div class="inventory-toolbar__filter-group">
            <label>
               <span class="inventory-toolbar__sr-only">Sort equipment</span>
               <select :value="sort" @change="emit('sortChange', ($event.target as HTMLSelectElement).value as InventorySortMode)">
                  <option value="condition_desc">Condition: High to Low</option>
                  <option value="condition_asc">Condition: Low to High</option>
                  <option value="name_asc">Name</option>
                  <option value="value_desc">Current Value: High to Low</option>
               </select>
            </label>
            <div class="inventory-toolbar__view" aria-label="View mode">
               <button type="button" :aria-pressed="view === 'grid'" :class="{ 'inventory-toolbar__view-button--active': view === 'grid' }" class="inventory-toolbar__view-button" aria-label="Grid view" @click="emit('viewChange', 'grid')"><i class="fa-solid fa-grip"></i></button>
               <button type="button" :aria-pressed="view === 'table'" :class="{ 'inventory-toolbar__view-button--active': view === 'table' }" class="inventory-toolbar__view-button" aria-label="Table view" @click="emit('viewChange', 'table')"><i class="fa-solid fa-list"></i></button>
            </div>
         </div>
      </div>
   </section>
</template>

<style scoped lang="scss">
.inventory-toolbar {
   border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg-tertiary);
   &__primary,&__filters { display:flex;align-items:center;justify-content:space-between;gap:var(--space-4);padding:13px 14px; }
   &__primary { border-bottom:1px solid rgba(255,255,255,.055); }
   &__tabs { display:flex;min-width:0;gap:3px;overflow-x:auto; @include custom-scrollbar; }
   &__tab { min-height:var(--control-height-sm);padding:8px 12px;border-radius:6px;color:var(--color-text-secondary);font-size:var(--text-xs);font-weight:var(--font-semibold);white-space:nowrap; }
   &__tab:hover { color:var(--color-text-primary);background:rgba(255,255,255,.03); }
   &__tab--active { background:var(--color-accent-subtle);color:var(--color-accent); }
   &__search { position:relative;display:flex;min-width:210px;align-items:center; }
   &__search i { position:absolute;left:12px;color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__search input,select { height:var(--control-height-md);border:1px solid var(--color-border);border-radius:6px;outline:0;background:var(--color-bg-elevated);color:var(--color-text-primary);font-size:var(--text-xs); }
   &__search input { width:100%;padding:0 12px 0 34px; }
   &__search input:focus,select:focus { border-color:var(--color-accent);box-shadow:0 0 0 2px var(--color-accent-subtle); }
   select { min-width:152px;padding:0 28px 0 11px; }
   &__filter-group { display:flex;align-items:center;gap:9px; }
   &__clear { display:flex;min-height:var(--control-height-sm);align-items:center;gap:6px;padding:8px 10px;color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__clear:hover,&__clear:focus-visible { color:var(--color-text-primary); }
   &__view { display:flex;padding:2px;border:1px solid var(--color-border);border-radius:6px;background:var(--color-bg-elevated); }
   &__view-button { display:grid;width:34px;height:34px;place-items:center;border-radius:4px;color:var(--color-text-muted);font-size:var(--text-xs); }
   &__view-button--active { background:var(--color-accent);color:white; }
   &__sr-only { @include visually-hidden; }
}
@include lg { .inventory-toolbar__primary { align-items:stretch;flex-direction:column; }.inventory-toolbar__search{width:100%;}.inventory-toolbar__filters{align-items:stretch;flex-direction:column;}.inventory-toolbar__filter-group{justify-content:space-between;} }
@include md { .inventory-toolbar__filter-group{align-items:stretch;flex-wrap:wrap;}.inventory-toolbar__filter-group label{flex:1;}.inventory-toolbar select{width:100%;}.inventory-toolbar__view{margin-left:auto;} }
</style>
