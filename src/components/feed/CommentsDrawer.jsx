import React, { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { apiRequest, getToken } from '../../lib/auth'

function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

export default function CommentsDrawer({ open, onClose, item }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [comments, setComments] = useState([])
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const token = useMemo(() => getToken(), [])

  useEffect(() => {
    if (!open || !item?.id || !item?.entityType) return
    let alive = true
    setLoading(true)
    setError('')
    apiRequest(`/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}`, { token })
      .then((data) => {
        if (!alive) return
        setComments(Array.isArray(data?.comments) ? data.comments : [])
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'Failed to load comments')
        setComments([])
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [item?.entityType, item?.id, open, token])

  async function submitComment() {
    const text = input.trim()
    if (!text || submitting || !item?.id || !item?.entityType) return
    setSubmitting(true)
    setError('')
    try {
      const created = await apiRequest(`/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/comment`, {
        method: 'POST',
        token,
        body: { text },
      })
      setComments((previous) => [created, ...previous])
      setInput('')
    } catch (err) {
      setError(err.message || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close comments" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col borderless-divider-l">
        <header className="flex items-center justify-between gap-3 px-4 py-3 borderless-divider-b">
          <div>
            <p className="text-sm font-semibold text-slate-900">Comments</p>
            <p className="text-[11px] text-slate-500 truncate">{item?.author?.name || 'Post'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
          {loading ? <div className="text-sm text-slate-500">Loading comments...</div> : null}
          {!loading && error ? <div className="text-sm text-rose-700 bg-rose-50 borderless-shadow rounded-lg p-3">{error}</div> : null}
          {!loading && !error && comments.length === 0 ? <div className="text-sm text-slate-500">No comments yet.</div> : null}

          {!loading && comments.map((c) => (
            <div key={c.id} className="bg-white borderless-shadow rounded-xl p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {c.actor_name || 'User'}{' '}
                    {c.actor_verified ? <span className="ml-1 text-[10px] text-[#0A66C2] font-bold" title="Verified">Verified</span> : null}
                  </p>
                  <p className="text-[10px] text-slate-500">{formatDateTime(c.created_at)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{c.text}</p>
            </div>
          ))}
        </div>

        <footer className="p-4 borderless-divider-t bg-white">
          <div className="flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Write a comment..."
              className="flex-1 rounded-full bg-slate-100 borderless-shadow px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            />
            <button
              type="button"
              onClick={submitComment}
              disabled={submitting || !input.trim()}
              className="rounded-full bg-[#0A66C2] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-500">Unverified senders may appear as message requests elsewhere.</p>
        </footer>
      </aside>
    </div>
  )
}


