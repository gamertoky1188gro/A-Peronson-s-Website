import React from 'react'

export default function SpotlightCard({ className = '', children }) {
  function handleSpotlightMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div className={['spotlight-card', className].join(' ')} onMouseMove={handleSpotlightMove}>
      {children}
    </div>
  )
}

