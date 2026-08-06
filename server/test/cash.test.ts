/// <reference types="node" />

import assert from 'node:assert/strict'
import test from 'node:test'
import {
   addCash,
   compareCash,
   formatCash,
   parseCash,
   roundCashHalfUp,
   subtractCash,
} from '../src/utils/money'

test('cash converts between strict decimal strings and bigint cents', () => {
   assert.equal(parseCash('10000.00'), 1_000_000n)
   assert.equal(parseCash('0.1'), 10n)
   assert.equal(formatCash(1_000_000n), '10000.00')
   assert.equal(formatCash(-5n), '-0.05')
})

test('cash arithmetic and comparison remain exact', () => {
   const left = parseCash('0.10')
   const right = parseCash('0.20')
   assert.equal(formatCash(addCash(left, right)), '0.30')
   assert.equal(formatCash(subtractCash(right, left)), '0.10')
   assert.equal(compareCash(left, right), -1)
   assert.equal(compareCash(right, right), 0)
})

test('cash parser rejects unsafe or unsupported representations', () => {
   for (const value of ['', '-1.00', '1.001', '1e2', 'NaN', 'Infinity', '+1.00', ' 1.00']) {
      assert.throws(() => parseCash(value), Error)
   }
   assert.equal(parseCash('-1.00', { allowNegative: true }), -100n)
   assert.throws(() => parseCash('1000000000000000000.00'), /NUMERIC/)
})

test('ROUND_HALF_UP rounds cash without floating-point arithmetic', () => {
   assert.equal(roundCashHalfUp('1.004'), '1.00')
   assert.equal(roundCashHalfUp('1.005'), '1.01')
   assert.equal(roundCashHalfUp('-1.005'), '-1.01')
   assert.equal(roundCashHalfUp('999.999'), '1000.00')
   assert.throws(() => roundCashHalfUp('1e-3'), Error)
})
