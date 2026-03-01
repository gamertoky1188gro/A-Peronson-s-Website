import crypto from 'crypto'
import path from 'path'
import fs from 'fs/promises'
import { readJson, writeJson } from '../utils/jsonStore.js'

const FILE = 'documents.json'

export async function saveDocumentMetadata(matchId, uploadedBy, type, file) {
  const docs = await readJson(FILE)
  const ext = path.extname(file.originalname || '').toLowerCase()
  if (ext !== '.pdf') {
    throw new Error('Only PDF uploads are allowed')
  }

  const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const targetPath = path.join(process.cwd(), 'server', 'uploads', safeName)
  await fs.writeFile(targetPath, file.buffer)

  const doc = {
    id: crypto.randomUUID(),
    match_id: matchId,
    uploaded_by: uploadedBy,
    file_path: path.relative(process.cwd(), targetPath),
    type,
    created_at: new Date().toISOString(),
  }
  docs.push(doc)
  await writeJson(FILE, docs)
  return doc
}
