/// <reference types="node" />

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import test, { after, before } from 'node:test'
import { Pool, type PoolClient } from 'pg'

const testDatabaseUrl = process.env.TEST_DATABASE_URL
if (!testDatabaseUrl) {
   throw new Error('TEST_DATABASE_URL is required for ledger integration tests')
}

const databaseName = new URL(testDatabaseUrl).pathname.replace(/^\//, '')
if (!/(^|_)test($|_)/i.test(databaseName) && !/_test$/i.test(databaseName)) {
   throw new Error('TEST_DATABASE_URL must name an explicitly isolated test database')
}

process.env.DATABASE_URL = testDatabaseUrl

const database = new Pool({ connectionString: testDatabaseUrl, max: 10 })
const migrationsDirectory = join(__dirname, '../src/db/migrations')
const migration = (name: string) => readFile(join(migrationsDirectory, name), 'utf8')

async function runInTransaction(client: PoolClient, sql: string) {
   await client.query('BEGIN')
   try {
      await client.query(sql)
      await client.query('COMMIT')
   } catch (error) {
      await client.query('ROLLBACK')
      throw error
   }
}

async function applyMigration(client: PoolClient, name: string) {
   const applied = await client.query('SELECT 1 FROM schema_migrations WHERE name = $1', [name])
   if (applied.rowCount) return false
   await client.query('BEGIN')
   try {
      await client.query(await migration(name))
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name])
      await client.query('COMMIT')
      return true
   } catch (error) {
      await client.query('ROLLBACK')
      throw error
   }
}

async function resetDatabase(includeLedger = false) {
   await database.query('DROP SCHEMA public CASCADE')
   await database.query('CREATE SCHEMA public')
   const client = await database.connect()
   try {
      await client.query(`
         CREATE TABLE schema_migrations (
            name TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
         )
      `)
      await applyMigration(client, '001_create_users.sql')
      await applyMigration(client, '002_create_game_state.sql')
      if (includeLedger) await applyMigration(client, '003_create_financial_ledger.sql')
   } finally {
      client.release()
   }
}

let authService: typeof import('../src/modules/auth/auth.service')
let appPool: typeof import('../src/db/connection').pool
let ledger: typeof import('../src/modules/ledger')
let walletService: typeof import('../src/modules/wallet')
let money: typeof import('../src/utils/money')

before(async () => {
   authService = await import('../src/modules/auth/auth.service')
   appPool = (await import('../src/db/connection')).pool
   ledger = await import('../src/modules/ledger')
   walletService = await import('../src/modules/wallet')
   money = await import('../src/utils/money')
})

after(async () => {
   await Promise.all([database.end(), appPool?.end()])
})

