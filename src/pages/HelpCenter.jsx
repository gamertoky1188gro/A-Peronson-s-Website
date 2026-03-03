import React, { useCallback, useMemo, useState } from 'react'
import FloatingAssistant from '../components/FloatingAssistant'
import AccessDeniedState from '../components/AccessDeniedState'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

export default function HelpCenter(){
  const [q, setQ] = useState('')
  const [entries, setEntries] = useState([])
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState({ question: '', answer: '', keywords: '' })
  const [editingId, setEditingId] = useState('')
  const currentUser = useMemo(() => getCurrentUser(), [])
  const isOwnerAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin'

  const staticFaqs = [
    { q: 'How to create Buyer Request?', a: 'Use Buyer Request Management. Buyers can include normal fields plus custom requirement description.' },
    { q: 'How does smart notification work?', a: 'When you search products/requests, your query is saved as a search alert. New matching posts appear in Notifications.' },
    { q: 'How are verified and unverified messages handled?', a: 'Verified users are prioritized for direct inbox routing. Others can still send but remain in request flow.' },
    { q: 'How to manage contracts?', a: 'Use Contract Vault to store digitally signed contract files and track deal artifacts.' },
    { q: 'What verification documents are required?', a: 'Open Verification Center for your live checklist. Requirements are role and region-specific: factories submit business + compliance docs (e.g., trade license/TIN/ERC), buying houses submit agency docs, and buyers submit bank proof plus EU (VAT/EORI) or US (EIN/IOR) documents based on selected buyer country.' },
  ]

  const loadFaqs = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) return
      const data = await apiRequest('/assistant/knowledge', { token })
      setEntries((data.entries || []).filter((entry) => (entry.type || 'faq') === 'faq'))
      setFeedback('')
    } catch (err) {
      setFeedback(err.status === 403 ? 'Access denied' : err.message)
    }
  }, [])


  function selectForEdit(entry) {
    setEditingId(entry.id)
    setForm({
      question: entry.question || '',
      answer: entry.answer || '',
      keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : '',
    })
  }

  function resetForm() {
    setEditingId('')
    setForm({ question: '', answer: '', keywords: '' })
  }

  async function saveFaq(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) {
      setFeedback('Please login again to edit FAQ data')
      return
    }

    const payload = {
      type: 'faq',
      question: form.question,
      answer: form.answer,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    }

    try {
      if (editingId) {
        await apiRequest(`/assistant/knowledge/${editingId}`, { method: 'PUT', token, body: payload })
        setFeedback('FAQ entry updated')
      } else {
        await apiRequest('/assistant/knowledge', { method: 'POST', token, body: payload })
        setFeedback('FAQ entry added')
      }
      resetForm()
      await loadFaqs()
    } catch (err) {
      setFeedback(err.status === 403 ? 'Access denied' : err.message)
    }
  }

  async function removeFaq(entryId) {
    const token = getToken()
    if (!token) return
    try {
      await apiRequest(`/assistant/knowledge/${entryId}`, { method: 'DELETE', token })
      if (editingId === entryId) resetForm()
      setFeedback('FAQ entry removed')
      await loadFaqs()
    } catch (err) {
      setFeedback(err.status === 403 ? 'Access denied' : err.message)
    }
  }

  const access = [
    ['Public', '/, /pricing, /about, /terms, /privacy, /help, /login, /signup'],
    ['Any logged-in user', '/feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts, /notifications, /chat, /call'],
    ['Buyer + Buying House + Admin', '/buyer-requests'],
    ['Factory + Buying House + Admin', '/product-management, /partner-network'],
    ['Buying House + Factory + Admin', '/member-management, /org-settings'],
    ['Buying House + Admin', '/owner, /agent, /insights'],
  ]

  const faqs = [...entries.map((entry) => ({ q: entry.question, a: entry.answer, managed: true, id: entry.id })), ...staticFaqs]

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-2">Help Center</h1>
          <input placeholder="Search help topics..." value={q} onChange={(e)=>setQ(e.target.value)} className="w-full border px-3 py-2 rounded mb-4" />

          <div className="space-y-3 mb-6">
            {faqs.filter(f=>f.q.toLowerCase().includes(q.toLowerCase())).map((f,i)=> (
              <details key={f.id || i} className="bg-white neo-panel cyberpunk-card border rounded p-3">
                <summary className="font-semibold">{f.q}</summary>
                <p className="text-sm text-[#5A5A5A] mt-2">{f.a}</p>
              </details>
            ))}
          </div>

          {isOwnerAdmin ? (
            <section className="bg-white neo-panel cyberpunk-card border rounded p-4 mb-6">
              <div className="mb-3 flex items-center justify-between gap-2"><h2 className="text-lg font-semibold">Manage Help Center FAQ</h2><button type="button" onClick={loadFaqs} className="px-3 py-2 border rounded text-sm">Refresh FAQs</button></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <form onSubmit={saveFaq} className="border rounded p-3">
                  <label className="block text-sm">Question</label>
                  <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full border px-3 py-2 rounded mb-3" required />
                  <label className="block text-sm">Answer</label>
                  <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full border px-3 py-2 rounded mb-3 min-h-28" required />
                  <label className="block text-sm">Keywords (comma separated)</label>
                  <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full border px-3 py-2 rounded mb-3" />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="px-3 py-2 bg-[#0A66C2] text-white rounded">{editingId ? 'Update' : 'Save'} FAQ</button>
                    {editingId && <button type="button" onClick={resetForm} className="px-3 py-2 border rounded">Cancel</button>}
                  </div>
                </form>

                <div className="border rounded p-3 max-h-80 overflow-auto">
                  <h3 className="font-semibold mb-2">Managed FAQs ({entries.length})</h3>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div key={entry.id} className="border rounded p-2">
                        <p className="font-semibold">{entry.question}</p>
                        <p className="text-sm text-[#5A5A5A]">{entry.answer}</p>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => selectForEdit(entry)} className="px-2 py-1 text-xs border rounded">Edit</button>
                          <button onClick={() => removeFaq(entry.id)} className="px-2 py-1 text-xs border rounded text-red-600">Delete</button>
                        </div>
                      </div>
                    ))}
                    {!entries.length && <p className="text-sm text-[#5A5A5A]">No managed FAQs yet.</p>}
                  </div>
                </div>
              </div>
              {feedback && <p className="mt-3 text-sm text-[#5A5A5A]">{feedback}</p>}
            </section>
          ) : (
            <AccessDeniedState message="Only owners and admins can edit Help Center FAQ data." />
          )}

          <section className="bg-white neo-panel cyberpunk-card border rounded p-4">
            <h2 className="text-lg font-semibold mb-3">Page access matrix</h2>
            <div className="space-y-2 text-sm">
              {access.map(([role, pages]) => (
                <div key={role} className="grid grid-cols-12 gap-2 border-b border-white/10 pb-2">
                  <div className="col-span-4 font-semibold">{role}</div>
                  <div className="col-span-8">{pages}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside>
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
            <h4 className="font-semibold">Floating Assistant</h4>
            <p className="text-sm text-[#5A5A5A]">Available on all pages to help with setup, settings and quick workflow guidance.</p>
          </div>
        </aside>
      </div>

      <FloatingAssistant />
    </div>
  )
}
