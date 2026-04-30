    1 | import prisma from '../utils/prisma.js'
    2 | import { readLegacyJson, isCrmSqlEnabled } from '../utils/crmFallbackStore.js'
    3 | import { readJson } from '../utils/jsonStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import { createNotification } from './notificationService.js'
    6 | import { sendEmail } from './emailService.js'
    7 | import { trackEvent } from './eventTrackingService.js'
    8 | import { logError } from '../utils/logger.js'
    9 | 
   10 | const REMINDERS_FILE = 'lead_reminders.json'
   11 | const LEADS_FILE = 'leads.json'
   12 | const USERS_FILE = 'users.json'
   13 | // Evaluate CRM mode at runtime inside the sweep to respect test-time env changes.
   14 | 
   15 | let sweepActive = false
   16 | 
   17 | function buildRecipientSet({ reminder, lead }) {
   18 |   const recipients = new Set()
   19 |   if (reminder?.created_by) recipients.add(String(reminder.created_by))
   20 |   if (lead?.assigned_agent_id) recipients.add(String(lead.assigned_agent_id))
   21 |   if (lead?.org_owner_id) recipients.add(String(lead.org_owner_id))
   22 |   return recipients
   23 | }
   24 | 
   25 | function formatLeadLabel(lead, usersById) {
   26 |   if (!lead) return 'Lead reminder'
   27 |   const counterparty = usersById.get(String(lead.counterparty_id || ''))
   28 |   const counterpartyName = counterparty?.name || counterparty?.email || lead.counterparty_id || ''
   29 |   return counterpartyName ? `Lead with ${counterpartyName}` : 'Lead reminder'
   30 | }
   31 | 
   32 | export async function runLeadReminderSweep() {
   33 |   if (sweepActive) return { ok: false, skipped: true }
   34 |   sweepActive = true
   35 | 
   36 |   try {
   37 |     let reminders
   38 |     let leads
   39 |     let users
   40 | 
   41 |       const useSql = isCrmSqlEnabled()
   42 |       let reader
   43 |       if (!useSql) {
   44 |         reader = process.env.NODE_ENV === 'test' ? readJson : readLegacyJson
   45 |       }
   46 | 
   47 |       [reminders, leads, users] = useSql
   48 |         ? await Promise.all([
   49 |           prisma.leadReminder.findMany(),
   50 |           prisma.lead.findMany(),
   51 |           prisma.user.findMany(),
   52 |         ])
   53 |         : await Promise.all([
   54 |           reader(REMINDERS_FILE),
   55 |           reader(LEADS_FILE),
   56 |           reader(USERS_FILE),
   57 |         ])
   58 | 
   59 |     const reminderRows = Array.isArray(reminders) ? reminders : []
   60 |     const leadRows = Array.isArray(leads) ? leads : []
   61 |     const userRows = Array.isArray(users) ? users : []
   62 |     const usersById = new Map(userRows.map((u) => [String(u.id), u]))
   63 |     const leadsById = new Map(leadRows.map((l) => [String(l.id), l]))
   64 | 
   65 |     const now = Date.now()
   66 |     let processed = 0
   67 | 
   68 |     const sideEffects = []
   69 | 
   70 |     const nextReminders = reminderRows.map((reminder) => {
   71 |       const remindAt = new Date(reminder.remind_at || '').getTime()
   72 |       if (!Number.isFinite(remindAt)) return reminder
   73 |       if (reminder.done) return reminder
   74 |       if (remindAt > now) return reminder
   75 | 
   76 |       const lead = leadsById.get(String(reminder.lead_id || ''))
   77 |       const recipients = [...buildRecipientSet({ reminder, lead })]
   78 |       const label = formatLeadLabel(lead, usersById)
   79 |       const message = sanitizeString(String(reminder.message || 'Follow up'), 200)
   80 | 
   81 |       recipients.forEach((recipientId) => {
   82 |         sideEffects.push(createNotification(recipientId, {
   83 |           type: 'lead_reminder_due',
   84 |           entity_type: 'lead',
   85 |           entity_id: reminder.lead_id,
   86 |           message: `${label}: ${message}`,
   87 |           meta: {
   88 |             lead_id: reminder.lead_id,
   89 |             remind_at: reminder.remind_at,
   90 |           },
   91 |         }))
   92 | 
   93 |         const user = usersById.get(String(recipientId))
   94 |         if (user?.email) {
   95 |           sideEffects.push(sendEmail({
   96 |             to: user.email,
   97 |             subject: 'GarTexHub reminder',
   98 |             text: `${label}\n\nReminder: ${message}\nDue: ${reminder.remind_at}`,
   99 |           }))
  100 |         }
  101 |       })
  102 | 
  103 |       sideEffects.push(trackEvent({
  104 |         type: 'lead_reminder_due',
  105 |         actor_id: reminder.created_by || reminder.org_owner_id || null,
  106 |         entity_id: reminder.lead_id,
  107 |         metadata: {
  108 |           reminder_id: reminder.id,
  109 |           lead_id: reminder.lead_id,
  110 |           recipients,
  111 |         },
  112 |       }))
  113 | 
  114 |       processed += 1
  115 |       return {
  116 |         ...reminder,
  117 |         done: true,
  118 |         notified_at: new Date().toISOString(),
  119 |         notified_to: recipients,
  120 |       }
  121 |     })
  122 | 
  123 |       if (processed > 0 && useSql) {
  124 |       await prisma.$transaction(
  125 |         nextReminders
  126 |           .filter((row) => row?.id)
  127 |           .map((row) => prisma.leadReminder.update({
  128 |             where: { id: row.id },
  129 |             data: {
  130 |               done: Boolean(row.done),
  131 |               notified_at: row.notified_at ? new Date(row.notified_at) : null,
  132 |             },
  133 |           })),
  134 |       )
  135 |     }
  136 | 
  137 |     if (sideEffects.length) {
  138 |       try {
  139 |         await Promise.allSettled(sideEffects)
  140 |       } catch {
  141 |         void 0
  142 |       }
  143 |     }
  144 | 
  145 |     return { ok: true, processed }
  146 |   } catch (error) {
  147 |     logError('lead_reminder_sweep_failed', error)
  148 |     return { ok: false, error: error?.message || 'lead_reminder_sweep_failed' }
  149 |   } finally {
  150 |     sweepActive = false
  151 |   }
  152 | }
  153 | 