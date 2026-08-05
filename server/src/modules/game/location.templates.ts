export const LOCATION_TEMPLATES = [
   { type: 'home', name: 'Home', requiredLevel: 1, purchasePrice: 0, slotCapacity: 4, powerCapacityKw: 4, coolingCapacity: 100, status: 'owned', isOwned: true },
   { type: 'garage', name: 'Garage', requiredLevel: 5, purchasePrice: 7500, slotCapacity: 10, powerCapacityKw: 15, coolingCapacity: 250, status: 'locked', isOwned: false },
   { type: 'warehouse', name: 'Warehouse', requiredLevel: 12, purchasePrice: 30000, slotCapacity: 30, powerCapacityKw: 60, coolingCapacity: 700, status: 'locked', isOwned: false },
   { type: 'data_center', name: 'Data Center', requiredLevel: 25, purchasePrice: 150000, slotCapacity: 100, powerCapacityKw: 500, coolingCapacity: 3000, status: 'locked', isOwned: false },
] as const
