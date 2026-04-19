/*
  Route: /ratings/feedback
  Access: Protected (login required)
  Purpose: Show pending feedback requests and submit ratings.
*/
import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiRequest, getToken } from '../lib/auth'

const STAR_OPTIONS = [1, 2, 3, 4, 5]

function Stars({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {STAR_OPTIONS.map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={`h-8 w-8 rounded-full text-sm font-semibold transition${
            score <= value
              ? 'bg-amber-400 text-white shadow-sm'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          aria-label={`${score} star`}
        >
          {score}
        </button>
      ))}
    </div>
  )
}

export default function RatingFeedback() {
  const token = useMemo(() => getToken(), [])
  const [searchParams] = useSearchParams()
  const focusProfileKey = searchParams.get('profile_key') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [lookup, setLookup] = useState({})
  const [drafts, setDrafts] = useState({})
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!token) return
    apiRequest('/ratings/feedback-requests', { token })
      .then((data) => {
        setError('')
        const rows = Array.isArray(data?.items) ? data.items : []
        setItems(rows)
        setDrafts((prev) => {
          const next = { ...prev }
          rows.forEach((row) => {
            if (!next[row.id]) {
              const initialScore = Number(row?.suggested_score || 0)
              next[row.id] = {
                score: initialScore >= 1 ? Math.round(initialScore) : 4,
                comment: '',
              }
            }
          })
          return next
        })

        const ids = rows
          .map((row) => String(row.profile_key || '').replace(/^user:/, ''))
          .filter(Boolean)
        if (ids.length) {
          apiRequest('/users/lookup', { method: 'POST', token, body: { ids } })
            .then((res) => {
              const map = (res?.users || []).reduce((acc, user) => {
                acc[user.id] = user
                return acc
              }, {})
              setLookup(map)
            })
            .catch(() => setLookup({}))
        } else {
          setLookup({})
        }
      })
      .catch((err) => {
        setError(err.message || 'Unable to load feedback requests')
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [token])

  function updateDraft(id, patch) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  async function submitRating(row) {
    const draft = drafts[row.id]
    if (!draft?.score) return
    setFeedback('')
    try {
      await apiRequest(`/ratings/profiles/${encodeURIComponent(row.profile_key)}`, {
        method: 'POST',
        token,
        body: {
          score: draft.score,
          comment: draft.comment,
          interaction_type: row.interaction_type || 'deal',
        },
      })
      setItems((prev) => prev.filter((item) => item.id !== row.id))
      setFeedback('Rating submitted. Thank you!')
    } catch (err) {
      setFeedback(err.message || 'Unable to submit rating')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-600 dark:bg-[#020617] dark:text-slate-200">Loading feedback requests...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-slate-50 p-6 text-rose-700 dark:bg-[#020617] dark:text-rose-200">{error}</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Rate recent interactions</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Feedback helps strengthen trust signals across GarTexHub.
          </p>
        </div>

        {feedback ? <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-3 text-sm text-slate-700">{feedback}</div> : null}

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            No pending rating requests right now.
          </div>
        ) : null}

        <div className="space-y-4">
          {items.map((row) => {
            const targetId = String(row.profile_key || '').replace(/^user:/, '')
            const target = lookup[targetId] || {}
            const draft = drafts[row.id] || { score: 4, comment: '' }
            const suggested = row?.suggested_score ? Number(row.suggested_score) : null
            const isFocused = focusProfileKey && row.profile_key === focusProfileKey
            return (
              <div
                key={row.id}
                className={`rounded-2xl bg-white p-5 shadow-sm ring-1${isFocused ? 'ring-gtBlue' : 'ring-slate-200/60'}dark:bg-slate-900/50 dark:ring-slate-800`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{target.name || 'Counterparty'}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{target.role || 'User'} - {target.email || '--'}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Interaction: {row.interaction_type || 'deal'}</p>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Requested {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'recently'}
                  </div>
                </div>

                {suggested ? (
                  <div className="mt-4 rounded-xl shadow-borderless dark:shadow-borderlessDark bg-emerald-50 p-3 text-xs text-emerald-900">
                    Suggested rating: <span className="font-semibold">{suggested.toFixed(1)}</span>
                    {Array.isArray(row.suggested_reasons) && row.suggested_reasons.length ? (
                      <span className="ml-2 text-emerald-800">({row.suggested_reasons.join(', ')})</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => updateDraft(row.id, { score: Math.round(suggested) })}
                      className="ml-3 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white"
                    >
                      Use suggested
                    </button>
                  </div>
                ) : null}

                <div className="mt-4">
                  <Stars value={draft.score} onChange={(score) => updateDraft(row.id, { score })} />
                </div>

                <div className="mt-4">
                  <textarea
                    value={draft.comment}
                    onChange={(e) => updateDraft(row.id, { comment: e.target.value })}
                    placeholder="Optional comment for this interaction..."
                    className="w-full rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-slate-950/40 dark:text-slate-100"
                    rows={3}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Signals: {row?.signals?.contract_signed ? 'Contract signed' : 'No contract'} - {row?.signals?.recorded_call ? 'Recorded call' : 'No call'}
                    {row?.signals?.avg_response_hours !== null ? ` - Avg response ${row.signals.avg_response_hours}h` : ''}
                  </div>
                  <button
                    type="button"
                    onClick={() => submitRating(row)}
                    className="rounded-full bg-gtBlue px-4 py-2 text-xs font-semibold text-white hover:bg-gtBlueHover"
                  >
                    Submit rating
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

