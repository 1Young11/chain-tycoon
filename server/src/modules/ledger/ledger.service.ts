import type { PoolClient } from 'pg'
import type { Cash } from '../../utils/money'
import { formatCash } from '../../utils/money'
import type { EntryType, FinancialOperation, LedgerEntry, OperationType } from './ledger.types'

type OperationRow = {
   id: string
   user_id: string
   operation_type: string
   idempotency_key: string
   status: 'POSTED'
   metadata: Record<string, unknown>
   created_at: Date
}

type EntryRow = {
   id: string
   operation_id: string
   user_id: string
   wallet_id: string
   entry_type: EntryType
   amount: string
   currency: 'USD'
   created_at: Date
}

const mapOperation = (row: OperationRow): FinancialOperation => ({
   id: String(row.id),
   userId: String(row.user_id),
   operationType: row.operation_type,
   idempotencyKey: row.idempotency_key,
   status: row.status,
   metadata: row.metadata,
   createdAt: row.created_at,
})

const mapEntry = (row: EntryRow): LedgerEntry => ({
   id: String(row.id),
   operationId: String(row.operation_id),
   userId: String(row.user_id),
   walletId: String(row.wallet_id),
   entryType: row.entry_type,
   amount: row.amount,
   currency: row.currency,
   createdAt: row.created_at,
})

export async function findOperation(
   client: PoolClient,
   userId: string,
   idempotencyKey: string,
): Promise<FinancialOperation | null> {
   const result = await client.query<OperationRow>(
      `SELECT id, user_id, operation_type, idempotency_key, status, metadata, created_at
       FROM financial_operations
       WHERE user_id = $1 AND idempotency_key = $2`,
      [userId, idempotencyKey],
   )
   return result.rows[0] ? mapOperation(result.rows[0]) : null
}

export async function createOperation(
   client: PoolClient,
   input: {
      userId: string
      operationType: OperationType
      idempotencyKey: string
      metadata?: Record<string, unknown>
   },
): Promise<{ operation: FinancialOperation; replayed: boolean }> {
   const existing = await findOperation(client, input.userId, input.idempotencyKey)
   if (existing) {
      if (existing.operationType !== input.operationType) {
         throw new Error('Idempotency key is already used by an incompatible operation')
      }
      return { operation: existing, replayed: true }
   }

   try {
      const result = await client.query<OperationRow>(
         `INSERT INTO financial_operations (user_id, operation_type, idempotency_key, metadata)
          VALUES ($1, $2, $3, $4::jsonb)
          RETURNING id, user_id, operation_type, idempotency_key, status, metadata, created_at`,
         [input.userId, input.operationType, input.idempotencyKey, JSON.stringify(input.metadata ?? {})],
      )
      return { operation: mapOperation(result.rows[0]), replayed: false }
   } catch (error) {
      if ((error as { code?: string }).code !== '23505') throw error
      const raced = await findOperation(client, input.userId, input.idempotencyKey)
      if (!raced || raced.operationType !== input.operationType) {
         throw new Error('Opening balance or idempotency key already exists')
      }
      return { operation: raced, replayed: true }
   }
}

export async function createLedgerEntry(
   client: PoolClient,
   input: {
      operationId: string
      userId: string
      walletId: string
      entryType: EntryType
      amount: Cash
   },
): Promise<LedgerEntry> {
   const result = await client.query<EntryRow>(
      `INSERT INTO ledger_entries (
         operation_id, user_id, wallet_id, entry_type, amount, currency
       ) VALUES ($1, $2, $3, $4, $5::numeric, 'USD')
       RETURNING id, operation_id, user_id, wallet_id, entry_type, amount::text, currency, created_at`,
      [input.operationId, input.userId, input.walletId, input.entryType, formatCash(input.amount)],
   )
   return mapEntry(result.rows[0])
}

export async function getOperationEntries(
   client: PoolClient,
   operationId: string,
): Promise<LedgerEntry[]> {
   const result = await client.query<EntryRow>(
      `SELECT id, operation_id, user_id, wallet_id, entry_type, amount::text, currency, created_at
       FROM ledger_entries WHERE operation_id = $1 ORDER BY created_at, id`,
      [operationId],
   )
   return result.rows.map(mapEntry)
}
