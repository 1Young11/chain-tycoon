import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiError, apiRequest } from '@/shared/api/client'
import { useAuthStore } from '@/features/auth'
import router from '@/router'
import { formatUsd } from '@/utils/money'

export type Location = {
   id: string; type: string; name: string; requiredLevel: number; purchasePrice: string
   slotCapacity: number; usedSlots: number; powerCapacityKw: number; powerUsageKw: number
   coolingCapacity: number; heatGenerated: number; status: string; isOwned: boolean
}
export type Player = { id: string; email: string; level: number; xp: number; totalXp: number }
export type Wallet = { currency: 'USD'; availableCash: string; reservedCash: string }
export type FinancialSummary = {
   cash: string; cryptoValue: string; equipmentValue: string; grossIncomePerHour: string
   electricityCostPerHour: string; netIncomePerHour: string; netWorth: string
}
type GameResponse = { success: true; data: { player: Player; wallet: Wallet; financialSummary: FinancialSummary; locations: Location[] } }

export const useGameStore = defineStore('game', () => {
   const player = ref<Player | null>(null)
   const wallet = ref<Wallet | null>(null)
   const financialSummary = ref<FinancialSummary | null>(null)
   const locations = ref<Location[]>([])
   const isLoading = ref(false)
   const error = ref<string | null>(null)

   const balance = computed(() => wallet.value?.availableCash ?? '0.00')
   const level = computed(() => player.value?.level ?? 1)
   const xp = computed(() => player.value?.xp ?? 0)
   const xpTarget = computed(() => level.value * 500)
   const xpProgress = computed(() => Math.min((xp.value / xpTarget.value) * 100, 100))
   const passiveIncomeHourly = computed(() => financialSummary.value?.netIncomePerHour ?? '0.00')
   const formattedBalance = computed(() => formatUsd(balance.value))
   const formattedNetWorth = computed(() => formatUsd(financialSummary.value?.netWorth ?? '0.00'))
   const formattedPassiveIncome = computed(() => `${formatUsd(passiveIncomeHourly.value)}/hr`)

   async function fetchGameState() {
      isLoading.value = true
      error.value = null
      try {
         const response = await apiRequest<GameResponse>('/game/state')
         player.value = response.data.player
         wallet.value = response.data.wallet
         financialSummary.value = response.data.financialSummary
         locations.value = response.data.locations
      } catch (reason) {
         if (reason instanceof ApiError && reason.status === 401) {
            useAuthStore().logout()
            await router.replace({ name: 'login' })
         }
         error.value = reason instanceof Error ? reason.message : 'Unable to load your game'
      } finally {
         isLoading.value = false
      }
   }

   return { player, wallet, financialSummary, locations, isLoading, error, balance, level, xp, xpTarget, xpProgress, passiveIncomeHourly, formattedBalance, formattedNetWorth, formattedPassiveIncome, fetchGameState }
})
