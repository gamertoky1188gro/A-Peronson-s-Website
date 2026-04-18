import React, { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  ImagePlus,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  UserRound,
  Moon,
  SunMedium,
  FileText,
  PencilLine,
  Film,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getToken } from '../lib/auth'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const initialReadme = `# Launch Update

- feature 1
- feature 2

\`\`\`bash
npm run dev:full
\`\`\``

const seedPosts = []

const Field = ({ label, hint, children, compact }) => (
  <div className={cn('space-y-2', compact && 'space-y-1')}>
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
      'min-h-30 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
      'placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10',
      'dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10',
      className,
    )}
  />
)

const Badge = ({ children, tone = 'default' }) => {
  const tones = {
    default:
      'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
    indigo:
      'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-300',
    emerald:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300',
    amber:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  )
}

const SectionCard = ({ title, subtitle, action, children, className = '' }) => (
  <section
    className={cn(
      'rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_60px_-28px_rgba(15,23,42,0.25)] backdrop-blur-xl',
      'dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-[0_16px_60px_-28px_rgba(0,0,0,0.55)]',
      className,
    )}
  >
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
)

const PreviewMarkdown = ({ value }) => {
  const lines = useMemo(() => value.split('\n'), [value])
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-950 prose-pre:text-slate-100 dark:prose-pre:border-slate-800">
      <div className="space-y-4">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold">{line.slice(2)}</h1>
          if (line.startsWith('## ')) return <h2 key={idx} className="text-xl font-semibold">{line.slice(3)}</h2>
          if (line.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc pl-6">
                <li>{line.slice(2)}</li>
              </ul>
            )
          }
          if (line.startsWith('```')) return null
          if (!line.trim()) return <div key={idx} className="h-2" />
          return <p key={idx} className="text-sm leading-7 text-slate-600 dark:text-slate-300">{line}</p>
        })}
        <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800"><code>npm run dev:full</code></pre>
      </div>
    </div>
  )
}

