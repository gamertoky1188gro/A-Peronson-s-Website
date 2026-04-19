import React from 'react'
import { Link } from 'react-router-dom'

export default function AccessDeniedState({ message = 'You do not have permission to access this section.' }) {
  return (
    <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-amber-50 p-4 text-amber-800">
      <h2 className="font-semibold">Access denied</h2>
      <p className="mt-1 text-sm">{message}</p>
      <Link to="/access-denied" className="mt-3 inline-block text-sm font-medium text-[#0A66C2] underline">View details</Link>
    </div>
  )
}
