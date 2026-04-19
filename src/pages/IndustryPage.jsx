/*
  Route: /industry/:slug
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Purpose:
    - Category landing page with pre-filtered results (project.md).
    - AI auto-reply widget for quick outreach using industry stats.
*/
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { apiRequest, getToken } from '../lib/auth'
import { trackClientEvent } from '../lib/events'

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  )
}

export default function IndustryPage() {
  const { slug } = useParams()
  const token = useMemo(() => getToken(), [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)
  const [requests, setRequests] = useState([])
  const [products, setProducts] = useState([])
  const [aiReply, setAiReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError('')
    apiRequest(`/industry/${encodeURIComponent(slug)}`, { token })
      .then((data) => {
        setSummary(data || null)
        if (data?.category) {
          trackClientEvent('industry_page_view', {
            entityType: 'industry',
            entityId: slug,
            metadata: { category: data.category },
          })
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to load industry page')
        setSummary(null)
      })
      .finally(() => setLoading(false))
  }, [slug, token])

  useEffect(() => {
    if (!summary?.category) return
    const category = summary.category
    const qs = `category=${encodeURIComponent(category)}`

    Promise.all([
      apiRequest(`/requirements/search?${qs}`, { token }),
      apiRequest(`/products/search?${qs}`, { token }),
    ])
      .then(([reqRes, prodRes]) => {
        setRequests(Array.isArray(reqRes?.items) ? reqRes.items : [])
        setProducts(Array.isArray(prodRes?.items) ? prodRes.items : [])
      })
      .catch(() => {
        setRequests([])
        setProducts([])
      })
  }, [summary?.category, token])

  async function generateAutoReply() {
    if (!slug) return
    setAiLoading(true)
    setAiError('')
    try {
      const res = await apiRequest(`/industry/${encodeURIComponent(slug)}/auto-reply`, { method: 'POST', token })
      const reply = String(res?.reply || '').trim()
      if (!reply) {
        setAiError('Unable to generate a reply yet.')
        setAiReply('')
      } else {
        setAiReply(reply)
        setCopyStatus('')
        trackClientEvent('industry_auto_reply', {
          entityType: 'industry',
          entityId: slug,
          metadata: { category: summary?.category || '' },
        })
      }
    } catch (err) {
      setAiError(err.message || 'Auto-reply failed')
    } finally {
      setAiLoading(false)
    }
  }

  async function copyReply() {
    if (!aiReply) return
    try {
      await navigator.clipboard.writeText(aiReply)
      setCopyStatus('Copied to clipboard')
    } catch {
      setCopyStatus('Copy failed')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-600 dark:bg-[#020617] dark:text-slate-200">Loading industry page...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200">{error}</div>
  }

  const stats = summary?.stats || {}
  const topCountries = Array.isArray(stats.top_countries) ? stats.top_countries : []
  const displayCategory = summary?.category || slug

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/40 dark:ring-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Industry page</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{displayCategory}</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Live marketplace snapshot for {displayCategory}. Pre-filtered search results below.
              </p>
            </div>
            <Link
              to={`/search?category=${encodeURIComponent(displayCategory)}`}
              className="inline-flex items-center gap-2 rounded-full bg-gtBlue px-4 py-2 text-xs font-semibold text-white hover:bg-gtBlueHover"
            >
              Open full search
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Buyer requests" value={summary?.counts?.requests ?? 0} />
            <StatCard label="Products listed" value={summary?.counts?.products ?? 0} />
            <StatCard label="Avg lead time (days)" value={stats.average_lead_time_days ?? '--'} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Avg MOQ" value={stats.average_moq ?? '--'} />
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Top buyer regions</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {topCountries.length ? topCountries.map((c) => c.country).join(', ') : '--'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/40 dark:ring-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">AI auto-reply</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Generate a quick outreach message using live industry stats.</p>
            </div>
            <button
              type="button"
              onClick={generateAutoReply}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
            >
              <Sparkles size={14} />
              {aiLoading ? 'Thinking...' : 'Generate'}
            </button>
          </div>
          {aiError ? <div className="mt-3 text-xs font-semibold text-rose-600">{aiError}</div> : null}
          {aiReply ? (
            <div className="mt-4 rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-100">
              <p className="whitespace-pre-wrap">{aiReply}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <button type="button" onClick={copyReply} className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  Copy
                </button>
                {copyStatus ? <span>{copyStatus}</span> : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/40 dark:ring-slate-800">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Latest buyer requests</p>
            <div className="mt-3 space-y-3">
              {(requests || []).slice(0, 6).map((req) => (
                <div key={req.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white p-4 dark:bg-slate-900/60">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{req.title || req.category || 'Buyer request'}</p>
                  <p className="mt-1 text-xs text-slate-500">{req.category || '--'} - MOQ {req.moq || '--'} - Price {req.price_range || '--'}</p>
                  <p className="mt-2 text-xs text-slate-500">Buyer: {req.author?.name || req.buyer_name || 'Buyer'}</p>
                </div>
              ))}
              {!requests.length ? <div className="text-sm text-slate-500">No requests yet.</div> : null}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/40 dark:ring-slate-800">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Top products</p>
            <div className="mt-3 space-y-3">
              {(products || []).slice(0, 6).map((product) => (
                <div key={product.id} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white p-4 dark:bg-slate-900/60">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{product.title || 'Product'}</p>
                  <p className="mt-1 text-xs text-slate-500">{product.category || '--'} - MOQ {product.moq || '--'} - Lead time {product.lead_time_days || '--'}</p>
                  <p className="mt-2 text-xs text-slate-500">Company: {product.author?.name || product.company_name || 'Company'}</p>
                </div>
              ))}
              {!products.length ? <div className="text-sm text-slate-500">No products yet.</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

