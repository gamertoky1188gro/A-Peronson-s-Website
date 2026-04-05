import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { createNotification } from './notificationService.js'
import { sendEmail } from './emailService.js'
import { trackEvent } from './analyticsService.js'
import { logError } from '../utils/logger.js'

const REMINDERS_FILE = 'lead_reminders.json'
const LEADS_FILE = 'leads.json'
const USERS_FILE = 'users.json'

let sweepActive = false

function buildRecipientSet({ reminder, lead }) {
  const recipients = new Set()
  if (reminder?.created_by) recipients.add(String(reminder.created_by))
  if (lead?.assigned_agent_id) recipients.add(String(lead.assigned_agent_id))
  if (lead?.org_owner_id) recipients.add(String(lead.org_owner_id))
  return recipients
}

function formatLeadLabel(lead, usersById) {
  if (!lead) return 'Lead reminder'
  const counterparty = usersById.get(String(lead.counterparty_id || ''))
  const counterpartyName = counterparty?.name || counterparty?.email || lead.counterparty_id || ''
  return counterpartyName ? `Lead with ${counterpartyName}` : 'Lead reminder'
}

export async function runLeadReminderSweep() {
  if (sweepActive) return { ok: false, skipped: true }
  sweepActive = true

  try {
    const [reminders, leads, users] = await Promise.all([
      readJson(REMINDERS_FILE),
      readJson(LEADS_FILE),
      readJson(USERS_FILE),
    ])

    const reminderRows = Array.isArray(reminders) ? reminders : []
    const leadRows = Array.isArray(leads) ? leads : []
    const userRows = Array.isArray(users) ? users : []
    const usersById = new Map(userRows.map((u) => [String(u.id), u]))
    const leadsById = new Map(leadRows.map((l) => [String(l.id), l]))

    const now = Date.now()
    let processed = 0

    const nextReminders = reminderRows.map((reminder) => {
      const remindAt = new Date(reminder.remind_at || '').getTime()
      if (!Number.isFinite(remindAt)) return reminder
      if (reminder.done) return reminder
      if (remindAt > now) return reminder

      const lead = leadsById.get(String(reminder.lead_id || ''))
      const recipients = [...buildRecipientSet({ reminder, lead })]
      const label = formatLeadLabel(lead, usersById)
      const message = sanitizeString(String(reminder.message || 'Follow up'), 200)

      recipients.forEach((recipientId) => {
        createNotification(recipientId, {
          type: 'lead_reminder_due',
          entity_type: 'lead',
          entity_id: reminder.lead_id,
          message: `${label}: ${message}`,
          meta: {
            lead_id: reminder.lead_id,
            remind_at: reminder.remind_at,
          },
        }).catch(() => {})

        const user = usersById.get(String(recipientId))
        if (user?.email) {
          sendEmail({
            to: user.email,
            subject: 'GarTexHub reminder',
            text: `${label}\n\nReminder: ${message}\nDue: ${reminder.remind_at}`,
          }).catch(() => {})
        }
      })

      trackEvent({
        type: 'lead_reminder_due',
        actor_id: reminder.created_by || reminder.org_owner_id || null,
        entity_id: reminder.lead_id,
        metadata: {
          reminder_id: reminder.id,
          lead_id: reminder.lead_id,
          recipients,
        },
      }).catch(() => {})

      processed += 1
      return {
        ...reminder,
        done: true,
        notified_at: new Date().toISOString(),
        notified_to: recipients,
      }
    })

    if (processed > 0) {
      await writeJson(REMINDERS_FILE, nextReminders)
    }

    return { ok: true, processed }
  } catch (error) {
    logError('lead_reminder_sweep_failed', error)
    return { ok: false, error: error?.message || 'lead_reminder_sweep_failed' }
  } finally {
    sweepActive = false
  }
}
