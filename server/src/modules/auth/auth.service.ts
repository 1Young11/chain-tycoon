import bcrypt from 'bcryptjs'
import { pool } from '../../db/connection'
import { generateToken } from '../../utils/jwt'
import { initializeGameState } from '../game/game.service'

type SafeUser = { id: string; username: string; email: string }

const createSession = (user: SafeUser) => ({
   token: generateToken({ sub: String(user.id), email: user.email }),
   user: { ...user, id: String(user.id) },
})

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
      return createSession(user)
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

   return createSession({ id: user.id, username: user.username, email: user.email })
}
