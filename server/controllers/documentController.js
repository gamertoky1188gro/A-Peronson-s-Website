import { deleteDocument, listDocuments, saveDocumentMetadata } from '../services/documentService.js'

export async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const entityType = req.body?.entity_type || 'verification'
    const entityId = req.body?.entity_id || req.user.id
    const doc = await saveDocumentMetadata(req.user.id, entityType, entityId, req.body?.type || 'other', req.file)
    return res.status(201).json(doc)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

export async function getDocuments(req, res) {
  const entityType = req.query.entity_type || 'verification'
  const entityId = req.query.entity_id || req.user.id
  const docs = await listDocuments(entityType, entityId)
  return res.json(docs)
}

export async function removeDocument(req, res) {
  const result = await deleteDocument(req.params.documentId, req.user)
  if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  if (!result) return res.status(404).json({ error: 'Document not found' })
  return res.json({ ok: true })
}
