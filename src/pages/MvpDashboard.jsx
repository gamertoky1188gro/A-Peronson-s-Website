import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const emptyRegistration = {
  company_name: '',
  email: '',
  password: '',
  role: 'buyer',
  profile: { country: '', categories: [], certifications: [], moq: '', lead_time_days: '' },
}

const emptyRequirement = {
  category: '',
  fabric_type: '',
  gsm: '',
  quantity: '',
  target_price: '',
  certifications_required: [],
  shipping_port: '',
  timeline_days: '',
}

function api(path, method = 'GET', token = null, body = null, isForm = false) {
  return fetch(`${API}${path}`, {
    method,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  })
}

export default function MvpDashboard() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('jwt')
    const user = localStorage.getItem('user')
    return { token, user: user ? JSON.parse(user) : null }
  })
  const [reg, setReg] = useState(emptyRegistration)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [requirement, setRequirement] = useState(emptyRequirement)
  const [requirements, setRequirements] = useState([])
  const [matches, setMatches] = useState([])
  const [inbox, setInbox] = useState({ priority: [], request_pool: [] })
  const [messageText, setMessageText] = useState('')
  const [selectedMatch, setSelectedMatch] = useState('')
  const [messages, setMessages] = useState([])
  const [adminUsers, setAdminUsers] = useState([])
  const [metrics, setMetrics] = useState([])
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  async function onRegister(e) {
    e.preventDefault()
    try {
      const payload = {
        ...reg,
        profile: {
          ...reg.profile,
          categories: reg.profile.categories.filter(Boolean),
          certifications: reg.profile.certifications.filter(Boolean),
        },
      }
      const data = await api('/auth/register', 'POST', null, payload)
      localStorage.setItem('jwt', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setAuth({ token: data.token, user: data.user })
      setFeedback('Registered and logged in.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function onLogin(e) {
    e.preventDefault()
    try {
      const data = await api('/auth/login', 'POST', null, loginData)
      localStorage.setItem('jwt', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setAuth({ token: data.token, user: data.user })
      setFeedback('Login success.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  function logout() {
    localStorage.removeItem('jwt')
    localStorage.removeItem('user')
    setAuth({ token: null, user: null })
    setFeedback('Logged out.')
  }

  async function postRequirement(e) {
    e.preventDefault()
    try {
      const payload = {
        ...requirement,
        certifications_required: requirement.certifications_required.filter(Boolean),
      }
      const data = await api('/requirements', 'POST', auth.token, payload)
      setFeedback(`Requirement posted. Matches found: ${data.matches.length}`)
      setRequirement(emptyRequirement)
      await loadRequirements()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function loadRequirements() {
    try {
      const data = await api('/requirements', 'GET', auth.token)
      setRequirements(data)
      setFeedback(`Loaded ${data.length} requirements.`)
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function loadMatches(requirementId) {
    try {
      const data = await api(`/requirements/${requirementId}/matches`, 'GET', auth.token)
      setMatches(data)
      setFeedback(`Loaded ${data.length} matches.`)
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function loadInbox() {
    try {
      const data = await api('/messages/inbox', 'GET', auth.token)
      setInbox(data)
      setFeedback('Inbox loaded.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    try {
      await api(`/messages/${selectedMatch}`, 'POST', auth.token, { message: messageText, type: 'text' })
      setMessageText('')
      await viewMessages(selectedMatch)
      setFeedback('Message sent.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function viewMessages(matchId) {
    try {
      const data = await api(`/messages/${matchId}`, 'GET', auth.token)
      setMessages(data)
      setSelectedMatch(matchId)
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function uploadDoc(file, type = 'contract') {
    if (!file || !selectedMatch) return
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      await api(`/documents/${selectedMatch}`, 'POST', auth.token, fd, true)
      setFeedback('Document uploaded.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function loadAdmin() {
    try {
      const users = await api('/users', 'GET', auth.token)
      const metricRows = await api('/admin/metrics', 'GET', auth.token)
      setAdminUsers(users)
      setMetrics(metricRows)
      setFeedback('Admin data loaded.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function verifyUser(userId, verified) {
    try {
      await api(`/users/${userId}/verify`, 'PATCH', auth.token, { verified })
      await loadAdmin()
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Cross-Border B2B Textile Trust Platform (MVP)</h1>
        <div className="top-actions">
          <button onClick={() => setDark(!dark)}>{dark ? '🌙 Dark' : '☀️ Light'}</button>
          {auth.user ? <button onClick={logout}>Logout</button> : null}
        </div>
      </header>

      <p className="feedback">{feedback}</p>

      {!auth.user ? (
        <section className="grid two-col">
          <form onSubmit={onRegister} className="card">
            <h2>Register</h2>
            <input placeholder="Company Name" value={reg.company_name} onChange={(e) => setReg({ ...reg, company_name: e.target.value })} required />
            <input placeholder="Email" type="email" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} required />
            <input placeholder="Password" type="password" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} required />
            <select value={reg.role} onChange={(e) => setReg({ ...reg, role: e.target.value })}>
              <option value="buyer">Buyer</option><option value="factory">Factory</option><option value="buying_house">Buying House</option><option value="admin">Admin</option>
            </select>
            <input placeholder="Country" value={reg.profile.country} onChange={(e) => setReg({ ...reg, profile: { ...reg.profile, country: e.target.value } })} />
            <input placeholder="Factory Categories (comma separated)" onChange={(e) => setReg({ ...reg, profile: { ...reg.profile, categories: e.target.value.split(',').map((x) => x.trim()) } })} />
            <input placeholder="Certifications (comma separated)" onChange={(e) => setReg({ ...reg, profile: { ...reg.profile, certifications: e.target.value.split(',').map((x) => x.trim()) } })} />
            <input placeholder="MOQ" value={reg.profile.moq} onChange={(e) => setReg({ ...reg, profile: { ...reg.profile, moq: e.target.value } })} />
            <input placeholder="Lead Time Days" value={reg.profile.lead_time_days} onChange={(e) => setReg({ ...reg, profile: { ...reg.profile, lead_time_days: e.target.value } })} />
            <button type="submit">Create account</button>
          </form>

          <form onSubmit={onLogin} className="card">
            <h2>Login</h2>
            <input placeholder="Email" type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
            <input placeholder="Password" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
            <button type="submit">Login</button>
          </form>
        </section>
      ) : (
        <main className="grid two-col">
          <section className="card">
            <h2>My Account</h2>
            <p><strong>{auth.user.company_name}</strong> ({auth.user.role})</p>
            <p>Status: {auth.user.verified ? 'Verified' : 'Unverified'}</p>
          </section>

          {auth.user.role === 'buyer' ? (
            <section className="card">
              <h2>Create Requirement</h2>
              <form onSubmit={postRequirement} className="stack">
                <input placeholder="Category" value={requirement.category} onChange={(e) => setRequirement({ ...requirement, category: e.target.value })} required />
                <input placeholder="Fabric Type" value={requirement.fabric_type} onChange={(e) => setRequirement({ ...requirement, fabric_type: e.target.value })} required />
                <input placeholder="GSM" value={requirement.gsm} onChange={(e) => setRequirement({ ...requirement, gsm: e.target.value })} />
                <input placeholder="Quantity" value={requirement.quantity} onChange={(e) => setRequirement({ ...requirement, quantity: e.target.value })} required />
                <input placeholder="Target Price" value={requirement.target_price} onChange={(e) => setRequirement({ ...requirement, target_price: e.target.value })} />
                <input placeholder="Certifications (comma separated)" onChange={(e) => setRequirement({ ...requirement, certifications_required: e.target.value.split(',').map((x) => x.trim()) })} />
                <input placeholder="Shipping Port" value={requirement.shipping_port} onChange={(e) => setRequirement({ ...requirement, shipping_port: e.target.value })} />
                <input placeholder="Timeline Days" value={requirement.timeline_days} onChange={(e) => setRequirement({ ...requirement, timeline_days: e.target.value })} />
                <button type="submit">Post & Match</button>
              </form>
            </section>
          ) : (
            <section className="card"><h2>Factory/Buying House Dashboard</h2><p>Use inbox and matches to negotiate verified opportunities.</p></section>
          )}

          <section className="card">
            <h2>Requirements & Matches</h2>
            <button onClick={loadRequirements}>Load Requirements</button>
            <ul>
              {requirements.map((r) => (
                <li key={r.id}>
                  <strong>{r.category}</strong> · Qty {r.quantity} · {r.status}
                  <button onClick={() => loadMatches(r.id)}>View Matches</button>
                </li>
              ))}
            </ul>
            <ul>
              {matches.map((m) => {
                const key = `${m.requirement_id}:${m.factory_id}`
                return (
                  <li key={key}>
                    Factory {m.factory_id.slice(0, 8)} · Score {m.score} · {m.status}
                    <button onClick={() => setSelectedMatch(key)}>Select</button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="card">
            <h2>Negotiation Dashboard</h2>
            <button onClick={loadInbox}>Load Tiered Inbox</button>
            <p>Priority: {inbox.priority.length} | Request Pool: {inbox.request_pool.length}</p>
            <form onSubmit={sendMessage} className="stack">
              <input placeholder="Selected Match ID (req:factory)" value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)} required />
              <textarea placeholder="Send structured negotiation message" value={messageText} onChange={(e) => setMessageText(e.target.value)} required />
              <button type="submit">Send Message</button>
            </form>
            <input type="file" accept="application/pdf" onChange={(e) => uploadDoc(e.target.files?.[0])} />
            <button onClick={() => viewMessages(selectedMatch)} disabled={!selectedMatch}>Refresh Conversation</button>
            <ul>
              {messages.map((m) => <li key={m.id}>{m.timestamp}: {m.message}</li>)}
            </ul>
          </section>

          {auth.user.role === 'admin' ? (
            <section className="card full">
              <h2>Admin Panel</h2>
              <button onClick={loadAdmin}>Load Admin Data</button>
              <h3>Users</h3>
              <ul>
                {adminUsers.map((u) => (
                  <li key={u.id}>
                    {u.company_name} ({u.role}) · {u.verified ? 'verified' : 'unverified'}
                    {!u.verified ? <button onClick={() => verifyUser(u.id, true)}>Verify</button> : null}
                  </li>
                ))}
              </ul>
              <h3>Conversion Transitions</h3>
              <ul>{metrics.map((m) => <li key={m.id}>{m.requirement_id}: {m.to_status}</li>)}</ul>
            </section>
          ) : null}
        </main>
      )}
    </div>
  )
}
