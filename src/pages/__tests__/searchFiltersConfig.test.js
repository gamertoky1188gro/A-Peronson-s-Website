import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_CORE_FILTER_KEYS,
  validateCoreFilterRenderKeys,
} from '../searchFiltersConfig.js'

test('default core filters stay capped at 8 keys', () => {
  assert.ok(DEFAULT_CORE_FILTER_KEYS.length <= 8)
})

test('default core filters match expected initial UI controls', () => {
  assert.deepEqual(DEFAULT_CORE_FILTER_KEYS, [
    'industry',
    'category',
    'verifiedOnly',
    'country',
    'moqRange',
    'priceRange',
    'orgType',
    'leadTimeMax',
  ])
})

test('guard utility flags leaked non-core keys', () => {
  const result = validateCoreFilterRenderKeys([...DEFAULT_CORE_FILTER_KEYS, 'priorityOnly'])
  assert.equal(result.isValid, false)
  assert.deepEqual(result.unknownKeys, ['priorityOnly'])
})

test('guard utility passes for mobile and desktop initial core set', () => {
  const mobileResult = validateCoreFilterRenderKeys(DEFAULT_CORE_FILTER_KEYS)
  const desktopResult = validateCoreFilterRenderKeys(DEFAULT_CORE_FILTER_KEYS)

  assert.equal(mobileResult.isValid, true)
  assert.equal(desktopResult.isValid, true)
  assert.ok(mobileResult.rendered.length <= 8)
  assert.ok(desktopResult.rendered.length <= 8)
})
