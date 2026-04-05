/**
 * Deal journey E2E matrix (Playwright/Cypress-aligned).
 * This file is intentionally matrix-first and can be ported to Cypress by mirroring each row as a describe block.
 */
import { test, expect } from '@playwright/test'

const MATRIX = [
  {
    name: 'buyer-first flow',
    actor: 'buyer',
    steps: ['search_open', 'match_confirmed', 'message_start', 'call_scheduled', 'call_completed', 'contract_draft', 'contract_signed', 'deal_closed'],
  },
  {
    name: 'factory-first flow',
    actor: 'factory',
    steps: ['search_open', 'match_confirmed', 'message_start', 'call_scheduled', 'call_completed', 'contract_draft', 'contract_signed', 'deal_closed'],
  },
  {
    name: 'buying-house coordination flow',
    actor: 'buying_house',
    steps: ['search_open', 'match_confirmed', 'message_start', 'call_scheduled', 'call_completed', 'contract_draft', 'contract_signed', 'deal_closed'],
  },
]

test.describe('deal journey matrix', () => {
  for (const row of MATRIX) {
    test(row.name, async ({ request }) => {
      // NOTE: Setup auth and ids in your test environment fixtures.
      const response = await request.post('/api/deal-journeys/events', {
        data: {
          event_type: row.steps[0],
          context: {
            search_source: `${row.actor}_test`,
            requirement_id: `req-${row.actor}`,
          },
          metadata: { matrix: row.name },
        },
      })

      expect(response.ok()).toBeTruthy()
      const journey = await response.json()
      expect(journey.current_state).toBeTruthy()
      expect(Array.isArray(journey.transitions)).toBeTruthy()
    })
  }
})
