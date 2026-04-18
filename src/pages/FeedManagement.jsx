import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
import MarkdownReadme from '../components/feed/MarkdownReadme'

const EMPTY_FORM = {
  title: '',
  description_markdown: '',
  caption: '',
  cta_text: '',
  cta_url: '',
  hashtags: '',
  emojis: '',
  mentions: '',
  links: '',
  product_tags: '',
  location_tag: '',
  category: '',
  status: 'published',
}

function toCsv(value) {
  return Array.isArray(value) ? value.join(', ') : ''
}

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function normalizeMediaRows(media) {
  if (!Array.isArray(media)) return []
  return media
    .map((entry) => ({
      type: String(entry?.type || 'image').toLowerCase() === 'video' ? 'video' : 'image',
      url: String(entry?.url || '').trim(),
      alt: String(entry?.alt || '').trim(),
    }))
    .filter((entry) => entry.url)
}

export default function FeedManagement() {
  const token = useMemo(() => getToken(), [])
  const user = useMemo(() => getCurrentUser(), [])

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState('')
  const [previewOpen, setPreviewOpen] = useState(true)
  const [advancedReadme, setAdvancedReadme] = useState(true)
  const [mediaRows, setMediaRows] = useState([])

  const loadMine = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/feed/posts/mine', { token })
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setItems([])
      setError(err.message || 'Failed to load your feed posts')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadMine()
  }, [loadMine])

  function resetComposer() {
    setEditingId('')
    setForm(EMPTY_FORM)
    setMediaRows([])
  }

  function startEdit(item) {
    setEditingId(item?.id || '')
    setForm({
      title: item?.title || '',
      description_markdown: item?.description_markdown || '',
      caption: item?.caption || '',
      cta_text: item?.cta_text || '',
      cta_url: item?.cta_url || '',
      hashtags: toCsv(item?.hashtags),
      emojis: toCsv(item?.emojis),
      mentions: toCsv(item?.mentions),
      links: toCsv(item?.links),
      product_tags: toCsv(item?.product_tags),
      location_tag: item?.location_tag || '',
      category: item?.category || '',
      status: item?.status || 'published',
    })
    setMediaRows(normalizeMediaRows(item?.media))
    setNotice('')
    setError('')
  }

  function payloadFromForm() {
    return {
      ...form,
      hashtags: parseCsv(form.hashtags),
      emojis: parseCsv(form.emojis),
      mentions: parseCsv(form.mentions),
      links: parseCsv(form.links),
      product_tags: parseCsv(form.product_tags),
      media: mediaRows
        .map((entry) => ({
          type: String(entry.type || 'image').toLowerCase() === 'video' ? 'video' : 'image',
          url: String(entry.url || '').trim(),
          alt: String(entry.alt || '').trim(),
        }))
        .filter((entry) => entry.url),
    }
  }

  async function savePost() {
    if (!token) return
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!form.description_markdown.trim()) {
      setError('Description README is required.')
      return
    }

    setSaving(true)
    setError('')
    setNotice('')
    try {
      const body = payloadFromForm()
      if (editingId) {
        const updated = await apiRequest(`/feed/posts/${encodeURIComponent(editingId)}`, {
          method: 'PATCH',
          token,
          body,
        })
        setItems((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)))
        setNotice('Feed post updated.')
      } else {
        const created = await apiRequest('/feed/posts', { method: 'POST', token, body })
        setItems((prev) => [created, ...prev])
        setNotice('Feed post created.')
      }
      resetComposer()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function removePost(id) {
    if (!token || !id) return
    if (!window.confirm('Delete this feed post?')) return
    setError('')
    setNotice('')
    try {
      await apiRequest(`/feed/posts/${encodeURIComponent(id)}`, { method: 'DELETE', token })
      setItems((prev) => prev.filter((entry) => entry.id !== id))
      if (editingId === id) resetComposer()
      setNotice('Feed post deleted.')
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  function updateMedia(index, key, value) {
    setMediaRows((prev) => prev.map((entry, i) => (i === index ? { ...entry, [key]: value } : entry)))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-800">
            <p className="text-xs text-slate-500">Owner</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name || 'Member'}</p>
            <p className="text-xs text-slate-500">Manage your own feed posts only</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/feed" className="rounded-full px-3 py-2 text-xs font-semibold ring-1 ring-slate-200/70 hover:bg-slate-50 dark:ring-white/10 dark:hover:bg-white/5">Back to Feed</Link>
              <button
                type="button"
                onClick={resetComposer}
                className="rounded-full px-3 py-2 text-xs font-semibold bg-[var(--gt-blue)] text-white hover:bg-[var(--gt-blue-hover)]"
              >
                New Post
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-800 space-y-2">
            <p className="text-sm font-semibold">README Support</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">GitHub-style markdown with tables, task lists, code blocks, and sanitized HTML.</p>
            <label className="inline-flex items-center gap-2 text-xs">
              <input type="checkbox" checked={advancedReadme} onChange={(e) => setAdvancedReadme(e.target.checked)} />
              Advanced README mode
            </label>
            <label className="inline-flex items-center gap-2 text-xs">
              <input type="checkbox" checked={previewOpen} onChange={(e) => setPreviewOpen(e.target.checked)} />
              Live preview
            </label>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-4">
          {(error || notice) ? (
            <div className={`rounded-2xl p-4 text-sm ring-1 ${error ? 'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30' : 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30'}`}>
              {error || notice}
            </div>
          ) : null}

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-800">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-lg font-bold">{editingId ? 'Edit Feed Post' : 'Create Feed Post'}</h1>
              <p className="text-xs text-slate-500">Path: /feed/manage</p>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Title</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Category</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium">Caption / Copy</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.caption} onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))} />
              </label>
            </div>

            <div className={`mt-4 grid gap-4 ${previewOpen ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Description README (Markdown)</span>
                <textarea
                  rows={advancedReadme ? 18 : 10}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-mono"
                  placeholder="# Launch Update\n\n- feature 1\n- feature 2\n\n```bash\nnpm run dev:full\n```"
                  value={form.description_markdown}
                  onChange={(e) => setForm((prev) => ({ ...prev, description_markdown: e.target.value }))}
                />
              </label>

              {previewOpen ? (
                <div className="space-y-1 text-sm">
                  <span className="font-medium">README Preview</span>
                  <div className="min-h-[240px] rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-950/40 dark:border-slate-700">
                    <MarkdownReadme content={form.description_markdown} />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="space-y-1 text-sm">
                <span className="font-medium">CTA Text</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.cta_text} onChange={(e) => setForm((prev) => ({ ...prev, cta_text: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">CTA URL</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="https://example.com/shop" value={form.cta_url} onChange={(e) => setForm((prev) => ({ ...prev, cta_url: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Hashtags (comma-separated)</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.hashtags} onChange={(e) => setForm((prev) => ({ ...prev, hashtags: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Emojis (comma-separated)</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.emojis} onChange={(e) => setForm((prev) => ({ ...prev, emojis: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Mentions (comma-separated)</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="@alice, @brandx" value={form.mentions} onChange={(e) => setForm((prev) => ({ ...prev, mentions: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Links (comma-separated)</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.links} onChange={(e) => setForm((prev) => ({ ...prev, links: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Product Tags (comma-separated)</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.product_tags} onChange={(e) => setForm((prev) => ({ ...prev, product_tags: e.target.value }))} />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Location Tag</span>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.location_tag} onChange={(e) => setForm((prev) => ({ ...prev, location_tag: e.target.value }))} />
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Visual Content (Images / Videos)</p>
                <button
                  type="button"
                  onClick={() => setMediaRows((prev) => [...prev, { type: 'image', url: '', alt: '' }])}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Add Media
                </button>
              </div>
              {mediaRows.length === 0 ? <p className="text-xs text-slate-500">No media yet. Add image/video URLs.</p> : null}
              {mediaRows.map((entry, index) => (
                <div key={`media-row-${index}`} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={entry.type} onChange={(e) => updateMedia(index, 'type', e.target.value)}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <input className="md:col-span-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="https://... or /uploads/..." value={entry.url} onChange={(e) => updateMedia(index, 'url', e.target.value)} />
                  <button
                    type="button"
                    onClick={() => setMediaRows((prev) => prev.filter((_, i) => i !== index))}
                    className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
                  >
                    Remove
                  </button>
                  <input className="md:col-span-5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Alt text (optional)" value={entry.alt} onChange={(e) => updateMedia(index, 'alt', e.target.value)} />
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={savePost}
                disabled={saving}
                className="rounded-full bg-[var(--gt-blue)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Saving...' : (editingId ? 'Update Post' : 'Create Post')}
              </button>
              <button
                type="button"
                onClick={resetComposer}
                className="rounded-full px-4 py-2 text-xs font-semibold ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Reset
              </button>
              <label className="inline-flex items-center gap-2 text-xs">
                <span>Status</span>
                <select
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-800">
            <h2 className="text-lg font-bold">My Feed Posts</h2>
            {loading ? <p className="mt-3 text-sm text-slate-500">Loading...</p> : null}
            {!loading && items.length === 0 ? <p className="mt-3 text-sm text-slate-500">No posts yet.</p> : null}
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.status} · {new Date(item.created_at || Date.now()).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => startEdit(item)} className="rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-slate-200 hover:bg-slate-50">Edit</button>
                      <button type="button" onClick={() => removePost(item.id)} className="rounded-full px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700">Delete</button>
                    </div>
                  </div>
                  {item.caption ? <p className="mt-2 text-sm text-slate-700">{item.caption}</p> : null}
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
