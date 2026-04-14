    1 | import test from 'node:test'
    2 | import assert from 'node:assert/strict'
    3 | 
    4 | function buildPrismaStub() {
    5 |   const leads = [
    6 |     {
    7 |       id: 'lead-1',
    8 |       org_owner_id: 'org-1',
    9 |       match_id: 'm-1',
   10 |       counterparty_id: 'buyer-1',
   11 |       status: 'new',
   12 |       assigned_agent_id: 'agent-1',
   13 |       updated_at: new Date('2026-04-04T00:00:00.000Z'),
   14 |       created_at: new Date('2026-04-01T00:00:00.000Z'),
   15 |     },
   16 |   ]
   17 |   const notes = []
   18 |   const reminders = []
   19 | 
   20 |   return {
   21 |     leads,
   22 |     notes,
   23 |     reminders,
   24 |     lead: {
   25 |       findMany: async ({ where } = {}) => {
   26 |         if (!where) return leads
   27 |         return leads.filter((row) => Object.entries(where).every(([k, v]) => String(row[k] || '') === String(v || '')))
   28 |       },
   29 |       findFirst: async ({ where } = {}) => leads.find((row) => Object.entries(where || {}).every(([k, v]) => String(row[k] || '') === String(v || ''))) || null,
   30 |       update: async ({ where, data }) => {
   31 |         const idx = leads.findIndex((row) => row.id === where.id)
   32 |         if (idx < 0) return null
   33 |         leads[idx] = { ...leads[idx], ...data }
   34 |         return leads[idx]
   35 |       },
   36 |     },
   37 |     leadNote: {
   38 |       findMany: async ({ where } = {}) => notes.filter((row) => String(row.lead_id) === String(where?.lead_id || '')),
   39 |       create: async ({ data }) => {
   40 |         notes.push(data)
   41 |         return data
   42 |       },
   43 |     },
   44 |     leadReminder: {
   45 |       findMany: async ({ where } = {}) => reminders.filter((row) => String(row.lead_id) === String(where?.lead_id || '')),
   46 |       create: async ({ data }) => {
   47 |         reminders.push(data)
   48 |         return data
   49 |       },
   50 |     },
   51 |     user: {
   52 |       findFirst: async ({ where } = {}) => {
   53 |         if (where?.id === 'agent-1' && where?.role === 'agent' && where?.org_owner_id === 'org-1') return { id: 'agent-1' }
   54 |         return null
   55 |       },
   56 |     },
   57 |   }
   58 | }
   59 | 
   60 | test('lead CRUD/detail + note/reminder flows via SQL path', async () => {
   61 |   process.env.USE_SQL_CRM = 'true'
   62 | 
   63 |   const prismaModule = await import('../../utils/prisma.js')
   64 |   const prisma = prismaModule.default
   65 |   const stub = buildPrismaStub()
   66 | 
   67 |   prisma.lead = stub.lead
   68 |   prisma.leadNote = stub.leadNote
   69 |   prisma.leadReminder = stub.leadReminder
   70 |   prisma.user = stub.user
   71 | 
   72 |   const leadService = await import('../leadService.js')
   73 |   const actor = { id: 'org-1', role: 'factory' }
   74 | 
   75 |   const listed = await leadService.listLeads(actor)
   76 |   assert.equal(listed.length, 1)
   77 | 
   78 |   const updated = await leadService.updateLead(actor, 'lead-1', { status: 'contacted', assigned_agent_id: 'agent-1' })
   79 |   assert.equal(updated.status, 'contacted')
   80 | 
   81 |   const note = await leadService.addLeadNote(actor, 'lead-1', 'Call scheduled')
   82 |   assert.equal(note.lead_id, 'lead-1')
   83 | 
   84 |   const reminder = await leadService.addLeadReminder(actor, 'lead-1', { message: 'Follow up tomorrow' })
   85 |   assert.equal(reminder.lead_id, 'lead-1')
   86 | 
   87 |   const detail = await leadService.getLeadById(actor, 'lead-1')
   88 |   assert.equal(detail.notes.length, 1)
   89 |   assert.equal(detail.reminders.length, 1)
   90 | })
   91 | 