const MATRIX = [
  'buyer-first flow',
  'factory-first flow',
  'buying-house coordination flow',
]

describe('Deal journey matrix', () => {
  MATRIX.forEach((scenario) => {
    it(scenario, () => {
      // Placeholder matrix spec; implement with your login + fixture helpers.
      cy.request('GET', '/api/health').its('status').should('eq', 200)
    })
  })
})
