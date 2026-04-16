import fs from 'node:fs/promises'
import path from 'node:path'

async function readHookSource() {
  return fs.readFile(path.join(process.cwd(), 'src', 'hooks', 'useLocalStorageState.js'), 'utf8')
}

describe('useLocalStorageState contracts', () => {
  test('safe parse fallback is used for initial value', async () => {
    const source = await readHookSource()
    expect(source).toMatch(/function safeParseJson\(value, fallback\)/)
    expect(source).toMatch(/return safeParseJson\(window\.localStorage\.getItem\(key\), initialValue\)/)
  })

  test('setter persists to localStorage with resolved value', async () => {
    const source = await readHookSource()
    expect(source).toMatch(/const setAndPersist = useCallback\(\(nextValue\) => \{/)
    expect(source).toMatch(/window\.localStorage\.setItem\(key, JSON\.stringify\(resolved\)\)/)
  })
})
