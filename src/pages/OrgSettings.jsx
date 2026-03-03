import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'
import { apiRequest, getToken } from '../lib/auth'

const emptyFaq = { question: '', answer: '', keywords: '' }

export default function OrgSettings(){
  const [tab, setTab] = useState('general')
  const [isOwnerAdmin] = useState(true)
  const [remainingDays, setRemainingDays] = useState(4)
  const [entries, setEntries] = useState([])
  const [faqForm, setFaqForm] = useState(emptyFaq)
  const [editingId, setEditingId] = useState('')
  const [faqFeedback, setFaqFeedback] = useState('')

  const verificationStatus = useMemo(() => {
    if (remainingDays <= 0) return 'expired'
    if (remainingDays <= 7) return 'expiring_soon'
    return 'verified_active'
  }, [remainingDays])

  const loadFaqs = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) return
      const data = await apiRequest('/assistant/knowledge', { token })
      setEntries(data.entries || [])
      setFaqFeedback('')
    } catch (err) {
      setFaqFeedback(err.message)
    }
  }, [])

  function resetForm() {
    setFaqForm(emptyFaq)
    setEditingId('')
  }

  function selectForEdit(entry) {
    setEditingId(entry.id)
    setFaqForm({
      question: entry.question || '',
      answer: entry.answer || '',
      keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : '',
    })
  }

  async function saveFaq(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) {
      setFaqFeedback('Please login again to edit assistant knowledge')
      return
    }

    const payload = {
      question: faqForm.question,
      answer: faqForm.answer,
      keywords: faqForm.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    }

    try {
      if (editingId) {
        await apiRequest(`/assistant/knowledge/${editingId}`, { method: 'PUT', token, body: payload })
        setFaqFeedback('FAQ entry updated')
      } else {
        await apiRequest('/assistant/knowledge', { method: 'POST', token, body: payload })
        setFaqFeedback('FAQ entry added')
      }
      resetForm()
      await loadFaqs()
    } catch (err) {
      setFaqFeedback(err.message)
    }
  }

  async function removeFaq(entryId) {
    const token = getToken()
    if (!token) return
    try {
      await apiRequest(`/assistant/knowledge/${entryId}`, { method: 'DELETE', token })
      if (editingId === entryId) resetForm()
      setFaqFeedback('FAQ entry removed')
      await loadFaqs()
    } catch (err) {
      setFaqFeedback(err.message)
    }
  }

  const statusChipClasses = {
    verified_active: 'bg-green-100 text-green-700',
    expiring_soon: 'bg-amber-100 text-amber-700',
    expired: 'bg-red-100 text-red-700',
  }

  const statusLabel = {
    verified_active: 'Verified active',
    expiring_soon: 'Expiring soon',
    expired: 'Expired (renew to restore badge)',
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Organization Settings</h1>
            <p className="text-sm text-[#5A5A5A]">Manage organization profile, verification, branding, security and subscription</p>
          </div>
        </div>

        <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
          <div className="flex gap-4 border-b mb-4 flex-wrap">
            <button onClick={()=>setTab('general')} className={`px-3 py-2 ${tab==='general'?'border-b-2 border-[#0A66C2]':''}`}>General Info</button>
            <button onClick={()=>setTab('verification')} className={`px-3 py-2 ${tab==='verification'?'border-b-2 border-[#0A66C2]':''}`}>Verification</button>
            <button onClick={()=>setTab('branding')} className={`px-3 py-2 ${tab==='branding'?'border-b-2 border-[#0A66C2]':''}`}>Branding</button>
            <button onClick={()=>setTab('security')} className={`px-3 py-2 ${tab==='security'?'border-b-2 border-[#0A66C2]':''}`}>Security</button>
            <button onClick={()=>setTab('members')} className={`px-3 py-2 ${tab==='members'?'border-b-2 border-[#0A66C2]':''}`}>Members</button>
            <button onClick={()=>setTab('subscription')} className={`px-3 py-2 ${tab==='subscription'?'border-b-2 border-[#0A66C2]':''}`}>Subscription</button>
            <button onClick={()=> { setTab('assistant_faq'); loadFaqs() }} className={`px-3 py-2 ${tab==='assistant_faq'?'border-b-2 border-[#0A66C2]':''}`}>Assistant FAQ</button>
          </div>

          <div>
            {tab === 'general' && (
              <div>
                <label className="block text-sm">Organization Name</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
                <label className="block text-sm">Industry Category</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
                <label className="block text-sm">Registration Number</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
              </div>
            )}

            {tab === 'verification' && (
              <div>
                <p className="text-sm text-[#5A5A5A]">Upload trade license and certifications</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusChipClasses[verificationStatus]}`}>
                    {statusLabel[verificationStatus]}
                  </span>
                  <span className="text-xs text-[#5A5A5A]">{Math.max(0, remainingDays)} day(s) remaining</span>
                </div>
                <p className="mt-2 text-xs text-[#5A5A5A]">Verification is subscription-based, not permanent. Keep premium active to keep the badge visible.</p>
                <div className="mt-3">
                  <button className="px-3 py-2 border rounded">Upload Trade License</button>
                  <button className="px-3 py-2 border rounded ml-2">Upload ISO / WRAP</button>
                </div>
              </div>
            )}

            {tab !== 'general' && !isOwnerAdmin && (
              <div className="p-4 bg-yellow-50 border rounded mt-4">You do not have permission to view this section. Owner/Admin access required.</div>
            )}

            {tab === 'branding' && (
              <div>
                <label className="block text-sm">Primary Contact Email</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
                <label className="block text-sm">Support Contact Number</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
              </div>
            )}

            {tab === 'security' && (
              <div>
                <label className="flex items-center gap-3"><input type="checkbox"/> Enable 2FA</label>
                <div className="mt-3 text-sm text-[#5A5A5A]">Active sessions and login activity are shown here.</div>
              </div>
            )}

            {tab === 'members' && (
              <div>
                <Link to="/member-management" className="px-3 py-2 bg-[#0A66C2] text-white rounded">Open Member Management</Link>
              </div>
            )}

            {tab === 'subscription' && (
              <div>
                <div className="text-sm">Current Plan: Premium Monthly</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusChipClasses[verificationStatus]}`}>
                    {statusLabel[verificationStatus]}
                  </span>
                  <span className="text-xs text-[#5A5A5A]">Verification is subscription-based, not permanent.</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => setRemainingDays((d) => d + 30)} className="px-3 py-2 bg-[#0A66C2] text-white rounded">Renew premium monthly</button>
                  <span className="text-xs text-[#5A5A5A]">Remaining: {Math.max(0, remainingDays)} day(s)</span>
                </div>
              </div>
            )}

            {tab === 'assistant_faq' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <form onSubmit={saveFaq} className="border rounded p-4">
                  <h3 className="font-semibold mb-2">{editingId ? 'Edit FAQ Entry' : 'Add FAQ Entry'}</h3>
                  <label className="block text-sm">Question</label>
                  <input value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} className="w-full border px-3 py-2 rounded mb-3" required />
                  <label className="block text-sm">Answer</label>
                  <textarea value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} className="w-full border px-3 py-2 rounded mb-3 min-h-28" required />
                  <label className="block text-sm">Keywords (comma separated)</label>
                  <input value={faqForm.keywords} onChange={(e) => setFaqForm({ ...faqForm, keywords: e.target.value })} className="w-full border px-3 py-2 rounded mb-3" />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="px-3 py-2 bg-[#0A66C2] text-white rounded">{editingId ? 'Update' : 'Save'} Entry</button>
                    {editingId && <button type="button" onClick={resetForm} className="px-3 py-2 border rounded">Cancel edit</button>}
                  </div>
                  {faqFeedback && <p className="mt-3 text-sm text-[#5A5A5A]">{faqFeedback}</p>}
                </form>

                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Assistant FAQ Entries ({entries.length})</h3>
                  <div className="space-y-3 max-h-[420px] overflow-auto">
                    {entries.map((entry) => (
                      <div key={entry.id} className="border rounded p-3">
                        <p className="font-semibold">{entry.question}</p>
                        <p className="text-sm text-[#5A5A5A] mt-1">{entry.answer}</p>
                        <p className="text-xs mt-2">Keywords: {(entry.keywords || []).join(', ') || 'None'}</p>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => selectForEdit(entry)} className="px-2 py-1 text-sm border rounded">Edit</button>
                          <button onClick={() => removeFaq(entry.id)} className="px-2 py-1 text-sm border rounded text-red-600">Delete</button>
                        </div>
                      </div>
                    ))}
                    {!entries.length && <p className="text-sm text-[#5A5A5A]">No org-specific entries yet.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
