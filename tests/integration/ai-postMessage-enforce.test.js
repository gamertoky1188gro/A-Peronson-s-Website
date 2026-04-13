describe('messageService AI auto-reply enforcement', () => {
  test('blocks ai-origin messages when org auto-reply is disabled', async () => {
    process.env.NODE_ENV = 'test'
    const { postMessage } = await import('../../server/services/messageService.js')
    const jsonStore = await import('../../server/utils/jsonStore.js')

    // Seed supplier as org owner and disable auto-reply for them
    await jsonStore.writeJson('users.json', [{ id: 'supplier1', role: 'factory' }])
    await jsonStore.writeJson('org_ai_settings.json', [{ id: 'org-s1', org_owner_id: 'supplier1', auto_reply_enabled: false, auto_reply_rate_limit_per_hour: 5 }])
    await jsonStore.writeJson('messages.json', [])

    const matchId = 'req1:supplier1'

    let threw = false
    try {
      await postMessage(matchId, 'system:ai', 'Automated reply attempt', 'text', null, { source_label: 'ai:auto_reply' })
    } catch (err) {
      threw = true
      expect(err).toBeDefined()
      expect(err.code === 'AI_AUTO_REPLY_DISABLED' || err.code === 'AI_AUTO_REPLY_RATE_LIMIT').toBe(true)
    }

    expect(threw).toBe(true)
  })
})
