import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { jest } from '@jest/globals'

class MockWebSocket {
  static OPEN = 1

  constructor() {
    this.readyState = MockWebSocket.OPEN
    setTimeout(() => {
      if (this.onopen) this.onopen()
    }, 0)
  }

  send() {}

  close() {
    this.readyState = 3
    if (this.onclose) this.onclose()
  }
}

async function renderChat() {
  global.WebSocket = MockWebSocket

    jest.unstable_mockModule('../../src/lib/auth.js', () => ({
    apiRequest: async () => ({ priority: [], request_pool: [] }),
    getCurrentUser: () => null,
    getToken: () => '',
  }))

  jest.unstable_mockModule('../../src/lib/events', () => ({
    trackClientEvent: () => {},
  }))

  jest.unstable_mockModule('../../src/lib/leadSource', () => ({
    consumeLeadSource: () => null,
  }))

  jest.unstable_mockModule('../../src/components/chat/AttachmentPreviewModal', () => ({
    default: () => React.createElement('div', null, 'AttachmentPreview'),
  }))
  jest.unstable_mockModule('../../src/components/chat/MarkdownMessage', () => ({
    default: () => React.createElement('div', null, 'MarkdownMessage'),
  }))
  jest.unstable_mockModule('../../src/components/chat/FileAttachmentCard', () => ({
    default: () => React.createElement('div', null, 'FileAttachmentCard'),
  }))
  jest.unstable_mockModule('../../src/components/JourneyTimeline', () => ({
    default: () => React.createElement('div', null, 'JourneyTimeline'),
  }))

  const ChatInterface = (await import('../../src/pages/ChatInterface.jsx')).default
  render(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/chat'] },
      React.createElement(ChatInterface),
    ),
  )
}

describe('ChatInterface UI (RTL)', () => {
  test('shows sign-in error when no token', async () => {
    await renderChat()
    await waitFor(() => {
      expect(screen.getByText('Please sign in to view your inbox.')).toBeInTheDocument()
    })
  })
})
