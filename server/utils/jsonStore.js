import fs from 'fs/promises'
import path from 'path'

const locks = new Map()

function dbPath(fileName) {
  return path.join(process.cwd(), 'server', 'database', fileName)
}

async function withLock(fileName, action) {
  const prior = locks.get(fileName) || Promise.resolve()
  const next = prior.then(action, action)
  locks.set(fileName, next.finally(() => {
    if (locks.get(fileName) === next) {
      locks.delete(fileName)
    }
  }))
  return next
}

export async function readJson(fileName) {
  const fullPath = dbPath(fileName)
  try {
    const raw = await fs.readFile(fullPath, 'utf-8')
    return JSON.parse(raw || '[]')
  } catch {
    return []
  }
}

export async function writeJson(fileName, data) {
  return withLock(fileName, async () => {
    const fullPath = dbPath(fileName)
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8')
    return data
  })
}

export async function updateJson(fileName, updater) {
  return withLock(fileName, async () => {
    const existing = await readJson(fileName)
    const next = await updater(existing)
    const fullPath = dbPath(fileName)
    await fs.writeFile(fullPath, JSON.stringify(next, null, 2), 'utf-8')
    return next
  })
}
