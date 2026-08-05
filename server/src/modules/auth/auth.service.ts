import bcrypt from 'bcryptjs'
import { pool } from '../../db/connection'
import { initializeGameState } from '../game/game.service'

export type SafeUser = { id: string; username: string; email: string }

const normalizeUser = (user: SafeUser): SafeUser => ({ ...user, id: String(user.id) })

export async function register(username: string, email: string, password: string) {
   const client = await pool.connect()
   try {
      await client.query('BEGIN')
      const hashedPassword = await bcrypt.hash(password, 10)
      const result = await client.query<SafeUser>(
         'INSERT INTO users (username, email, password) VALUES ($1, LOWER($2), $3) RETURNING id, username, email',
         [username, email, hashedPassword],
      )
      const user = result.rows[0]
      await initializeGameState(client, String(user.id))
      await client.query('COMMIT')
      return normalizeUser(user)
   } catch (error) {
      await client.query('ROLLBACK')
      throw error
   } finally {
      client.release()
   }
}

export async function login(email: string, password: string) {
   const result = await pool.query(
      'SELECT id, username, email, password FROM users WHERE email = LOWER($1)',
      [email]
   )

   const user = result.rows[0]

   if (!user) throw new Error('User not found')

   const isValid = await bcrypt.compare(password, user.password)
   if (!isValid) throw new Error('Invalid password')

   return normalizeUser({ id: user.id, username: user.username, email: user.email })
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
   const result = await pool.query<SafeUser>(
      'SELECT id, username, email FROM users WHERE id = $1',
      [userId],
   )
   return result.rows[0] ? normalizeUser(result.rows[0]) : null
}
