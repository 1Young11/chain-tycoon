import type { GameState } from './game.types'

export const mapGameState = (user: Record<string, unknown>, wallet: Record<string, unknown>, progress: Record<string, unknown>, locations: Array<Record<string, unknown>>): GameState => {
   const cash = Number(wallet.balance)
   return {
      player: { id: String(user.id), email: String(user.email), level: Number(progress.level), xp: Number(progress.xp), totalXp: Number(progress.total_xp) },
      wallet: { currency: String(wallet.currency), cash },
      financialSummary: { cash, cryptoValue: 0, equipmentValue: 0, grossIncomePerHour: 0, electricityCostPerHour: 0, netIncomePerHour: 0, netWorth: cash },
      locations: locations.map((row) => ({
         id: String(row.id), type: String(row.type), name: String(row.name), requiredLevel: Number(row.required_level), purchasePrice: Number(row.purchase_price),
         slotCapacity: Number(row.slot_capacity), usedSlots: Number(row.used_slots), powerCapacityKw: Number(row.power_capacity_kw), powerUsageKw: Number(row.power_usage_kw),
         coolingCapacity: Number(row.cooling_capacity), heatGenerated: Number(row.heat_generated), status: String(row.status), isOwned: Boolean(row.is_owned),
      })),
   }
}
