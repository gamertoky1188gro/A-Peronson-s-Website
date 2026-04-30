    1 | /*
    2 |   Route: /access-denied
    3 |   Access: Public (shown after an auth/role gate denies access)
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Purpose:
   12 |     - Display a friendly "you can't access this" screen after ProtectedRoute rejects a role.
   13 |     - Echo the route that was attempted via react-router `location.state.from` (set by the router guard).
   14 | 
   15 |   Notes:
   16 |     - Styling uses the legacy `neo-page` / `cyberpunk-card` utilities from App.css.
   17 |     - This page does not call any API.
   18 | */
   19 | import React from 'react'
   20 | import { Link, useLocation, useNavigate } from 'react-router-dom'
   21 | 
   22 | export default function AccessDenied() {
   23 |   // Read the attempted path from router state (ProtectedRoute sets this when redirecting here).
   24 |   const location = useLocation()
   25 |   const navigate = useNavigate()
   26 | 
   27 |   const handleBack = () => {
   28 |     if (window.history.length > 1) {
   29 |       navigate(-1)
   30 |       return
   31 |     }
   32 |     navigate('/', { replace: true })
   33 |   }
   34 | 
   35 |   return (
   36 |     // Full-height page wrapper (keeps center content vertically spaced on large screens).
   37 |     <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card p-6">
   38 |       {/* Centered panel to keep the message readable and focused. */}
   39 |       <div className="max-w-3xl mx-auto mt-16 bg-white neo-panel cyberpunk-card rounded-xl p-8">
   40 |         <div className="flex items-center justify-between">
   41 |           <h1 className="text-3xl font-bold">Access denied</h1>
   42 |           <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
   43 |             Back
   44 |           </button>
   45 |         </div>
   46 |         <p className="mt-3 text-gray-600">
   47 |           {/* Show the blocked route (fallback to generic wording if missing). */}
   48 |           You do not have permission to access <strong>{location.state?.from || 'this page'}</strong>.
   49 |         </p>
   50 |         {/* Primary actions: re-auth or return to a safe default page. */}
   51 |         <div className="mt-6 flex flex-wrap gap-3">
   52 |           <Link to="/login" className="px-4 py-2 rounded-lg bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-hover)] text-white">Login with another account</Link>
   53 |           <Link to="/feed" className="px-4 py-2 rounded-lg borderless-shadow">Go to Feed</Link>
   54 |         </div>
   55 |       </div>
   56 |     </div>
   57 |   )
   58 | }
   59 | 