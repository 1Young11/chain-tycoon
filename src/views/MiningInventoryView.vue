<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import EquipmentCard from '@/features/mining/inventory/components/EquipmentCard.vue'
import EquipmentDetailsPanel from '@/features/mining/inventory/components/EquipmentDetailsPanel.vue'
import EquipmentTable from '@/features/mining/inventory/components/EquipmentTable.vue'
import InventorySummary from '@/features/mining/inventory/components/InventorySummary.vue'
import InventoryToolbar from '@/features/mining/inventory/components/InventoryToolbar.vue'
import { useInventoryStore } from '@/features/mining'
import type { EquipmentInstance } from '@/features/mining/inventory/model/equipment.types'

const inventory = useInventoryStore()
const isDetailsOpen = ref(false)
const notification = ref('')
const lastSelectedEquipmentId = ref<string | null>(inventory.selectedEquipmentId)
let notificationTimer: ReturnType<typeof setTimeout> | undefined

const showPlaceholder = (message: string) => {
   notification.value = message
   if (notificationTimer) clearTimeout(notificationTimer)
   notificationTimer = setTimeout(() => { notification.value = '' }, 3600)
}

const selectEquipment = (id: string) => {
   inventory.selectEquipment(id)
   lastSelectedEquipmentId.value = id
   isDetailsOpen.value = true
}

const buyHardware = () => showPlaceholder('Hardware Market will be connected in the next mining stage.')

const closeDetails = () => {
   isDetailsOpen.value = false
   const targetId = lastSelectedEquipmentId.value
   if (!targetId) return
   void nextTick(() => {
      const target = [...document.querySelectorAll<HTMLElement>('[data-equipment-id]')]
         .find((element) => element.dataset.equipmentId === targetId)
      target?.focus()
   })
}

const describeAction = (action: string, equipment: EquipmentInstance) => {
   showPlaceholder(`${action}: ${equipment.name}. Gameplay integration will be added next.`)
}

watch(
   () => inventory.filteredEquipment.map((item) => item.id),
   (visibleIds) => {
      if (inventory.selectedEquipmentId && visibleIds.includes(inventory.selectedEquipmentId)) return
      const nextId = visibleIds[0] ?? null
      inventory.selectEquipment(nextId)
      lastSelectedEquipmentId.value = nextId
      if (!nextId) isDetailsOpen.value = false
   },
   { immediate: true },
)

onBeforeUnmount(() => {
   if (notificationTimer) clearTimeout(notificationTimer)
})
</script>

<template>
   <div class="inventory-page">
      <header class="inventory-page__header">
         <div>
            <span class="inventory-page__eyebrow">Mining operations</span>
            <h1>Inventory</h1>
            <p>Manage hardware owned by your mining business.</p>
         </div>
         <button class="inventory-page__buy" type="button" @click="buyHardware">
            <i class="fa-solid fa-plus" aria-hidden="true"></i> Buy Hardware
         </button>
      </header>

      <InventorySummary
         :total="inventory.totalEquipmentCount"
         :storage="inventory.storageCount"
         :installed="inventory.installedCount"
         :attention="inventory.needsAttentionCount"
         :value="inventory.totalInventoryValue"
      />

      <InventoryToolbar
         :query="inventory.searchQuery"
         :category="inventory.selectedCategory"
         :status="inventory.selectedStatus"
         :location="inventory.selectedLocation"
         :sort="inventory.sortMode"
         :view="inventory.viewMode"
         :locations="inventory.availableLocations"
         :active="inventory.hasActiveFilters"
         @query-change="inventory.setSearchQuery"
         @category-change="inventory.setCategory"
         @status-change="inventory.setStatus"
         @location-change="inventory.setLocation"
         @sort-change="inventory.setSortMode"
         @view-change="inventory.setViewMode"
         @clear="inventory.clearFilters"
      />

      <div class="inventory-page__workspace">
         <main class="inventory-page__results">
            <div class="inventory-page__result-meta" aria-live="polite">
               <span><strong>{{ inventory.filteredEquipment.length }}</strong> of {{ inventory.totalEquipmentCount }} items</span>
               <span v-if="inventory.selectedEquipment">Selected: <b>{{ inventory.selectedEquipment.name }}</b></span>
            </div>

            <div v-if="inventory.filteredEquipment.length === 0" class="inventory-empty">
               <span><i class="fa-solid fa-box-open" aria-hidden="true"></i></span>
               <h2>No equipment found</h2>
               <p>{{ inventory.totalEquipmentCount === 0 ? 'Your mining business does not own any hardware yet.' : 'No equipment matches the selected filters.' }}</p>
               <button v-if="inventory.totalEquipmentCount === 0" class="inventory-empty__button inventory-empty__button--primary" type="button" @click="buyHardware">Buy Hardware</button>
               <button v-else-if="inventory.hasActiveFilters" class="inventory-empty__button" type="button" @click="inventory.clearFilters">Clear Filters</button>
            </div>

            <div v-else-if="inventory.viewMode === 'grid'" class="inventory-page__grid">
               <EquipmentCard
                  v-for="item in inventory.filteredEquipment"
                  :key="item.id"
                  :equipment="item"
                  :selected="inventory.selectedEquipmentId === item.id"
                  @select="selectEquipment"
               />
            </div>
            <EquipmentTable v-else :equipment="inventory.filteredEquipment" :selected-id="inventory.selectedEquipmentId" @select="selectEquipment" />
         </main>

         <EquipmentDetailsPanel
            :equipment="inventory.selectedEquipment"
            :open="isDetailsOpen"
            @close="closeDetails"
            @view-farm="describeAction('View farm', $event)"
            @view-performance="describeAction('View performance', $event)"
            @replace="describeAction('Replace equipment', $event)"
            @remove="describeAction('Remove equipment', $event)"
         />
      </div>

      <Transition name="inventory-toast">
         <div v-if="notification" class="inventory-page__toast" role="status"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>{{ notification }}</div>
      </Transition>
   </div>
