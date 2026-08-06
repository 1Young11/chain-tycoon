const MONEY_PATTERN = /^-?\d+\.\d{2}$/

export function formatUsd(value: string): string {
   if (!MONEY_PATTERN.test(value)) throw new Error('Invalid money value received from the server')
   const negative = value.startsWith('-')
   const unsigned = negative ? value.slice(1) : value
   const [integer, fraction] = unsigned.split('.')
   const normalizedInteger = integer.replace(/^0+(?=\d)/, '')
   const grouped = normalizedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
   return `${negative ? '-' : ''}$${grouped}.${fraction}`
}
