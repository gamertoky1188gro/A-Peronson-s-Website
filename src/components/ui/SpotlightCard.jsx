import React from 'react'

export default function SpotlightCard({ className='', children }) {
  function handleSpotlightMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      className={[
        'relative overflow-hidden',
        'before:pointer-events-none before:absolute before:inset-0',
        'before:opacity-0 hover:before:opacity-100',
        'before:transition-opacity before:duration-200',
        'before:bg-[radial-gradient(600px_circle_at_var(--spotlight-x)_var(--spotlight-y),rgba(255,255,255,0.55),transparent_40%)]',
        'dark:before:bg-[radial-gradient(600px_circle_at_var(--spotlight-x)_var(--spotlight-y),rgba(10,102,194,0.16),transparent_45%)]',
        className,
      ].join(' ')}
      onMouseMove={handleSpotlightMove}
    >
      {children}
    </div>
  )
}
