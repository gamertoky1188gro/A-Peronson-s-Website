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
    status: row?.status || 'published',
    image_urls: Array.isArray(row?.image_urls) ? row.image_urls : [],
    cover_image_url: row?.cover_image_url || '',
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
