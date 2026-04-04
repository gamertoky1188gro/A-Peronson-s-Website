import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom'
import { apiRequest, getRoleHome, saveSession } from '../../lib/auth'

export default function SignupUltra() {
  const { time, date } = useParams()
  const navigate = useNavigate()
  
  // Validation Logic
  const isAuthorized = useMemo(() => {
    const now = new Date()
    
    // Check Date (DD:MM:YY)
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear()).slice(-2)
    const expectedDate = `${day}:${month}:${year}`
    
    if (date !== expectedDate) return false

    // Check Time (HH:MM) - allow 2 minute window
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes()
    
    const [h, m] = (time || "").split(':').map(Number)
    if (isNaN(h) || isNaN(m)) return false
    
    const inputTotalMinutes = h * 60 + m
    const diff = Math.abs(currentTotalMinutes - inputTotalMinutes)
    
    return diff <= 2 // 2 minute tolerance
  }, [time, date])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    country: '',
    organization: '',
  })

  if (!isAuthorized) {
    return <Navigate to="/" replace />
  }

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
    <div className="min-h-screen neo-page cyberpunk-page bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white neo-panel cyberpunk-card rounded-xl p-8 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Ultra Access</span>
          <h1 className="text-3xl font-bold text-slate-900">Elevated Registration</h1>
        </div>
        <p className="text-sm text-slate-500">Authorized personnel only. Create Admin, Agent, or Owner accounts directly.</p>

        <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors borderless-shadow" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Secret Email</label>
            <input type="email" className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors borderless-shadow" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Master Password</label>
            <input type="password" placeholder="--------" className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors borderless-shadow" value={form.password} onChange={(e) => onChange('password', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Elevated Role</label>
            <select className="w-full px-4 py-2.5 rounded-lg outline-none bg-white transition-colors borderless-shadow" value={form.role} onChange={(e) => onChange('role', e.target.value)}>
              <option value="admin">Administrator</option>
              <option value="owner">System Owner</option>
              <option value="agent">Operational Agent</option>
              <option value="buying_house">Buying House (Root)</option>
              <option value="factory">Factory (Root)</option>
              <option value="buyer">Buyer (Root)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">HQ Country</label>
            <input className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors borderless-shadow" value={form.country} onChange={(e) => onChange('country', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Organization / Entity</label>
            <input className="w-full px-4 py-2.5 rounded-lg outline-none transition-colors borderless-shadow" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
          </div>

          <div className="md:col-span-2 bg-indigo-50 rounded-xl p-4 text-xs text-indigo-900 leading-relaxed borderless-shadow">
            <p className="font-bold mb-1 underline">⚠️ Security Notice:</p>
            <p>Admin and Owner accounts are automatically granted full system verification and override capabilities. All actions performed through this terminal are logged for security auditing. High-level accounts must maintain 2FA after initial login.</p>
          </div>

          {error ? <p className="md:col-span-2 text-sm font-bold text-rose-600 bg-rose-50 p-2 rounded borderless-shadow">Auth Error: {error}</p> : null}

          <div className="md:col-span-2 pt-2">
            <button 
              disabled={loading} 
              className="w-full py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'INITIALIZING ACCOUNT...' : 'PROVISION ACCOUNT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

