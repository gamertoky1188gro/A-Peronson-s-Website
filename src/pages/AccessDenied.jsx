import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function AccessDenied() {
  const location = useLocation()

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card p-6">
      <div className="max-w-3xl mx-auto mt-16 bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-gray-600">
          You do not have permission to access <strong>{location.state?.from || 'this page'}</strong>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login with another account</Link>
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
    </div>
  )
}
