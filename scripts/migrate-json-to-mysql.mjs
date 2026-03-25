import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { readJson, writeJson } from '../server/utils/jsonStore.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const databaseDir = path.join(__dirname, '..', 'server', 'database')
const force = String(process.env.FORCE_MIGRATE || '').toLowerCase() === '1'

const FILES = [
  'users.json',
  'subscriptions.json',
  'verification.json',
  'requirements.json',
  'company_products.json',
  'messages.json',
  'message_requests.json',
  'notifications.json',
  'search_alerts.json',
  'search_usage_counters.json',
  'conversation_locks.json',
  'partner_requests.json',
  'call_sessions.json',
  'call_recording_views.json',
  'documents.json',
  'leads.json',
  'lead_notes.json',
  'lead_reminders.json',
  'analytics.json',
  'boosts.json',
  'product_views.json',
  'reports.json',
  'violations.json',
  'social_interactions.json',
  'user_connections.json',
  'matches.json',
  'metrics.json',
  'assistant_knowledge.json',
  'payment_proofs.json',
  'wallet_history.json',
  'coupon_codes.json',
  'coupon_redemptions.json',
  'message_reads.json',
  'ratings.json',
]

function hasRows(value) {
  if (!value) return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') {
    const counts = Object.values(value)
      .filter((v) => Array.isArray(v))
      .reduce((sum, arr) => sum + arr.length, 0)
    return counts > 0
  }
  return false
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  const trimmed = String(raw || '').trim()
  if (!trimmed) return null
  return JSON.parse(trimmed)
}

async function migrateFile(fileName) {
  const filePath = path.join(databaseDir, fileName)
  const exists = await fileExists(filePath)
  if (!exists) {
    console.log(`- skip ${fileName} (missing)`)
    return { file: fileName, status: 'missing' }
  }

  const payload = await readJsonFile(filePath)
  if (payload === null) {
    console.log(`- skip ${fileName} (empty)`)
    return { file: fileName, status: 'empty' }
  }

  const existing = await readJson(fileName)
  if (hasRows(existing) && !force) {
    console.log(`- skip ${fileName} (db already has data, use FORCE_MIGRATE=1 to override)`)
    return { file: fileName, status: 'skipped' }
  }

  await writeJson(fileName, payload)
  console.log(`- migrated ${fileName}`)
  return { file: fileName, status: 'migrated' }
}

async function main() {
  console.log(`Starting JSON -> MySQL migration (force=${force})`)
  const results = []

  for (const file of FILES) {
    try {
      results.push(await migrateFile(file))
    } catch (error) {
      console.error(`- failed ${file}:`, error?.message || error)
      results.push({ file, status: 'error', error: error?.message || String(error) })
    }
  }

  const migrated = results.filter((r) => r.status === 'migrated').length
  const skipped = results.filter((r) => r.status === 'skipped').length
  const missing = results.filter((r) => r.status === 'missing').length
  const empty = results.filter((r) => r.status === 'empty').length
  const errors = results.filter((r) => r.status === 'error').length

  console.log('Summary:', { migrated, skipped, missing, empty, errors })
}

main().catch((error) => {
  console.error('Migration failed:', error?.message || error)
  process.exit(1)
})
