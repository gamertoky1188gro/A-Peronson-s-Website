import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Film, ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MarkdownMessage from '../components/chat/MarkdownMessage'
import { apiRequest, getToken } from '../lib/auth'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Field = ({ label, hint, children }) => (
  <div className="space-y-2">
    <div className="flex items-end justify-between gap-3">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      {hint ? <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
    </div>
    {children}
  </div>
)

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={cn(
      'h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition',
      'placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10',
      'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10',
      className,
    )}
  />
)

const Textarea = ({ className = '', ...props }) => (
  <textarea
    {...props}
    className={cn(
      'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
      'placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10',
      'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10',
      className,
    )}
  />
)

const SectionCard = ({ title, subtitle, children }) => (
  <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_60px_-28px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-[0_16px_60px_-28px_rgba(0,0,0,0.55)]">
    <div className="mb-5">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </div>
    {children}
  </section>
)

function splitCsv(value = '') {
  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function mapApiToPost(row = {}) {
  return {
    id: row.id,
    title: row.title || 'Untitled Post',
    category: row.category || 'General',
    createdAt: new Date(row.created_at || Date.now()).toLocaleString(),
    caption: row.caption || 'No caption provided.',
  }
}

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export default function FeedManageProPage() {
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])

  const [posts, setPosts] = useState([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [mediaRows, setMediaRows] = useState([])
  const [form, setForm] = useState({
    title: '',
    category: '',
    caption: '',
    readme: '',
    ctaText: '',
    ctaUrl: '',
    hashtags: '',
    mentions: '',
    links: '',
    tags: '',
    location: '',
  })

  useEffect(() => {
    let alive = true
    if (!token) return undefined

    apiRequest('/feed/posts/mine', { token })
      .then((rows) => {
        if (!alive) return
        const mapped = Array.isArray(rows) ? rows.map(mapApiToPost) : []
        setPosts(mapped)
      })
      .catch(() => {
        if (!alive) return
        setPosts([])
      })

    return () => {
      alive = false
    }
  }, [token])

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const uploadFeedMedia = useCallback(async (file) => {
    if (!token) throw new Error('Not signed in')
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/feed/posts/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data?.error || 'Upload failed')
      err.status = res.status
      err.details = data
      throw err
    }

    return data
  }, [token])

  const handleUploadFiles = useCallback(async (files) => {
    const list = Array.from(files || [])
    if (!list.length || uploading) return
    setError('')
    setUploading(true)
    try {
      for (const file of list) {
        const result = await uploadFeedMedia(file)
        const nextType = String(result?.type || '').toLowerCase() === 'video' ? 'video' : 'image'
        const nextUrl = String(result?.url || '').trim()
        if (!nextUrl) continue
        setMediaRows((prev) => [...prev, { type: nextType, url: nextUrl, alt: file?.name || '' }])
      }
    } catch (err) {
      setError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [uploadFeedMedia, uploading])

  const createPost = useCallback(async () => {
    if (!token || saving) return
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: form.title || 'Untitled Post',
        category: form.category || 'General',
        caption: form.caption || 'No caption provided.',
        description_markdown: form.readme || '',
        cta_text: form.ctaText || '',
        cta_url: form.ctaUrl || '',
        hashtags: splitCsv(form.hashtags),
        mentions: splitCsv(form.mentions),
        links: splitCsv(form.links),
        product_tags: splitCsv(form.tags),
        location_tag: form.location || '',
        status: 'published',
        media: mediaRows
          .map((entry) => ({
            type: String(entry.type || 'image').toLowerCase() === 'video' ? 'video' : 'image',
            url: String(entry.url || '').trim(),
            alt: String(entry.alt || '').trim(),
          }))
          .filter((entry) => entry.url),
      }

      const created = await apiRequest('/feed/posts', {
        method: 'POST',
        token,
        body: payload,
      })
      const newPost = mapApiToPost(created)
      setPosts((prev) => [newPost, ...prev])
      setForm((prev) => ({ ...prev, title: '', category: '', caption: '', readme: '' }))
      setMediaRows([])
    } catch (err) {
      setError(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [form, mediaRows, saving, token])

  const deletePost = useCallback(async (postId) => {
    if (!token || !postId) return
    setError('')
    try {
      await apiRequest(`/feed/posts/${postId}`, { method: 'DELETE', token })
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (err) {
      setError(err?.message || 'Delete failed')
    }
  }, [token])

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 transition-colors duration-300 dark:bg-[#060816] dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Feed Management</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create and manage your feed posts.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/feed')}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Feed
          </button>
        </header>

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Post editor" subtitle="Advanced markdown + live preview (no extra toggles).">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <Input value={form.title} onChange={handleChange('title')} placeholder="Title..." />
                </Field>
                <Field label="Category">
                  <Input value={form.category} onChange={handleChange('category')} placeholder="Announcements" />
                </Field>
              </div>

              <Field label="Caption">
                <Textarea value={form.caption} onChange={handleChange('caption')} placeholder="Short feed caption..." className="min-h-28" />
              </Field>

              <Field label="README / Longform (Markdown)">
                <Textarea
                  value={form.readme}
                  onChange={handleChange('readme')}
                  placeholder="Write markdown here..."
                  className="min-h-56"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="CTA Text">
                  <Input value={form.ctaText} onChange={handleChange('ctaText')} placeholder="Optional" />
                </Field>
                <Field label="CTA URL">
                  <Input value={form.ctaUrl} onChange={handleChange('ctaUrl')} placeholder="https://..." />
                </Field>
                <Field label="Hashtags (comma-separated)">
                  <Input value={form.hashtags} onChange={handleChange('hashtags')} placeholder="#launch, #update" />
                </Field>
                <Field label="Mentions (comma-separated)">
                  <Input value={form.mentions} onChange={handleChange('mentions')} placeholder="@buyer, @factory" />
                </Field>
                <Field label="Links (comma-separated)">
                  <Input value={form.links} onChange={handleChange('links')} placeholder="https://..." />
                </Field>
                <Field label="Product tags (comma-separated)">
                  <Input value={form.tags} onChange={handleChange('tags')} placeholder="cotton, denim, etc" />
                </Field>
                <Field label="Location tag">
                  <Input value={form.location} onChange={handleChange('location')} placeholder="Dhaka, Bangladesh" />
                </Field>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <ImagePlus className="h-4 w-4 text-indigo-500" /> Media (images / videos)
                  </div>
                  <label
                    className={cn(
                      'inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800',
                      'dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200',
                      uploading && 'pointer-events-none opacity-70',
                    )}
                  >
                    <UploadCloud className={cn('h-4 w-4', uploading && 'animate-pulse')} />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleUploadFiles(e.target.files)}
                    />
                  </label>
                </div>

                {!mediaRows.length ? (
                  <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    No media uploaded yet.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {mediaRows.map((entry, idx) => (
                      <div key={`${entry.url}-${idx}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                        <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
                          {entry.type === 'video' ? (
                            <video className="h-full w-full object-cover" src={entry.url} controls preload="metadata" />
                          ) : (
                            <img className="h-full w-full object-cover" src={entry.url} alt={entry.alt || ''} />
                          )}
                          <button
                            type="button"
                            onClick={() => setMediaRows((prev) => prev.filter((_v, i) => i !== idx))}
                            className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
                            aria-label="Remove media"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Film className="h-3.5 w-3.5" /> {entry.type}
                          </span>
                          <span className="truncate">{entry.url.replace('/uploads/', '')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setForm((prev) => ({ ...prev, title: '', category: '', caption: '', readme: '' }))
                    setMediaRows([])
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={createPost}
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save post'}
                </button>
              </div>
            </div>
          </SectionCard>

          <div className="space-y-5">
            <SectionCard title="Live preview" subtitle="Preview is empty when README textarea is empty.">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
                {String(form.readme || '').trim() ? (
                  <MarkdownMessage text={form.readme} />
                ) : (
                  <div className="text-sm text-slate-500 dark:text-slate-400">Nothing to preview.</div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Your posts" subtitle="From /api/feed/posts/mine">
              {!posts.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                  No posts yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {posts.map((post) => (
                    <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-50">{post.title}</h3>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{post.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deletePost(post.id)}
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.caption}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Created</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}
