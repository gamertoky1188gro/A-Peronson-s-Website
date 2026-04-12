import { writeJson, readJson } from '../../server/utils/jsonStore.js'
import { runLeadReminderSweep } from '../../server/services/leadReminderService.js'

describe('lead reminder sweep', () => {
  test('processes due reminders and creates notifications', async () => {
    process.env.NODE_ENV = 'test'
    // prepare in-memory stores
    await writeJson('users.json', [{ id: 'u1', name: 'User 1', email: 'u1@example.com' }])
    await writeJson('leads.json', [{ id: 'lead1', org_owner_id: 'org1', match_id: '1:2', counterparty_id: 'u1' }])
    const past = new Date(Date.now() - 1000).toISOString()
    await writeJson('lead_reminders.json', [{ id: 'r1', lead_id: 'lead1', org_owner_id: 'org1', created_by: 'u1', remind_at: past, message: 'Follow up', done: false }])
    await writeJson('notifications.json', [])

    const res = await runLeadReminderSweep()
    expect(res).toBeDefined()
    expect(res.ok).toBe(true)
    const notes = await readJson('notifications.json')
    const due = notes.find((n) => n.type === 'lead_reminder_due')
    expect(due).toBeDefined()
  })
})
