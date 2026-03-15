import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'

const EMPTY_FORM = {
  title: '',
  category: '',
  material: '',
  moq: '',
  lead_time_days: '',
  description: '',
  video_url: '',
}

function canManageProducts(role) {
  return ['factory', 'buying_house', 'admin'].includes(String(role || ''))
}

export default function ProductManagement() {
  const token = useMemo(() => getToken(), [])
  const user = useMemo(() => getCurrentUser(), [])
  const role = user?.role || ''

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const loadMine = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/products?mine=true', { token })
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load products')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadMine()
  }, [loadMine])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setNotice('')
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditing(item)
    setForm({
      title: item?.title || '',
      category: item?.category || '',
      material: item?.material || '',
      moq: item?.moq || '',
      lead_time_days: item?.lead_time_days || '',
      description: item?.description || '',
      video_url: item?.video_url || '',
    })
    setNotice('')
    setModalOpen(true)
  }

  async function save() {
    if (!token) return
    if (!form.title.trim()) {
      setNotice('Title is required.')
      return
    }

    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (editing?.id) {
        const updated = await apiRequest(`/products/${encodeURIComponent(editing.id)}`, { method: 'PATCH', token, body: form })
        setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        setNotice('Product updated.')
      } else {
        const created = await apiRequest('/products', { method: 'POST', token, body: form })
        setItems((prev) => [created, ...prev])
        setNotice('Product created.')
      }
      setModalOpen(false)
      setEditing(null)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function remove(productId) {
    if (!token || !productId) return
    const ok = window.confirm('Delete this product?')
    if (!ok) return
    setError('')
    setNotice('')
    try {
      await apiRequest(`/products/${encodeURIComponent(productId)}`, { method: 'DELETE', token })
      setItems((prev) => prev.filter((p) => p.id !== productId))
      setNotice('Product deleted.')
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  if (!canManageProducts(role)) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-lg font-bold text-slate-900">Product Management</p>
          <p className="mt-2 text-sm text-slate-600">Your account type cannot manage products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-extrabold text-slate-900">Product Management</p>
            <p className="text-[11px] text-slate-500">Buying houses and factories can post products. Video links may be reviewed.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
          >
            + Create product
          </button>
        </div>

        {notice ? <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-800">{notice}</div> : null}
        {error ? <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-800">{error}</div> : null}

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}
          {!loading && !items.length ? <div className="text-sm text-slate-600">No products yet.</div> : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
                <p className="mt-1 text-xs text-slate-600">{p.category || '—'} • MOQ {p.moq || '—'} • Lead {p.lead_time_days || '—'}</p>
                <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                {p.hasVideo ? <p className="mt-2 text-xs font-semibold text-indigo-700">Video available</p> : null}
                <p className="mt-2 text-[11px] text-slate-500">Video status: {String(p.video_review_status || 'approved').replaceAll('_', ' ')}</p>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                  <button onClick={() => remove(p.id)} className="flex-1 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} aria-label="Close modal" />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <p className="text-sm font-bold text-slate-900">{editing ? 'Edit product' : 'Create product'}</p>
              <p className="text-[11px] text-slate-500">No music uploads. Video must be a trusted link (YouTube/Vimeo/etc).</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Category (e.g. Shirts)" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Material (e.g. Cotton)" value={form.material} onChange={(e) => setForm((prev) => ({ ...prev, material: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="MOQ" value={form.moq} onChange={(e) => setForm((prev) => ({ ...prev, moq: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Lead time (days)" value={form.lead_time_days} onChange={(e) => setForm((prev) => ({ ...prev, lead_time_days: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Video URL (optional)" value={form.video_url} onChange={(e) => setForm((prev) => ({ ...prev, video_url: e.target.value }))} />
              <textarea className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 text-sm min-h-[120px]" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
            </div>
            <div className="px-5 py-4 border-t border-slate-200 bg-white flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button disabled={saving} onClick={save} className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