test('003 preserves legacy capital, fills missing wallets, and creates one opening entry', async () => {
   await resetDatabase()
   await database.query('ALTER TABLE users ADD COLUMN balance NUMERIC(20,2)')
   await database.query(`
      INSERT INTO users (id, username, email, password, balance) VALUES
      (gen_random_uuid(), 'wallet-owner', 'wallet-owner@example.test', 'hash', 999.00),
      (gen_random_uuid(), 'missing-wallet', 'missing-wallet@example.test', 'hash', 77.77),
      (gen_random_uuid(), 'zero-wallet', 'zero-wallet@example.test', 'hash', 0.00)
   `)
   await database.query(`
      INSERT INTO wallets (user_id, currency, balance)
      SELECT id, 'USD', CASE username WHEN 'wallet-owner' THEN 123.45 ELSE 0.00 END
      FROM users WHERE username IN ('wallet-owner', 'zero-wallet')
   `)

   const beforeBalances = await database.query(
      'SELECT COUNT(*)::int AS count, SUM(balance)::text AS total FROM users',
   )
   const client = await database.connect()
   try {
      assert.equal(await applyMigration(client, '003_create_financial_ledger.sql'), true)
      assert.equal(await applyMigration(client, '003_create_financial_ledger.sql'), false)
   } finally {
      client.release()
   }

   const projections = await database.query(`
      SELECT w.available_cash::text, w.reserved_cash::text, e.amount::text
      FROM wallets w
      JOIN financial_operations operation
         ON operation.user_id = w.user_id AND operation.operation_type = 'OPENING_BALANCE'
      JOIN ledger_entries e
         ON e.operation_id = operation.id AND e.wallet_id = w.id
      ORDER BY w.available_cash
   `)
   assert.deepEqual(
      projections.rows.map((row) => [row.available_cash, row.reserved_cash, row.amount]),
      [['0.00', '0.00', '0.00'], ['77.77', '0.00', '77.77'], ['123.45', '0.00', '123.45']],
   )

   const counts = await database.query(`
      SELECT
         (SELECT COUNT(*)::int FROM wallets) AS wallets,
         (SELECT COUNT(*)::int FROM financial_operations WHERE operation_type = 'OPENING_BALANCE') AS openings,
         (SELECT COUNT(*)::int FROM ledger_entries) AS entries,
         (SELECT COUNT(*)::int FROM schema_migrations) AS migrations
   `)
   assert.deepEqual(counts.rows[0], { wallets: 3, openings: 3, entries: 3, migrations: 3 })

   const afterBalances = await database.query(
      'SELECT COUNT(*)::int AS count, SUM(balance)::text AS total FROM users',
   )
   assert.deepEqual(afterBalances.rows[0], beforeBalances.rows[0])
})

test('invalid legacy balance aborts all of migration 003', async () => {
   await resetDatabase()
   await database.query('ALTER TABLE users ADD COLUMN balance NUMERIC(20,2)')
   await database.query(
      `INSERT INTO users (username, email, password, balance)
       VALUES ('invalid-legacy', 'invalid-legacy@example.test', 'hash', NULL)`,
   )
   const client = await database.connect()
   try {
      await assert.rejects(
         () => applyMigration(client, '003_create_financial_ledger.sql'),
         /invalid legacy balance/,
      )
   } finally {
      client.release()
   }

   const state = await database.query(`
      SELECT
         to_regclass('public.financial_operations') IS NULL AS operations_absent,
         NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'wallets' AND column_name = 'available_cash'
         ) AS projection_absent
   `)
   assert.deepEqual(state.rows[0], { operations_absent: true, projection_absent: true })
})

test('registration atomically creates one 10000.00 opening balance', async () => {
   await resetDatabase(true)
   const user = await authService.register('new-player', 'new-player@example.test', 'strong-password')
   const result = await database.query(`
      SELECT w.available_cash::text, w.reserved_cash::text, w.balance::text,
             COUNT(DISTINCT operation.id)::int AS operations,
             COUNT(entry.id)::int AS entries,
             SUM(entry.amount)::text AS ledger_total
      FROM wallets w
      JOIN financial_operations operation ON operation.user_id = w.user_id
      JOIN ledger_entries entry ON entry.operation_id = operation.id
      WHERE w.user_id = $1
      GROUP BY w.id
   `, [user.id])
   assert.deepEqual(result.rows[0], {
      available_cash: '10000.00', reserved_cash: '0.00', balance: '10000.00',
      operations: 1, entries: 1, ledger_total: '10000.00',
   })
})

