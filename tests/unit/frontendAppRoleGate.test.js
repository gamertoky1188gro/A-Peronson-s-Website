import fs from 'node:fs/promises'
import path from 'node:path'

async function readAppSource() {
  return fs.readFile(path.join(process.cwd(), 'src', 'App.jsx'), 'utf8')
}

describe('App protected routes and role gates', () => {
  test('ProtectedRoute redirects unauthenticated users to login', async () => {
    const source = await readAppSource()
    expect(source).toMatch(/if \(!user\)\s*\{[\s\S]*?<Navigate to="\/login"/)
  })

  test('ProtectedRoute redirects unauthorized roles to access-denied', async () => {
    const source = await readAppSource()
    expect(source).toMatch(/!roles\.includes\(user\.role\)[\s\S]*?<Navigate to="\/access-denied"/)
  })

  test('critical role arrays and gated routes exist', async () => {
    const source = await readAppSource()

    expect(source).toMatch(/const AUTH_ROLES = \['buyer', 'buying_house', 'factory', 'owner', 'admin', 'agent'\]/)
    expect(source).toMatch(/path="\/admin"[\s\S]*?roles=\{\['owner'\]\}/)
    expect(source).toMatch(/path="\/agent"[\s\S]*?roles=\{\['buying_house', 'owner', 'admin', 'agent'\]\}/)
    expect(source).toMatch(/path="\/search"[\s\S]*?<ProtectedRoute roles=\{AUTH_ROLES\}>/)
    expect(source).toMatch(/path="\/access-denied" element=\{<AccessDenied \/>\}/)
    expect(source).toMatch(/path="\/member-management"[\s\S]*?roles=\{MEMBER_MANAGEMENT_ROLES\}/)
    expect(source).toMatch(/path="\*" element=\{<Navigate to="\/" replace \/>\}/)
  })
})
