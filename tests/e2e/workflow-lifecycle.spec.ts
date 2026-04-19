import { test, expect } from '@playwright/test'

const AUTH_HEADER = process.env.E2E_AUTH_TOKEN ? { Authorization: `Bearer ${process.env.E2E_AUTH_TOKEN}` } : {}
const E2E_RUN = String(process.env.E2E_RUN || '').toLowerCase() === 'true'

test.describe('workflow lifecycle api', () => {
  test('happy path: create + linear transitions', async ({ request }) => {
    test.skip(!E2E_RUN, 'Set E2E_RUN=true to execute API-backed e2e tests.')
    test.skip(!process.env.E2E_AUTH_TOKEN, 'Set E2E_AUTH_TOKEN to run authenticated workflow e2e tests.')

    const create = await request.post('/api/workflow/journeys', {
      headers: AUTH_HEADER,
      data: {
        match_id: `match-e2e-${Date.now()}`,
        initial_state: 'discovered',
      },
    })
    expect(create.ok()).toBeTruthy()
    const journey = await create.json()
    expect(journey.current_state).toBe('discovered')

    for (const state of ['matched', 'contacted', 'meeting_scheduled', 'negotiating', 'contract_drafted', 'contract_signed', 'closed']) {
      const transition = await request.post(`/api/workflow/journeys/${journey.id}/transition`, {
        headers: AUTH_HEADER,
        data: {
          to_state: state,
          event_type: 'e2e_transition',
        },
      })
      expect(transition.ok()).toBeTruthy()
      const row = await transition.json()
      expect(row.current_state).toBe(state)
    }
  })

  test('invalid transition: discovered -> contract_signed rejected deterministically', async ({ request }) => {
    test.skip(!E2E_RUN, 'Set E2E_RUN=true to execute API-backed e2e tests.')
    test.skip(!process.env.E2E_AUTH_TOKEN, 'Set E2E_AUTH_TOKEN to run authenticated workflow e2e tests.')

    const create = await request.post('/api/workflow/journeys', {
      headers: AUTH_HEADER,
      data: {
        match_id: `match-invalid-${Date.now()}`,
        initial_state: 'discovered',
      },
    })
    expect(create.ok()).toBeTruthy()
    const journey = await create.json()

    const transition = await request.post(`/api/workflow/journeys/${journey.id}/transition`, {
      headers: AUTH_HEADER,
      data: {
        to_state: 'contract_signed',
        event_type: 'e2e_invalid_transition',
      },
    })

    expect(transition.status()).toBe(409)
    const error = await transition.json()
    expect(error.code).toBe('INVALID_TRANSITION')
    expect(Array.isArray(error.allowed_next_states)).toBeTruthy()
    expect(error.allowed_next_states).toContain('matched')
  })
})
