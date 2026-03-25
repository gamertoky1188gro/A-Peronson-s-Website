import fs from 'fs/promises'
import path from 'path'

const BASE_DIR = path.join(process.cwd(), 'server', 'database')

async function ensureDir() {
  await fs.mkdir(BASE_DIR, { recursive: true })
}

export async function readLocalJson(fileName, fallback = []) {
  const filePath = path.join(BASE_DIR, fileName)
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    await ensureDir()
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8')
    return fallback
  }
}

export async function writeLocalJson(fileName, data) {
  const filePath = path.join(BASE_DIR, fileName)
  await ensureDir()
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
  return data
}

export async function updateLocalJson(fileName, updater, fallback = []) {
  const current = await readLocalJson(fileName, fallback)
  const next = await updater(current)
  await writeLocalJson(fileName, next)
  return next
}
