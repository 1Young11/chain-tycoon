const usdPriceFormatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
})
const percentFormatter = new Intl.NumberFormat('en-US', {
   style: 'unit',
   unit: 'percent',
   signDisplay: 'always',
})

export const formatUsdPrice = (priceUsd: string): string => {
   return usdPriceFormatter.format(Number(priceUsd))
}

export const formatChangePercent = (change24hPercent: string | null): string => {
   if (change24hPercent === null) return '—'
   return percentFormatter.format(Number(change24hPercent))
}