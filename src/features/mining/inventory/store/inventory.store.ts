import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { equipmentMock } from '../model/equipment.mock'
import { categoryLabels } from '../model/equipment.utils'
import type {
   EquipmentCategory,
   EquipmentInstance,
   EquipmentStatus,
   InventorySortMode,
   InventoryViewMode,
} from '../model/equipment.types'

export const useInventoryStore = defineStore('mining-inventory', () => {
   const equipment = ref<EquipmentInstance[]>(equipmentMock)
   const selectedEquipmentId = ref<string | null>(equipmentMock[0]?.id ?? null)
   const searchQuery = ref('')
   const selectedCategory = ref<EquipmentCategory | 'all'>('all')
   const selectedStatus = ref<EquipmentStatus | 'all'>('all')
   const selectedLocation = ref('all')
   const sortMode = ref<InventorySortMode>('condition_desc')
   const viewMode = ref<InventoryViewMode>('grid')

   const selectedEquipment = computed(() =>
      equipment.value.find((item) => item.id === selectedEquipmentId.value) ?? null,
   )
   const availableLocations = computed(() =>
      [...new Set(equipment.value.map((item) => item.locationName).filter((name): name is string => Boolean(name)))].sort(),
   )
   const filteredEquipment = computed(() => {
      const query = searchQuery.value.trim().toLowerCase()
      const items = equipment.value.filter((item) => {
         const searchable = [item.name, item.id, categoryLabels[item.category], item.locationName, item.farmName]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

         return (
            (!query || searchable.includes(query)) &&
            (selectedCategory.value === 'all' || item.category === selectedCategory.value) &&
            (selectedStatus.value === 'all' || item.status === selectedStatus.value) &&
            (selectedLocation.value === 'all' || item.locationName === selectedLocation.value)
         )
      })

      return [...items].sort((first, second) => {
         if (sortMode.value === 'condition_asc') return first.condition - second.condition
         if (sortMode.value === 'name_asc') return first.name.localeCompare(second.name)
         if (sortMode.value === 'value_desc') return second.currentValueUsd - first.currentValueUsd
         return second.condition - first.condition
      })
   })

   const totalEquipmentCount = computed(() => equipment.value.length)
   const installedCount = computed(() => equipment.value.filter((item) => item.status === 'installed').length)
   const storageCount = computed(() => equipment.value.filter((item) => item.status === 'in_storage').length)
   const needsAttentionCount = computed(() =>
      equipment.value.filter((item) => item.status === 'broken' || item.status === 'repairing').length,
   )
   const totalInventoryValue = computed(() =>
      equipment.value.reduce((total, item) => total + item.currentValueUsd, 0),
   )
   const hasActiveFilters = computed(() =>
      Boolean(searchQuery.value.trim()) ||
      selectedCategory.value !== 'all' ||
      selectedStatus.value !== 'all' ||
      selectedLocation.value !== 'all' ||
      sortMode.value !== 'condition_desc',
   )

   const selectEquipment = (id: string | null) => { selectedEquipmentId.value = id }
   const setSearchQuery = (query: string) => { searchQuery.value = query }
   const setCategory = (category: EquipmentCategory | 'all') => { selectedCategory.value = category }
   const setStatus = (status: EquipmentStatus | 'all') => { selectedStatus.value = status }
   const setLocation = (location: string) => { selectedLocation.value = location }
   const setSortMode = (mode: InventorySortMode) => { sortMode.value = mode }
   const setViewMode = (mode: InventoryViewMode) => { viewMode.value = mode }
   const clearFilters = () => {
      searchQuery.value = ''
      selectedCategory.value = 'all'
      selectedStatus.value = 'all'
      selectedLocation.value = 'all'
      sortMode.value = 'condition_desc'
   }

   return {
      equipment,
      selectedEquipmentId,
      searchQuery,
      selectedCategory,
      selectedStatus,
      selectedLocation,
      sortMode,
      viewMode,
      selectedEquipment,
      availableLocations,
      filteredEquipment,
      totalEquipmentCount,
      installedCount,
      storageCount,
      needsAttentionCount,
      totalInventoryValue,
      hasActiveFilters,
      selectEquipment,
      setSearchQuery,
      setCategory,
      setStatus,
      setLocation,
      setSortMode,
      setViewMode,
      clearFilters,
   }
})
