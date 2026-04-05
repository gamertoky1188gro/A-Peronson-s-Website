import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAnalyticsDashboard from '../hooks/useAnalyticsDashboard'
import LeadManager from '../components/leads/LeadManager'
import { apiRequest, getToken } from '../lib/auth'

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('requests')
  const { dashboard, subscription, isEnterprise, loading, error } = useAnalyticsDashboard()
  const totals = dashboard?.totals || {}
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [aiChecklist, setAiChecklist] = useState([])
  const [aiExtractedRequirements, setAiExtractedRequirements] = useState({})
  const [approvalState, setApprovalState] = useState(null)
  const [sendState, setSendState] = useState(null)
  const [queueSummary, setQueueSummary] = useState({ queue: [] })

  async function generateAiReply() {
    const token = getToken()
    if (!token) {
      setAiError('Please login to use AI suggestions.')
      return
    }
    setAiLoading(true)
    setAiError('')
    setApprovalState(null)
    setSendState(null)
    try {
      const prompt = aiPrompt.trim() || 'Draft a short, professional reply for a textile sourcing conversation. Ask for missing MOQ, price range, and lead time if needed.'
      const res = await apiRequest('/ai/reply/draft', { method: 'POST', token, body: { text: prompt } })
      const reply = String(res?.draft || '').trim()
      setAiSuggestion(reply)
      setAiChecklist(Array.isArray(res?.checklist) ? res.checklist : [])
      setAiExtractedRequirements(res?.requirements || {})
      if (!aiPrompt.trim()) setAiPrompt(prompt)
    } catch (err) {
      setAiError(err.message || 'Unable to generate suggestion')
    } finally {
      setAiLoading(false)
    }
  }

  async function copySuggestion() {
    if (!aiSuggestion) return
    try {
      await navigator.clipboard.writeText(aiSuggestion)
      setAiError('Copied to clipboard.')
    } catch {
      setAiError('Copy failed.')
    }
  }

  async function approveSuggestion() {
    const token = getToken()
    if (!token || !aiSuggestion) return
    setAiLoading(true)
    setAiError('')
    try {
      const res = await apiRequest('/ai/reply/approve', {
        method: 'POST',
        token,
        body: {
          draft: aiSuggestion,
          extracted_requirements: aiExtractedRequirements,
        },
      })
      setApprovalState(res)
      if (!res?.approved) setAiError(res?.reason || 'Approval blocked by guardrails.')
    } catch (err) {
      setAiError(err.message || 'Unable to approve suggestion.')
    } finally {
      setAiLoading(false)
    }
  }

  async function sendSuggestion() {
    const token = getToken()
    if (!token || !aiSuggestion) return
    setAiLoading(true)
    setAiError('')
    try {
      const res = await apiRequest('/ai/reply/send', {
        method: 'POST',
        token,
        body: {
          draft: aiSuggestion,
          approval: approvalState || {},
        },
      })
      setSendState(res)
      if (!res?.sent) setAiError(res?.message || 'Send failed.')
    } catch (err) {
      setAiError(err.message || 'Unable to send suggestion.')
    } finally {
      setAiLoading(false)
    }
  }

  async function refreshQueueSummary() {
    const token = getToken()
    if (!token) return
    try {
      const queueData = await apiRequest('/org/operations/queue', { token })
      setQueueSummary({ queue: queueData?.queue || [] })
    } catch {
      setQueueSummary({ queue: [] })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-[#020617] dark:text-slate-100">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 space-y-3 sticky top-20">
            <Link to="/agent?tab=requests" className="block font-semibold text-[#0A66C2] cursor-pointer">📋 My Requests</Link>
            <div className="text-sm text-[#5A5A5A]">Assigned: {totals.open_buyer_requests ?? 0}</div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 mt-4 sticky top-56">
            <Link to="/agent?tab=chats" className="block font-semibold text-[#0A66C2] cursor-pointer mb-3">💬 My Chats</Link>
            <div className="text-sm text-[#5A5A5A] mt-2">Active conversations: {totals.chats ?? 0}</div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 mt-4">
            <Link to="/agent?tab=factories" className="block font-semibold text-[#0A66C2] cursor-pointer mb-3">🏭 Connected Factories</Link>
            <div className="text-sm text-[#5A5A5A]">{totals.partner_network ?? 0} connected</div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 mt-4">
            <h3 className="font-semibold mb-2">Plan</h3>
            <div className="text-sm text-[#5A5A5A]">{subscription?.plan || 'free'} plan</div>
            <div className="text-sm text-[#5A5A5A]">{isEnterprise ? 'Enterprise analytics on' : 'Free analytics view'}</div>
          </div>

          <Link to="/login" className="block w-full mt-4 px-3 py-2 text-center bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100">Logout</Link>
        </aside>

        <main className="lg:col-span-3 space-y-4">
          {loading ? <div className="bg-white rounded-xl p-4">Loading agent metrics...</div> : null}
          {error ? <div className="bg-red-50 text-red-600 rounded-xl p-4">{error}</div> : null}

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3 borderless-divider-b pb-3">
              <h3 className="font-semibold">Agent Activity</h3>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('requests')} className={`px-3 py-1 rounded${activeTab === 'requests' ? 'bg-[#0A66C2] text-white' : 'borderless-shadow bg-white/70 text-slate-700'}`}>Requests</button>
                <button onClick={() => setActiveTab('chats')} className={`px-3 py-1 rounded${activeTab === 'chats' ? 'bg-[#0A66C2] text-white' : 'borderless-shadow bg-white/70 text-slate-700'}`}>Chats</button>
                <button onClick={() => setActiveTab('leads')} className={`px-3 py-1 rounded${activeTab === 'leads' ? 'bg-[#0A66C2] text-white' : 'borderless-shadow bg-white/70 text-slate-700'}`}>Leads</button>
              </div>
            </div>

            {activeTab === 'requests' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#F4F9FF] dark:bg-slate-950/30"><div className="text-sm text-slate-500 dark:text-slate-400">Buyer Requests</div><div className="text-xl font-semibold">{totals.buyer_requests ?? 0}</div></div>
                <div className="p-3 rounded-lg bg-[#F4F9FF] dark:bg-slate-950/30"><div className="text-sm text-slate-500 dark:text-slate-400">Open Requests</div><div className="text-xl font-semibold">{totals.open_buyer_requests ?? 0}</div></div>
                <div className="p-3 rounded-lg bg-[#F4F9FF] dark:bg-slate-950/30"><div className="text-sm text-slate-500 dark:text-slate-400">Contracts / Docs</div><div className="text-xl font-semibold">{`${totals.contracts ?? 0} / ${totals.documents ?? 0}`}</div></div>
              </div>
            ) : activeTab === 'chats' ? (
              <div className="space-y-2">
                <div className="text-sm text-[#5A5A5A]">Active chat threads: {totals.chats ?? 0}</div>
                <div className="text-sm text-[#5A5A5A]">Messages exchanged: {totals.messages ?? 0}</div>
                <div className="text-sm text-[#5A5A5A]">Partner factories connected: {totals.partner_network ?? 0}</div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-50 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p>Queue ownership: <strong>{queueSummary.queue.length}</strong> leads</p>
                    <button type="button" className="text-xs px-2 py-1 rounded bg-white borderless-shadow" onClick={refreshQueueSummary}>Refresh queue</button>
                  </div>
                </div>
                <LeadManager title="My Leads (CRM)" allowAssign={false} showOperations />
              </div>
            )}
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3 borderless-divider-b pb-3">
              <h3 className="font-semibold">AI Suggested Reply</h3>
              <button
                type="button"
                onClick={generateAiReply}
                className="px-3 py-1 rounded bg-[#0A66C2] text-white text-xs font-semibold"
                disabled={aiLoading}
              >
                {aiLoading ? 'Thinking...' : 'Generate'}
              </button>
            </div>

            <p className="text-sm text-[#5A5A5A] mb-2">Paste a short prompt or let the assistant draft a default reply.</p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full borderless-shadow rounded px-3 py-2 text-sm mb-3"
              rows={3}
              placeholder="Example: Reply to a buyer asking for MOQ and lead time."
            />

            {aiError ? <div className="text-xs text-rose-600 mb-2">{aiError}</div> : null}
            {aiSuggestion ? (
              <div className="rounded-lg borderless-shadow bg-slate-50 p-3 text-sm">
                <textarea
                  className="w-full rounded borderless-shadow bg-white px-2 py-2 whitespace-pre-wrap"
                  rows={6}
                  value={aiSuggestion}
                  onChange={(e) => setAiSuggestion(e.target.value)}
                />
                {aiChecklist.length ? (
                  <div className="mt-2 rounded bg-amber-50 px-2 py-2 text-xs text-amber-700">
                    Missing-info checklist: {aiChecklist.join(', ')}
                  </div>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={copySuggestion} className="text-xs font-semibold text-[#0A66C2] hover:underline">Copy suggestion</button>
                  <button type="button" onClick={approveSuggestion} className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">Approve draft</button>
                  <button type="button" onClick={sendSuggestion} className="rounded bg-[#0A66C2] px-2 py-1 text-xs font-semibold text-white">One-click send</button>
                </div>
                {approvalState?.status ? <div className="mt-2 text-xs text-slate-600">Approval: {approvalState.status}</div> : null}
                {sendState?.status ? <div className="mt-1 text-xs text-slate-600">Send status: {sendState.status}</div> : null}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No suggestion yet.</div>
            )}
          </div>
        </main>
      </div>

    </div>
  )
}
