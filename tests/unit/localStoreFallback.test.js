/** @jest-environment node */

import prisma from '../../server/utils/prisma.js'
import { readLocalJson, updateLocalJson, writeLocalJson } from '../../server/utils/localStore.js'

describe('localStore fallback and test-mode behavior', () => {
  const originalNodeEnv = process.env.NODE_ENV
  const originalAppState = prisma.appState

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv
    prisma.appState = originalAppState
  })

  test('uses in-memory state in test mode', async () => {
    process.env.NODE_ENV = 'test'

    const fallback = [{ id: 'seed' }]
    const first = await readLocalJson('org_settings.json', fallback)
    expect(first).toEqual(fallback)

    await writeLocalJson('org_settings.json', [{ id: 'one' }])
    const second = await readLocalJson('org_settings.json', fallback)
    expect(second).toEqual([{ id: 'one' }])

    await updateLocalJson('org_settings.json', (current) => [...current, { id: 'two' }], fallback)
    const third = await readLocalJson('org_settings.json', fallback)
    expect(third).toEqual([{ id: 'one' }, { id: 'two' }])
  })

  test('falls back to Prisma app_state row in non-test mode', async () => {
    process.env.NODE_ENV = 'development'

    const state = new Map()
    prisma.appState = {
      findUnique: async ({ where }) => state.get(String(where.key)) || null,
      create: async ({ data }) => {
        const row = { key: data.key, data: data.data }
        state.set(String(data.key), row)
        return row
      },
      upsert: async ({ where, create, update }) => {
        const key = String(where.key)
        const current = state.get(key)
        if (!current) {
          const row = { key: create.key, data: create.data }
          state.set(key, row)
          return row
        }
        const next = { ...current, data: update.data }
        state.set(key, next)
        return next
      },
    }

    const fallback = [{ when: new Date('2026-04-14T00:00:00.000Z') }]
    const first = await readLocalJson('ops_flags.json', fallback)
    expect(first).toEqual([{ when: '2026-04-14T00:00:00.000Z' }])

    await writeLocalJson('ops_flags.json', [{ enabled: true }])
    const second = await readLocalJson('ops_flags.json', [])
    expect(second).toEqual([{ enabled: true }])

    await updateLocalJson('ops_flags.json', (current) => [...current, { enabled: false }], [])
    const third = await readLocalJson('ops_flags.json', [])
    expect(third).toEqual([{ enabled: true }, { enabled: false }])
  })
})
