const usdPriceFormatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
   style: 'unit',
   unit: 'percent',
   signDisplay: 'exceptZero',
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
})

const fetchedAtDateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
   day: 'numeric',
   month: 'short',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
   hour12: false,
})

export const formatUsdPrice = (priceUsd: string): string => {
   return usdPriceFormatter.format(Number(priceUsd))
}

export const formatChangePercent = (change24hPercent: string | null): string => {
   if (change24hPercent === null) return '—'

   return percentFormatter.format(Number(change24hPercent))
}

export const formatLastFetchedAt = (fetchedAt: string | null): string => {
   if (fetchedAt === null) return 'Never'

   const fetchedAtTimestamp = Date.parse(fetchedAt)
   const currentTimestamp = Date.now()

   if (fetchedAtTimestamp > currentTimestamp) return 'Just now'

   const elapsedMilliseconds = currentTimestamp - fetchedAtTimestamp
   const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
   const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60))

   if (elapsedSeconds < 60) return 'Just now'
   if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`

   return fetchedAtDateTimeFormatter.format(new Date(fetchedAtTimestamp))
}

export const formatProviderUpdatedAt = (providerUpdatedAt: string): string => {
   const currentTimestamp = Date.now()
   const providerUpdatedAtTimestamp = Date.parse(providerUpdatedAt)

   if (providerUpdatedAtTimestamp > currentTimestamp) return 'Just now'

   const elapsedMilliseconds = currentTimestamp - providerUpdatedAtTimestamp
   const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)
   const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60))

   if (elapsedSeconds === 0) return 'Just now'
   if (elapsedSeconds < 60) return `${elapsedSeconds}s ago`
   if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`
   return fetchedAtDateTimeFormatter.format(new Date(providerUpdatedAtTimestamp))
}