test('registration rollback leaves no financial rows', async () => {
   await database.query(`
      CREATE FUNCTION fail_progress_for_test() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'forced test rollback'; END; $$;
      CREATE TRIGGER fail_progress_for_test BEFORE INSERT ON player_progress
      FOR EACH ROW EXECUTE FUNCTION fail_progress_for_test();
   `)
   try {
      await assert.rejects(
         () => authService.register('rollback-player', 'rollback-player@example.test', 'strong-password'),
         /forced test rollback/,
      )
      const result = await database.query(`
         SELECT
            (SELECT COUNT(*)::int FROM users WHERE email = 'rollback-player@example.test') AS users,
            (SELECT COUNT(*)::int FROM wallets w JOIN users u ON u.id = w.user_id WHERE u.email = 'rollback-player@example.test') AS wallets,
            (SELECT COUNT(*)::int FROM financial_operations operation JOIN users u ON u.id = operation.user_id WHERE u.email = 'rollback-player@example.test') AS operations
      `)
      assert.deepEqual(result.rows[0], { users: 0, wallets: 0, operations: 0 })
   } finally {
      await database.query('DROP TRIGGER fail_progress_for_test ON player_progress')
      await database.query('DROP FUNCTION fail_progress_for_test()')
   }
})

test('ledger history rejects UPDATE and DELETE', async () => {
   await assert.rejects(
      () => database.query(`UPDATE financial_operations SET metadata = '{}'::jsonb`),
      /append-only/,
   )
   await assert.rejects(() => database.query('DELETE FROM financial_operations'), /append-only/)
   await assert.rejects(
      () => database.query(`UPDATE ledger_entries SET amount = amount`),
      /append-only/,
   )
   await assert.rejects(() => database.query('DELETE FROM ledger_entries'), /append-only/)
})

async function performDebit(userId: string, key: string, amount: string) {
   const client = await database.connect()
   try {
      await client.query('BEGIN')
      const wallet = await walletService.getUsdWallet(client, userId, { forUpdate: true })
      if (!wallet) throw new Error('Wallet missing')
      const operationResult = await ledger.createOperation(client, {
         userId,
         operationType: ledger.OPERATION_TYPES.DEBIT,
         idempotencyKey: key,
         metadata: { amount },
      })
      if (!operationResult.replayed) {
         await walletService.debitAvailable(
            client, wallet, operationResult.operation.id, money.parseCash(amount),
         )
         await walletService.assertWalletParity(client, wallet.id)
      } else if (operationResult.operation.metadata.amount !== amount) {
         throw new Error('Idempotent replay amount is incompatible')
      }
      await client.query('COMMIT')
      return operationResult
   } catch (error) {
      await client.query('ROLLBACK')
      throw error
   } finally {
      client.release()
   }
}

test('idempotent replay and concurrent debits cannot double-spend', async () => {
   const user = await authService.register('concurrent-player', 'concurrent-player@example.test', 'strong-password')

   const sameKey = await Promise.all([
      performDebit(user.id, 'same-debit:v1', '100.00'),
      performDebit(user.id, 'same-debit:v1', '100.00'),
   ])
   assert.deepEqual(sameKey.map((result) => result.replayed).sort(), [false, true])

   const incompatibleClient = await database.connect()
   try {
      await incompatibleClient.query('BEGIN')
      await assert.rejects(
         () => ledger.createOperation(incompatibleClient, {
            userId: user.id,
            operationType: ledger.OPERATION_TYPES.CREDIT,
            idempotencyKey: 'same-debit:v1',
         }),
         /incompatible operation/,
      )
      await incompatibleClient.query('ROLLBACK')
   } finally {
      incompatibleClient.release()
   }

   const concurrent = await Promise.allSettled([
      performDebit(user.id, 'large-debit-a:v1', '7000.00'),
      performDebit(user.id, 'large-debit-b:v1', '7000.00'),
   ])
   assert.equal(concurrent.filter((result) => result.status === 'fulfilled').length, 1)
   assert.equal(concurrent.filter((result) => result.status === 'rejected').length, 1)

   const result = await database.query(`
      SELECT available_cash::text,
             (SELECT COALESCE(SUM(amount), 0)::text FROM ledger_entries WHERE wallet_id = w.id AND entry_type = 'AVAILABLE_CASH') AS ledger_total
      FROM wallets w WHERE user_id = $1
   `, [user.id])
   assert.deepEqual(result.rows[0], { available_cash: '2900.00', ledger_total: '2900.00' })
})
