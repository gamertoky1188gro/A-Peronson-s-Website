import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import { getAdminMasterSummary } from '../services/adminMasterService.js'
import { readAuditLog } from '../utils/auditStore.js'
import { getAdminConfig, updateAdminConfig } from '../services/adminConfigService.js'
import { listUsers } from '../services/userService.js'
import { performAdminAction } from '../services/adminActionService.js'
import { handleControllerError } from '../utils/permissions.js'
import { readJson } from '../utils/jsonStore.js'

export async function adminMasterOverview(req, res) {
  const summary = await getAdminMasterSummary(req.user)
  return res.json(summary)
}

export async function adminAction(req, res) {
  const action = String(req.body?.action || '').trim()
  if (!action) return res.status(400).json({ error: 'action is required' })
  try {
    const result = await performAdminAction(action, req.body?.payload || {}, req.user)
    return res.json({ ok: true, action_id: crypto.randomUUID(), result })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export async function adminAuditLog(req, res) {
  const items = await readAuditLog()
  const limit = Math.max(1, Math.min(200, Number(req.query?.limit || 100)))
  return res.json({ items: items.slice(-limit).reverse() })
}

export async function adminGetConfig(req, res) {
  const config = await getAdminConfig()
  return res.json(config)
}

export async function adminUpdateConfig(req, res) {
  const patch = req.body || {}
  const config = await updateAdminConfig(patch)
  return res.json(config)
}

export async function adminEmailExport(req, res) {
  const users = await listUsers()
  const emails = users.map((u) => u.email).filter(Boolean)
  const csv = ['email', ...emails].join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="gartexhub_emails.csv"')
  return res.send(csv)
}

function toCsv(rows = []) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((key) => escape(row[key])).join(',')),
  ]
  return lines.join('\n')
}

function generatePdf(data, dataset, res) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 })
      const chunks = []
      
      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="${dataset}.pdf"`)
        res.end(pdfBuffer)
        resolve()
      })
      doc.on('error', reject)

      doc.fontSize(20).text(`GarTexHub - ${dataset.replace(/_/g, ' ').toUpperCase()}`, { align: 'center' })
      doc.moveDown(0.5)
      doc.fontSize(10).text(`Generated: ${new Date().toISOString()}`, { align: 'center' })
      doc.moveDown()

      if (Array.isArray(data) && data.length > 0) {
        const rows = data.slice(0, 100)
        doc.fontSize(12).text(`Total Records: ${data.length} (showing first 100)`, { align: 'left' })
        doc.moveDown()

        const headers = Object.keys(rows[0])
        const colWidth = 500 / headers.length

        doc.fontSize(9)
        let y = doc.y
        headers.forEach((header, i) => {
          doc.text(header, 50 + (i * colWidth), y, { width: colWidth, lineBreak: false })
        })
        doc.moveDown()
        y = doc.y

        doc.fontSize(8)
        rows.forEach((row, rowIndex) => {
          if (rowIndex > 30 && doc.y > 700) {
            doc.addPage()
            y = 50
          }
          headers.forEach((header, i) => {
            const value = String(row[header] ?? '').substring(0, 30)
            doc.text(value, 50 + (i * colWidth), y, { width: colWidth, lineBreak: false })
          })
          doc.moveDown(0.3)
          y = doc.y
        })
      } else if (data && typeof data === 'object') {
        doc.fontSize(11).text('Configuration Data:', { underline: true })
        doc.moveDown(0.5)
        doc.fontSize(9)
        Object.entries(data).forEach(([key, value]) => {
          const val = typeof value === 'object' ? JSON.stringify(value) : String(value)
          doc.text(`${key}: ${val.substring(0, 100)}`)
          doc.moveDown(0.3)
        })
      } else {
        doc.fontSize(11).text('No data available')
      }

      doc.moveDown(2)
      doc.fontSize(8).text('GarTexHub Admin Export', { align: 'center' })

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

export async function adminDataExport(req, res) {
  const dataset = String(req.query?.dataset || '').trim()
  const format = String(req.query?.format || 'json').toLowerCase()
  if (!dataset) return res.status(400).json({ error: 'dataset is required' })

  let data = null
  try {
    data = await readJson(`${dataset}.json`)
  } catch {
    return res.status(404).json({ error: 'dataset not found' })
  }

  if (format === 'csv') {
    const rows = Array.isArray(data) ? data : [data]
    const csv = toCsv(rows)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${dataset}.csv"`)
    return res.send(csv)
  }

  if (format === 'pdf') {
    try {
      await generatePdf(data, dataset, res)
    } catch (err) {
      console.error('[PDF Export Error]:', err.message)
      return res.status(500).json({ error: 'Failed to generate PDF' })
    }
    return
  }

  res.setHeader('Content-Type', 'application/json')
  return res.json({ dataset, items: data })
}
