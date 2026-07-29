import type { EquipmentCategory, EquipmentConditionLabel, EquipmentStatus } from './equipment.types'

export const categoryLabels: Record<EquipmentCategory, string> = {
   gpu: 'GPU',
   psu: 'PSU',
   case: 'Cases & Frames',
   base_system: 'Base Systems',
   cooling: 'Cooling',
   accessory: 'Accessories',
}

export const statusLabels: Record<EquipmentStatus, string> = {
   in_storage: 'In Storage',
   installed: 'Installed',
   reserved: 'Reserved',
   installing: 'Installing',
   repairing: 'Repairing',
   broken: 'Broken',
   for_sale: 'For Sale',
}

export const clampCondition = (condition: number) => Math.min(Math.max(condition, 0), 100)

export const getConditionLabel = (condition: number): EquipmentConditionLabel => {
   const normalized = clampCondition(condition)
   if (normalized >= 90) return 'excellent'
   if (normalized >= 70) return 'good'
   if (normalized >= 50) return 'worn'
   if (normalized >= 25) return 'poor'
   return 'critical'
}

export const formatConditionLabel = (label: EquipmentConditionLabel) =>
   label.charAt(0).toUpperCase() + label.slice(1)

export const formatInventoryCurrency = (value: number) =>
   new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(value)

export const formatRuntime = (hours: number) => `${new Intl.NumberFormat('en-US').format(hours)} hours`
