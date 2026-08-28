type ChangeDirection = 'positive' | 'negative' | 'neutral' | null

export const getChangeDirection = (percent: string | null): ChangeDirection => {
   if (percent === null) return null
   const percentValue = Number(percent)
   if (percentValue > 0) {
      return 'positive'
   } else if (percentValue < 0) {
      return 'negative'
   } 
   return 'neutral'
}