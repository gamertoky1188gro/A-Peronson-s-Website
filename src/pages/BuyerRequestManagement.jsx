import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken, API_BASE } from '../lib/auth'

// Roles allowed by router:
// - buyer: create requests + see own requests + browse redacted summaries
// - buying_house/admin: manage lead queue + assign requests to agents

const EMPTY_FORM = {
  title: '',
  product: '',
  industry: '',
  category: '',
  quantity: '',
  moq: '',
  priceRange: '',
  fabric: '',
  gsm: '',
  sizeRange: '',
  colorPantone: '',
  customization: '',
  techpackAccepted: false,
  sampleAvailable: '',
  sampleLeadTime: '',
  targetMarket: '',
  deliveryTimeline: '',
  incoterms: '',
  paymentTerms: '',
  documentReady: '',
  auditDate: '',
  languageSupport: '',
  shippingTerms: '',
  certifications: '',
  trimsWash: '',
  sampleTimeline: '',
  packaging: '',
  complianceNotes: '',
  complianceDetails: '',
  customDescription: '',
}

function splitCsv(value) {
  return String(value || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

function formToPayload(form) {
  return {
    title: form.title,
    product: form.product || form.category,
    industry: form.industry,
    category: form.category || form.product,
    quantity: form.quantity,
    moq: form.moq,
    price_range: form.priceRange,
    material: form.fabric,
    fabric_gsm: form.gsm,
    size_range: form.sizeRange,
    color_pantone: form.colorPantone,
    customization_capabilities: form.customization,
    techpack_accepted: Boolean(form.techpackAccepted),
    sample_available: form.sampleAvailable,
    sample_lead_time_days: form.sampleLeadTime,
    target_market: form.targetMarket,
    delivery_timeline: form.deliveryTimeline,
    incoterms: form.incoterms,
    payment_terms: form.paymentTerms,
    document_ready: form.documentReady,
    audit_date: form.auditDate,
    language_support: form.languageSupport,
    shipping_terms: form.shippingTerms,
    certifications_required: splitCsv(form.certifications),
    trims_wash: form.trimsWash,
    sample_timeline: form.sampleTimeline,
    packaging: form.packaging,
    compliance_notes: form.complianceNotes,
    compliance_details: form.complianceDetails,
    custom_description: form.customDescription,
  }
}

function requirementToForm(req) {
  return {
    title: req.title || '',
    product: req.product || '',
    industry: req.industry || '',
    category: req.category || '',
    quantity: req.quantity || '',
    moq: req.moq || '',
    priceRange: req.price_range || '',
    fabric: req.material || '',
    gsm: req.fabric_gsm || '',
    sizeRange: req.size_range || '',
    colorPantone: req.color_pantone || '',
    customization: req.customization_capabilities || '',
    techpackAccepted: Boolean(req.techpack_accepted),
    sampleAvailable: req.sample_available || '',
    sampleLeadTime: req.sample_lead_time_days || '',
    targetMarket: req.target_market || '',
    deliveryTimeline: req.delivery_timeline || req.timeline_days || '',
    incoterms: req.incoterms || '',
    paymentTerms: req.payment_terms || '',
    documentReady: req.document_ready || '',
    auditDate: req.audit_date || '',
    languageSupport: req.language_support || '',
    shippingTerms: req.shipping_terms || '',
    certifications: Array.isArray(req.certifications_required) ? req.certifications_required.join(', ') : '',
    trimsWash: req.trims_wash || '',
    sampleTimeline: req.sample_timeline || '',
    packaging: req.packaging || '',
    complianceNotes: req.compliance_notes || '',
    complianceDetails: req.compliance_details || '',
    customDescription: req.custom_description || '',
  }
}

function toPublicFileUrl(filePath = '') {
  if (!filePath) return ''
  const normalized = String(filePath).replace(/\\/g, '/')
  const marker = 'server/uploads/'
  if (normalized.includes(marker)) {
    const suffix = normalized.split(marker)[1]
    return `/uploads/${suffix}`
  }
  if (normalized.startsWith('/uploads/')) return normalized
  if (normalized.startsWith('uploads/')) return `/${normalized}`
  return normalized.startsWith('/') ? normalized : `/${normalized}`
}

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

export default function BuyerRequestManagement() {
  const user = useMemo(() => getCurrentUser(), [])
  const role = String(user?.role || '').toLowerCase()

  const [step, setStep] = useState(1)
  const [moreFieldsOpen, setMoreFieldsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const [requests, setRequests] = useState([])
  const [browse, setBrowse] = useState([])
  const [agents, setAgents] = useState([])
  const [attachmentsByRequest, setAttachmentsByRequest] = useState({})
  const [uploadingAttachmentId, setUploadingAttachmentId] = useState('')
  const [attachmentFeedback, setAttachmentFeedback] = useState('')
  const [attachmentTypeByRequest, setAttachmentTypeByRequest] = useState({})

  const [loading, setLoading] = useState(true)
  const [loadingBrowse, setLoadingBrowse] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editingId, setEditingId] = useState('')
  const [editForm, setEditForm] = useState(EMPTY_FORM)

  const token = useMemo(() => getToken(), [])

  const loadRequests = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/requirements', { token })
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load buyer requests.')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [token])

  const loadBrowse = useCallback(async () => {
    if (!token || role !== 'buyer') return
    setLoadingBrowse(true)
    try {
      const data = await apiRequest('/requirements/browse', { token })
      setBrowse(Array.isArray(data) ? data : [])
    } catch {
      setBrowse([])
    } finally {
      setLoadingBrowse(false)
    }
  }, [role, token])

  const loadAgents = useCallback(async () => {
    if (!token) return
    if (!(role === 'buying_house' || role === 'admin')) return
    try {
      const data = await apiRequest('/org/members', { token })
      setAgents(Array.isArray(data?.members) ? data.members : [])
    } catch {
      setAgents([])
    }
  }, [role, token])

  const loadAttachments = useCallback(async (requirementId) => {
    if (!token || !requirementId) return
    try {
      const data = await apiRequest(`/documents*entity_type=buyer_request&entity_id=${encodeURIComponent(requirementId)}`, { token })
      setAttachmentsByRequest((prev) => ({ ...prev, [requirementId]: Array.isArray(data) ? data : [] }))
    } catch {
      setAttachmentsByRequest((prev) => ({ ...prev, [requirementId]: [] }))
    }
  }, [token])

  const uploadAttachment = useCallback(async (requirementId, file, type = 'reference') => {
    if (!token || !requirementId || !file) return
    setAttachmentFeedback('')
    setUploadingAttachmentId(requirementId)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('entity_type', 'buyer_request')
      formData.append('entity_id', requirementId)
      formData.append('type', type || 'reference')

      const res = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Upload failed')
      }
      await res.json().catch(() => ({}))
      setAttachmentFeedback('Attachment uploaded.')
      await loadAttachments(requirementId)
    } catch (err) {
      setAttachmentFeedback(err.message || 'Attachment upload failed')
    } finally {
      setUploadingAttachmentId('')
    }
  }, [loadAttachments, token])

  const removeAttachment = useCallback(async (documentId, requirementId) => {
    if (!token || !documentId) return
    setAttachmentFeedback('')
    try {
      await apiRequest(`/documents/${encodeURIComponent(documentId)}`, { method: 'DELETE', token })
      if (requirementId) await loadAttachments(requirementId)
      setAttachmentFeedback('Attachment removed.')
    } catch (err) {
      setAttachmentFeedback(err.message || 'Failed to remove attachment.')
    }
  }, [loadAttachments, token])

  useEffect(() => {
    loadRequests()
    loadBrowse()
    loadAgents()
  }, [loadAgents, loadBrowse, loadRequests])

  async function createRequest() {
    if (!token) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await apiRequest('/requirements', { method: 'POST', token, body: formToPayload(form) })
      setSuccess('Buyer request posted.')
      setForm(EMPTY_FORM)
      setStep(1)
      await loadRequests()
      await loadBrowse()
    } catch (err) {
      setError(err.message || 'Failed to post buyer request.')
    } finally {
      setSaving(false)
    }
  }

  function startEditing(req) {
    setEditingId(req.id)
    setEditForm(requirementToForm(req))
    setSuccess('')
    setError('')
  }

  async function saveEdit() {
    if (!token || !editingId) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await apiRequest(`/requirements/${encodeURIComponent(editingId)}`, { method: 'PATCH', token, body: formToPayload(editForm) })
      setSuccess('Request updated.')
      setEditingId('')
      setEditForm(EMPTY_FORM)
      await loadRequests()
      await loadBrowse()
    } catch (err) {
      setError(err.message || 'Failed to update request.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteRequest(id) {
    if (!token || !id) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await apiRequest(`/requirements/${encodeURIComponent(id)}`, { method: 'DELETE', token })
      setSuccess('Request deleted.')
      await loadRequests()
      await loadBrowse()
    } catch (err) {
      setError(err.message || 'Failed to delete request.')
    } finally {
      setSaving(false)
    }
  }

  async function assignRequest(requirementId, agentId) {
    if (!token || !requirementId) return
    setError('')
    setSuccess('')
    try {
      await apiRequest(`/requirements/${encodeURIComponent(requirementId)}`, {
        method: 'PATCH',
        token,
        body: { assigned_agent_id: agentId || '' },
      })
      setSuccess('Assignment updated.')
      await loadRequests()
    } catch (err) {
      setError(err.message || 'Failed to assign request.')
    }
  }

  const myRequests = useMemo(() => {
    if (role === 'buyer') return requests
    // Buying house/admin: we show all open requests in the lead queue by default.
    return requests.filter((r) => String(r.status || 'open').toLowerCase() === 'open')
  }, [requests, role])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {role === 'buyer' ? 'Post Buyer Request' : 'Buyer Request Management'}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {role === 'buyer'
                ? 'Create structured requests so factories and buying houses can compare requirements quickly.'
                : 'Lead queue for buyer requests. Use Assign to route a request to a specific agent.'}
            </p>
          </div>
          {role !== 'buyer' ? (
            <Link
              to="/owner"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
            >
              Back to Dashboard
            </Link>
          ) : null}
        </div>

        {error ? <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">{error}</div> : null}
        {success ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200">{success}</div> : null}
        {attachmentFeedback ? <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">{attachmentFeedback}</div> : null}

        {/* Buyer-only: structured posting flow (progressive disclosure). */}
        {role === 'buyer' ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Step {step} of 3</div>
              <button
                type="button"
                className="text-xs font-semibold text-[var(--gt-blue)]"
                onClick={() => setMoreFieldsOpen((v) => !v)}
              >
                {moreFieldsOpen ? 'Hide more fields' : 'More fields'}
              </button>
            </div>

            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Request title" hint="Example: Denim jacket -- 10k pcs, wash + trims">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </Field>
                <Field label="Product / Category">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </Field>
                <Field label="Industry (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                </Field>
                <Field label="Quantity">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                </Field>
                <Field label="MOQ (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} />
                </Field>
                <Field label="Price range (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} />
                </Field>
                <div className="md:col-span-2 flex gap-2">
                  <button type="button" className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)]" onClick={() => setStep(2)}>
                    Continue
                  </button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Fabric / Material">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
                </Field>
                <Field label="GSM">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.gsm} onChange={(e) => setForm({ ...form, gsm: e.target.value })} />
                </Field>
                <Field label="Size range (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.sizeRange} onChange={(e) => setForm({ ...form, sizeRange: e.target.value })} />
                </Field>
                <Field label="Color / Pantone (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.colorPantone} onChange={(e) => setForm({ ...form, colorPantone: e.target.value })} />
                </Field>
                <Field label="Customization capability (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.customization} onChange={(e) => setForm({ ...form, customization: e.target.value })} />
                </Field>
                <Field label="Techpack accepted">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={form.techpackAccepted} onChange={(e) => setForm({ ...form, techpackAccepted: e.target.checked })} />
                    Accept techpacks
                  </label>
                </Field>
                <Field label="Sample available (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.sampleAvailable} onChange={(e) => setForm({ ...form, sampleAvailable: e.target.value })} placeholder="Yes/No" />
                </Field>
                <Field label="Sample lead time (days)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.sampleLeadTime} onChange={(e) => setForm({ ...form, sampleLeadTime: e.target.value })} />
                </Field>
                <Field label="Target market">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.targetMarket} onChange={(e) => setForm({ ...form, targetMarket: e.target.value })} />
                </Field>
                <Field label="Delivery timeline">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.deliveryTimeline} onChange={(e) => setForm({ ...form, deliveryTimeline: e.target.value })} />
                </Field>
                <Field label="Incoterms (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })} />
                </Field>
                <Field label="Payment terms (optional)">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
                </Field>
                <Field label="Shipping terms">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.shippingTerms} onChange={(e) => setForm({ ...form, shippingTerms: e.target.value })} />
                </Field>
                <Field label="Certifications (comma separated)" hint="Example: GOTS, OEKO-TEX, BSCI">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
                </Field>
                <div className="md:col-span-2 flex gap-2">
                  <button type="button" className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)]" onClick={() => setStep(3)}>
                    Continue
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setStep(1)}>
                    Back
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                {moreFieldsOpen ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Trims / Wash (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.trimsWash} onChange={(e) => setForm({ ...form, trimsWash: e.target.value })} />
                    </Field>
                    <Field label="Sample timeline (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.sampleTimeline} onChange={(e) => setForm({ ...form, sampleTimeline: e.target.value })} />
                    </Field>
                    <Field label="Packaging (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.packaging} onChange={(e) => setForm({ ...form, packaging: e.target.value })} />
                    </Field>
                    <Field label="Compliance notes (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.complianceNotes} onChange={(e) => setForm({ ...form, complianceNotes: e.target.value })} />
                    </Field>
                    <Field label="Compliance details (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.complianceDetails} onChange={(e) => setForm({ ...form, complianceDetails: e.target.value })} />
                    </Field>
                    <Field label="Document readiness (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.documentReady} onChange={(e) => setForm({ ...form, documentReady: e.target.value })} />
                    </Field>
                    <Field label="Last audit date (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.auditDate} onChange={(e) => setForm({ ...form, auditDate: e.target.value })} />
                    </Field>
                    <Field label="Language support (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.languageSupport} onChange={(e) => setForm({ ...form, languageSupport: e.target.value })} />
                    </Field>
                  </div>
                ) : null}

                <Field label="Custom description" hint="Add detailed specs, designs, tech packs, trims, washes, and negotiation notes.">
                  <textarea className="w-full min-h-[140px] rounded-lg border border-slate-200 px-3 py-2" value={form.customDescription} onChange={(e) => setForm({ ...form, customDescription: e.target.value })} />
                </Field>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={createRequest}
                    className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)] disabled:opacity-70"
                  >
                    {saving ? 'Posting...' : 'Post Request'}
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setStep(2)}>
                    Back
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Lead queue for Buying House/Admin */}
        {role === 'buying_house' || role === 'admin' ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Open Buyer Requests</h2>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold">Assign</span> routes a request to an Agent ID so teammates don’t overlap work.
                </p>
              </div>
              <button type="button" onClick={loadRequests} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                Refresh
              </button>
            </div>

            {loading ? <div className="text-sm text-slate-600">Loading...</div> : null}
            {!loading && myRequests.length === 0 ? <div className="text-sm text-slate-600">No open requests.</div> : null}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th className="py-2 pr-3">Title</th>
                    <th className="py-2 pr-3">Qty</th>
                    <th className="py-2 pr-3">Target</th>
                    <th className="py-2 pr-3">Delivery</th>
                    <th className="py-2 pr-3">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((r) => (
                    <tr key={r.id} className="border-t border-slate-200/60">
                      <td className="py-2 pr-3">
                        <div className="font-semibold text-slate-900">{r.title || r.category || 'Buyer Request'}</div>
                        <div className="text-xs text-slate-500">Buyer: {String(r.buyer_id || '').slice(0, 8)}...</div>
                        {r.ai_summary ? <div className="mt-1 text-[11px] text-slate-500">{r.ai_summary}</div> : null}
                      </td>
                      <td className="py-2 pr-3">{r.quantity || '--'}</td>
                      <td className="py-2 pr-3">{r.target_market || '--'}</td>
                      <td className="py-2 pr-3">{r.delivery_timeline || r.timeline_days || '--'}</td>
                      <td className="py-2 pr-3">
                        <select
                          className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                          value={r.assigned_agent_id || ''}
                          onChange={(e) => assignRequest(r.id, e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {agents.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.member_id})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Buyer-only: My Requests */}
        {role === 'buyer' ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">My Requests</h2>
              <button type="button" onClick={loadRequests} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                Refresh
              </button>
            </div>

            {loading ? <div className="text-sm text-slate-600">Loading...</div> : null}
            {!loading && myRequests.length === 0 ? <div className="text-sm text-slate-600">No requests yet.</div> : null}

            <div className="space-y-3">
              {myRequests.map((r) => {
                const attachments = attachmentsByRequest[r.id] || []
                const selectedType = attachmentTypeByRequest[r.id] || 'tech_pack'
                return (
                <div key={r.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
                  {editingId === r.id ? (
                    <div className="space-y-3">
                      <Field label="Title">
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                      </Field>
                      <Field label="Category">
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                      </Field>
                      <Field label="Quantity">
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} />
                      </Field>
                      <Field label="Custom description">
                        <textarea className="w-full min-h-[120px] rounded-lg border border-slate-200 px-3 py-2" value={editForm.customDescription} onChange={(e) => setEditForm({ ...editForm, customDescription: e.target.value })} />
                      </Field>
                      <div className="flex gap-2">
                        <button type="button" disabled={saving} className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)] disabled:opacity-70" onClick={saveEdit}>
                          Save
                        </button>
                        <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setEditingId('')}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                        <div className="font-semibold text-slate-900">{r.title || r.category || 'Buyer Request'}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          Qty {r.quantity || '--'} - {r.material || '--'} - Target {r.target_market || '--'} - Delivery {r.delivery_timeline || r.timeline_days || '--'}
                        </div>
                      </div>
                        <div className="shrink-0 flex gap-2">
                        <button type="button" className="rounded-full bg-[var(--gt-blue)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--gt-blue-hover)]" onClick={() => startEditing(r)}>
                          Edit
                        </button>
                        <button type="button" className="rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50" onClick={() => deleteRequest(r.id)}>
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-700">Attachments</p>
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-[var(--gt-blue)]"
                          onClick={() => loadAttachments(r.id)}
                        >
                          Refresh
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {attachments.length ? attachments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between gap-2 rounded-lg bg-white px-2 py-2 ring-1 ring-slate-200/60">
                            <a
                              className="text-xs font-semibold text-slate-700 truncate"
                              href={toPublicFileUrl(doc.file_path)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {doc.type || 'Attachment'}: {doc.file_path ? String(doc.file_path).split(/[\\/]/).pop() : 'File'}
                            </a>
                            <button
                              type="button"
                              className="text-[11px] font-semibold text-rose-600"
                              onClick={() => removeAttachment(doc.id, r.id)}
                            >
                              Remove
                            </button>
                          </div>
                        )) : (
                          <div className="text-[11px] text-slate-500">No attachments uploaded yet.</div>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <select
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                          value={selectedType}
                          onChange={(e) => setAttachmentTypeByRequest((prev) => ({ ...prev, [r.id]: e.target.value }))}
                        >
                          <option value="tech_pack">Tech pack</option>
                          <option value="sketch">Sketch</option>
                          <option value="reference_image">Reference image</option>
                          <option value="compliance">Compliance</option>
                          <option value="other">Other</option>
                        </select>
                        <label className="text-xs font-semibold text-[var(--gt-blue)] cursor-pointer">
                          {uploadingAttachmentId === r.id ? 'Uploading...' : 'Upload file'}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              if (file) uploadAttachment(r.id, file, selectedType)
                              event.target.value = ''
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )})}
            </div>
          </div>
        ) : null}

        {/* Buyer-only: Browse Requests (redacted) */}
        {role === 'buyer' ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Browse Requests (Summary Only)</h2>
                <p className="text-xs text-slate-500">You can research market demand, but full details remain private.</p>
              </div>
              <button type="button" onClick={loadBrowse} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                {loadingBrowse ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {!browse.length ? <div className="text-sm text-slate-600">No requests to browse yet.</div> : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {browse
                .filter((r) => r.buyer_id !== user?.id)
                .slice(0, 12)
                .map((r) => (
                  <div key={r.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/60 dark:bg-slate-950/30 dark:ring-white/10">
                    <div className="font-semibold text-slate-900">{r.title || r.category || 'Buyer Request'}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Qty {r.quantity || '--'} - {r.material || '--'} - Target {r.target_market || '--'} - Delivery {r.delivery_timeline || '--'}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link to={`/buyer/${encodeURIComponent(r.buyer_id)}`} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-800 ring-1 ring-slate-200/70 hover:bg-slate-50">
                        View Buyer Profile
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

