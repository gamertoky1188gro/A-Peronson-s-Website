import { useEffect, useMemo, useState } from 'react'
import FloatingAssistant from '../components/FloatingAssistant'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function api(path, method = 'GET', token = '', body = null, isForm = false) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export default function MvpDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('jwt') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [feedback, setFeedback] = useState('')

  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'buyer' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const [onboarding, setOnboarding] = useState({ profile_image: '', organization_name: '', categories: 'Shirts' })
  const [requestForm, setRequestForm] = useState({ category: '', quantity: '', price_range: '', material: '', timeline_days: '', certifications_required: '', shipping_terms: '', custom_description: '' })
  const [productForm, setProductForm] = useState({ title: '', category: 'Shirts', material: '', moq: '', lead_time_days: '', description: '', video_url: '' })

  const [unique, setUnique] = useState(false)
  const [feedType, setFeedType] = useState('all')
  const [feed, setFeed] = useState({ tags: [], items: [] })

  const [verificationStatus, setVerificationStatus] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  const [assistantQuestion, setAssistantQuestion] = useState('')
  const [assistantResponse, setAssistantResponse] = useState('')

  const [claimRequestId, setClaimRequestId] = useState('')
  const [grantRequestId, setGrantRequestId] = useState('')
  const [targetAgentId, setTargetAgentId] = useState('')

  useEffect(() => {
    if (token) localStorage.setItem('jwt', token)
    else localStorage.removeItem('jwt')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const canManageOrg = useMemo(() => user && (user.role === 'admin' || user.role === 'buying_house'), [user])

  async function register(e) {
    e.preventDefault()
    try {
      const data = await api('/auth/register', 'POST', '', registerForm)
      setToken(data.token)
      setUser(data.user)
      setFeedback('Registered')
    } catch (err) { setFeedback(err.message) }
  }

  async function login(e) {
    e.preventDefault()
    try {
      const data = await api('/auth/login', 'POST', '', loginForm)
      setToken(data.token)
      setUser(data.user)
      setFeedback('Logged in')
    } catch (err) { setFeedback(err.message) }
  }

  function logout() { setToken(''); setUser(null); setFeedback('Logged out') }

  async function completeOnboarding(e) {
    e.preventDefault()
    try {
      await api('/onboarding', 'POST', token, { ...onboarding, categories: onboarding.categories.split(',').map((x) => x.trim()).filter(Boolean) })
      setFeedback('Onboarding completed (3 steps saved)')
    } catch (err) { setFeedback(err.message) }
  }

  async function createRequest(e) {
    e.preventDefault()
    try {
      await api('/requirements', 'POST', token, { ...requestForm, certifications_required: requestForm.certifications_required.split(',').map((x) => x.trim()).filter(Boolean) })
      setFeedback('Buyer request posted')
      await loadFeed()
    } catch (err) { setFeedback(err.message) }
  }

  async function createProduct(e) {
    e.preventDefault()
    try {
      await api('/products', 'POST', token, productForm)
      setFeedback('Company product posted')
      await loadFeed()
    } catch (err) { setFeedback(err.message) }
  }

  async function loadFeed() {
    try {
      const data = await api(`/feed?unique=${unique}&type=${feedType}`, 'GET', token)
      setFeed(data)
    } catch (err) { setFeedback(err.message) }
  }

  async function submitVerification() {
    try {
      const data = await api('/verification/me', 'POST', token, {
        documents: {
          company_registration: 'submitted',
          trade_license: 'submitted',
          tin_or_ein: 'submitted',
          authorized_person_nid: 'submitted',
          bank_proof: 'submitted',
          erc_or_eori: 'submitted',
        },
      })
      setVerificationStatus(data)
      setFeedback('Verification submitted')
    } catch (err) { setFeedback(err.message) }
  }

  async function refreshStatus() {
    try {
      const [v, s, a] = await Promise.all([
        api('/verification/me', 'GET', token),
        api('/subscriptions/me', 'GET', token),
        api('/analytics/summary', 'GET', token),
      ])
      setVerificationStatus(v)
      setSubscription(s)
      setAnalytics(a)
    } catch (err) { setFeedback(err.message) }
  }

  async function askAssistant(e) {
    e.preventDefault()
    try {
      const res = await api('/assistant/ask', 'POST', token, { question: assistantQuestion })
      setAssistantResponse(`${res.mode}: ${res.message}`)
    } catch (err) { setFeedback(err.message) }
  }

  async function claimConversation() {
    try {
      const r = await api(`/conversations/${claimRequestId}/claim`, 'POST', token)
      setFeedback(`Conversation ${r.status}`)
    } catch (err) { setFeedback(err.message) }
  }

  async function grantConversation() {
    try {
      await api(`/conversations/${grantRequestId}/grant`, 'POST', token, { target_agent_id: targetAgentId })
      setFeedback('Access granted')
    } catch (err) { setFeedback(err.message) }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>GarTexHub Enterprise UX MVP</h1>
          <p className="feedback">Behavioral architecture for trust-first B2B textile commerce.</p>
        </div>
        {user ? <button onClick={logout}>Logout</button> : null}
      </header>

      <p className="feedback">{feedback}</p>

      {!user ? (
        <section className="grid two-col">
          <form className="card stack" onSubmit={register}>
            <h2>Register</h2>
            <input placeholder="Name" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} required />
            <input placeholder="Email" type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
            <input placeholder="Password" type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
            <select value={registerForm.role} onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}>
              <option value="buyer">Buyer</option><option value="factory">Factory</option><option value="buying_house">Buying House</option><option value="admin">Admin</option>
            </select>
            <button type="submit">Create Account</button>
          </form>
          <form className="card stack" onSubmit={login}>
            <h2>Login</h2>
            <input placeholder="Email" type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
            <input placeholder="Password" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
            <button type="submit">Login</button>
          </form>
        </section>
      ) : (
        <main className="grid two-col">
          <section className="card stack">
            <h2>Onboarding (3 Steps)</h2>
            <form onSubmit={completeOnboarding} className="stack">
              <input placeholder="1) Profile Image URL" value={onboarding.profile_image} onChange={(e) => setOnboarding({ ...onboarding, profile_image: e.target.value })} />
              <input placeholder="2) Organization Name" value={onboarding.organization_name} onChange={(e) => setOnboarding({ ...onboarding, organization_name: e.target.value })} />
              <input placeholder="3) Category Selection (comma separated)" value={onboarding.categories} onChange={(e) => setOnboarding({ ...onboarding, categories: e.target.value })} />
              <button type="submit">Save Onboarding</button>
            </form>
            <p>Role: <strong>{user.role}</strong> | Verified badge: {user.verified ? '🔵 Blue Safe' : 'Unverified'}</p>
            <button onClick={submitVerification}>Submit Verification Bundle</button>
            <button onClick={refreshStatus}>Refresh Verification / Subscription / Analytics</button>
            <p>Subscription: {subscription ? `${subscription.plan}` : 'N/A'}</p>
            <p>Verification Missing: {(verificationStatus?.missing_required || []).join(', ') || 'none'}</p>
            <p>Analytics events: {analytics?.total_events ?? 0}</p>
          </section>

          {user.role === 'buyer' ? (
            <section className="card stack">
              <h2>Post Buyer Request</h2>
              <form onSubmit={createRequest} className="stack">
                <input placeholder="Category" value={requestForm.category} onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })} required />
                <input placeholder="Quantity" value={requestForm.quantity} onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })} required />
                <input placeholder="Price Range" value={requestForm.price_range} onChange={(e) => setRequestForm({ ...requestForm, price_range: e.target.value })} required />
                <input placeholder="Material" value={requestForm.material} onChange={(e) => setRequestForm({ ...requestForm, material: e.target.value })} required />
                <input placeholder="Timeline Days" value={requestForm.timeline_days} onChange={(e) => setRequestForm({ ...requestForm, timeline_days: e.target.value })} required />
                <input placeholder="Certifications (comma separated)" value={requestForm.certifications_required} onChange={(e) => setRequestForm({ ...requestForm, certifications_required: e.target.value })} />
                <input placeholder="Shipping Terms" value={requestForm.shipping_terms} onChange={(e) => setRequestForm({ ...requestForm, shipping_terms: e.target.value })} required />
                <textarea placeholder="Custom Description" value={requestForm.custom_description} onChange={(e) => setRequestForm({ ...requestForm, custom_description: e.target.value })} />
                <button type="submit">Publish Request</button>
              </form>
            </section>
          ) : (
            <section className="card stack">
              <h2>Post Company Product</h2>
              <form onSubmit={createProduct} className="stack">
                <input placeholder="Title" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
                <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                  <option>Shirts</option><option>Knitwear</option><option>Denim</option><option>Women</option><option>Kids</option>
                </select>
                <input placeholder="Material" value={productForm.material} onChange={(e) => setProductForm({ ...productForm, material: e.target.value })} required />
                <input placeholder="MOQ" value={productForm.moq} onChange={(e) => setProductForm({ ...productForm, moq: e.target.value })} />
                <input placeholder="Lead Time Days" value={productForm.lead_time_days} onChange={(e) => setProductForm({ ...productForm, lead_time_days: e.target.value })} />
                <textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                <input placeholder="Video URL (for gallery/reels)" value={productForm.video_url} onChange={(e) => setProductForm({ ...productForm, video_url: e.target.value })} />
                <button type="submit">Publish Product</button>
              </form>
            </section>
          )}

          <section className="card full stack">
            <h2>Combined Feed (Buyer Requests + Company Products)</h2>
            <div className="top-actions">
              <label><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> Unique Toggle</label>
              <select value={feedType} onChange={(e) => setFeedType(e.target.value)}>
                <option value="all">All</option><option value="requests">Buyer Requests</option><option value="products">Company Products</option>
              </select>
              <button onClick={loadFeed}>Load Feed</button>
            </div>
            <p>Tags: {(feed.tags || []).join(', ')}</p>
            <ul>
              {(feed.items || []).map((item) => (
                <li key={item.id}>{item.icon} <strong>{item.feed_type}</strong> | {item.category} | {item.custom_description || item.description || item.title}</li>
              ))}
            </ul>
          </section>

          <section className="card stack">
            <h2>Conversation Lock</h2>
            <input placeholder="Request ID to claim" value={claimRequestId} onChange={(e) => setClaimRequestId(e.target.value)} />
            <button onClick={claimConversation}>Start Conversation / Claim & Respond</button>
            {canManageOrg ? (
              <>
                <input placeholder="Request ID to grant" value={grantRequestId} onChange={(e) => setGrantRequestId(e.target.value)} />
                <input placeholder="Target Agent User ID" value={targetAgentId} onChange={(e) => setTargetAgentId(e.target.value)} />
                <button onClick={grantConversation}>Grant Access</button>
              </>
            ) : null}
          </section>

          <section className="card stack">
            <h2>Rule-Based AI Guidance</h2>
            <form onSubmit={askAssistant} className="stack">
              <input placeholder="Ask about setup, verification, premium, help" value={assistantQuestion} onChange={(e) => setAssistantQuestion(e.target.value)} />
              <button type="submit">Ask Assistant</button>
            </form>
            <p>{assistantResponse}</p>
          </section>
        </main>
      )}

      <FloatingAssistant />
    </div>
  )
}
