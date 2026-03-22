import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { writeJson } from '../server/utils/jsonStore.js'
import { logInfo } from '../server/utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch {
    return null
  }
}

function normalizeProductRows(rows = []) {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => ({
    ...row,
    company_name: undefined,
    verified: undefined,
    status: row?.status || 'published',
    image_urls: Array.isArray(row?.image_urls) ? row.image_urls : [],
    cover_image_url: row?.cover_image_url || '',
  }))
}

function normalizeRequirementRows(rows = []) {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => ({
    ...row,
    organization_name: undefined,
    verified: undefined,
    title: row?.title || 'Untitled requirement',
    request_type: row?.request_type || 'garments',
    specs: row?.specs && typeof row.specs === 'object' ? row.specs : {},
    custom_fields: Array.isArray(row?.custom_fields) ? row.custom_fields : [],
    quote_deadline: row?.quote_deadline || null,
    expires_at: row?.expires_at || null,
    max_suppliers: row?.max_suppliers ?? null,
  }))
}

function normalizeUserRows(rows = []) {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => ({
    ...row,
    status: row?.status || 'active',
    messaging_restricted_until: row?.messaging_restricted_until ? row.messaging_restricted_until : null,
    password_reset_at: row?.password_reset_at ? row.password_reset_at : null,
  }))
}

function normalizeVerificationRows(rows = []) {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => ({
    ...row,
    verified_at: row?.verified_at || null,
    subscription_valid_until: row?.subscription_valid_until || null,
    updated_at: row?.updated_at || null,
  }))
}

async function migrate() {
  const dbDir = path.join(process.cwd(), 'server', 'database')
  const files = await fs.readdir(dbDir)

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fullPath = path.join(dbDir, file)
    const data = await loadJson(fullPath)
    if (data === null) continue
    const payload = file === 'company_products.json'
      ? normalizeProductRows(data)
      : file === 'requirements.json'
        ? normalizeRequirementRows(data)
        : file === 'users.json'
          ? normalizeUserRows(data)
          : file === 'verification.json'
            ? normalizeVerificationRows(data)
      : data
    await writeJson(file, payload)
    logInfo(`Migrated ${file}`)
  }
}

migrate()
  .then(() => {
    logInfo('JSON -> MySQL migration complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
