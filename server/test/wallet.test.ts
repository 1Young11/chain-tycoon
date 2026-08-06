import assert from 'node:assert/strict'
import test from 'node:test'
import { assertSufficientCash } from '../src/modules/wallet'
import { parseCash } from '../src/utils/money'

test('wallet rejects insufficient available cash without floating-point arithmetic', () => {
   assert.doesNotThrow(() => assertSufficientCash(parseCash('10.00'), parseCash('10.00'), 'available cash'))
   assert.throws(
      () => assertSufficientCash(parseCash('9.99'), parseCash('10.00'), 'available cash'),
      /Insufficient available cash/,
   )
})
