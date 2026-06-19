import bcrypt from "bcryptjs";

import { pool } from '../../db/connection';

import { generateToken } from '../../utils/jwt';

export async function register(username: string, email: string, password: string) {
   const salt = bcrypt.genSaltSync(10);
   const hashedPassword = bcrypt.hashSync(password, salt);

   const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, balance',
      [username, email, hashedPassword]
   );

   const user  = result.rows[0];
   const token = generateToken(user);

   return { token, user }
}

export async function login(email: string, password: string) {
   const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
   )

   const user = result.rows[0]

   if (!user) throw new Error('User not found')

   const isValid = await bcrypt.compare(password, user.password)
   if (!isValid) throw new Error('Invalid password')

   const { password: _, created_at, updated_at, ...safeUser } = user
   const token = generateToken(safeUser)

   return { token, safeUser }
}