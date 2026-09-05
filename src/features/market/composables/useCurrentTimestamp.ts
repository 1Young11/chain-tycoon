import { ref, onMounted, onUnmounted } from 'vue'

const TIMESTAMP_UPDATE_INTERVAL_MS = 1_000

export const useCurrentTimestamp = () => {
   const currentTimestamp = ref(Date.now())
   let timestampIntervalId: ReturnType<typeof setInterval> | undefined

   const updateCurrentTimestamp = () => {
      currentTimestamp.value = Date.now()
   }

   onMounted(() => {
      timestampIntervalId = setInterval(updateCurrentTimestamp, TIMESTAMP_UPDATE_INTERVAL_MS)
   })
   onUnmounted(() => {
      if (timestampIntervalId !== undefined) {
         clearInterval(timestampIntervalId)
      }
   })

   return currentTimestamp
}