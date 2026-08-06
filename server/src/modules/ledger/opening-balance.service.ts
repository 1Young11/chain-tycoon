import type { PoolClient } from 'pg'
import type { Cash } from '../../utils/money'
import { compareCash, parseCash } from '../../utils/money'
import { assertWalletParity, creditAvailable, getUsdWallet } from '../wallet'
import { createOperation, getOperationEntries } from './ledger.service'
import { OPERATION_TYPES } from './ledger.types'

export async function createOpeningBalance(
   client: PoolClient,
   input: {
      userId: string
      walletId: string
      amount: Cash
      idempotencyKey: string
      source: 'REGISTRATION' | 'LEGACY_BACKFILL'
   },
) {
   const { operation, replayed } = await createOperation(client, {
      userId: input.userId,
      operationType: OPERATION_TYPES.OPENING_BALANCE,
      idempotencyKey: input.idempotencyKey,
      metadata: { source: input.source },
   })

   if (replayed) {
      const entries = await getOperationEntries(client, operation.id)
      const openingEntry = entries.find((entry) =>
         entry.walletId === input.walletId && entry.entryType === 'AVAILABLE_CASH')
      if (!openingEntry || compareCash(parseCash(openingEntry.amount, { allowNegative: true }), input.amount) !== 0) {
         throw new Error('Opening balance replay is incompatible with the existing ledger entry')
      }
      return { operation, replayed, wallet: await getUsdWallet(client, input.userId, { forUpdate: true }) }
   }

   const wallet = await getUsdWallet(client, input.userId, { forUpdate: true })
   if (!wallet || wallet.id !== input.walletId) throw new Error('Opening balance wallet is missing')
   const updatedWallet = await creditAvailable(client, wallet, operation.id, input.amount)
   await assertWalletParity(client, wallet.id)
   return { operation, replayed, wallet: updatedWallet }
}
