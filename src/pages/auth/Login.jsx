/*
  Route: /login
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Purpose:
    - Authenticate the user and persist a session (token + user object).
    - Redirect the user back to the originally requested page (if present),
      otherwise redirect to the role home route.

  Key API:
    - POST /api/auth/login  (via `apiRequest('/auth/login')`)

  Notes:
    - Styling is still using legacy `neo-page` / `cyberpunk-card` utilities.
      (We are only adding comments here; not changing styles/behavior.)
*/
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest, getRoleHome, saveSession } from '../../lib/auth'

export default function Login() {
  // `navigate` is used after a successful login (or when routing needs to change).
  const navigate = useNavigate()
  // `location` holds router state, including the "from" path set by ProtectedRoute when redirecting to /login.
  const location = useLocation()

  // Form fields (controlled inputs).
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Whether to persist session in longer-lived storage (implementation handled by `saveSession`).
  const [rememberMe, setRememberMe] = useState(true)
  // UX states for the submit button + inline error message.
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If ProtectedRoute sent us here, it passes the blocked path in state so we can return after login.
  const redirectTo = location.state?.from || null

  // Submit handler: calls backend auth endpoint, stores the session, and redirects.
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Authenticate (server returns { user, token } on success).
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      // Persist user + token (optionally "remember me") so protected routes can use them.
      saveSession(data.user, data.token, { remember: rememberMe })
      // Go back to the original route, or to the default role home screen.
      navigate(redirectTo || getRoleHome(data.user.role), { replace: true })
    } catch (err) {
      // Surface backend message for incorrect credentials or other auth failures.
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Page wrapper: centers the login panel and applies the current "neo/cyberpunk" base style utilities.
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4">
      {/* Login card container (max width keeps form readable). */}
      <div className="w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>

        {/* Controlled form: React state is the single source of truth for inputs. */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            {/* Email is required; browser validates type=email too. */}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-3 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            {/* Password is required; actual auth validation happens server-side. */}
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 border rounded-lg" />
          </div>

          {/* "Remember me" determines how session is stored (cookie/localStorage) based on `saveSession` implementation. */}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember me
          </label>

          {/* Inline error (only renders when there is an error string). */}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          {/* Primary CTA: disabled while API request is in flight. */}
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Secondary nav: send user to signup if they do not have an account yet. */}
        <p className="mt-6 text-sm text-gray-600">
          New here? <Link className="text-indigo-500" to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  )
}
