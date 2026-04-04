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
  const [replyingTo, setReplyingTo] = useState('')
  const [replyInput, setReplyInput] = useState('')
  const [expandedThreads, setExpandedThreads] = useState({})
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

  function resetReply() {
    setReplyingTo('')
    setReplyInput('')
  }

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

  async function submitReply(parentId) {
    const text = replyInput.trim()
    if (!text || submitting || !item?.id || !item?.entityType || !parentId) return
    setSubmitting(true)
    setError('')
    try {
      const created = await apiRequest(`/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/comment`, {
        method: 'POST',
        token,
        body: { text, parent_id: parentId },
      })
      setComments((previous) => [created, ...previous])
      resetReply()
    } catch (err) {
      setError(err.message || 'Failed to post reply')
    } finally {
      setSubmitting(false)
    }
  }

  const commentTree = useMemo(() => {
    const byId = new Map()
    const roots = []
    const sorted = [...comments].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    sorted.forEach((comment) => {
      byId.set(comment.id, { comment, children: [] })
    })
    sorted.forEach((comment) => {
      const node = byId.get(comment.id)
      if (comment.parent_id && byId.has(comment.parent_id)) {
        byId.get(comment.parent_id).children.push(node)
      } else {
        roots.push(node)
      }
    })
    return roots
  }, [comments])

  function toggleThread(id) {
    setExpandedThreads((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function renderCommentNode(node, depth = 0) {
    const { comment, children } = node
    const safeDepth = Math.min(depth, 8)
    const indent = safeDepth * 16
    const hasChildren = children.length > 0
    const shouldCollapse = hasChildren && !expandedThreads[comment.id] && children.length > 3
    const visibleChildren = shouldCollapse ? children.slice(0, 3) : children

    return (
      <div key={comment.id} className="relative">
        {depth > 0 ? (
          <>
            <div
              className="absolute top-0 bottom-0 w-px bg-slate-200"
              style={{ left: `${indent - 8}px` }}
            />
            <div
              className="absolute top-6 h-px w-3 bg-slate-200"
              style={{ left: `${indent - 8}px` }}
            />
          </>
        ) : null}
        <div className="bg-white borderless-shadow rounded-xl p-3" style={{ marginLeft: `${indent}px` }}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {comment.actor_name || 'User'}{' '}
                {comment.actor_verified ? <span className="ml-1 text-[10px] text-[#0A66C2] font-bold" title="Verified">Verified</span> : null}
              </p>
              <p className="text-[10px] text-slate-500">{formatDateTime(comment.created_at)}</p>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(comment.id)}
              className="text-[11px] font-semibold text-[#0A66C2] hover:text-[#084b8a]"
            >
              Reply
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{comment.text}</p>

          {replyingTo === comment.id ? (
            <div className="mt-3 flex gap-2 items-center">
              <input
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitReply(comment.id)}
                placeholder="Write a reply..."
                className="flex-1 rounded-full bg-slate-100 borderless-shadow px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              />
              <button
                type="button"
                onClick={() => submitReply(comment.id)}
                disabled={submitting || !replyInput.trim()}
                className="rounded-full bg-[#0A66C2] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Send'}
              </button>
              <button
                type="button"
                onClick={resetReply}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        {hasChildren ? (
          <div className="mt-3 space-y-3">
            {visibleChildren.map((child) => renderCommentNode(child, depth + 1))}
            {shouldCollapse ? (
              <button
                type="button"
                onClick={() => toggleThread(comment.id)}
                className="ml-4 text-[11px] font-semibold text-[#0A66C2] hover:text-[#084b8a]"
              >
                View {children.length - 3} more replies
              </button>
            ) : null}
            {!shouldCollapse && hasChildren && children.length > 3 ? (
              <button
                type="button"
                onClick={() => toggleThread(comment.id)}
                className="ml-4 text-[11px] font-semibold text-slate-500 hover:text-slate-700"
              >
                Hide replies
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    )
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

          {!loading && commentTree.map((node) => renderCommentNode(node, 0))}
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


