export async function systemMeta(req, res) {
  return res.json({
    name: 'Cross-Border B2B Textile Trust Platform',
    version: 'mvp',
    modules: ['auth', 'profiles', 'requirements', 'matching', 'messages', 'documents', 'admin'],
    kpi: 'Requirement Created → Matched → First Message Sent → Accepted',
  })
}
