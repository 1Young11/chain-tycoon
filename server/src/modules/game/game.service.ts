import type { PoolClient } from 'pg'
import { pool } from '../../db/connection'
import { LOCATION_TEMPLATES } from './location.templates'
import { mapGameState } from './game.mapper'

export async function initializeGameState(client: PoolClient, userId: string) {
   await client.query(`INSERT INTO wallets (user_id, currency, balance) VALUES ($1, 'USD', 10000) ON CONFLICT (user_id, currency) DO NOTHING`, [userId])
   await client.query(`INSERT INTO player_progress (user_id, level, xp, total_xp) VALUES ($1, 1, 0, 0) ON CONFLICT (user_id) DO NOTHING`, [userId])

   for (const location of LOCATION_TEMPLATES) {
      await client.query(
         `INSERT INTO user_locations (user_id, type, name, required_level, purchase_price, slot_capacity, power_capacity_kw, cooling_capacity, status, is_owned)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (user_id, type) DO NOTHING`,
         [userId, location.type, location.name, location.requiredLevel, location.purchasePrice, location.slotCapacity, location.powerCapacityKw, location.coolingCapacity, location.status, location.isOwned],
      )
   }
}

export async function getGameState(userId: string) {
   const client = await pool.connect()
   try {
      await client.query('BEGIN')
      const userResult = await client.query('SELECT id, email FROM users WHERE id = $1 FOR UPDATE', [userId])
      if (!userResult.rowCount) throw new Error('User not found')
      await initializeGameState(client, userId)
      const [wallet, progress, locations] = await Promise.all([
         client.query(`SELECT currency, balance FROM wallets WHERE user_id = $1 AND currency = 'USD'`, [userId]),
         client.query('SELECT level, xp, total_xp FROM player_progress WHERE user_id = $1', [userId]),
         client.query('SELECT * FROM user_locations WHERE user_id = $1 ORDER BY required_level', [userId]),
      ])
      await client.query('COMMIT')
      return mapGameState(userResult.rows[0], wallet.rows[0], progress.rows[0], locations.rows)
   } catch (error) {
      await client.query('ROLLBACK')
      throw error
   } finally {
      client.release()
   }
}
