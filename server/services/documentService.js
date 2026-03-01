import crypto from 'crypto'
import path from 'path'
import fs from 'fs/promises'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'documents.json'

function ensureAllowed(file) {
  const ext = path.extname(file.originalname || '').toLowerCase()
  const allowed = ['.pdf', '.png', '.jpg', '.jpeg']
  if (!allowed.includes(ext)) throw new Error('Invalid file type')
}

export async function saveDocumentMetadata(ownerId, entityType, entityId, type, file) {
  const docs = await readJson(FILE)
  ensureAllowed(file)
  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const targetPath = path.join(process.cwd(), 'server', 'uploads', safeName)
  await fs.writeFile(targetPath, file.buffer)

  const doc = {
    id: crypto.randomUUID(),
    uploaded_by: ownerId,
    entity_type: sanitizeString(entityType, 60),
    entity_id: sanitizeString(entityId, 100),
    file_path: path.relative(process.cwd(), targetPath),
    type: sanitizeString(type || 'other', 60),
    created_at: new Date().toISOString(),
  }

  docs.push(doc)
  await writeJson(FILE, docs)
  return doc
}

export async function listDocuments(entityType, entityId) {
  const docs = await readJson(FILE)
  return docs.filter((d) => d.entity_type === entityType && d.entity_id === entityId)
}

export async function deleteDocument(docId, actor) {
  const docs = await readJson(FILE)
  const target = docs.find((d) => d.id === docId)
  if (!target) return false
  if (actor.role !== 'admin' && target.uploaded_by !== actor.id) return 'forbidden'

  const next = docs.filter((d) => d.id !== docId)
  await writeJson(FILE, next)
  return true
}