</template>

<style scoped lang="scss">
.inventory-page {
   display:flex;min-width:0;flex-direction:column;gap:22px;padding:24px 28px 40px;background-image:radial-gradient(rgba(42,42,58,.5) 1px,transparent 1px);background-size:24px 24px;
   &__header { display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-5); }
   &__eyebrow { color:var(--color-accent);font-size:var(--text-2xs);font-weight:var(--font-bold);letter-spacing:.12em;text-transform:uppercase; }
   &__header h1 { margin-top:4px;font-size:var(--text-page-title); }
   &__header p { margin-top:5px;color:var(--color-text-secondary);font-size:var(--text-sm); }
   &__buy { display:flex;min-height:42px;align-items:center;gap:8px;padding:9px 17px;border-radius:var(--radius-sm);background:var(--color-accent);color:#fff;font-size:var(--text-sm);font-weight:var(--font-bold);transition:background-color var(--transition-fast),box-shadow var(--transition-fast),transform var(--transition-fast); }
   &__buy i { font-size:var(--text-sm); }
   &__buy:hover { background:var(--color-accent-hover);box-shadow:0 6px 18px rgba(0,0,0,.2); }
   &__buy:active { transform:translateY(1px);background:var(--color-accent-active); }
   &__buy:focus-visible { outline:var(--focus-ring);outline-offset:var(--focus-offset); }
   &__buy:disabled { background:var(--color-bg-elevated);color:var(--color-text-muted);cursor:not-allowed;box-shadow:none;transform:none; }
   &__workspace { display:grid;min-width:0;grid-template-columns:minmax(0,1fr) minmax(300px,26%);gap:14px;align-items:start; }
   &__results { min-width:0; }
   &__result-meta { display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;color:var(--color-text-muted);font-size:var(--text-2xs); }
   &__result-meta strong,&__result-meta b { color:var(--color-text-secondary); }
   &__grid { display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:stretch; }
   &__toast { position:fixed;right:20px;bottom:20px;z-index:var(--z-toast);display:flex;max-width:min(430px,calc(100vw - 32px));align-items:center;gap:8px;padding:12px 16px;border:1px solid rgba(108,99,255,.35);border-radius:var(--radius-sm);background:#202038;box-shadow:var(--shadow-lg);font-size:var(--text-xs); }
   &__toast i { color:var(--color-accent); }
}
.inventory-empty { display:grid;min-height:300px;place-items:center;align-content:center;padding:30px;border:1px dashed var(--color-border);border-radius:var(--radius-sm);background:rgba(30,30,42,.72);text-align:center; }
.inventory-empty>span { display:grid;width:48px;height:48px;place-items:center;border-radius:50%;background:var(--color-bg-elevated);color:var(--color-text-muted); }
.inventory-empty h2 { margin-top:12px;font-size:var(--text-lg); }.inventory-empty p{max-width:360px;margin-top:7px;color:var(--color-text-secondary);font-size:var(--text-xs);}.inventory-empty__button{min-height:var(--control-height-sm);margin-top:14px;padding:8px 13px;border:1px solid var(--color-border);border-radius:6px;background:var(--color-bg-elevated);font-size:var(--text-xs);transition:color var(--transition-fast),background-color var(--transition-fast),border-color var(--transition-fast),transform var(--transition-fast);}.inventory-empty__button:hover{border-color:var(--color-text-muted);background:#2b2b39;}.inventory-empty__button:active{transform:translateY(1px);}.inventory-empty__button:focus-visible{outline:var(--focus-ring);outline-offset:var(--focus-offset);}.inventory-empty__button--primary{border-color:var(--color-accent);background:var(--color-accent);color:#fff;}.inventory-empty__button--primary:hover{border-color:var(--color-accent-hover);background:var(--color-accent-hover);}
.inventory-toast-enter-active,.inventory-toast-leave-active{transition:all var(--duration-base) var(--ease-default);}.inventory-toast-enter-from,.inventory-toast-leave-to{opacity:0;transform:translateY(10px);}
@media(max-width:1500px){.inventory-page__grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
@media(max-width:1180px){.inventory-page__workspace{grid-template-columns:1fr;}}
@include md{.inventory-page{padding:16px 12px 28px;}.inventory-page__header{align-items:flex-start;flex-direction:column;}.inventory-page__buy{width:100%;justify-content:center;}.inventory-page__result-meta span:last-child{display:none;}.inventory-page__grid{grid-template-columns:1fr;}}
@media(prefers-reduced-motion:reduce){.inventory-page button,.inventory-toast-enter-active,.inventory-toast-leave-active{transition:none!important;}.inventory-page button:active{transform:none;}}
</style>
