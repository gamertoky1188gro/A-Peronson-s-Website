import { writeJson, readJson } from '../../server/utils/jsonStore.js'
import { exportAnalytics } from '../../server/services/analyticsExportService.js'
import { updateAdminConfig } from '../../server/services/adminConfigService.js'

describe('audited analytics export', () => {
  test('exports sanitized report and records audit', async () => {
    process.env.NODE_ENV = 'test'
    // seed admin user and empty event logs
    await writeJson('users.json', [{ id: 'admin1', role: 'admin' }])
    await writeJson('event_logs.json', [])

    const raw = {
      actor_id: 'sensitive-user',
      totals: { buyer_requests: 42 },
      top_categories_global: [{ label: 'Small', count: 1 }, { label: 'Large', count: 50 }],
    }

    // ensure admin config allows exports for tests
    await updateAdminConfig({ analytics: { governance: { export_allowed_roles: ['admin', 'owner'], allow_raw_exports: true } } })
    const res = await exportAnalytics({ id: 'admin1', role: 'admin' }, raw)
    expect(res).toBeDefined()
    expect(res.export_id).toBeDefined()
    expect(res.sanitized).toBeDefined()

    const logs = await readJson('event_logs.json')
    expect(Array.isArray(logs)).toBe(true)
    const audit = logs.find((l) => l.id === res.export_id)
    expect(audit).toBeDefined()
    expect(audit.type).toBe('analytics_export')
    expect(audit.allowed).toBe(true)
    // verify denied fields are removed from sanitized.report
    const reportJson = JSON.stringify(res.sanitized.report || {})
    expect(reportJson).not.toContain('sensitive-user')
  })
})
