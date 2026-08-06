import type { PoolClient } from 'pg'
import { createLedgerEntry } from '../ledger/ledger.service'
import type { Cash } from '../../utils/money'
import { compareCash, formatCash, parseCash } from '../../utils/money'
import type { WalletProjection } from './wallet.types'

type WalletRow = {
   id: string
   user_id: string
   currency: 'USD'
   available_cash: string
   reserved_cash: string
}

const mapWallet = (row: WalletRow): WalletProjection => ({
   id: String(row.id),
   userId: String(row.user_id),
   currency: row.currency,
   availableCash: formatCash(parseCash(row.available_cash)),
   reservedCash: formatCash(parseCash(row.reserved_cash)),
})

export function assertSufficientCash(current: Cash, requested: Cash, bucket: string) {
   if (requested < 0n) throw new Error('Requested cash amount cannot be negative')
   if (compareCash(current, requested) < 0) throw new Error(`Insufficient ${bucket}`)
}

export async function createUsdWallet(client: PoolClient, userId: string): Promise<WalletProjection> {
   const result = await client.query<WalletRow>(
      `INSERT INTO wallets (
         user_id, currency, balance, available_cash, reserved_cash
       ) VALUES ($1, 'USD', 0.00, 0.00, 0.00)
       RETURNING id, user_id, currency, available_cash::text, reserved_cash::text`,
      [userId],
   )
   return mapWallet(result.rows[0])
}

export async function getUsdWallet(
   client: PoolClient,
   userId: string,
   options: { forUpdate?: boolean } = {},
): Promise<WalletProjection | null> {
   const result = await client.query<WalletRow>(
      `SELECT id, user_id, currency, available_cash::text, reserved_cash::text
       FROM wallets
       WHERE user_id = $1 AND currency = 'USD'
       ${options.forUpdate ? 'FOR UPDATE' : ''}`,
      [userId],
   )
   return result.rows[0] ? mapWallet(result.rows[0]) : null
}

async function updateProjection(
   client: PoolClient,
   walletId: string,
   availableDelta: Cash,
   reservedDelta: Cash,
): Promise<WalletProjection> {
   const result = await client.query<WalletRow>(
      `UPDATE wallets
       SET available_cash = available_cash + $2::numeric,
           reserved_cash = reserved_cash + $3::numeric,
           balance = available_cash + $2::numeric,
           updated_at = NOW()
       WHERE id = $1
         AND available_cash + $2::numeric >= 0
         AND reserved_cash + $3::numeric >= 0
       RETURNING id, user_id, currency, available_cash::text, reserved_cash::text`,
      [walletId, formatCash(availableDelta), formatCash(reservedDelta)],
   )
   if (!result.rows[0]) throw new Error('Wallet projection update would violate an invariant')
   return mapWallet(result.rows[0])
}

export async function creditAvailable(
   client: PoolClient,
   wallet: WalletProjection,
   operationId: string,
   amount: Cash,
): Promise<WalletProjection> {
   if (amount < 0n) throw new Error('Credit amount cannot be negative')
   await createLedgerEntry(client, {
      operationId, userId: wallet.userId, walletId: wallet.id,
      entryType: 'AVAILABLE_CASH', amount,
   })
   return updateProjection(client, wallet.id, amount, 0n)
}

export async function debitAvailable(
   client: PoolClient,
   wallet: WalletProjection,
   operationId: string,
   amount: Cash,
): Promise<WalletProjection> {
   assertSufficientCash(parseCash(wallet.availableCash), amount, 'available cash')
   await createLedgerEntry(client, {
      operationId, userId: wallet.userId, walletId: wallet.id,
      entryType: 'AVAILABLE_CASH', amount: -amount,
   })
   return updateProjection(client, wallet.id, -amount, 0n)
}

export async function reserveAvailable(
   client: PoolClient,
   wallet: WalletProjection,
   operationId: string,
   amount: Cash,
): Promise<WalletProjection> {
   assertSufficientCash(parseCash(wallet.availableCash), amount, 'available cash')
   await createLedgerEntry(client, {
      operationId, userId: wallet.userId, walletId: wallet.id,
      entryType: 'AVAILABLE_CASH', amount: -amount,
   })
   await createLedgerEntry(client, {
      operationId, userId: wallet.userId, walletId: wallet.id,
      entryType: 'RESERVED_CASH', amount,
   })
   return updateProjection(client, wallet.id, -amount, amount)
}

export async function releaseReserved(
   client: PoolClient,
   wallet: WalletProjection,
   operationId: string,
   amount: Cash,
): Promise<WalletProjection> {
   assertSufficientCash(parseCash(wallet.reservedCash), amount, 'reserved cash')
   await createLedgerEntry(client, {
      operationId, userId: wallet.userId, walletId: wallet.id,
      entryType: 'RESERVED_CASH', amount: -amount,
   })
   await createLedgerEntry(client, {
      operationId, userId: wallet.userId, walletId: wallet.id,
      entryType: 'AVAILABLE_CASH', amount,
   })
   return updateProjection(client, wallet.id, amount, -amount)
}

export async function assertWalletParity(client: PoolClient, walletId: string) {
   const result = await client.query<{ parity: boolean }>(
      `SELECT
         w.available_cash = COALESCE(SUM(e.amount) FILTER (WHERE e.entry_type = 'AVAILABLE_CASH'), 0)
         AND w.reserved_cash = COALESCE(SUM(e.amount) FILTER (WHERE e.entry_type = 'RESERVED_CASH'), 0)
         AS parity
       FROM wallets w
       LEFT JOIN ledger_entries e ON e.wallet_id = w.id
       WHERE w.id = $1
       GROUP BY w.id, w.available_cash, w.reserved_cash`,
      [walletId],
   )
   if (!result.rows[0]?.parity) throw new Error('Wallet projection does not match its ledger')
}
