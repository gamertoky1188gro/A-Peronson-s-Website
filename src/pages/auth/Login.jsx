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
    - Tailwind-only styling (no legacy App.css utilities).
*/
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest, getCurrentUser, getRoleHome, saveSession } from '../../lib/auth'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import BackButton from '../../components/ui/BackButton'

export default function Login() {
  // `navigate` is used after a successful login (or when routing needs to change).
  const navigate = useNavigate()
  // `location` holds router state, including the "from" path set by ProtectedRoute when redirecting to /login.
  const location = useLocation()
  const existingUser = getCurrentUser()

  // Form fields (controlled inputs).
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  // Whether to persist session in longer-lived storage (implementation handled by `saveSession`).
  const [rememberMe, setRememberMe] = useState(true)
  // UX states for the submit button + inline error message.
  const [loading, setLoading] = useState(false)
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [enrollLoading, setEnrollLoading] = useState(false)
  const [suppressRedirect, setSuppressRedirect] = useState(false)
  const [rememberPasskeyUser, setRememberPasskeyUser] = useState(() => {
    const raw = localStorage.getItem('remember_passkey_user')
    return raw ? raw === 'true' : true
  })
  const [passkeyHint, setPasskeyHint] = useState(() => {
    try {
      const raw = localStorage.getItem('passkey_user_hint')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)

  // If ProtectedRoute sent us here, it passes the blocked path in state so we can return after login.
  const redirectTo = location.state?.from || null

  useEffect(() => {
    if (suppressRedirect) return
    if (!existingUser?.role) return
    navigate(getRoleHome(existingUser.role), { replace: true })
  }, [existingUser?.role, navigate, suppressRedirect])

  useEffect(() => {
    localStorage.setItem('remember_passkey_user', rememberPasskeyUser ? 'true' : 'false')
    if (!rememberPasskeyUser) {
      localStorage.removeItem('passkey_user_hint')
      setPasskeyHint(null)
    }
  }, [rememberPasskeyUser])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/', { replace: true })
  }

  // Submit handler: calls backend auth endpoint, stores the session, and redirects.
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Authenticate (server returns { user, token } on success).
      // Backend will accept either email or Agent ID (member_id)
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { identifier, password },
      })

      // Persist user + token (optionally "remember me") so protected routes can use them.
      saveSession(data.user, data.token, { remember: rememberMe })
      // project.md: if onboarding is not completed, route user into the 3-step wizard first.
      const onboardingCompleted = data?.user?.profile?.onboarding_completed === true || String(data?.user?.profile?.onboarding_completed || '').toLowerCase() === 'true'
      navigate(onboardingCompleted ? (redirectTo || getRoleHome(data.user.role)) : '/onboarding', { replace: true })
    } catch (err) {
      // Surface backend message for incorrect credentials or other auth failures.
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      setError('Passkeys are not supported on this device/browser.')
      return
    }
    setError('')
    setPasskeyLoading(true)
    try {
      const optionsRes = await apiRequest('/auth/passkey/login/options', {
        method: 'POST',
        body: { identifier: identifier.trim() || undefined },
      })
      const assertion = await startAuthentication(optionsRes.options)
      const data = await apiRequest('/auth/passkey/login/verify', {
        method: 'POST',
        body: { identifier: identifier.trim() || undefined, credential: assertion },
      })
      if (rememberPasskeyUser) {
        const hint = {
          user_name: data?.user?.name || '',
          user_email: data?.user?.email || '',
          passkey_name: data?.passkey?.name || '',
        }
        localStorage.setItem('passkey_user_hint', JSON.stringify(hint))
        localStorage.setItem('remember_passkey_user', 'true')
        setPasskeyHint(hint)
      } else {
        localStorage.removeItem('passkey_user_hint')
        localStorage.setItem('remember_passkey_user', 'false')
        setPasskeyHint(null)
      }
      saveSession(data.user, data.token, { remember: rememberMe })
      const onboardingCompleted = data?.user?.profile?.onboarding_completed === true || String(data?.user?.profile?.onboarding_completed || '').toLowerCase() === 'true'
      navigate(onboardingCompleted ? (redirectTo || getRoleHome(data.user.role)) : '/onboarding', { replace: true })
    } catch (err) {
      setError(err.message || 'Passkey login failed')
    } finally {
      setPasskeyLoading(false)
    }
  }

  const handlePasskeyEnroll = async () => {
    if (!identifier.trim() || !password) {
      setError('Enter your email/Agent ID and password to set up a passkey.')
      return
    }
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      setError('Passkeys are not supported on this device/browser.')
      return
    }
    setError('')
    setEnrollLoading(true)
    setSuppressRedirect(true)
    try {
      const loginRes = await apiRequest('/auth/login', {
        method: 'POST',
        body: { identifier, password },
      })
      const optionsRes = await apiRequest('/auth/passkey/registration/options', {
        method: 'POST',
        token: loginRes.token,
      })
      if (!optionsRes?.options?.challenge) {
        throw new Error('Passkey setup failed. Please refresh and try again.')
      }
      const credential = await startRegistration(optionsRes.options)
      await apiRequest('/auth/passkey/registration/verify', {
        method: 'POST',
        token: loginRes.token,
        body: { credential },
      })
      saveSession(loginRes.user, loginRes.token, { remember: rememberMe })
      const onboardingCompleted = loginRes?.user?.profile?.onboarding_completed === true || String(loginRes?.user?.profile?.onboarding_completed || '').toLowerCase() === 'true'
      navigate(onboardingCompleted ? (redirectTo || getRoleHome(loginRes.user.role)) : '/onboarding', { replace: true })
    } catch (err) {
      setError(err.message || 'Passkey setup failed')
    } finally {
      setEnrollLoading(false)
      setSuppressRedirect(false)
    }
  }

  return (
    // Page wrapper: centers the login panel and applies the current "neo/cyberpunk" base style utilities.
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
      {/* Login card container (max width keeps form readable). */}
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60 dark:bg-slate-900/70 dark:shadow-none dark:ring-white/10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Login</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>
          </div>
          <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-transparent px-2 py-1 rounded-none" />
        </div>

        {/* Controlled form: React state is the single source of truth for inputs. */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">Email or Agent ID</label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              type="text"
              required
              placeholder="Enter your email or Agent ID"
              className="w-full rounded-lg shadow-borderless dark:shadow-borderlessDark px-4 py-3 bg-white text-slate-900 dark:bg-[#0b1224] dark:text-slate-100"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Agents: Use your assigned Agent ID to login</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">Password</label>
            {/* Password is required; actual auth validation happens server-side. */}
            <div className="flex items-center gap-2 rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-2 bg-white dark:bg-[#0b1224] focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={passwordVisible ? 'text' : 'password'}
                required
                className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={rememberPasskeyUser}
                onChange={(e) => setRememberPasskeyUser(e.target.checked)}
              />
              Remember passkey user
            </label>
            {passkeyHint ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Passkey: <span className="font-semibold">{passkeyHint.passkey_name || 'Passkey'}</span>
                {passkeyHint.user_name ? ` · ${passkeyHint.user_name}` : ''}
                {passkeyHint.user_email ? ` (${passkeyHint.user_email})` : ''}
              </p>
            ) : null}
          </div>

          {/* Inline error (only renders when there is an error string). */}
          {error ? <p className="text-sm text-red-500 dark:text-rose-300">{error}</p> : null}

          {/* Primary CTA: uses brand blue color */}
          <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-(--gt-blue) hover:bg-(--gt-blue-hover) text-white disabled:opacity-70 transition">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading}
            className="w-full px-4 py-3 rounded-lg shadow-borderless dark:shadow-borderlessDark text-slate-700 dark:text-slate-100 disabled:opacity-70"
          >
            {passkeyLoading ? 'Opening passkey...' : 'Sign in with passkey'}
          </button>
          <button
            type="button"
            onClick={handlePasskeyEnroll}
            disabled={enrollLoading}
            className="w-full px-4 py-3 rounded-lg shadow-borderless dark:shadow-borderlessDark text-slate-700 dark:text-slate-100 disabled:opacity-70"
          >
            {enrollLoading ? 'Setting up passkey...' : 'Set up passkey (first time)'}
          </button>
          <p className="mt-6 text-sm text-gray-600 dark:text-slate-300">
            New here* <Link className="text-(--gt-blue) hover:underline" to="/signup">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
