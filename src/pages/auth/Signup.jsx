/*
  Route: /signup
  Access: Public

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Purpose:
    - Register a new account (Buyer / Factory / Buying House).
    - Immediately create a session and route the user to the correct role home.

  Key API:
    - POST /api/auth/register (via `apiRequest('/auth/register')`)

  Notes:
    - This file currently uses legacy `neo-page` / `cyberpunk-card` styles.
      We are only adding comments, not altering visuals or behavior.
*/
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, getCurrentUser, getRoleHome, saveSession } from '../../lib/auth'
import { BUYER_COUNTRY_OPTIONS } from '../../../shared/config/geo.js'

export default function Signup() {
  // Router navigation after successful account creation.
  const navigate = useNavigate()
  const existingUser = getCurrentUser()
  // UX state for async submit + error display.
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Controlled form model (single object keeps submission payload building simple).
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    primaryRole: 'buyer',
    country: '',
    organization: '',
  })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  // Generic onChange helper so each input doesn't need its own setter function.
  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  useEffect(() => {
    if (!existingUser?.role) return
    navigate(getRoleHome(existingUser.role), { replace: true })
  }, [existingUser?.role, navigate])

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/', { replace: true })
  }

  // Submit handler: builds backend payload, calls register endpoint, and saves session.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (form.password !== form.confirmPassword) {
      setLoading(false)
      setError('Passwords do not match.')
      return
    }
    try {
      // Backend expects a slightly different field naming; map UI fields -> API fields here.
      const resolvedRole = form.primaryRole
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: resolvedRole,
        company_name: form.organization,
        profile: { country: form.country },
      }

      // Create the account on the server.
      const data = await apiRequest('/auth/register', { method: 'POST', body: payload })
      // Persist session immediately so user can access protected routes right away.
      saveSession(data.user, data.token)
      // project.md: onboarding wizard runs right after signup to reduce complexity.
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Page wrapper: centers the signup card and applies legacy base styles.
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">A clean, professional start for Garments and Textile sourcing teams.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]">GarTexHub</div>
            <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
              Back
            </button>
          </div>
        </div>
        <div className="mt-3 sm:hidden">
          <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
            Back
          </button>
        </div>

        <form className="mt-8 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
            <input className="w-full px-4 py-3 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
            <input type="email" className="w-full px-4 py-3 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="w-full bg-transparent outline-none"
                value={form.password}
                onChange={(e) => onChange('password', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="text-xs font-semibold text-slate-500"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Confirm Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
              <input
                type={confirmVisible ? 'text' : 'password'}
                className="w-full bg-transparent outline-none"
                value={form.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setConfirmVisible((prev) => !prev)}
                className="text-xs font-semibold text-slate-500"
              >
                {confirmVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-slate-700">Account Type</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { value: 'buyer', label: 'Buyer' },
                { value: 'factory', label: 'Factory' },
                { value: 'buying_house', label: 'Buying House' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange('primaryRole', option.value)}
                  className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                    form.primaryRole === option.value
                      ? 'border-[#0A66C2] bg-blue-50 text-[#0A66C2]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Country</label>
            <input
              list="country-options"
              className="w-full px-4 py-3 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20"
              value={form.country}
              onChange={(e) => onChange('country', e.target.value)}
              required
            />
            <datalist id="country-options">
              {BUYER_COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Organization Name</label>
            <input className="w-full px-4 py-3 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>
          {/* API error state (e.g. email already used). */}
          {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}

          {/* Footer actions: primary submit + link to login. */}
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <Link
              to="/login"
              className="px-5 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:bg-slate-900/60"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
