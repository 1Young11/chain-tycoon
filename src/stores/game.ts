import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

type ActivityTone = 'green' | 'red' | 'amber' | 'purple' | 'blue'
type ActivityValueTone = 'profit' | 'loss' | 'warning' | 'muted'

type ActivityItem = {
   id: number
   time: string
   icon: string
   title: string
   description: string
   value: string
   tone: ActivityTone
   valueTone: ActivityValueTone
}

type SummaryMetric = {
   label: string
   value: string
   tone?: ActivityValueTone
}

type ChartBar = {
   label: string
   height: number
   tone?: 'profit' | 'loss' | 'active'
   active?: boolean
}

const formatMoney = (value: number) =>
   new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(value)

export const useGameStore = defineStore('game', () => {
   const balance = ref(12453.68)
   const level = ref(3)
   const xp = ref(725)
   const xpTarget = ref(1500)
   const passiveIncomeHourly = ref(24.5)
   const todayPnl = ref(731)
   const todayPnlPercent = ref(6.2)
   const globalRank = ref(284)
   const tickerId = ref<ReturnType<typeof setInterval> | null>(null)

   const urgentEvent = ref({
      title: 'Market Event Active: SEC Investigation',
      secondsRemaining: 47,
   })

   const todayActivities = ref<ActivityItem[]>([
      {
         id: 1,
         time: '09:15',
         icon: 'fa-cart-shopping',
         title: 'Bought BTC',
         description: '0.05 BTC at $64,250',
         value: 'pending',
         tone: 'green',
         valueTone: 'muted',
      },
      {
         id: 2,
         time: '10:00',
         icon: 'fa-bolt',
         title: 'Mining Income',
         description: 'Alpha Rig & Beta Station',
         value: '+$24.50',
         tone: 'amber',
         valueTone: 'profit',
      },
      {
         id: 3,
         time: '11:30',
         icon: 'fa-triangle-exclamation',
         title: 'Market Event',
         description: 'SEC Investigation - reacted poorly',
         value: '-$180.00',
         tone: 'red',
         valueTone: 'loss',
      },
      {
         id: 4,
         time: '12:45',
         icon: 'fa-chart-line',
         title: 'Sold ETH',
         description: '0.1 ETH at $3,420',
         value: '+$342.00',
         tone: 'green',
         valueTone: 'profit',
      },
      {
         id: 5,
         time: '14:00',
         icon: 'fa-bolt',
         title: 'Mining Income',
         description: 'Passive collection batch',
         value: '+$49.00',
         tone: 'amber',
         valueTone: 'profit',
      },
      {
         id: 6,
         time: '15:20',
         icon: 'fa-check',
         title: 'Market Event',
         description: 'ETF Approval - reacted correctly',
         value: '+$520.00',
         tone: 'green',
         valueTone: 'profit',
      },
      {
         id: 7,
         time: '16:00',
         icon: 'fa-arrow-up',
         title: 'Farm Upgraded',
         description: 'Alpha Rig to Level 4',
         value: '-$200.00',
         tone: 'purple',
         valueTone: 'muted',
      },
      {
         id: 8,
         time: '17:00',
         icon: 'fa-info',
         title: 'New Event',
         description: 'Flash Crash incoming in 4:32',
         value: 'warning',
         tone: 'blue',
         valueTone: 'warning',
      },
   ])

   const weeklySummary = ref<SummaryMetric[]>([
      { label: 'Profit', value: '+$1,240.00', tone: 'profit' },
      { label: 'Trades', value: '12' },
      { label: 'Won/Lost', value: '3 / 1' },
      { label: 'Best Day', value: 'Thu (+$520)', tone: 'profit' },
   ])

   const weeklyChart = ref<ChartBar[]>([
      { label: 'M', height: 12, tone: 'profit' },
      { label: 'T', height: 24, tone: 'profit' },
      { label: 'W', height: 10, tone: 'loss' },
      { label: 'T', height: 36, tone: 'profit' },
      { label: 'F', height: 42, tone: 'active', active: true },
      { label: 'S', height: 0 },
      { label: 'S', height: 0 },
   ])

   const xpProgress = computed(() => Math.min((xp.value / xpTarget.value) * 100, 100))
   const formattedBalance = computed(() => formatMoney(balance.value))
   const formattedPassiveIncome = computed(() => `+$${passiveIncomeHourly.value.toFixed(2)}/hr`)
   const formattedTodayPnl = computed(() => `+$${todayPnl.value.toLocaleString('en-US')}`)
   const urgentCountdown = computed(() => {
      const mins = Math.floor(urgentEvent.value.secondsRemaining / 60)
      const secs = urgentEvent.value.secondsRemaining % 60

      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
   })
   const activityColumns = computed(() => {
      const midpoint = Math.ceil(todayActivities.value.length / 2)

      return [todayActivities.value.slice(0, midpoint), todayActivities.value.slice(midpoint)]
   })

   const startTicker = () => {
      if (tickerId.value) return

      tickerId.value = setInterval(() => {
         balance.value += passiveIncomeHourly.value / 3600
         if (urgentEvent.value.secondsRemaining > 0) {
            urgentEvent.value.secondsRemaining -= 1
         }
      }, 1000)
   }

   const stopTicker = () => {
      if (!tickerId.value) return

      clearInterval(tickerId.value)
      tickerId.value = null
   }

   return {
      balance,
      level,
      xp,
      xpTarget,
      passiveIncomeHourly,
      todayPnl,
      todayPnlPercent,
      globalRank,
      urgentEvent,
      todayActivities,
      weeklySummary,
      weeklyChart,
      xpProgress,
      formattedBalance,
      formattedPassiveIncome,
      formattedTodayPnl,
      urgentCountdown,
      activityColumns,
      startTicker,
      stopTicker,
   }
})
