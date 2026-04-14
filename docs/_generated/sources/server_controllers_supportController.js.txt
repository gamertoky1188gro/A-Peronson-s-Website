    1 | import { createReport } from '../services/reportService.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | import { isPremiumUser } from '../services/entitlementService.js'
    4 | import {
    5 |   appendSupportTicketMessage,
    6 |   buildSupportTicketSummary,
    7 |   createSupportTicket,
    8 |   getSupportTicketById,
    9 |   listSupportTicketMessages,
   10 |   listSupportTicketsForUser,
   11 | } from '../services/supportTicketService.js'
   12 | 
   13 | export async function createSupportReport(req, res) {
   14 |   const subject = sanitizeString(String(req.body?.subject || ''), 140)
   15 |   const description = sanitizeString(String(req.body?.description || ''), 1200)
   16 |   if (!subject || !description) {
   17 |     return res.status(400).json({ error: 'Subject and description are required' })
   18 |   }
   19 | 
   20 |   const premium = await isPremiumUser(req.user)
   21 |   const requestedPriority = sanitizeString(String(req.body?.priority || ''), 40).toLowerCase()
   22 |   const priority = premium && ['high', 'urgent', 'priority'].includes(requestedPriority)
   23 |     ? 'priority'
   24 |     : 'standard'
   25 | 
   26 |   const metadata = {
   27 |     category: sanitizeString(String(req.body?.category || ''), 80),
   28 |     page_url: sanitizeString(String(req.body?.page_url || ''), 240),
   29 |     priority,
   30 |     contact_email: sanitizeString(String(req.body?.contact_email || ''), 120),
   31 |     premium_support: premium,
   32 |   }
   33 | 
   34 |   const report = await createReport({
   35 |     actor: req.user,
   36 |     entity_type: 'support',
   37 |     entity_id: `support:${req.user?.id || 'anonymous'}`,
   38 |     reason: subject,
   39 |     metadata: { ...metadata, description },
   40 |   })
   41 | 
   42 |   return res.status(201).json(report)
   43 | }
   44 | 
   45 | export async function createSupportTicketController(req, res) {
   46 |   const subject = sanitizeString(String(req.body?.subject || ''), 140)
   47 |   const description = sanitizeString(String(req.body?.description || ''), 1200)
   48 |   if (!subject || !description) {
   49 |     return res.status(400).json({ error: 'Subject and description are required' })
   50 |   }
   51 | 
   52 |   const premium = await isPremiumUser(req.user)
   53 |   const requestedPriority = sanitizeString(String(req.body?.priority || ''), 40).toLowerCase()
   54 |   const priority = premium && ['high', 'urgent', 'priority'].includes(requestedPriority)
   55 |     ? 'priority'
   56 |     : 'standard'
   57 | 
   58 |   const ticketResult = await createSupportTicket({
   59 |     actor: req.user,
   60 |     subject,
   61 |     description,
   62 |     category: sanitizeString(String(req.body?.category || ''), 80),
   63 |     pageUrl: sanitizeString(String(req.body?.page_url || ''), 240),
   64 |     contactEmail: sanitizeString(String(req.body?.contact_email || ''), 120),
   65 |     priority,
   66 |   })
   67 | 
   68 |   return res.status(201).json({ ticket: ticketResult.ticket, message: ticketResult.initial_message })
   69 | }
   70 | 
   71 | export async function listMySupportTicketsController(req, res) {
   72 |   const tickets = await listSupportTicketsForUser(req.user.id)
   73 |   const summaries = await Promise.all(tickets.map((ticket) => buildSupportTicketSummary(ticket)))
   74 |   return res.json({ items: summaries })
   75 | }
   76 | 
   77 | export async function listSupportTicketMessagesController(req, res) {
   78 |   const ticketId = sanitizeString(String(req.params.ticketId || ''), 120)
   79 |   if (!ticketId) return res.status(400).json({ error: 'ticketId is required' })
   80 |   const ticket = await getSupportTicketById(ticketId)
   81 |   if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
   82 |   if (String(ticket.user_id) !== String(req.user.id)) return res.status(403).json({ error: 'Forbidden' })
   83 |   const messages = await listSupportTicketMessages(ticketId)
   84 |   return res.json({ items: messages })
   85 | }
   86 | 
   87 | export async function postSupportTicketMessageController(req, res) {
   88 |   const ticketId = sanitizeString(String(req.params.ticketId || ''), 120)
   89 |   const message = sanitizeString(String(req.body?.message || ''), 1200)
   90 |   if (!ticketId || !message) return res.status(400).json({ error: 'message is required' })
   91 |   const entry = await appendSupportTicketMessage(ticketId, req.user, message)
   92 |   if (entry === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   93 |   if (!entry) return res.status(404).json({ error: 'Ticket not found' })
   94 |   return res.status(201).json(entry)
   95 | }
   96 | 