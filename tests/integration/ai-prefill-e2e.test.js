describe('AI prefill → create → match_id persistence (integration)', () => {
  test('extracts, maps, creates requirement and persists match metadata', async () => {
    process.env.NODE_ENV = 'test'
    const ai = await import('../../server/services/aiOrchestrationService.js')
    const jsonStore = await import('../../server/utils/jsonStore.js')
    const reqSvc = await import('../../server/services/requirementService.js')
    const mapper = await import('../../src/lib/aiPrefill.js')

    // Seed minimal fixtures and clear stores used in test-mode (in-memory)
    await jsonStore.writeJson('users.json', [{ id: 'buyer-e2e', role: 'buyer' }])
    await jsonStore.writeJson('leads.json', [{ id: 'lead1', match_id: 'match-e2e-123', org_owner_id: 'buyer-e2e' }])
    await jsonStore.writeJson('requirements.json', [])
    await jsonStore.writeJson('messages.json', [])
    await jsonStore.writeJson('lead_notes.json', [])
    await jsonStore.writeJson('org_ai_settings.json', [{ id: 'org-e2e', org_owner_id: 'buyer-e2e', auto_reply_enabled: true, auto_reply_rate_limit_per_hour: 100 }])

    // Simulate a user description that would be sent to the AI
    const text = 'Need 200 blue cotton shirts, moq 200, target price USD 3-4, timeline 30 days, FOB'

    // Run the extraction (service returns a minimal structure); then enrich to simulate a realistic extraction
    const extraction = await ai.extractRequirementFromText(text)
    const extracted = extraction.extracted || {}
    extracted.product_type = 'shirt'
    extracted.category = 'garments'
    extracted.moq = 200
    extracted.price = { min: 3, max: 4, currency: 'USD' }
    extracted.timeline = '30'
    extracted.incoterm = 'FOB'
    extracted.notes = text

    // Map AI output to the client form fields
    const mapped = mapper.mapExtractedToForm(extracted)

    // Build create payload from mapped fields (server expects certain keys)
    const payload = {
      title: mapped.title || 'E2E Request',
      category: mapped.category || mapped.subCategory || 'garments',
      quantity: mapped.quantity || mapped.totalQuantity || String(extracted.moq || 200),
      price_range: mapped.targetPrice || mapped.targetFobPrice || 'USD 3-4',
      incoterms: mapped.incoterms || mapped.incoterm || 'FOB',
      ex_factory_date: new Date().toISOString(),
      payment_terms: 'TT',
      match_id: 'match-e2e-123',
      status: 'draft',
    }

    // Create requirement as the buyer and assert match_id persisted
    const created = await reqSvc.createRequirement('buyer-e2e', payload)
    expect(created).toBeDefined()
    expect(created.match_id).toBe('match-e2e-123')

    const all = await jsonStore.readJson('requirements.json')
    const found = Array.isArray(all) ? all.find((r) => r.id === created.id) : null
    expect(found).not.toBeNull()
    expect(found.match_id).toBe('match-e2e-123')

    // Validate that AI metadata persistence also writes messages and lead notes for the match
    const draft = ai.generateDraftResponse(extracted, [])
    const validation = await ai.validateDraftResponse(draft, extracted)
    await ai.persistAiMetadataForMatch('match-e2e-123', validation)

    const messages = await jsonStore.readJson('messages.json')
    expect(Array.isArray(messages)).toBe(true)
    expect(messages.some((m) => String(m.match_id || '') === 'match-e2e-123')).toBe(true)

    const notes = await jsonStore.readJson('lead_notes.json')
    expect(Array.isArray(notes)).toBe(true)
    const note = notes.find((n) => n.lead_id === 'lead1')
    expect(note).toBeDefined()
  })
})
