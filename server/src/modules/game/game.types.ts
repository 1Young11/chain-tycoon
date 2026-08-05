export type GameState = {
   player: { id: string; email: string; level: number; xp: number; totalXp: number }
   wallet: { currency: string; cash: number }
   financialSummary: { cash: number; cryptoValue: number; equipmentValue: number; grossIncomePerHour: number; electricityCostPerHour: number; netIncomePerHour: number; netWorth: number }
   locations: Array<{ id: string; type: string; name: string; requiredLevel: number; purchasePrice: number; slotCapacity: number; usedSlots: number; powerCapacityKw: number; powerUsageKw: number; coolingCapacity: number; heatGenerated: number; status: string; isOwned: boolean }>
}