function splitCsv(value = '') {
  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function mapApiToPost(row = {}) {
  const status = String(row.status || '').toLowerCase() === 'draft' ? 'Draft' : 'Published'
  return {
    id: row.id,
    title: row.title || 'Untitled Post',
    category: row.category || 'General',
    status,
    createdAt: new Date(row.created_at || Date.now()).toLocaleString(),
    caption: row.caption || 'No caption provided.',
  }
}

export default function FeedManageProPage() {
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return true
  })
  const [advancedReadme, setAdvancedReadme] = useState(true)
  const [status, setStatus] = useState('Published')
  const [posts, setPosts] = useState(seedPosts)
  const [saving, setSaving] = useState(false)
  const [mediaRows, setMediaRows] = useState([])
  const [form, setForm] = useState({
    title: '',
    category: '',
    caption: '',
    description: '',
    readme: initialReadme,
    ctaText: '',
    ctaUrl: 'https://example.com/shop',
    hashtags: '',
    emojis: '',
    mentions: '@alice, @brandx',
    links: '',
    tags: '',
    location: '',
  })

  React.useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  React.useEffect(() => {
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

  const createPost = async () => {
    if (!token || saving) return
    setSaving(true)
    try {
      const payload = {
        title: form.title || 'Untitled Post',
        category: form.category || 'General',
        caption: form.caption || form.description || 'No caption provided.',
        description_markdown: form.readme || initialReadme,
        cta_text: form.ctaText,
        cta_url: form.ctaUrl,
        hashtags: splitCsv(form.hashtags),
        emojis: splitCsv(form.emojis),
        mentions: splitCsv(form.mentions),
        links: splitCsv(form.links),
        product_tags: splitCsv(form.tags),
        location_tag: form.location,
        status: String(status || '').toLowerCase() === 'draft' || String(status || '').toLowerCase() === 'archived' ? 'draft' : 'published',
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
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cn('min-h-screen bg-[#f5f7fb] text-slate-900 transition-colors duration-300 dark:bg-[#060816] dark:text-slate-100')}>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />
        <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10" />
        <div className="pointer-events-none absolute -bottom-32 left-[20%] h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <div className="mx-auto max-w-400 px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 rounded-4xl border border-slate-200/80 bg-white/80 px-5 py-5 shadow-[0_12px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="indigo">Owner</Badge>
                  <Badge tone="emerald">Admin</Badge>
                  <Badge tone="amber">Manage your own feed posts only</Badge>
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                  Create a feed post with a premium editorial workflow.
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                  A polished management screen for launching posts, editing README content, attaching media, and keeping your own feed organized.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => navigate('/feed')}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Feed
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm({
                    title: '',
                    category: '',
                    caption: '',
                    description: '',
                    readme: initialReadme,
                    ctaText: '',
                    ctaUrl: 'https://example.com/shop',
                    hashtags: '',
                    emojis: '',
                    mentions: '@alice, @brandx',
                    links: '',
                    tags: '',
                    location: '',
                  })
                  setStatus('Published')
                  setMediaRows([])
                }}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                <Plus className="h-4 w-4" /> New Post
              </button>
              <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/70 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/60">
                <FileText className="h-4 w-4" /> README Support
              </button>
              <button
                onClick={() => setDarkMode((v) => !v)}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
              >
                {darkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <main className="space-y-5">
            <SectionCard
              title="Create Post"
              subtitle="Path: /feed/manage"
              action={<Badge tone="indigo">Status · {status}</Badge>}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <Input value={form.title} onChange={handleChange('title')} placeholder="Enter a compelling title" />
                </Field>
                <Field label="Category">
                  <div className="relative">
                    <Input value={form.category} onChange={handleChange('category')} placeholder="Choose or type a category" />
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  </div>
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Caption / Copy">
                  <Textarea value={form.caption} onChange={handleChange('caption')} placeholder="A strong short-form caption for your feed post" />
                </Field>
                <Field label="Description">
                  <Textarea value={form.description} onChange={handleChange('description')} placeholder="Long-form description or campaign details" />
                </Field>
              </div>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      <PencilLine className="h-4 w-4 text-indigo-500" /> README (Markdown)
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">GitHub-style markdown with tables, task lists, code blocks, and sanitized HTML.</p>
                  </div>
                  <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
                    <button
                      onClick={() => setAdvancedReadme(true)}
                      className={cn(
                        'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition',
                        advancedReadme
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900',
                      )}
                    >
                      Advanced README mode
                    </button>
                    <button
                      onClick={() => setAdvancedReadme(false)}
                      className={cn(
                        'inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition',
                        !advancedReadme
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900',
                      )}
                    >
                      Live preview
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">README Support</label>
                    <Textarea
                      value={form.readme}
                      onChange={handleChange('readme')}
                      className="min-h-80 font-mono text-[13px] leading-6"
                      placeholder="Write GitHub-style markdown here"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">README Preview</label>
                      <Badge tone="default">Sanitized</Badge>
                    </div>
                    <div className="min-h-80 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      <PreviewMarkdown value={form.readme} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="CTA Text">
                  <Input value={form.ctaText} onChange={handleChange('ctaText')} placeholder="Shop Now" />
                </Field>
                <Field label="CTA URL">
                  <Input value={form.ctaUrl} onChange={handleChange('ctaUrl')} placeholder="https://example.com/shop" />
                </Field>
                <Field label="Hashtags (comma-separated)">
                  <Input value={form.hashtags} onChange={handleChange('hashtags')} placeholder="#launch, #update" />
                </Field>
                <Field label="Emojis (comma-separated)">
                  <Input value={form.emojis} onChange={handleChange('emojis')} placeholder="🚀, ✨, 🔥" />
                </Field>
                <Field label="Mentions (comma-separated)">
                  <Input value={form.mentions} onChange={handleChange('mentions')} placeholder="@alice, @brandx" />
                </Field>
                <Field label="Links (comma-separated)">
                  <Input value={form.links} onChange={handleChange('links')} placeholder="https://..." />
                </Field>
                <Field label="Product Tags (comma-separated)">
                  <Input value={form.tags} onChange={handleChange('tags')} placeholder="summer-drop, featured" />
                </Field>
                <Field label="Location Tag">
                  <Input value={form.location} onChange={handleChange('location')} placeholder="Dhaka, Bangladesh" />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <ImagePlus className="h-4 w-4 text-indigo-500" /> Visual Content (Images / Videos)
                  </div>
                  <button
                    type="button"
                    onClick={() => setMediaRows((prev) => [...prev, { type: 'image', url: '', alt: '' }])}
                    className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  >
                    <Film className="h-4 w-4" /> Add Media
                  </button>
                  <div className="mt-4 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    No media yet. Add image/video URLs.
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">Status</div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Control the post visibility and publishing state.</p>
                    </div>
                    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
                      {[
                        'Draft',
                        'Published',
                        'Archived',
                      ].map((item) => (
                        <button
                          key={item}
                          onClick={() => setStatus(item)}
                          className={cn(
                            'rounded-xl px-3 py-2 text-xs font-semibold transition',
                            status === item
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900',
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        <UserRound className="h-4 w-4" /> Role
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">Owner / Admin</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        <Clock3 className="h-4 w-4" /> Update
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-50">Instant preview sync</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
                <button
                  onClick={createPost}
                  disabled={saving}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-cyan-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] hover:shadow-indigo-500/35 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" /> {saving ? 'Creating...' : 'Create Post'}
                </button>
                <button
                  onClick={() => {
                    setForm({
                      title: '',
                      category: '',
                      caption: '',
                      description: '',
                      readme: initialReadme,
                      ctaText: '',
                      ctaUrl: 'https://example.com/shop',
                      hashtags: '',
                      emojis: '',
                      mentions: '@alice, @brandx',
                      links: '',
                      tags: '',
                      location: '',
                    })
                    setStatus('Published')
                    setMediaRows([])
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
            </SectionCard>
          </main>

          <aside className="space-y-5">
            <SectionCard
              title="My Feed Posts"
              subtitle="You only manage your own content."
              action={<Badge tone="emerald">{posts.length} Posts</Badge>}
            >
              {posts.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
                  <div className="mb-3 rounded-2xl bg-indigo-600/10 p-4 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-50">No posts yet.</div>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Create a polished post on the left to populate your personal feed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <article key={post.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-indigo-900/70 dark:hover:bg-slate-900">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-50">{post.title}</h3>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{post.category}</p>
                        </div>
                        <Badge tone={post.status === 'Published' ? 'emerald' : 'default'}>{post.status}</Badge>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.caption}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Created</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="README Support"
              subtitle="Markdown-focused content editing for power users."
            >
              <div className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p>GitHub-style markdown rendering for headings, lists, and code blocks.</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p>Sanitized HTML handling for safer content display.</p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p>Advanced README mode and live preview are both available in one interface.</p>
                </div>
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  )
}