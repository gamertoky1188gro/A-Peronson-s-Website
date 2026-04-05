import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const LEGACY_DB_DIR = path.join(ROOT, 'server', 'database')

export function isCrmSqlEnabled() {
  const raw = String(process.env.CRM_SQL_ENABLED ?? 'true').toLowerCase().trim()
  return !['0', 'false', 'no', 'off'].includes(raw)
}

export async function readLegacyJson(fileName) {
  const filePath = path.join(LEGACY_DB_DIR, fileName)
  const raw = await fs.readFile(filePath, 'utf8').catch(() => null)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
