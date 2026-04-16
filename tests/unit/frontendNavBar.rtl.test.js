import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { jest } from '@jest/globals'

let mockUser = null

async function renderNavBarWithUser(user) {
  mockUser = user
  jest.unstable_mockModule('../../src/lib/auth.js', () => ({
    apiRequest: async () => [],
    clearSession: () => {},
    getCurrentUser: () => mockUser,
    getRoleHome: () => '/feed',
    getToken: () => (mockUser ? 'token' : ''),
  }))

  const NavBar = (await import('../../src/components/NavBar.jsx')).default
  render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/'] },
      React.createElement(NavBar),
    ),
  )
}

describe('NavBar auth-state rendering (RTL)', () => {
  test('shows public links when logged out', async () => {
    await renderNavBarWithUser(null)
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  test('shows authenticated icon links when logged in', async () => {
    await renderNavBarWithUser({ id: 'u1', role: 'buyer', name: 'Buyer' })
    expect(screen.getByLabelText('Feed')).toBeInTheDocument()
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByLabelText('Chat')).toBeInTheDocument()
    expect(screen.getByLabelText('Verification')).toBeInTheDocument()
  })
})
