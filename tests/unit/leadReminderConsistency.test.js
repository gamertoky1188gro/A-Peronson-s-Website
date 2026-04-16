/** @jest-environment node */

import prisma from '../../server/utils/prisma.js'

describe('lead assignment/reminder consistency', () => {
  const originalNodeEnv = process.env.NODE_ENV
  const originalUseSql = process.env.USE_SQL_CRM
  const originalLead = prisma.lead
  const originalLeadReminder = prisma.leadReminder
  const originalUser = prisma.user
  const originalTransaction = prisma.$transaction

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv
    process.env.USE_SQL_CRM = originalUseSql
    prisma.lead = originalLead
    prisma.leadReminder = originalLeadReminder
    prisma.user = originalUser
    prisma.$transaction = originalTransaction
  })

  test('leadService reminder creation + reminder sweep stay consistent in SQL mode', async () => {
    process.env.NODE_ENV = 'development'
    process.env.USE_SQL_CRM = 'true'

    const now = Date.now()
    const ownerId = `owner-${now}`
    const agentId = `agent-${now}`
    const leadId = `lead-${now}`
    const reminders = []

    const users = [
      { id: ownerId, role: 'factory', name: 'Owner', email: 'owner@example.com' },
      { id: agentId, role: 'agent', org_owner_id: ownerId, name: 'Agent', email: 'agent@example.com' },
    ]
    const leads = [{
      id: leadId,
      org_owner_id: ownerId,
      match_id: `${leadId}:factory-1`,
      counterparty_id: 'buyer-1',
      status: 'new',
      assigned_agent_id: agentId,
      created_at: new Date(now - 5000).toISOString(),
      updated_at: new Date(now - 5000).toISOString(),
    }]

    prisma.user = {
      findMany: async () => users,
    }
    prisma.lead = {
      findFirst: async ({ where } = {}) => leads.find((row) => row.id === where?.id && row.org_owner_id === where?.org_owner_id) || null,
      findMany: async () => leads,
    }
    prisma.leadReminder = {
      findMany: async () => reminders,
      create: async ({ data }) => {
        const row = {
          ...data,
          remind_at: data.remind_at?.toISOString?.() || data.remind_at,
          created_at: data.created_at?.toISOString?.() || data.created_at,
        }
        reminders.push(row)
        return row
      },
      update: async ({ where, data }) => {
        const idx = reminders.findIndex((row) => row.id === where.id)
        if (idx < 0) return null
        reminders[idx] = {
          ...reminders[idx],
          ...data,
          notified_at: data.notified_at?.toISOString?.() || data.notified_at,
        }
        return reminders[idx]
      },
    }
    prisma.$transaction = async (ops) => Promise.all(ops)

    const leadService = await import(`../../server/services/leadService.js?nonce=${now}`)
    const leadReminderService = await import(`../../server/services/leadReminderService.js?nonce=${now}`)

    const actor = { id: ownerId, role: 'factory' }

    const reminder = await leadService.addLeadReminder(actor, leadId, {
      remind_at: new Date(now - 1000).toISOString(),
      message: 'Follow up with buyer',
    })
    expect(reminder).toBeDefined()
    expect(reminder.lead_id).toBe(leadId)

    const result = await leadReminderService.runLeadReminderSweep()
    expect(result.ok).toBe(true)
    expect(result.processed).toBe(1)

    const reminderRow = reminders.find((row) => row.id === reminder.id)
    expect(reminderRow.done).toBe(true)
    expect(reminderRow.notified_at).toBeTruthy()
  })
})
