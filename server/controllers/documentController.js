import { saveDocumentMetadata } from '../services/documentService.js'

export async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const doc = await saveDocumentMetadata(req.params.matchId, req.user.id, req.body?.type || 'other', req.file)
    return res.status(201).json(doc)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
