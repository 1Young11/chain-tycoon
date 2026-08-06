import assert from 'node:assert/strict'
import test from 'node:test'
import type { PoolClient } from 'pg'
import { createOperation, OPERATION_TYPES } from '../src/modules/ledger'

const existingOperation = {
   id: 'operation-id',
   user_id: 'user-id',
   operation_type: 'CREDIT',
   idempotency_key: 'request-key',
   status: 'POSTED' as const,
   metadata: {},
   created_at: new Date(0),
}

test('ledger rejects reuse of an idempotency key by an incompatible operation type', async () => {
   const client = {
      query: async () => ({ rows: [existingOperation] }),
   } as unknown as PoolClient

   await assert.rejects(
      () => createOperation(client, {
         userId: 'user-id',
         operationType: OPERATION_TYPES.DEBIT,
         idempotencyKey: 'request-key',
      }),
      /incompatible operation/,
   )
})

test('ledger returns the existing operation for a compatible idempotent replay', async () => {
   let queryCount = 0
   const client = {
      query: async () => {
         queryCount += 1
         return { rows: [existingOperation] }
      },
   } as unknown as PoolClient

   const result = await createOperation(client, {
      userId: 'user-id',
      operationType: OPERATION_TYPES.CREDIT,
      idempotencyKey: 'request-key',
   })
   assert.equal(result.replayed, true)
   assert.equal(result.operation.id, 'operation-id')
   assert.equal(queryCount, 1)
})
