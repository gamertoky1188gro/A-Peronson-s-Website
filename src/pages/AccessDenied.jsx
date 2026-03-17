/*
  Route: /access-denied
  Access: Public (shown after an auth/role gate denies access)

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Purpose:
    - Display a friendly "you can't access this" screen after ProtectedRoute rejects a role.
    - Echo the route that was attempted via react-router `location.state.from` (set by the router guard).

  Notes:
    - Styling uses the legacy `neo-page` / `cyberpunk-card` utilities from App.css.
    - This page does not call any API.
*/
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function AccessDenied() {
  // Read the attempted path from router state (ProtectedRoute sets this when redirecting here).
  const location = useLocation()

  return (
    // Full-height page wrapper (keeps center content vertically spaced on large screens).
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card p-6">
      {/* Centered panel to keep the message readable and focused. */}
      <div className="max-w-3xl mx-auto mt-16 bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-gray-600">
          {/* Show the blocked route (fallback to generic wording if missing). */}
          You do not have permission to access <strong>{location.state?.from || 'this page'}</strong>.
        </p>
        {/* Primary actions: re-auth or return to a safe default page. */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/login" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Login with another account</Link>
          <Link to="/feed" className="px-4 py-2 rounded-lg border">Go to Feed</Link>
        </div>
      </div>
    </div>
  )
}
