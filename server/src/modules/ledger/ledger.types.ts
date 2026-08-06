export const OPERATION_TYPES = {
   OPENING_BALANCE: 'OPENING_BALANCE',
   CREDIT: 'CREDIT',
   DEBIT: 'DEBIT',
   RESERVE: 'RESERVE',
   RELEASE_RESERVE: 'RELEASE_RESERVE',
} as const

export type OperationType = typeof OPERATION_TYPES[keyof typeof OPERATION_TYPES]
export type EntryType = 'AVAILABLE_CASH' | 'RESERVED_CASH'

export type FinancialOperation = {
   id: string
   userId: string
   operationType: string
   idempotencyKey: string
   status: 'POSTED'
   metadata: Record<string, unknown>
   createdAt: Date
}

export type LedgerEntry = {
   id: string
   operationId: string
   userId: string
   walletId: string
   entryType: EntryType
   amount: string
   currency: 'USD'
   createdAt: Date
}
