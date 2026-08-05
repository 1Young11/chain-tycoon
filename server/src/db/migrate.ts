import 'dotenv/config'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pool } from './connection'

async function migrate() {
   const directory = join(__dirname, 'migrations')
   const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort()
   const client = await pool.connect()
   try {
      await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())')
      for (const file of files) {
         const applied = await client.query('SELECT 1 FROM schema_migrations WHERE name = $1', [file])
         if (applied.rowCount) continue
         await client.query('BEGIN')
         await client.query(await readFile(join(directory, file), 'utf8'))
         await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file])
         await client.query('COMMIT')
         console.log(`Applied ${file}`)
      }
   } catch (error) {
      await client.query('ROLLBACK')
      throw error
   } finally {
      client.release()
      await pool.end()
   }
}

migrate().catch((error) => {
   console.error('Migration failed', error)
   process.exitCode = 1
})
