export type EquipmentCategory = 'gpu' | 'psu' | 'case' | 'base_system' | 'cooling' | 'accessory'

export type EquipmentStatus =
   | 'in_storage'
   | 'installed'
   | 'reserved'
   | 'installing'
   | 'repairing'
   | 'broken'
   | 'for_sale'

export type EquipmentConditionLabel = 'excellent' | 'good' | 'worn' | 'poor' | 'critical'
export type InventoryViewMode = 'grid' | 'table'
export type InventorySortMode = 'condition_desc' | 'condition_asc' | 'name_asc' | 'value_desc'

export type EquipmentMetric = {
   label: string
   value: string
}

export type EquipmentPerformance = {
   algorithmOrCoin: string
   value: string
}

export type EquipmentInstance = {
   id: string
   modelId: string
   name: string
   category: EquipmentCategory
   status: EquipmentStatus
   condition: number
   locationId: string | null
   locationName: string | null
   farmId: string | null
   farmName: string | null
   purchasePriceUsd: number
   currentValueUsd: number
   lifetimeRevenueUsd: number
   runtimeHours: number
   repairEtaMinutes?: number
   powerWatts: number | null
   cardMetrics: EquipmentMetric[]
   performance: EquipmentPerformance[]
   imageUrl: string | null
}
