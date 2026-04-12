import { detectHallucination } from '../../server/utils/hallucinationDetector.js'

describe('hallucinationDetector', () => {
  test('flags empty object as hallucination', () => {
    const r = detectHallucination({})
    expect(r).toBeDefined()
    expect(r.hallucination).toBe(true)
    expect(typeof r.score).toBe('number')
  })

  test('low score for reasonable extraction', () => {
    const r = detectHallucination({ product_type: 't-shirt', moq: '100', target_price: '10' })
    expect(r).toBeDefined()
    expect(r.hallucination).toBe(false)
    expect(r.score).toBeLessThan(0.7)
  })
})
