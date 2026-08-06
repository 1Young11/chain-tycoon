export type Money = string

export type GameState = {
   player: { id: string; email: string; level: number; xp: number; totalXp: number }
   wallet: { currency: 'USD'; availableCash: Money; reservedCash: Money }
   financialSummary: {
      cash: Money
      cryptoValue: Money
      equipmentValue: Money
      grossIncomePerHour: Money
      electricityCostPerHour: Money
      netIncomePerHour: Money
      netWorth: Money
   }
   locations: Array<{
      id: string
      type: string
      name: string
      requiredLevel: number
      purchasePrice: Money
      slotCapacity: number
      usedSlots: number
      powerCapacityKw: number
      powerUsageKw: number
      coolingCapacity: number
      heatGenerated: number
      status: string
      isOwned: boolean
   }>
}
