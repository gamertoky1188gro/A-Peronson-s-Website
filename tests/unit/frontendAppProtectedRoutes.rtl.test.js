import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'

const pageStub = (label) => function Stub() {
  return React.createElement('div', null, label)
}

let mockUser = null
let mockTrackClientEvent = jest.fn()

const pageModules = {
  '../../src/pages/TexHub': 'TexHub',
  '../../src/pages/Pricing': 'Pricing',
  '../../src/pages/About': 'About',
  '../../src/pages/Terms': 'Terms',
  '../../src/pages/Privacy': 'Privacy',
  '../../src/pages/HelpCenter': 'Help',
  '../../src/pages/auth/Login': 'Login Page',
  '../../src/pages/auth/Signup': 'Signup Page',
  '../../src/pages/auth/SignupUltra': 'SignupUltra Page',
  '../../src/pages/auth/OnboardingWizard': 'Onboarding',
  '../../src/pages/MainFeed': 'MainFeed',
  '../../src/pages/SearchResults': 'SearchResults',
  '../../src/pages/BuyerProfile': 'BuyerProfile',
  '../../src/pages/FactoryProfile': 'FactoryProfile',
  '../../src/pages/BuyingHouseProfile': 'BuyingHouseProfile',
  '../../src/pages/MemberManagement': 'MemberManagement',
  '../../src/pages/PartnerNetwork': 'PartnerNetwork',
  '../../src/pages/ProductManagement': 'ProductManagement',
  '../../src/pages/BuyerRequestManagement': 'BuyerRequestManagement',
  '../../src/pages/ContractVault': 'ContractVault',
  '../../src/pages/NotificationsCenter': 'Notifications',
  '../../src/pages/OrgSettings': 'OrgSettings',
  '../../src/pages/Insights': 'Insights',
  '../../src/pages/ChatInterface': 'ChatInterface',
  '../../src/pages/CallInterface': 'CallInterface',
  '../../src/pages/OwnerDashboard': 'OwnerDashboard',
  '../../src/pages/AgentDashboard': 'AgentDashboard',
  '../../src/pages/MvpDashboard': 'MvpDashboard',
  '../../src/pages/IndustryPage': 'IndustryPage',
  '../../src/pages/RatingFeedback': 'RatingFeedback',
  '../../src/pages/SupportReports': 'SupportReports',
  '../../src/pages/AdminPanel': 'AdminPanel',
  '../../src/pages/AdminGovernance': 'AdminGovernance',
  '../../src/pages/AccessDenied': 'Access Denied Page',
  '../../src/pages/VerificationPage': 'Verification',
}

async function renderAppWithUser(user, path) {
  mockUser = user
  mockTrackClientEvent = jest.fn()

  Object.entries(pageModules).forEach(([modulePath, label]) => {
    jest.unstable_mockModule(modulePath, () => ({
      default: pageStub(label),
    }))
  })

  jest.unstable_mockModule('../../src/components/NavBar', () => ({
    default: pageStub('NavBar'),
  }))
  jest.unstable_mockModule('../../src/components/Footer', () => ({
    default: pageStub('Footer'),
  }))
  jest.unstable_mockModule('../../src/components/FloatingAssistant', () => ({
    default: pageStub('FloatingAssistant'),
  }))

  jest.unstable_mockModule('../../src/lib/auth.js', () => ({
    getCurrentUser: () => mockUser,
  }))
  jest.unstable_mockModule('../../src/lib/events.js', () => ({
    trackClientEvent: (...args) => mockTrackClientEvent(...args),
  }))

  window.history.pushState({}, '', path)
  const App = (await import('../../src/App.jsx')).default
  render(React.createElement(App))

  return { trackClientEvent: mockTrackClientEvent }
}

describe('App protected routes (RTL)', () => {
  test('unauthenticated users are redirected to Login', async () => {
    await renderAppWithUser(null, '/feed')
    expect(await screen.findByText('Login Page')).toBeInTheDocument()
  })

  test('unauthorized roles are redirected to AccessDenied', async () => {
    await renderAppWithUser({ id: 'u1', role: 'buyer' }, '/admin')
    expect(await screen.findByText(/access denied/i)).toBeInTheDocument()
  })

  test('route change triggers page_view tracking', async () => {
    const { trackClientEvent } = await renderAppWithUser({ id: 'u2', role: 'buyer' }, '/search')
    await waitFor(() => {
      expect(trackClientEvent).toHaveBeenCalledWith('page_view', expect.any(Object))
    })
  })
})
