function extractCodes(raw = '') {
  return String(raw || '')
    .split(',')
    .map((v) => String(v || '').trim())
    .filter(Boolean)
}

export function requireDualExportApproval(req, res, next) {
  const primary = String(process.env.ADMIN_EXPORT_CODE_PRIMARY || '').trim()
  const secondary = String(process.env.ADMIN_EXPORT_CODE_SECONDARY || '').trim()
  if (!primary && !secondary) return next()

  const provided = extractCodes(req.headers['x-admin-export-approval'])
  const okPrimary = !primary || provided.includes(primary)
  const okSecondary = !secondary || provided.includes(secondary)

  if (!okPrimary || !okSecondary) {
    return res.status(403).json({ error: 'Dual approval required for export.' })
  }

  return next()
}

