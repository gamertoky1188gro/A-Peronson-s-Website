import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getToken } from '../../lib/auth'

const ORDERED_STATES = ['discovered', 'matched', 'contacted', 'negotiating', 'sample', 'agreed', 'signed', 'closed']

function toLabel(state) {
  return String(state || '').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
}

export default function JourneyTimeline({ title = 'Journey Timeline', requirementId = '', productId = '', matchId = '', contractId = '' }) {
  const [journey, setJourney] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const params = new URLSearchParams()
    if (requirementId) params.set('requirement_id', requirementId)
    if (productId) params.set('product_id', productId)
    if (matchId) params.set('match_id', matchId)
    if (contractId) params.set('contract_id', contractId)
    if (![...params.keys()].length) return

    apiRequest(`/deal-journeys/context?${params.toString()}`, { token })
      .then((row) => {
        setJourney(row)
        setError('')
      })
      .catch(() => {
        setJourney(null)
        setError('Journey not started yet.')
      })
  }, [contractId, matchId, productId, requirementId])

  const currentIndex = useMemo(() => ORDERED_STATES.indexOf(String(journey?.current_state || '')), [journey?.current_state])

  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {journey?.id ? <span className="text-[11px] text-slate-500">Journey #{journey.id.slice(0, 8)}</span> : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ORDERED_STATES.map((state, idx) => {
          const done = currentIndex >= idx
          return (
            <span
              key={state}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${done ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-50 text-slate-500 ring-slate-200'}`}
            >
              {toLabel(state)}
            </span>
          )
        })}
      </div>

      {journey?.interrupted ? (
        <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Interrupted: {journey.interrupted_reason || 'Missing context. Resume from the latest active workspace.'}
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to={matchId ? `/chat?match_id=${encodeURIComponent(matchId)}` : '/chat'} className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white">Resume in chat</Link>
            <Link to={contractId ? `/contracts?contract_id=${encodeURIComponent(contractId)}` : '/contracts'} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-300">Open contract</Link>
          </div>
        </div>
      ) : null}

      {journey ? (
        <div className="mt-3 text-xs text-slate-600">
          Missing artifacts:
          <ul className="mt-1 list-disc pl-5">
            {!journey.chat_thread_id ? <li>Add a chat thread to continue negotiation.</li> : null}
            {!(journey.call_ids || []).length ? <li>Schedule or complete at least one call.</li> : null}
            {!journey.contract_id ? <li>Create contract draft before signing.</li> : null}
          </ul>
        </div>
      ) : null}

      {journey?.rollback_logs?.length ? (
        <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">
          <div className="font-semibold">Rollback reason logs</div>
          <ul className="mt-1 list-disc pl-5">
            {journey.rollback_logs.slice(-3).reverse().map((row) => (
              <li key={row.id}>{row.from_state} → {row.to_state}: {row.reason}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {!journey && error ? <div className="mt-2 text-xs text-slate-500">{error}</div> : null}
    </section>
  )
}
