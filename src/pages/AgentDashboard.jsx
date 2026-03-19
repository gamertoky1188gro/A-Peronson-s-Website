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

  async function generateAiReply() {
    const token = getToken()
    if (!token) {
      setAiError('Please login to use AI suggestions.')
      return
    }
    setAiLoading(true)
    setAiError('')
    try {
      const prompt = aiPrompt.trim() || 'Draft a short, professional reply for a textile sourcing conversation. Ask for missing MOQ, price range, and lead time if needed.'
      const res = await apiRequest('/assistant/ask', { method: 'POST', token, body: { question: prompt } })
      const reply = String(res?.matched_answer || res?.answer || '').trim()
      setAiSuggestion(reply)
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
            <div className="flex items-center justify-between mb-3 border-b pb-3">
              <h3 className="font-semibold">Agent Activity</h3>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('requests')} className={`px-3 py-1 rounded ${activeTab === 'requests' ? 'bg-[#0A66C2] text-white' : 'border'}`}>Requests</button>
                <button onClick={() => setActiveTab('chats')} className={`px-3 py-1 rounded ${activeTab === 'chats' ? 'bg-[#0A66C2] text-white' : 'border'}`}>Chats</button>
                <button onClick={() => setActiveTab('leads')} className={`px-3 py-1 rounded ${activeTab === 'leads' ? 'bg-[#0A66C2] text-white' : 'border'}`}>Leads</button>
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
              <LeadManager title="My Leads (CRM)" allowAssign={false} />
            )}
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3 border-b pb-3">
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
              className="w-full border rounded px-3 py-2 text-sm mb-3"
              rows={3}
              placeholder="Example: Reply to a buyer asking for MOQ and lead time."
            />

            {aiError ? <div className="text-xs text-rose-600 mb-2">{aiError}</div> : null}
            {aiSuggestion ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="whitespace-pre-wrap">{aiSuggestion}</p>
                <button
                  type="button"
                  onClick={copySuggestion}
                  className="mt-2 text-xs font-semibold text-[#0A66C2] hover:underline"
                >
                  Copy suggestion
                </button>
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

