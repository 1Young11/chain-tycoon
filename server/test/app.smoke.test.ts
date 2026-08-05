import assert from 'node:assert/strict'
import { Server } from 'node:http'
import test from 'node:test'
import { Pool } from 'pg'

test('importing the Express app has no runtime or database side effects', async () => {
   const originalListen = Server.prototype.listen
   const originalConnect = Pool.prototype.connect
   const originalQuery = Pool.prototype.query
   let listenCalled = false
   let databaseCalled = false

   Server.prototype.listen = function (this: Server) {
      listenCalled = true
      return this
   } as typeof Server.prototype.listen

   Pool.prototype.connect = function () {
      databaseCalled = true
      throw new Error('Express app import attempted to connect to PostgreSQL')
   } as typeof Pool.prototype.connect

   Pool.prototype.query = function () {
      databaseCalled = true
      throw new Error('Express app import attempted to query PostgreSQL')
   } as typeof Pool.prototype.query

   try {
      const { default: app } = await import('../src/app')

      assert.equal(typeof app, 'function')
      assert.equal(listenCalled, false)
      assert.equal(databaseCalled, false)
   } finally {
      Server.prototype.listen = originalListen
      Pool.prototype.connect = originalConnect
      Pool.prototype.query = originalQuery
   }
})
