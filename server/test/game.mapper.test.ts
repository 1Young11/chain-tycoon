import assert from 'node:assert/strict'
import test from 'node:test'
import { mapGameState } from '../src/modules/game/game.mapper'

test('Game State mapper exposes every monetary field as a decimal string', () => {
   const state = mapGameState(
      { id: 'user-id', email: 'player@example.test' },
      {
         id: 'wallet-id',
         userId: 'user-id',
         currency: 'USD',
         availableCash: '10000.00',
         reservedCash: '25.50',
      },
      { level: 1, xp: 0, total_xp: 0 },
      [{
         id: 'location-id', type: 'garage', name: 'Garage', required_level: 1,
         purchase_price: '2500.00', slot_capacity: 1, used_slots: 0,
         power_capacity_kw: '10.00', power_usage_kw: '0.00',
         cooling_capacity: '10.00', heat_generated: '0.00', status: 'owned', is_owned: true,
      }],
   )

   assert.deepEqual(state.wallet, {
      currency: 'USD',
      availableCash: '10000.00',
      reservedCash: '25.50',
   })
   assert.deepEqual(state.financialSummary, {
      cash: '10000.00',
      cryptoValue: '0.00',
      equipmentValue: '0.00',
      grossIncomePerHour: '0.00',
      electricityCostPerHour: '0.00',
      netIncomePerHour: '0.00',
      netWorth: '10025.50',
   })
   assert.equal(state.locations[0].purchasePrice, '2500.00')
   assert.equal(typeof state.financialSummary.netWorth, 'string')
})
