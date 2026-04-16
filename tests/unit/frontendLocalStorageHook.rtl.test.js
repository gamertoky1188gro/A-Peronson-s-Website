import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useLocalStorageState from '../../src/hooks/useLocalStorageState.js'

function HookHarness({ storageKey = 'pref', initialValue = 'alpha' }) {
  const [value, setValue] = useLocalStorageState(storageKey, initialValue)
  return (
    React.createElement('div', null,
      React.createElement('span', { 'data-testid': 'value' }, String(value)),
      React.createElement('button', { type: 'button', onClick: () => setValue('beta') }, 'Set'),
    )
  )
}

describe('useLocalStorageState (RTL)', () => {
  test('parses initial value from localStorage and updates persist', async () => {
    window.localStorage.setItem('pref', JSON.stringify('stored'))
    const user = userEvent.setup()
    render(React.createElement(HookHarness))

    expect(screen.getByTestId('value')).toHaveTextContent('stored')
    await user.click(screen.getByRole('button', { name: 'Set' }))
    expect(screen.getByTestId('value')).toHaveTextContent('beta')
    expect(window.localStorage.getItem('pref')).toBe(JSON.stringify('beta'))
  })
})
