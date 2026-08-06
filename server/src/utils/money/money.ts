export type Cash = bigint

const CASH_PATTERN = /^-?\d+(?:\.\d{1,2})?$/
const ROUNDABLE_DECIMAL_PATTERN = /^-?\d+(?:\.\d+)?$/
const MAX_INTEGER_DIGITS = 18

function assertDecimalShape(value: string, pattern: RegExp, label: string) {
   if (!pattern.test(value)) throw new Error(`${label} must be a plain decimal string`)
   const unsigned = value.startsWith('-') ? value.slice(1) : value
   const integer = unsigned.split('.')[0].replace(/^0+(?=\d)/, '')
   if (integer.length > MAX_INTEGER_DIGITS) throw new Error(`${label} exceeds NUMERIC(20,2)`)
}

export function parseCash(value: string, options: { allowNegative?: boolean } = {}): Cash {
   assertDecimalShape(value, CASH_PATTERN, 'Cash')
   const negative = value.startsWith('-')
   if (negative && !options.allowNegative) throw new Error('Cash cannot be negative')

   const unsigned = negative ? value.slice(1) : value
   const [integer, fraction = ''] = unsigned.split('.')
   const cents = BigInt(integer) * 100n + BigInt(fraction.padEnd(2, '0'))
   return negative ? -cents : cents
}

export function formatCash(value: Cash): string {
   const negative = value < 0n
   const absolute = negative ? -value : value
   const integer = absolute / 100n
   const fraction = String(absolute % 100n).padStart(2, '0')
   return `${negative ? '-' : ''}${integer}.${fraction}`
}

export const addCash = (left: Cash, right: Cash): Cash => left + right
export const subtractCash = (left: Cash, right: Cash): Cash => left - right
export const compareCash = (left: Cash, right: Cash): -1 | 0 | 1 => left < right ? -1 : left > right ? 1 : 0

export function roundCashHalfUp(value: string): string {
   assertDecimalShape(value, ROUNDABLE_DECIMAL_PATTERN, 'Decimal')
   const negative = value.startsWith('-')
   const unsigned = negative ? value.slice(1) : value
   const [integer, fraction = ''] = unsigned.split('.')
   const retained = fraction.slice(0, 2).padEnd(2, '0')
   const shouldRound = (fraction[2] ?? '0') >= '5'
   let cents = BigInt(integer) * 100n + BigInt(retained)
   if (shouldRound) cents += 1n
   if (negative) cents = -cents

   const formatted = formatCash(cents)
   assertDecimalShape(formatted, CASH_PATTERN, 'Rounded cash')
   return formatted
}
