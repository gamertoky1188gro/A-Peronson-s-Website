import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, getRoleHome, saveSession } from '../../lib/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    country: '',
    organization: '',
  })

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        company_name: form.organization,
        profile: { country: form.country },
      }

      const data = await apiRequest('/auth/register', { method: 'POST', body: payload })
      saveSession(data.user, data.token)
      navigate(getRoleHome(data.user.role), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white neo-panel cyberpunk-card rounded-xl p-8">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">3-step onboarding starts after signup: profile image, organization name, category selection.</p>

        <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 py-3 border rounded-lg" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full px-4 py-3 border rounded-lg" value={form.password} onChange={(e) => onChange('password', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select className="w-full px-4 py-3 border rounded-lg" value={form.role} onChange={(e) => onChange('role', e.target.value)}>
              <option value="buyer">Buyer</option>
              <option value="factory">Factory</option>
              <option value="buying_house">Buying House</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.country} onChange={(e) => onChange('country', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Organization Name</label>
            <input className="w-full px-4 py-3 border rounded-lg" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>

          <div className="md:col-span-2 bg-gray-50 neo-panel cyberpunk-card border rounded-lg p-3 text-sm text-gray-700">
            <p><strong>Verification happens after signup.</strong> Create your account first, then upload role and region-specific documents in Verification Center.</p>
            <p className="mt-2">
              Need the full checklist?
              {' '}
              <Link to="/verification" className="text-indigo-700 underline">Go to Verification Center</Link>
              {' '}
              or
              {' '}
              <Link to="/help" className="text-indigo-700 underline">read Help Center guidance</Link>.
            </p>
          </div>

          {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}

          <div className="md:col-span-2 flex gap-3">
            <button disabled={loading} className="px-5 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <Link to="/login" className="px-5 py-3 rounded-lg border">Have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
