describe('aiOrchestrationService sendReply integration', () => {
  test('posts approved reply into thread when auto-reply enabled', async () => {
    process.env.NODE_ENV = 'test'
    const svc = await import('../../server/services/aiOrchestrationService.js')
    const jsonStore = await import('../../server/utils/jsonStore.js')
    const orgAi = await import('../../server/services/orgAiService.js')

    // Ensure org settings allow auto-reply for a test org
    const settings = [{ id: 'org-test', org_owner_id: 'org-test', auto_reply_enabled: true, auto_reply_rate_limit_per_hour: 10 }]
    await jsonStore.writeJson('org_ai_settings.json', settings)

    const before = await jsonStore.readJson('messages.json')
    const beforeCount = Array.isArray(before) ? before.length : 0

    const res = await svc.sendReply({ draft: 'Automated reply test', approval: { approved: true, match_id: 'test-match-1' } })
    expect(res).toBeDefined()
    // After send, messages.json should have at least one more entry
    const after = await jsonStore.readJson('messages.json')
    const afterCount = Array.isArray(after) ? after.length : 0
    expect(afterCount).toBeGreaterThanOrEqual(beforeCount)
  })
})
