import { orchestrateRequirementExtraction, validateDraftResponse } from '../../server/services/aiOrchestrationService.js'
import { readJson, writeJson } from '../../server/utils/jsonStore.js'

describe('org-level AI thresholds', () => {
  test('uses org settings when present', async () => {
    process.env.NODE_ENV = 'test'
    // Seed org settings with a strict threshold
    await writeJson('org_ai_settings.json', [{ id: 'org1', org_owner_id: 'org1', ai_handoff_threshold: 0.99, ai_hallucination_threshold: 0.99 }])

    const res = await orchestrateRequirementExtraction({ text: 'Short text' }, 'org1')
    expect(res).toBeDefined()
    expect(res.thresholds).toBeDefined()
    expect(res.thresholds.confidence).toBeCloseTo(0.99)

    const draft = 'Thanks'
    const validated = await validateDraftResponse(draft, {}, null, 'org1')
    expect(validated).toBeDefined()
    // With empty extraction, should handoff because threshold is high
    expect(validated.handoff).toBe(true)
  })
})
