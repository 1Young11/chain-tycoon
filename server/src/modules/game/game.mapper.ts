import { addCash, formatCash, parseCash } from '../../utils/money'
import type { WalletProjection } from '../wallet'
import type { GameState } from './game.types'

const normalizeMoney = (value: unknown) => formatCash(parseCash(String(value)))

export const mapGameState = (
   user: Record<string, unknown>,
   wallet: WalletProjection,
   progress: Record<string, unknown>,
   locations: Array<Record<string, unknown>>,
): GameState => {
   const availableCash = parseCash(wallet.availableCash)
   const reservedCash = parseCash(wallet.reservedCash)
   const cash = formatCash(availableCash)
   const zero = '0.00'

   return {
      player: {
         id: String(user.id),
         email: String(user.email),
         level: Number(progress.level),
         xp: Number(progress.xp),
         totalXp: Number(progress.total_xp),
      },
      wallet: {
         currency: wallet.currency,
         availableCash: cash,
         reservedCash: formatCash(reservedCash),
      },
      financialSummary: {
         cash,
         cryptoValue: zero,
         equipmentValue: zero,
         grossIncomePerHour: zero,
         electricityCostPerHour: zero,
         netIncomePerHour: zero,
         netWorth: formatCash(addCash(availableCash, reservedCash)),
      },
      locations: locations.map((row) => ({
         id: String(row.id),
         type: String(row.type),
         name: String(row.name),
         requiredLevel: Number(row.required_level),
         purchasePrice: normalizeMoney(row.purchase_price),
         slotCapacity: Number(row.slot_capacity),
         usedSlots: Number(row.used_slots),
         powerCapacityKw: Number(row.power_capacity_kw),
         powerUsageKw: Number(row.power_usage_kw),
         coolingCapacity: Number(row.cooling_capacity),
         heatGenerated: Number(row.heat_generated),
         status: String(row.status),
         isOwned: Boolean(row.is_owned),
      })),
   }
}
