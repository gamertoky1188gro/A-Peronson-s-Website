import prisma from './prisma.js'

function toSerializable(value) {
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(toSerializable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toSerializable(v)]))
  }
  return value
}

async function ensureStateRow(key, fallback) {
  const existing = await prisma.appState.findUnique({ where: { key } })
  if (existing) return existing
  const created = await prisma.appState.create({
    data: {
      key,
      data: toSerializable(fallback),
    },
  })
  return created
}

export async function readLocalJson(fileName, fallback = []) {
  const key = String(fileName)
  const row = await ensureStateRow(key, fallback)
  return row?.data ?? fallback
}

export async function writeLocalJson(fileName, data) {
  const key = String(fileName)
  const payload = toSerializable(data)
  await prisma.appState.upsert({
    where: { key },
    create: { key, data: payload },
    update: { data: payload, updated_at: new Date() },
  })
  return data
}

export async function updateLocalJson(fileName, updater, fallback = []) {
  const current = await readLocalJson(fileName, fallback)
  const next = await updater(current)
  await writeLocalJson(fileName, next)
  return next
}
