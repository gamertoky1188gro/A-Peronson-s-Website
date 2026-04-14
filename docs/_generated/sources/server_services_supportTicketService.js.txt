    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { getAdminConfig } from './adminConfigService.js'
    5 | 
    6 | const TICKETS_FILE = 'support_tickets.json'
    7 | const MESSAGES_FILE = 'support_ticket_messages.json'
    8 | 
    9 | function nowIso() {
   10 |   return new Date().toISOString()
   11 | }
   12 | 
   13 | function minutesFromNow(minutes) {
   14 |   return new Date(Date.now() + minutes * 60 * 1000).toISOString()
   15 | }
   16 | 
   17 | function hoursFromNow(hours) {
   18 |   return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
   19 | }
   20 | 
   21 | function publicUser(user) {
   22 |   if (!user) return null
   23 |   return {
   24 |     id: user.id,
   25 |     name: user.name || '',
   26 |     email: user.email || '',
   27 |     role: user.role || '',
   28 |   }
   29 | }
   30 | 
   31 | async function getSlaTargets() {
   32 |   const config = await getAdminConfig()
   33 |   const responseMinutes = Number(config?.support?.sla_targets?.response_minutes || 60)
   34 |   const resolutionHours = Number(config?.support?.sla_targets?.resolution_hours || 72)
   35 |   return {
   36 |     response_minutes: Math.max(15, responseMinutes),
   37 |     resolution_hours: Math.max(1, resolutionHours),
   38 |   }
   39 | }
   40 | 
   41 | function normalizePriority(priority, premium) {
   42 |   const raw = sanitizeString(String(priority || ''), 40).toLowerCase()
   43 |   if (premium && ['high', 'urgent', 'priority'].includes(raw)) return 'priority'
   44 |   if (['high', 'urgent', 'priority'].includes(raw)) return 'high'
   45 |   if (['low', 'medium', 'normal'].includes(raw)) return raw
   46 |   return 'standard'
   47 | }
   48 | 
   49 | export async function createSupportTicket({ actor, subject, description, category, pageUrl, contactEmail, priority }) {
   50 |   const tickets = await readJson(TICKETS_FILE)
   51 |   const rows = Array.isArray(tickets) ? tickets : []
   52 |   const messages = await readJson(MESSAGES_FILE)
   53 |   const messageRows = Array.isArray(messages) ? messages : []
   54 | 
   55 |   const premium = String(actor?.subscription_status || '').toLowerCase() === 'premium'
   56 |   const sla = await getSlaTargets()
   57 |   const now = nowIso()
   58 |   const ticketId = crypto.randomUUID()
   59 |   const assignedTo = sanitizeString(String(actor?.profile?.account_manager_id || ''), 120)
   60 | 
   61 |   const ticket = {
   62 |     id: ticketId,
   63 |     user_id: sanitizeString(String(actor?.id || ''), 120),
   64 |     subject: sanitizeString(String(subject || 'Support ticket'), 160),
   65 |     category: sanitizeString(String(category || 'General'), 80),
   66 |     status: 'open',
   67 |     priority: normalizePriority(priority, premium),
   68 |     premium_support: premium,
   69 |     page_url: sanitizeString(String(pageUrl || ''), 240),
   70 |     contact_email: sanitizeString(String(contactEmail || ''), 120),
   71 |     assigned_to: assignedTo || null,
   72 |     created_at: now,
   73 |     updated_at: now,
   74 |     last_message_at: now,
   75 |     sla_response_due_at: minutesFromNow(sla.response_minutes),
   76 |     sla_resolution_due_at: hoursFromNow(sla.resolution_hours),
   77 |   }
   78 | 
   79 |   rows.push(ticket)
   80 | 
   81 |   const initialMessage = {
   82 |     id: crypto.randomUUID(),
   83 |     ticket_id: ticketId,
   84 |     sender_id: sanitizeString(String(actor?.id || ''), 120),
   85 |     sender_role: sanitizeString(String(actor?.role || ''), 40),
   86 |     message: sanitizeString(String(description || ''), 1200),
   87 |     created_at: now,
   88 |   }
   89 |   messageRows.push(initialMessage)
   90 | 
   91 |   await writeJson(TICKETS_FILE, rows)
   92 |   await writeJson(MESSAGES_FILE, messageRows)
   93 |   return { ticket, initial_message: initialMessage }
   94 | }
   95 | 
   96 | export async function listSupportTicketsForUser(userId) {
   97 |   const tickets = await readJson(TICKETS_FILE)
   98 |   const rows = Array.isArray(tickets) ? tickets : []
   99 |   const userRows = rows
  100 |     .filter((row) => String(row.user_id) === String(userId || ''))
  101 |     .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  102 |   return userRows
  103 | }
  104 | 
  105 | export async function listSupportTicketsAdmin({ status, priority, assignedTo, premiumOnly, limit = 50, offset = 0 } = {}) {
  106 |   const tickets = await readJson(TICKETS_FILE)
  107 |   const rows = Array.isArray(tickets) ? tickets : []
  108 |   const normalizedStatus = status ? sanitizeString(String(status || ''), 40).toLowerCase() : ''
  109 |   const normalizedPriority = priority ? sanitizeString(String(priority || ''), 40).toLowerCase() : ''
  110 |   const normalizedAssigned = assignedTo ? sanitizeString(String(assignedTo || ''), 120) : ''
  111 |   const premiumFlag = premiumOnly === undefined ? null : Boolean(premiumOnly)
  112 | 
  113 |   const filtered = rows.filter((row) => {
  114 |     if (normalizedStatus && String(row.status || '').toLowerCase() !== normalizedStatus) return false
  115 |     if (normalizedPriority && String(row.priority || '').toLowerCase() !== normalizedPriority) return false
  116 |     if (normalizedAssigned && String(row.assigned_to || '') !== normalizedAssigned) return false
  117 |     if (premiumFlag !== null && Boolean(row.premium_support) !== premiumFlag) return false
  118 |     return true
  119 |   })
  120 | 
  121 |   const sorted = filtered.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
  122 |   const start = Math.max(0, Number(offset) || 0)
  123 |   const max = Math.min(200, Math.max(1, Number(limit) || 50))
  124 |   return sorted.slice(start, start + max)
  125 | }
  126 | 
  127 | export async function listSupportTicketMessages(ticketId) {
  128 |   const messages = await readJson(MESSAGES_FILE)
  129 |   const rows = Array.isArray(messages) ? messages : []
  130 |   return rows
  131 |     .filter((row) => String(row.ticket_id) === String(ticketId || ''))
  132 |     .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
  133 | }
  134 | 
  135 | export async function getSupportTicketById(ticketId) {
  136 |   const tickets = await readJson(TICKETS_FILE)
  137 |   const rows = Array.isArray(tickets) ? tickets : []
  138 |   return rows.find((row) => String(row.id) === String(ticketId || '')) || null
  139 | }
  140 | 
  141 | export async function appendSupportTicketMessage(ticketId, actor, message) {
  142 |   const tickets = await readJson(TICKETS_FILE)
  143 |   const rows = Array.isArray(tickets) ? tickets : []
  144 |   const idx = rows.findIndex((row) => String(row.id) === String(ticketId || ''))
  145 |   if (idx < 0) return null
  146 |   if (String(rows[idx].user_id) !== String(actor?.id || '')) return 'forbidden'
  147 | 
  148 |   const entry = {
  149 |     id: crypto.randomUUID(),
  150 |     ticket_id: String(ticketId),
  151 |     sender_id: sanitizeString(String(actor?.id || ''), 120),
  152 |     sender_role: sanitizeString(String(actor?.role || ''), 40),
  153 |     message: sanitizeString(String(message || ''), 1200),
  154 |     created_at: nowIso(),
  155 |   }
  156 | 
  157 |   const messages = await readJson(MESSAGES_FILE)
  158 |   const messageRows = Array.isArray(messages) ? messages : []
  159 |   messageRows.push(entry)
  160 |   rows[idx] = {
  161 |     ...rows[idx],
  162 |     updated_at: entry.created_at,
  163 |     last_message_at: entry.created_at,
  164 |     status: rows[idx].status === 'resolved' ? 'open' : rows[idx].status,
  165 |   }
  166 | 
  167 |   await writeJson(MESSAGES_FILE, messageRows)
  168 |   await writeJson(TICKETS_FILE, rows)
  169 |   return entry
  170 | }
  171 | 
  172 | export async function adminAssignSupportTicket(ticketId, assigneeId, actorId) {
  173 |   const tickets = await readJson(TICKETS_FILE)
  174 |   const rows = Array.isArray(tickets) ? tickets : []
  175 |   const idx = rows.findIndex((row) => String(row.id) === String(ticketId || ''))
  176 |   if (idx < 0) return null
  177 |   rows[idx] = {
  178 |     ...rows[idx],
  179 |     assigned_to: sanitizeString(String(assigneeId || ''), 120) || null,
  180 |     updated_at: nowIso(),
  181 |     updated_by: sanitizeString(String(actorId || ''), 120),
  182 |   }
  183 |   await writeJson(TICKETS_FILE, rows)
  184 |   return rows[idx]
  185 | }
  186 | 
  187 | export async function adminUpdateSupportTicket(ticketId, patch = {}, actorId = '') {
  188 |   const tickets = await readJson(TICKETS_FILE)
  189 |   const rows = Array.isArray(tickets) ? tickets : []
  190 |   const idx = rows.findIndex((row) => String(row.id) === String(ticketId || ''))
  191 |   if (idx < 0) return null
  192 | 
  193 |   const nextStatus = patch.status ? sanitizeString(String(patch.status || ''), 40).toLowerCase() : rows[idx].status
  194 |   const nextPriority = patch.priority ? sanitizeString(String(patch.priority || ''), 40).toLowerCase() : rows[idx].priority
  195 | 
  196 |   rows[idx] = {
  197 |     ...rows[idx],
  198 |     status: nextStatus || rows[idx].status,
  199 |     priority: nextPriority || rows[idx].priority,
  200 |     resolution_note: patch.resolution_note ? sanitizeString(String(patch.resolution_note || ''), 240) : rows[idx].resolution_note,
  201 |     resolved_at: nextStatus === 'resolved' ? nowIso() : rows[idx].resolved_at || '',
  202 |     updated_at: nowIso(),
  203 |     updated_by: sanitizeString(String(actorId || ''), 120),
  204 |   }
  205 | 
  206 |   await writeJson(TICKETS_FILE, rows)
  207 |   return rows[idx]
  208 | }
  209 | 
  210 | export async function buildSupportTicketSummary(ticket) {
  211 |   if (!ticket) return ticket
  212 |   const users = await readJson('users.json')
  213 |   const rows = Array.isArray(users) ? users : []
  214 |   const user = rows.find((u) => String(u.id) === String(ticket.user_id)) || null
  215 |   const assignee = ticket.assigned_to
  216 |     ? rows.find((u) => String(u.id) === String(ticket.assigned_to)) || null
  217 |     : null
  218 |   return {
  219 |     ...ticket,
  220 |     user: publicUser(user),
  221 |     assignee: publicUser(assignee),
  222 |   }
  223 | }
  224 | 