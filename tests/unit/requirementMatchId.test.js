describe('requirement match_id persistence', () => {
  test('createRequirement persists match_id', async () => {
    process.env.NODE_ENV = 'test'
    const reqSvc = await import('../../server/services/requirementService.js')
    const jsonStore = await import('../../server/utils/jsonStore.js')

    // seed minimal user and clear requirements
    await jsonStore.writeJson('users.json', [{ id: 'buyer1', role: 'buyer' }])
    await jsonStore.writeJson('requirements.json', [])

    const payload = {
      title: 'Test Request',
      category: 'test-category',
      quantity: '10',
      price_range: 'USD 10',
      incoterms: 'FOB',
      ex_factory_date: new Date().toISOString(),
      payment_terms: 'TT',
      match_id: 'match-xyz',
      status: 'draft',
    }

    const created = await reqSvc.createRequirement('buyer1', payload)
    expect(created).toBeDefined()
    expect(created.match_id).toBe('match-xyz')

    const all = await jsonStore.readJson('requirements.json')
    const found = Array.isArray(all) ? all.find((r) => r.id === created.id) : null
    expect(found).not.toBeNull()
    expect(found.match_id).toBe('match-xyz')
  })
})
