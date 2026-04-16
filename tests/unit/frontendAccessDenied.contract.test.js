import fs from 'node:fs/promises'
import path from 'node:path'

async function readSource(relPath) {
  return fs.readFile(path.join(process.cwd(), relPath), 'utf8')
}

describe('Access denied UX contracts', () => {
  test('AccessDenied page renders action links and back button', async () => {
    const source = await readSource('src/pages/AccessDenied.jsx')
    expect(source).toMatch(/<h1 className="text-3xl font-bold">Access denied<\/h1>/)
    expect(source).toMatch(/<Link to="\/login"/)
    expect(source).toMatch(/<Link to="\/feed"/)
    expect(source).toMatch(/navigate\(-1\)/)
    expect(source).toMatch(/navigate\('\/'\, \{ replace: true \}\)/)
  })

  test('AccessDeniedState default message and link', async () => {
    const source = await readSource('src/components/AccessDeniedState.jsx')
    expect(source).toMatch(/message = 'You do not have permission to access this section\.'/)
    expect(source).toMatch(/<Link to="\/access-denied"/)
  })
})
