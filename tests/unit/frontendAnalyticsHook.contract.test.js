import fs from 'node:fs/promises'
import path from 'node:path'

async function readHookSource() {
  return fs.readFile(path.join(process.cwd(), 'src', 'hooks', 'useAnalyticsDashboard.js'), 'utf8')
}

describe('useAnalyticsDashboard contracts', () => {
  test('hook tracks loading and forbidden error state', async () => {
    const source = await readHookSource()
    expect(source).toMatch(/const \[loading, setLoading\] = useState\(true\)/)
    expect(source).toMatch(/setForbidden\(err\.status === 403\)/)
    expect(source).toMatch(/setError\(err\.status === 403 \? 'You do not have permission to view analytics for this organization\.'/)
  })

  test('hook returns full data shape with flags', async () => {
    const source = await readHookSource()
    expect(source).toMatch(/return \{ dashboard, companyAnalytics, platformAnalytics, premiumInsights, subscription, isEnterprise, loading, error, forbidden \}/)
  })
})
