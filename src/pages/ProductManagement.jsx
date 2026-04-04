import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
import { trackClientEvent } from '../lib/events'

const EMPTY_FORM = {
  title: '',
  industry: '',
  category: '',
  material: '',
  moq: '',
  price_range: '',
  lead_time_days: '',
  fabric_gsm: '',
  size_range: '',
  color_pantone: '',
  customization_capabilities: '',
  sample_available: '',
  sample_lead_time_days: '',
  description: '',
  video_url: '',
  image_urls: [],
  cover_image_url: '',
  status: 'published',
}

function canManageProducts(user) {
  const role = String(user?.role || '')
  if (['factory', 'buying_house', 'admin', 'owner'].includes(role)) return true
  if (role === 'agent') return Boolean(user?.permission_matrix?.products?.edit)
  return false
}

export default function ProductManagement() {
  const token = useMemo(() => getToken(), [])
  const user = useMemo(() => getCurrentUser(), [])
  const canManage = canManageProducts(user)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [mediaGallery, setMediaGallery] = useState([])
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaBusy, setMediaBusy] = useState(false)
  const [mediaNotice, setMediaNotice] = useState('')
  const [videoBusy, setVideoBusy] = useState(false)
  const [videoNotice, setVideoNotice] = useState('')
  const [complianceChecked, setComplianceChecked] = useState(false)

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
    setMediaNotice('')
    setMediaGallery([])
    setMediaUrl('')
    setComplianceChecked(false)
    setVideoNotice('')
    setAdvancedOpen(false)
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditing(item)
    setForm({
      title: item?.title || '',
      industry: item?.industry || '',
      category: item?.category || '',
      material: item?.material || '',
      moq: item?.moq || '',
      price_range: item?.price_range || '',
      lead_time_days: item?.lead_time_days || '',
      fabric_gsm: item?.fabric_gsm || '',
      size_range: item?.size_range || '',
      color_pantone: item?.color_pantone || '',
      customization_capabilities: item?.customization_capabilities || '',
      sample_available: item?.sample_available || '',
      sample_lead_time_days: item?.sample_lead_time_days || '',
      description: item?.description || '',
      video_url: item?.video_url || '',
      image_urls: Array.isArray(item?.image_urls) ? item.image_urls : [],
      cover_image_url: item?.cover_image_url || '',
      status: item?.status || 'published',
    })
    setNotice('')
    setMediaNotice('')
    setMediaGallery(Array.isArray(item?.image_gallery) ? item.image_gallery : [])
    setMediaUrl('')
    setComplianceChecked(false)
    setVideoNotice('')
    setAdvancedOpen(false)
    setModalOpen(true)
  }

  async function save() {
    if (!token) return
    if (!form.title.trim()) {
      setNotice('Title is required.')
      return
    }
    if (!complianceChecked) {
      setNotice('Please confirm the media compliance checklist before saving.')
      return
    }
    if (form.video_url && !isInternalMediaUrl(form.video_url)) {
      setNotice('Video URL must be an internal /uploads/... path.')
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
        if (editing?.status !== updated.status && updated.status === 'published') {
          trackClientEvent('product_published', { entityType: 'product', entityId: updated.id })
        }
      } else {
        const created = await apiRequest('/products', { method: 'POST', token, body: form })
        setItems((prev) => [created, ...prev])
        setNotice('Product created.')
        if (created?.status === 'published') {
          trackClientEvent('product_published', { entityType: 'product', entityId: created.id })
        }
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
    const ok = window.confirm('Delete this product*')
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

  async function reportProductAppeal(product) {
    if (!token || !product?.id) return
    const reason = window.prompt('Explain why this product should be approved:') || ''
    if (!reason.trim()) return
    try {
      await apiRequest('/reports/product-appeal', {
        method: 'POST',
        token,
        body: { product_id: product.id, reason },
      })
      setNotice('Appeal submitted. Our team will review it shortly.')
    } catch (err) {
      setError(err.message || 'Unable to submit appeal.')
    }
  }

  function toPublicUrl(filePath = '') {
    if (!filePath) return ''
    const normalized = String(filePath).replace(/\\/g, '/')
    if (normalized.startsWith('/uploads/')) return normalized
    const idx = normalized.indexOf('server/uploads/')
    if (idx >= 0) return `/uploads/${normalized.slice(idx + 'server/uploads/'.length)}`
    return normalized.startsWith('uploads/') ? `/${normalized}` : normalized
  }

  function isInternalMediaUrl(value) {
    if (!value) return false
    const normalized = String(value).replace(/\\/g, '/')
    return normalized.startsWith('/uploads/') || normalized.startsWith('uploads/') || normalized.includes('server/uploads/')
  }

  async function syncProductMedia(nextForm) {
    if (!editing?.id || !token) return
    setMediaBusy(true)
    setMediaNotice('')
    try {
      const updated = await apiRequest(`/products/${encodeURIComponent(editing.id)}`, {
        method: 'PATCH',
        token,
        body: {
          image_urls: nextForm.image_urls,
          cover_image_url: nextForm.cover_image_url,
        },
      })
      setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditing(updated)
      setForm((prev) => ({
        ...prev,
        image_urls: Array.isArray(updated.image_urls) ? updated.image_urls : prev.image_urls,
        cover_image_url: updated.cover_image_url || prev.cover_image_url,
        status: updated.status || prev.status,
      }))
      setMediaGallery(Array.isArray(updated.image_gallery) ? updated.image_gallery : [])
      trackClientEvent('product_media_updated', { entityType: 'product', entityId: updated.id })
    } catch (err) {
      setMediaNotice(err.message || 'Unable to update product media')
    } finally {
      setMediaBusy(false)
    }
  }

  async function syncProductVideo(nextVideoUrl) {
    if (!editing?.id || !token) return
    setVideoBusy(true)
    setVideoNotice('')
    try {
      const updated = await apiRequest(`/products/${encodeURIComponent(editing.id)}`, {
        method: 'PATCH',
        token,
        body: { video_url: nextVideoUrl || '' },
      })
      setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditing(updated)
      setForm((prev) => ({
        ...prev,
        video_url: updated.video_url || '',
        status: updated.status || prev.status,
      }))
      trackClientEvent('product_video_updated', { entityType: 'product', entityId: updated.id })
    } catch (err) {
      setVideoNotice(err.message || 'Unable to update product video')
    } finally {
      setVideoBusy(false)
    }
  }

  async function handleUploadFiles(files) {
    if (!editing?.id || !token) {
      setMediaNotice('Save the product first to upload images.')
      return
    }
    if (!files || !files.length) return
    setMediaBusy(true)
    setMediaNotice('')
    try {
      const uploadedEntries = []
      for (const file of files) {
        const body = new FormData()
        body.append('file', file)
        body.append('entity_type', 'company_product')
        body.append('entity_id', editing.id)
        body.append('type', 'image')

        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/documents`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Image upload failed')
        uploadedEntries.push({
          document_id: data.id,
          source_path: data.file_path || data.url || '',
          url: toPublicUrl(data.file_path || data.url || ''),
          status: data.moderation_status || 'pending_review',
          flags: Array.isArray(data.moderation_flags) ? data.moderation_flags : [],
        })
        trackClientEvent('product_image_uploaded', { entityType: 'product', entityId: editing.id, metadata: { document_id: data.id } })
      }

      const nextForm = {
        ...form,
        image_urls: Array.from(new Set([...(form.image_urls || []), ...uploadedEntries.map((e) => e.source_path).filter(Boolean)])),
        cover_image_url: form.cover_image_url || uploadedEntries[0]?.source_path || '',
      }
      setForm(nextForm)
      setMediaGallery((prev) => [...prev, ...uploadedEntries])
      await syncProductMedia(nextForm)
    } catch (err) {
      setMediaNotice(err.message || 'Image upload failed')
    } finally {
      setMediaBusy(false)
    }
  }

  async function handleUploadVideo(file) {
    if (!editing?.id || !token) {
      setVideoNotice('Save the product first to upload a video.')
      return
    }
    if (!file) return
    setVideoBusy(true)
    setVideoNotice('')
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('entity_type', 'company_product')
      body.append('entity_id', editing.id)
      body.append('type', 'video')

      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Video upload failed')

      const sourcePath = data.file_path || data.url || ''
      if (!isInternalMediaUrl(sourcePath)) {
        throw new Error('Only internal uploads are allowed for video.')
      }
      await syncProductVideo(sourcePath)
      setVideoNotice('Video uploaded and pending review.')
      trackClientEvent('product_video_uploaded', { entityType: 'product', entityId: editing.id, metadata: { document_id: data.id } })
    } catch (err) {
      setVideoNotice(err.message || 'Video upload failed')
    } finally {
      setVideoBusy(false)
    }
  }

  async function handleAddMediaUrl() {
    if (!editing?.id || !token) {
      setMediaNotice('Save the product first to add media URLs.')
      return
    }
    const url = mediaUrl.trim()
    if (!url) return
    if (!isInternalMediaUrl(url)) {
      setMediaNotice('Only internal /uploads/... image URLs are allowed.')
      return
    }
    setMediaBusy(true)
    setMediaNotice('')
    try {
      const data = await apiRequest('/documents/url', {
        method: 'POST',
        token,
        body: {
          entity_type: 'company_product',
          entity_id: editing.id,
          type: 'image',
          url,
        },
      })
      const entry = {
        document_id: data.id,
        source_path: data.file_path || data.url || url,
        url: data.file_path ? toPublicUrl(data.file_path) : url,
        status: data.moderation_status || 'pending_review',
        flags: Array.isArray(data.moderation_flags) ? data.moderation_flags : [],
      }
      const nextForm = {
        ...form,
        image_urls: Array.from(new Set([...(form.image_urls || []), entry.source_path].filter(Boolean))),
        cover_image_url: form.cover_image_url || entry.source_path || '',
      }
      setMediaUrl('')
      setForm(nextForm)
      setMediaGallery((prev) => [...prev, entry])
      await syncProductMedia(nextForm)
      trackClientEvent('product_image_url_added', { entityType: 'product', entityId: editing.id, metadata: { document_id: data.id } })
    } catch (err) {
      setMediaNotice(err.message || 'Unable to register image URL')
    } finally {
      setMediaBusy(false)
    }
  }

  async function handleSetCover(entry) {
    if (!entry || !editing?.id) return
    const coverSource = entry.source_path || entry.url || ''
    const nextForm = { ...form, cover_image_url: coverSource }
    setForm(nextForm)
    await syncProductMedia(nextForm)
  }

  async function handleRemoveMedia(entry) {
    if (!entry) return
    const nextUrls = (form.image_urls || []).filter((url) => url !== entry.source_path)
    const nextCover = form.cover_image_url === entry.source_path ? (nextUrls[0] || '') : form.cover_image_url
    const nextForm = { ...form, image_urls: nextUrls, cover_image_url: nextCover }
    setForm(nextForm)
    setMediaGallery((prev) => prev.filter((item) => item.source_path !== entry.source_path))
    if (entry.document_id) {
      try {
        await apiRequest(`/documents/${encodeURIComponent(entry.document_id)}`, { method: 'DELETE', token })
      } catch {
        // ignore delete failure
      }
    }
    await syncProductMedia(nextForm)
    trackClientEvent('product_image_removed', { entityType: 'product', entityId: editing?.id || '' })
  }

  if (!canManage) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl borderless-shadow p-6">
          <p className="text-lg font-bold text-slate-900">Product Management</p>
          <p className="mt-2 text-sm text-slate-600">Your account does not have permission to manage products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl borderless-shadow p-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-extrabold text-slate-900">Product Management</p>
            <p className="text-[11px] text-slate-500">Buying houses and factories can post products. Drafts stay private; published items go live after media review.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
          >
            + Create product
          </button>
        </div>

        {notice ? <div className="bg-emerald-50 borderless-shadow rounded-2xl p-4 text-sm text-emerald-800">{notice}</div> : null}
        {error ? <div className="bg-rose-50 borderless-shadow rounded-2xl p-4 text-sm text-rose-800">{error}</div> : null}

        <div className="rounded-2xl borderless-shadow bg-slate-50 p-4 text-xs text-slate-600">
          <p className="text-sm font-semibold text-slate-800">Media & publishing help</p>
          <p className="mt-2">Upload product images/videos inside GarTexHub. Only internal /uploads/... URLs are allowed. Pending or rejected media stays hidden from buyers.</p>
          <p className="mt-1">Use Draft to keep items private while preparing your gallery; switch to Published when ready.</p>
        </div>

        <div className="bg-white rounded-2xl borderless-shadow p-4">
          {loading ? <div className="text-sm text-slate-600">Loading...</div> : null}
          {!loading && !items.length ? <div className="text-sm text-slate-600">No products yet.</div> : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((p) => (
              <div key={p.id} className="rounded-2xl borderless-shadow bg-white p-4">
                {p.cover_image_public_url ? (
                  <img src={p.cover_image_public_url} alt={p.title || 'Product'} className="h-32 w-full rounded-xl object-cover mb-3" />
                ) : null}
                <p className="text-sm font-bold text-slate-900">{p.title || 'Product'}</p>
                <p className="mt-1 text-xs text-slate-600">{p.category || '--'} - MOQ {p.moq || '--'} - Lead {p.lead_time_days || '--'}</p>
                <p className="mt-2 text-sm text-slate-700 line-clamp-3">{p.description || ''}</p>
                {p.hasVideo ? <p className="mt-2 text-xs font-semibold text-indigo-700">Video available</p> : null}
                <p className="mt-2 text-[11px] text-slate-500">Status: {String(p.status || 'published')}</p>
                <p className="mt-1 text-[11px] text-slate-500">Video status: {String(p.video_review_status || 'approved').replaceAll('_', ' ')}</p>
                <p className="mt-1 text-[11px] text-slate-500">Content review: {String(p.content_review_status || 'approved').replaceAll('_', ' ')}</p>
                {p.content_review_status === 'rejected' ? (
                  <div className="mt-2 rounded-xl borderless-shadow bg-rose-50 p-3 text-[11px] text-rose-700">
                    <p className="font-semibold">Rejected</p>
                    <p className="mt-1">{p.content_review_reason || 'This product needs changes to meet content standards.'}</p>
                    <button
                      type="button"
                      onClick={() => reportProductAppeal(p)}
                      className="mt-2 w-full rounded-full bg-rose-600 px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      If you think this is a mistake, report it for review
                    </button>
                  </div>
                ) : null}
                {p.content_review_status === 'pending_review' ? (
                  <div className="mt-2 rounded-xl borderless-shadow bg-amber-50 p-3 text-[11px] text-amber-700">
                    Pending review. We will check this item shortly.
                  </div>
                ) : null}
                {Array.isArray(p.image_gallery) && p.image_gallery.length ? (
                  <p className="mt-1 text-[11px] text-slate-500">Images: {p.image_gallery.length}</p>
                ) : null}

                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                  <button onClick={() => remove(p.id)} className="flex-1 rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} aria-label="Close modal" />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white borderless-shadow shadow-2xl overflow-hidden">
            <div className="px-5 py-4 borderless-divider-b">
              <p className="text-sm font-bold text-slate-900">{editing ? 'Edit product' : 'Create product'}</p>
              <p className="text-[11px] text-slate-500">No music uploads. Videos and images must be uploaded inside GarTexHub (internal /uploads/... only).</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Industry (optional)" value={form.industry} onChange={(e) => setForm((prev) => ({ ...prev, industry: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Category (e.g. Shirts)" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Material (e.g. Cotton)" value={form.material} onChange={(e) => setForm((prev) => ({ ...prev, material: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="MOQ" value={form.moq} onChange={(e) => setForm((prev) => ({ ...prev, moq: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Price range (optional)" value={form.price_range} onChange={(e) => setForm((prev) => ({ ...prev, price_range: e.target.value }))} />
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Lead time (days)" value={form.lead_time_days} onChange={(e) => setForm((prev) => ({ ...prev, lead_time_days: e.target.value }))} />
              <select className="rounded-xl borderless-shadow px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="published">Published (visible to buyers)</option>
                <option value="draft">Draft (private)</option>
              </select>
              <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Video URL (internal /uploads/...)" value={form.video_url} onChange={(e) => setForm((prev) => ({ ...prev, video_url: e.target.value }))} />
              <textarea className="md:col-span-2 rounded-xl borderless-shadow px-3 py-2 text-sm min-h-[120px]" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((prev) => !prev)}
                  className="text-xs font-semibold text-[#0A66C2]"
                >
                  {advancedOpen ? 'Hide advanced details' : 'Add advanced details'}
                </button>
              </div>
              {advancedOpen ? (
                <>
                  <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Fabric GSM (optional)" value={form.fabric_gsm} onChange={(e) => setForm((prev) => ({ ...prev, fabric_gsm: e.target.value }))} />
                  <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Size range (optional)" value={form.size_range} onChange={(e) => setForm((prev) => ({ ...prev, size_range: e.target.value }))} />
                  <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Color / Pantone (optional)" value={form.color_pantone} onChange={(e) => setForm((prev) => ({ ...prev, color_pantone: e.target.value }))} />
                  <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Customization capabilities (optional)" value={form.customization_capabilities} onChange={(e) => setForm((prev) => ({ ...prev, customization_capabilities: e.target.value }))} />
                  <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sample available (yes/no)" value={form.sample_available} onChange={(e) => setForm((prev) => ({ ...prev, sample_available: e.target.value }))} />
                  <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sample lead time (days)" value={form.sample_lead_time_days} onChange={(e) => setForm((prev) => ({ ...prev, sample_lead_time_days: e.target.value }))} />
                </>
              ) : null}

              <div className="md:col-span-2 rounded-xl borderless-shadow bg-slate-50 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Product video</p>
                  <p className="text-[11px] text-slate-500">Upload MP4/WEBM inside GarTexHub or paste an internal /uploads/... URL. External links are blocked.</p>
                </div>

                {!editing?.id ? (
                  <div className="text-[11px] text-slate-500">Save the product first to upload a video.</div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={(e) => handleUploadVideo(e.target.files?.[0])}
                        disabled={videoBusy}
                        className="text-xs"
                      />
                      <span className="text-[11px] text-slate-500">{videoBusy ? 'Uploading...' : 'MP4/WEBM only'}</span>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        value={form.video_url}
                        onChange={(e) => setForm((prev) => ({ ...prev, video_url: e.target.value }))}
                        placeholder="/uploads/products/videos/..."
                        className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-xs"
                        disabled={videoBusy}
                      />
                      <button
                        type="button"
                        onClick={() => syncProductVideo(form.video_url)}
                        disabled={videoBusy || !form.video_url.trim()}
                        className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Apply URL
                      </button>
                      <button
                        type="button"
                        onClick={() => syncProductVideo('')}
                        disabled={videoBusy}
                        className="rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-600 disabled:opacity-60"
                      >
                        Remove video
                      </button>
                    </div>
                    {videoNotice ? <p className="text-[11px] text-rose-600">{videoNotice}</p> : null}
                    {editing?.video_review_status ? (
                      <p className="text-[11px] text-slate-500">Status: {String(editing.video_review_status).replaceAll('_', ' ')}</p>
                    ) : null}
                  </>
                )}
              </div>

              <div className="md:col-span-2 rounded-xl borderless-shadow bg-slate-50 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Product media</p>
                  <p className="text-[11px] text-slate-500">Upload images or register internal /uploads/... URLs. Pending/rejected media stays hidden from buyers.</p>
                </div>

                {!editing?.id ? (
                  <div className="text-[11px] text-slate-500">Save the product first to upload images.</div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleUploadFiles(e.target.files)}
                        disabled={mediaBusy}
                        className="text-xs"
                      />
                      <span className="text-[11px] text-slate-500">{mediaBusy ? 'Uploading...' : 'PNG/JPG only'}</span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="/uploads/products/images/..."
                        className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-xs"
                        disabled={mediaBusy}
                      />
                      <button
                        type="button"
                        onClick={handleAddMediaUrl}
                        disabled={mediaBusy || !mediaUrl.trim()}
                        className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Add URL
                      </button>
                    </div>

                    {mediaNotice ? <p className="text-[11px] text-rose-600">{mediaNotice}</p> : null}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {mediaGallery.map((entry) => (
                        <div key={entry.source_path || entry.url} className="rounded-xl borderless-shadow bg-white p-2 space-y-2">
                          {entry.url ? (
                            <img src={entry.url} alt="Product media" className="h-28 w-full rounded-lg object-cover" />
                          ) : (
                            <div className="h-28 w-full rounded-lg bg-slate-100" />
                          )}
                          <p className="text-[10px] text-slate-500">Status: {entry.status || 'pending_review'}</p>
                          {entry.flags?.length ? (
                            <p className="text-[10px] text-rose-600">Flags: {entry.flags.slice(0, 2).join(', ')}</p>
                          ) : null}
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleSetCover(entry)}
                              className={`rounded-full px-3 py-1 text-[10px] font-semibold${
                                form.cover_image_url === entry.source_path ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {form.cover_image_url === entry.source_path ? 'Cover' : 'Set cover'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveMedia(entry)}
                              className="rounded-full px-3 py-1 text-[10px] font-semibold text-rose-600 bg-rose-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {!mediaGallery.length ? <p className="text-[11px] text-slate-500">No images yet.</p> : null}
                  </>
                )}
              </div>
            </div>
            <div className="px-5 py-4 borderless-divider-t bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-[11px] text-slate-600">
                <input
                  type="checkbox"
                  checked={complianceChecked}
                  onChange={(e) => setComplianceChecked(e.target.checked)}
                  className="h-4 w-4"
                />
                I confirm this product media contains no music or prohibited instruments.
              </label>
              <div className="flex justify-end gap-2">
                <button onClick={() => setModalOpen(false)} className="rounded-full borderless-shadow px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button disabled={saving || !complianceChecked} onClick={save} className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

