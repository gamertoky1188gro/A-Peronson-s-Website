    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { logError, logInfo } from '../utils/logger.js'
    5 | import { getAdminConfig } from './adminConfigService.js'
    6 | 
    7 | const OUTBOX_FILE = 'email_outbox.json'
    8 | 
    9 | function isConfigured(value) {
   10 |   return Boolean(String(value || '').trim())
   11 | }
   12 | 
   13 | export function isSmtpConfigured() {
   14 |   return isConfigured(process.env.SMTP_HOST) && isConfigured(process.env.SMTP_USER)
   15 | }
   16 | 
   17 | function isGmailConfigured() {
   18 |   return isConfigured(process.env.GMAIL_CLIENT_ID)
   19 |     && isConfigured(process.env.GMAIL_CLIENT_SECRET)
   20 |     && isConfigured(process.env.GMAIL_REFRESH_TOKEN)
   21 |     && isConfigured(process.env.GMAIL_SENDER)
   22 | }
   23 | 
   24 | async function getEmailConfig() {
   25 |   const config = await getAdminConfig()
   26 |   const emailConfig = config?.notifications?.email || {}
   27 |   return {
   28 |     enabled: Boolean(emailConfig?.enabled),
   29 |     provider: String(emailConfig?.provider || 'smtp'),
   30 |     from_name: sanitizeString(String(emailConfig?.from_name || ''), 120),
   31 |     from_email: sanitizeString(String(emailConfig?.from_email || ''), 160),
   32 |     test_recipient: sanitizeString(String(emailConfig?.test_recipient || ''), 160),
   33 |   }
   34 | }
   35 | 
   36 | export async function getEmailDeliveryStatus() {
   37 |   const emailConfig = await getEmailConfig()
   38 |   const provider = String(emailConfig.provider || 'smtp').toLowerCase()
   39 |   const smtpConfigured = isSmtpConfigured()
   40 |   const gmailConfigured = isGmailConfigured()
   41 |   const providerConfigured = provider === 'smtp'
   42 |     ? smtpConfigured
   43 |     : (provider === 'gmail_api' ? gmailConfigured : false)
   44 | 
   45 |   return {
   46 |     enabled: Boolean(emailConfig.enabled),
   47 |     provider,
   48 |     provider_configured: providerConfigured,
   49 |     ready: Boolean(emailConfig.enabled && providerConfigured),
   50 |     smtp: { configured: smtpConfigured },
   51 |     gmail_api: { configured: gmailConfigured },
   52 |     from_name_set: Boolean(emailConfig.from_name),
   53 |     from_email_set: Boolean(emailConfig.from_email),
   54 |   }
   55 | }
   56 | 
   57 | function normalizeRecipients(to) {
   58 |   if (Array.isArray(to)) return to.map((value) => sanitizeString(String(value || ''), 160)).filter(Boolean)
   59 |   const value = sanitizeString(String(to || ''), 160)
   60 |   return value ? [value] : []
   61 | }
   62 | 
   63 | async function queueEmail(entry) {
   64 |   const rows = await readJson(OUTBOX_FILE)
   65 |   const nextRows = Array.isArray(rows) ? rows : []
   66 |   nextRows.push(entry)
   67 |   await writeJson(OUTBOX_FILE, nextRows)
   68 | }
   69 | 
   70 | export async function sendEmail({ to, subject, text, html }) {
   71 |   const recipients = normalizeRecipients(to)
   72 |   if (recipients.length === 0) return { ok: false, status: 'no_recipients' }
   73 | 
   74 |   const emailConfig = await getEmailConfig()
   75 |   if (!emailConfig.enabled) return { ok: false, status: 'disabled' }
   76 | 
   77 |   const payload = {
   78 |     id: crypto.randomUUID(),
   79 |     to: recipients,
   80 |     subject: sanitizeString(String(subject || 'Notification'), 200),
   81 |     text: sanitizeString(String(text || ''), 2000),
   82 |     html: html ? String(html) : '',
   83 |     created_at: new Date().toISOString(),
   84 |     status: 'queued',
   85 |     error: '',
   86 |   }
   87 | 
   88 |   const provider = String(emailConfig.provider || 'smtp').toLowerCase()
   89 |   if (provider === 'smtp') {
   90 |     if (!isSmtpConfigured()) return { ok: false, status: 'smtp_not_configured' }
   91 |   } else if (provider === 'gmail_api') {
   92 |     if (!isGmailConfigured()) return { ok: false, status: 'gmail_not_configured' }
   93 |   } else {
   94 |     return { ok: false, status: 'unsupported_provider' }
   95 |   }
   96 | 
   97 |   try {
   98 |     const fromName = emailConfig.from_name || 'GarTexHub'
   99 |     const fromEmail = emailConfig.from_email
  100 |       || process.env.SMTP_FROM
  101 |       || process.env.SMTP_USER
  102 |       || process.env.GMAIL_SENDER
  103 |       || 'noreply@gartexhub.local'
  104 | 
  105 |     if (provider === 'smtp') {
  106 |       const nodemailer = await import('nodemailer')
  107 |       const port = Number(process.env.SMTP_PORT || 587)
  108 |       const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465
  109 |       const transport = nodemailer.createTransport({
  110 |         host: process.env.SMTP_HOST,
  111 |         port,
  112 |         secure,
  113 |         auth: {
  114 |           user: process.env.SMTP_USER,
  115 |           pass: process.env.SMTP_PASS || '',
  116 |         },
  117 |       })
  118 | 
  119 |       await transport.sendMail({
  120 |         from: `${fromName} <${fromEmail}>`,
  121 |         to: recipients.join(','),
  122 |         subject: payload.subject,
  123 |         text: payload.text,
  124 |         html: payload.html || undefined,
  125 |       })
  126 |     }
  127 | 
  128 |     if (provider === 'gmail_api') {
  129 |       const { google } = await import('googleapis')
  130 |       const oauth2Client = new google.auth.OAuth2(
  131 |         process.env.GMAIL_CLIENT_ID,
  132 |         process.env.GMAIL_CLIENT_SECRET,
  133 |       )
  134 |       oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
  135 |       const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
  136 |       const messageLines = [
  137 |         `From: ${fromName} <${fromEmail}>`,
  138 |         `To: ${recipients.join(',')}`,
  139 |         `Subject: ${payload.subject}`,
  140 |         'MIME-Version: 1.0',
  141 |         payload.html ? 'Content-Type: text/html; charset=UTF-8' : 'Content-Type: text/plain; charset=UTF-8',
  142 |         '',
  143 |         payload.html ? payload.html : payload.text,
  144 |       ]
  145 |       const message = messageLines.join('\r\n')
  146 |       const encodedMessage = Buffer.from(message)
  147 |         .toString('base64')
  148 |         .replace(/\+/g, '-')
  149 |         .replace(/\//g, '_')
  150 |         .replace(/=+$/, '')
  151 |       await gmail.users.messages.send({
  152 |         userId: process.env.GMAIL_SENDER,
  153 |         requestBody: { raw: encodedMessage },
  154 |       })
  155 |     }
  156 | 
  157 |     await queueEmail({ ...payload, status: 'sent' })
  158 |     logInfo('email_sent', { to: recipients })
  159 |     return { ok: true, status: 'sent' }
  160 |   } catch (error) {
  161 |     const message = error?.message || 'smtp_error'
  162 |     await queueEmail({ ...payload, status: 'failed', error: message })
  163 |     logError('email_send_failed', error)
  164 |     return { ok: false, status: 'failed', error: message }
  165 |   }
  166 | }
  167 | 