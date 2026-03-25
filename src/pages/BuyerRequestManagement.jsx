import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken, API_BASE } from '../lib/auth'

// Roles allowed by router:
// - buyer: create requests + see own requests + browse redacted summaries
// - buying_house/admin: manage lead queue + assign requests to agents

const EMPTY_FORM = {
  requestType: '',
  title: '',
  industry: '',
  category: '',
  genderTarget: '',
  season: '',
  totalQuantity: '',
  numberOfStyles: '',
  fabricComposition: '',
  fabricWeightGsm: '',
  weaveOrKnit: '',
  sizeRange: '',
  colorRequirement: '',
  styleDescription: '',
  techPackRequired: '',
  targetFobPrice: '',
  incoterms: '',
  destinationPort: '',
  exFactoryDate: '',
  sampleRequired: '',
  sampleType: '',
  paymentTerms: '',
  complianceCerts: [],
  sustainabilityCerts: [],
  complianceNotes: '',
  materialType: '',
  subCategory: '',
  quantity: '',
  unit: '',
  fiberComposition: '',
  fabricWidth: '',
  yarnCount: '',
  threadCount: '',
  finishRequired: '',
  stretchRequired: '',
  color: '',
  pattern: '',
  targetPrice: '',
  priceUnit: '',
  deliveryPort: '',
  leadTimeRequired: '',
  labTestRequired: '',
  swatchFirst: '',
  labCertNotes: '',
  quoteDeadline: '',
  expiresAt: '',
  maxSuppliers: '',
  verifiedOnly: false,
  preferredFactoryLocation: '',
  factorySizePreference: '',
  exportExperiencePreference: '',
  confidentialityToggle: false,
  packagingRequirement: '',
  originLabelRequired: '',
  hangtagBarcode: '',
  partialShipmentAllowed: '',
  shipmentMode: '',
  customFields: [],
  customDescription: '',
}

function formToPayload(form) {
  const isTextile = form.requestType === 'textile'
  const category = isTextile ? form.subCategory : form.category
  const priceRange = isTextile ? form.targetPrice : form.targetFobPrice
  const quantity = isTextile ? form.quantity : form.totalQuantity

  return {
    request_type: form.requestType || 'garments',
    title: form.title,
    industry: form.industry,
    category,
    product: isTextile ? form.materialType : form.category,
    quantity,
    price_range: priceRange,
    incoterms: form.incoterms,
    payment_terms: form.paymentTerms,
    material: isTextile ? form.fiberComposition : form.fabricComposition,
    fabric_gsm: form.fabricWeightGsm,
    size_range: form.sizeRange,
    color_pantone: form.colorRequirement,
    custom_description: form.customDescription,
    quote_deadline: form.quoteDeadline || null,
    expires_at: form.expiresAt || null,
    max_suppliers: form.maxSuppliers || null,
    verified_only: Boolean(form.verifiedOnly),
    custom_fields: Array.isArray(form.customFields) ? form.customFields : [],
    gender_target: form.genderTarget,
    season: form.season,
    number_of_styles: form.numberOfStyles,
    fabric_composition: form.fabricComposition,
    weave_or_knit: form.weaveOrKnit,
    color_requirement: form.colorRequirement,
    style_description: form.styleDescription,
    tech_pack_required: form.techPackRequired,
    destination_port: form.destinationPort,
    ex_factory_date: form.exFactoryDate,
    sample_required: form.sampleRequired,
    sample_type: form.sampleType,
    compliance_certs: Array.isArray(form.complianceCerts) ? form.complianceCerts : [],
    sustainability_certs: Array.isArray(form.sustainabilityCerts) ? form.sustainabilityCerts : [],
    compliance_notes: form.complianceNotes,
    material_type: form.materialType,
    sub_category: form.subCategory,
    unit: form.unit,
    fiber_composition: form.fiberComposition,
    fabric_width: form.fabricWidth,
    yarn_count: form.yarnCount,
    thread_count: form.threadCount,
    finish_required: form.finishRequired,
    stretch_required: form.stretchRequired,
    color: form.color,
    pattern: form.pattern,
    target_price: form.targetPrice,
    price_unit: form.priceUnit,
    delivery_port: form.deliveryPort,
    lead_time_required: form.leadTimeRequired,
    lab_test_required: form.labTestRequired,
    swatch_first: form.swatchFirst,
    lab_cert_notes: form.labCertNotes,
    preferred_factory_location: form.preferredFactoryLocation,
    factory_size_preference: form.factorySizePreference,
    export_experience_preference: form.exportExperiencePreference,
    confidentiality_toggle: Boolean(form.confidentialityToggle),
    packaging_requirement: form.packagingRequirement,
    origin_label_required: form.originLabelRequired,
    hangtag_barcode: form.hangtagBarcode,
    partial_shipment_allowed: form.partialShipmentAllowed,
    shipment_mode: form.shipmentMode,
  }
}

function requirementToForm(req) {
  const specs = req?.specs && typeof req.specs === 'object' ? req.specs : {}
  return {
    ...EMPTY_FORM,
    requestType: req.request_type || 'garments',
    title: req.title || '',
    industry: req.industry || '',
    category: req.category || '',
    genderTarget: specs.gender_target || '',
    season: specs.season || '',
    totalQuantity: req.quantity || '',
    numberOfStyles: specs.number_of_styles || '',
    fabricComposition: specs.fabric_composition || req.material || '',
    fabricWeightGsm: specs.fabric_weight_gsm || req.fabric_gsm || '',
    weaveOrKnit: specs.weave_or_knit || '',
    sizeRange: specs.size_range || req.size_range || '',
    colorRequirement: specs.color_requirement || req.color_pantone || '',
    styleDescription: specs.style_description || '',
    techPackRequired: specs.tech_pack_required || '',
    targetFobPrice: req.price_range || '',
    incoterms: req.incoterms || '',
    destinationPort: specs.destination_port || '',
    exFactoryDate: specs.ex_factory_date || '',
    sampleRequired: specs.sample_required || '',
    sampleType: specs.sample_type || '',
    paymentTerms: specs.payment_terms || req.payment_terms || '',
    complianceCerts: Array.isArray(specs.compliance_certs) ? specs.compliance_certs : [],
    sustainabilityCerts: Array.isArray(specs.sustainability_certs) ? specs.sustainability_certs : [],
    complianceNotes: specs.compliance_notes || req.compliance_notes || '',
    materialType: specs.material_type || '',
    subCategory: specs.sub_category || req.category || '',
    quantity: req.quantity || '',
    unit: specs.unit || '',
    fiberComposition: specs.fiber_composition || '',
    fabricWidth: specs.fabric_width || '',
    yarnCount: specs.yarn_count || '',
    threadCount: specs.thread_count || '',
    finishRequired: specs.finish_required || '',
    stretchRequired: specs.stretch_required || '',
    color: specs.color || '',
    pattern: specs.pattern || '',
    targetPrice: req.price_range || '',
    priceUnit: specs.price_unit || '',
    deliveryPort: specs.delivery_port || '',
    leadTimeRequired: specs.lead_time_required || '',
    labTestRequired: specs.lab_test_required || '',
    swatchFirst: specs.swatch_first || '',
    labCertNotes: specs.lab_cert_notes || '',
    quoteDeadline: req.quote_deadline ? new Date(req.quote_deadline).toISOString().slice(0, 10) : '',
    expiresAt: req.expires_at ? new Date(req.expires_at).toISOString().slice(0, 10) : '',
    maxSuppliers: req.max_suppliers ?? '',
    verifiedOnly: Boolean(req.verified_only),
    preferredFactoryLocation: specs.preferred_factory_location || '',
    factorySizePreference: specs.factory_size_preference || '',
    exportExperiencePreference: specs.export_experience_preference || '',
    confidentialityToggle: Boolean(specs.confidentiality_toggle),
    packagingRequirement: specs.packaging_requirement || '',
    originLabelRequired: specs.origin_label_required || '',
    hangtagBarcode: specs.hangtag_barcode || '',
    partialShipmentAllowed: specs.partial_shipment_allowed || '',
    shipmentMode: specs.shipment_mode || '',
    customFields: Array.isArray(req.custom_fields) ? req.custom_fields : [],
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

const GARMENT_COMPLIANCE_CERTS = ['BSCI', 'WRAP', 'SA8000']
const GARMENT_SUSTAIN_CERTS = ['GOTS', 'OEKO-TEX', 'GRS']
export default function BuyerRequestManagement() {
  const user = useMemo(() => getCurrentUser(), [])
  const role = String(user?.role || '').toLowerCase()

  const [moreFieldsOpen, setMoreFieldsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [step, setStep] = useState(0)
  const [pendingAttachments, setPendingAttachments] = useState([])

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

  const isTextile = form.requestType === 'textile'
  const steps = useMemo(() => (
    isTextile
      ? ['Type', 'Basics', 'Technical', 'Commercial', 'Compliance', 'Preview']
      : ['Type', 'Basics', 'Product', 'Commercial', 'Compliance', 'Preview']
  ), [isTextile])
  const isFirstStep = step === 0
  const isLastStep = step === steps.length - 1
  const canAdvance = step === 0 ? Boolean(form.requestType) : true

  useEffect(() => {
    if (step > steps.length - 1) setStep(steps.length - 1)
  }, [step, steps.length])

  function updateCustomField(index, key, value) {
    setForm((prev) => {
      const next = Array.isArray(prev.customFields) ? [...prev.customFields] : []
      const row = next[index] || { label: '', value: '' }
      next[index] = { ...row, [key]: value }
      return { ...prev, customFields: next }
    })
  }

  function addCustomField() {
    setForm((prev) => ({
      ...prev,
      customFields: [...(Array.isArray(prev.customFields) ? prev.customFields : []), { label: '', value: '' }],
    }))
  }

  function removeCustomField(index) {
    setForm((prev) => ({
      ...prev,
      customFields: (Array.isArray(prev.customFields) ? prev.customFields : []).filter((_, i) => i !== index),
    }))
  }

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
      const data = await apiRequest(`/documents?entity_type=buyer_request&entity_id=${encodeURIComponent(requirementId)}`, { token })
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

  async function createRequest(statusOverride = 'open') {
    if (!token) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const created = await apiRequest('/requirements', { method: 'POST', token, body: { ...formToPayload(form), status: statusOverride } })
      if (created?.id && pendingAttachments.length) {
        for (const attachment of pendingAttachments) {
          if (!attachment?.file) continue
              await uploadAttachment(created.id, attachment.file, attachment.type || 'tech_pack')
        }
      }
      setSuccess(statusOverride === 'draft' ? 'Draft saved.' : 'Buyer request posted.')
      setForm(EMPTY_FORM)
      setPendingAttachments([])
      setStep(0)
      await loadRequests()
      await loadBrowse()
    } catch (err) {
      setError(err.message || 'Failed to post buyer request.')
    } finally {
      setSaving(false)
    }
  }

  async function saveDraft() {
    await createRequest('draft')
  }

  function startEditing(req) {
    setEditingId(req.id)
    setEditForm(requirementToForm(req))
    setSuccess('')
    setError('')
  }

  function duplicateRequest(req) {
    setForm(requirementToForm(req))
    setStep(1)
    setSuccess('Loaded the request into the form. Update details and post when ready.')
    setError('')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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

  const previewRows = useMemo(() => {
    const rows = [
      { label: 'Request type', value: form.requestType || 'garments' },
      { label: 'Title', value: form.title },
      { label: 'Category', value: isTextile ? form.subCategory : form.category },
      { label: 'Industry', value: form.industry },
      { label: 'Gender target', value: form.genderTarget },
      { label: 'Season', value: form.season },
      { label: 'Total quantity', value: form.totalQuantity },
      { label: 'Number of styles', value: form.numberOfStyles },
      { label: 'Material type', value: form.materialType },
      { label: 'Quantity', value: form.quantity },
      { label: 'Unit', value: form.unit },
      { label: 'Fabric composition', value: form.fabricComposition || form.fiberComposition },
      { label: 'Fabric weight (GSM)', value: form.fabricWeightGsm },
      { label: 'Weave/Knit', value: form.weaveOrKnit },
      { label: 'Size range', value: form.sizeRange },
      { label: 'Color requirement', value: form.colorRequirement || form.color },
      { label: 'Style description', value: form.styleDescription },
      { label: 'Tech pack required', value: form.techPackRequired },
      { label: 'Target FOB price', value: form.targetFobPrice },
      { label: 'Target price', value: form.targetPrice },
      { label: 'Price unit', value: form.priceUnit },
      { label: 'Incoterm', value: form.incoterms },
      { label: 'Destination port', value: form.destinationPort || form.deliveryPort },
      { label: 'Ex-factory date', value: form.exFactoryDate },
      { label: 'Lead time required', value: form.leadTimeRequired },
      { label: 'Sample required', value: form.sampleRequired },
      { label: 'Sample type', value: form.sampleType },
      { label: 'Payment terms', value: form.paymentTerms },
      { label: 'Compliance certs', value: Array.isArray(form.complianceCerts) ? form.complianceCerts.join(', ') : '' },
      { label: 'Sustainability certs', value: Array.isArray(form.sustainabilityCerts) ? form.sustainabilityCerts.join(', ') : '' },
      { label: 'Lab test required', value: form.labTestRequired },
      { label: 'Swatch first', value: form.swatchFirst },
      { label: 'Compliance notes', value: form.complianceNotes || form.labCertNotes },
      { label: 'Quote deadline', value: form.quoteDeadline },
      { label: 'Request expiry', value: form.expiresAt },
      { label: 'Max suppliers', value: form.maxSuppliers },
      { label: 'Preferred location', value: form.preferredFactoryLocation },
      { label: 'Factory size', value: form.factorySizePreference },
      { label: 'Export experience', value: form.exportExperiencePreference },
      { label: 'Confidentiality', value: form.confidentialityToggle ? 'Hide brand name' : '' },
      { label: 'Packaging', value: form.packagingRequirement },
      { label: 'Origin label', value: form.originLabelRequired },
      { label: 'Hang tag / barcode', value: form.hangtagBarcode },
      { label: 'Partial shipment', value: form.partialShipmentAllowed },
      { label: 'Shipment mode', value: form.shipmentMode },
      { label: 'Messaging access', value: form.verifiedOnly ? 'Verified request only' : 'Normal' },
    ]
    return rows.filter((row) => row.value)
  }, [form, isTextile])

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
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Buyer request form
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[var(--gt-blue)]"
                onClick={() => setMoreFieldsOpen((v) => !v)}
              >
                {moreFieldsOpen ? 'Hide more fields' : 'More fields'}
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="text-xs font-semibold text-slate-800">Step {step + 1} of {steps.length} â€” {steps[step]}</p>
              <p className="mt-1">Complete each step so verified suppliers can quote faster.</p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              {steps.map((label, idx) => (
                <div
                  key={`${label}-${idx}`}
                  className={`rounded-full px-3 py-1 font-semibold ${
                    idx === step ? 'bg-[var(--gt-blue)] text-white' : idx < step ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-500 ring-1 ring-slate-200'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {step === 0 ? (
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Request type</h3>
                <p className="text-sm text-slate-600">Select the buyer request type so we can show the correct fields.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`rounded-2xl border px-4 py-4 text-left transition ${form.requestType === 'garments' ? 'border-[var(--gt-blue)] ring-2 ring-[var(--gt-blue)]/30' : 'border-slate-200'}`}
                    onClick={() => setForm({ ...form, requestType: 'garments' })}
                  >
                    <p className="text-sm font-semibold">Garments Buyer</p>
                    <p className="text-xs text-slate-500">Finished garments with design + construction focus.</p>
                  </button>
                  <button
                    type="button"
                    className={`rounded-2xl border px-4 py-4 text-left transition ${form.requestType === 'textile' ? 'border-[var(--gt-blue)] ring-2 ring-[var(--gt-blue)]/30' : 'border-slate-200'}`}
                    onClick={() => setForm({ ...form, requestType: 'textile' })}
                  >
                    <p className="text-sm font-semibold">Textile Buyer</p>
                    <p className="text-xs text-slate-500">Fabric/yarn/trim requests with technical specs.</p>
                  </button>
                </div>
            </div>
            ) : null}

            {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 text-sm font-semibold text-slate-900">Basic info</div>
                <Field label="Request title" hint="Example: Denim Jacket — 10k pcs">
                  <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </Field>
                {isTextile ? (
                  <>
                    <Field label="Material type">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.materialType} onChange={(e) => setForm({ ...form, materialType: e.target.value })} />
                    </Field>
                    <Field label="Sub-category">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })} />
                    </Field>
                    <Field label="Quantity">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                    </Field>
                    <Field label="Unit">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Product category">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </Field>
                    <Field label="Gender target">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.genderTarget} onChange={(e) => setForm({ ...form, genderTarget: e.target.value })} />
                    </Field>
                    <Field label="Season">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} />
                    </Field>
                    <Field label="Total quantity (pcs)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.totalQuantity} onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })} />
                    </Field>
                  </>
                )}

                {moreFieldsOpen ? (
                  <>
                    <Field label="Industry (optional)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                    </Field>
                    {!isTextile ? (
                      <Field label="Number of styles (optional)">
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.numberOfStyles} onChange={(e) => setForm({ ...form, numberOfStyles: e.target.value })} />
                      </Field>
                    ) : null}
                  </>
                ) : null}

            </div>
            ) : null}

            {step === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 text-sm font-semibold text-slate-900">Product specifications</div>
                {isTextile ? (
                  <>
                    <Field label="Fiber composition">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.fiberComposition} onChange={(e) => setForm({ ...form, fiberComposition: e.target.value })} />
                    </Field>
                    <Field label="Fabric weight (GSM)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.fabricWeightGsm} onChange={(e) => setForm({ ...form, fabricWeightGsm: e.target.value })} />
                    </Field>
                    <Field label="Fabric width">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.fabricWidth} onChange={(e) => setForm({ ...form, fabricWidth: e.target.value })} />
                    </Field>
                    <Field label="Yarn count">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.yarnCount} onChange={(e) => setForm({ ...form, yarnCount: e.target.value })} />
                    </Field>
                    <Field label="Thread count">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.threadCount} onChange={(e) => setForm({ ...form, threadCount: e.target.value })} />
                    </Field>
                    <Field label="Finish required">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.finishRequired} onChange={(e) => setForm({ ...form, finishRequired: e.target.value })} />
                    </Field>
                    <Field label="Stretch required">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.stretchRequired} onChange={(e) => setForm({ ...form, stretchRequired: e.target.value })} />
                    </Field>
                    <Field label="Color">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                    </Field>
                    <Field label="Pattern">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.pattern} onChange={(e) => setForm({ ...form, pattern: e.target.value })} />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Fabric composition">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.fabricComposition} onChange={(e) => setForm({ ...form, fabricComposition: e.target.value })} />
                    </Field>
                    <Field label="Fabric weight (GSM)">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.fabricWeightGsm} onChange={(e) => setForm({ ...form, fabricWeightGsm: e.target.value })} />
                    </Field>
                    <Field label="Weave / Knit type">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.weaveOrKnit} onChange={(e) => setForm({ ...form, weaveOrKnit: e.target.value })} />
                    </Field>
                    <Field label="Size range">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.sizeRange} onChange={(e) => setForm({ ...form, sizeRange: e.target.value })} />
                    </Field>
                    <Field label="Color requirement">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.colorRequirement} onChange={(e) => setForm({ ...form, colorRequirement: e.target.value })} />
                    </Field>
                    <Field label="Style description">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.styleDescription} onChange={(e) => setForm({ ...form, styleDescription: e.target.value })} />
                    </Field>
                    <Field label="Tech pack required">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.techPackRequired} onChange={(e) => setForm({ ...form, techPackRequired: e.target.value })} placeholder="Yes / No" />
                    </Field>
                  </>
                )}

                <div className="md:col-span-2">
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                    <p className="text-xs font-semibold text-slate-700">Tech pack upload (optional)</p>
                    <div className="mt-2 space-y-2">
                      {pendingAttachments.length ? pendingAttachments.map((fileRow, index) => (
                        <div key={`${fileRow.file?.name}-${index}`} className="flex items-center justify-between rounded-lg bg-white px-2 py-2 ring-1 ring-slate-200/60">
                          <span className="text-xs text-slate-600">{fileRow.file?.name || 'File'}</span>
                          <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => setPendingAttachments((prev) => prev.filter((_, i) => i !== index))}>
                            Remove
                          </button>
                        </div>
                      )) : (
                        <p className="text-[11px] text-slate-500">You can upload tech packs and sketches after posting too.</p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-[var(--gt-blue)] cursor-pointer">
                        Add file
                        <input
                          type="file"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) {
                              setPendingAttachments((prev) => [...prev, { file, type: 'tech_pack' }])
                            }
                            event.target.value = ''
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

            </div>
            ) : null}

            {step === 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 text-sm font-semibold text-slate-900">Commercial terms</div>
                {isTextile ? (
                  <>
                    <Field label="Target price">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.targetPrice} onChange={(e) => setForm({ ...form, targetPrice: e.target.value })} />
                    </Field>
                    <Field label="Price unit">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.priceUnit} onChange={(e) => setForm({ ...form, priceUnit: e.target.value })} />
                    </Field>
                    <Field label="Incoterm">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })} />
                    </Field>
                    <Field label="Delivery port">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.deliveryPort} onChange={(e) => setForm({ ...form, deliveryPort: e.target.value })} />
                    </Field>
                    <Field label="Lead time required">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.leadTimeRequired} onChange={(e) => setForm({ ...form, leadTimeRequired: e.target.value })} />
                    </Field>
                    <Field label="Lab test required">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.labTestRequired} onChange={(e) => setForm({ ...form, labTestRequired: e.target.value })} />
                    </Field>
                    <Field label="Swatch/sample first?">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.swatchFirst} onChange={(e) => setForm({ ...form, swatchFirst: e.target.value })} />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Target FOB price">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.targetFobPrice} onChange={(e) => setForm({ ...form, targetFobPrice: e.target.value })} />
                    </Field>
                    <Field label="Incoterm">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })} />
                    </Field>
                    <Field label="Destination port">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.destinationPort} onChange={(e) => setForm({ ...form, destinationPort: e.target.value })} />
                    </Field>
                    <Field label="Ex-factory date">
                      <input type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.exFactoryDate} onChange={(e) => setForm({ ...form, exFactoryDate: e.target.value })} />
                    </Field>
                    <Field label="Sample required">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.sampleRequired} onChange={(e) => setForm({ ...form, sampleRequired: e.target.value })} placeholder="Yes / No" />
                    </Field>
                    <Field label="Sample type">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.sampleType} onChange={(e) => setForm({ ...form, sampleType: e.target.value })} />
                    </Field>
                    <Field label="Payment terms">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
                    </Field>
                  </>
                )}

                {moreFieldsOpen ? (
                  <>
                    <Field label="Quote deadline">
                      <input type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.quoteDeadline} onChange={(e) => setForm({ ...form, quoteDeadline: e.target.value })} />
                    </Field>
                    <Field label="Request expiry">
                      <input type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
                    </Field>
                    <Field label="Max suppliers to contact">
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.maxSuppliers} onChange={(e) => setForm({ ...form, maxSuppliers: e.target.value })} />
                    </Field>
                      <Field
                        label="Messaging access"
                        hint="Normal: verified goes to inbox, unverified goes to requests. Verified request only: only verified suppliers can message."
                      >
                        <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="verified-only-create"
                              checked={!form.verifiedOnly}
                              onChange={() => setForm({ ...form, verifiedOnly: false })}
                            />
                            Normal
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="verified-only-create"
                              checked={form.verifiedOnly}
                              onChange={() => setForm({ ...form, verifiedOnly: true })}
                            />
                            Verified request only
                          </label>
                        </div>
                      </Field>
                  </>
                ) : null}

            </div>
            ) : null}

            {step === 4 ? (
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Compliance / Lab</h3>
                {!isTextile ? (
                  <>
                    <Field label="Compliance certifications">
                      <div className="flex flex-wrap gap-2">
                        {GARMENT_COMPLIANCE_CERTS.map((cert) => (
                          <label key={cert} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs">
                            <input
                              type="checkbox"
                              checked={form.complianceCerts.includes(cert)}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...form.complianceCerts, cert]
                                  : form.complianceCerts.filter((c) => c !== cert)
                                setForm({ ...form, complianceCerts: next })
                              }}
                            />
                            {cert}
                          </label>
                        ))}
                      </div>
                    </Field>
                    <Field label="Sustainability certifications">
                      <div className="flex flex-wrap gap-2">
                        {GARMENT_SUSTAIN_CERTS.map((cert) => (
                          <label key={cert} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs">
                            <input
                              type="checkbox"
                              checked={form.sustainabilityCerts.includes(cert)}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...form.sustainabilityCerts, cert]
                                  : form.sustainabilityCerts.filter((c) => c !== cert)
                                setForm({ ...form, sustainabilityCerts: next })
                              }}
                            />
                            {cert}
                          </label>
                        ))}
                      </div>
                    </Field>
                    <Field label="Compliance notes">
                      <textarea className="w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2" value={form.complianceNotes} onChange={(e) => setForm({ ...form, complianceNotes: e.target.value })} />
                    </Field>
                  </>
                ) : (
                  <Field label="Lab/Certification notes">
                    <textarea className="w-full min-h-[100px] rounded-lg border border-slate-200 px-3 py-2" value={form.labCertNotes} onChange={(e) => setForm({ ...form, labCertNotes: e.target.value })} />
                  </Field>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 text-sm font-semibold text-slate-900">Supplier preference</div>
                  <Field label="Preferred factory location">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.preferredFactoryLocation} onChange={(e) => setForm({ ...form, preferredFactoryLocation: e.target.value })} placeholder="Gazipur / Chittagong / Any" />
                  </Field>
                  <Field label="Factory size preference">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.factorySizePreference} onChange={(e) => setForm({ ...form, factorySizePreference: e.target.value })} placeholder="Small / Medium / Large" />
                  </Field>
                  <Field label="Export experience preference">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.exportExperiencePreference} onChange={(e) => setForm({ ...form, exportExperiencePreference: e.target.value })} placeholder="EU required / US required / Any" />
                  </Field>
                  <Field label="Confidentiality">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.confidentialityToggle}
                        onChange={(e) => setForm({ ...form, confidentialityToggle: e.target.checked })}
                      />
                      Hide brand name (only verified suppliers can see it)
                    </label>
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 text-sm font-semibold text-slate-900">Packaging & shipment</div>
                  <Field label="Packaging requirement">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.packagingRequirement} onChange={(e) => setForm({ ...form, packagingRequirement: e.target.value })} placeholder="Poly bag / Hanger / Flat pack" />
                  </Field>
                  <Field label="Origin label requirement">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.originLabelRequired} onChange={(e) => setForm({ ...form, originLabelRequired: e.target.value })} placeholder="Made in Bangladesh required?" />
                  </Field>
                  <Field label="Hang tag / Barcode">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.hangtagBarcode} onChange={(e) => setForm({ ...form, hangtagBarcode: e.target.value })} placeholder="Buyer-supplied / Factory to arrange" />
                  </Field>
                  <Field label="Partial shipment allowed">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.partialShipmentAllowed} onChange={(e) => setForm({ ...form, partialShipmentAllowed: e.target.value })} placeholder="Yes / No" />
                  </Field>
                  <Field label="Shipment mode">
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2" value={form.shipmentMode} onChange={(e) => setForm({ ...form, shipmentMode: e.target.value })} placeholder="Sea / Air / Both" />
                  </Field>
                </div>

                {moreFieldsOpen ? (
                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-slate-700">Custom fields</p>
                    <div className="mt-2 space-y-2">
                      {(Array.isArray(form.customFields) ? form.customFields : []).map((row, index) => (
                        <div key={`custom-${index}`} className="flex flex-wrap gap-2">
                          <input
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Label"
                            value={row.label}
                            onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                          />
                          <input
                            className="flex-[2] rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Value"
                            value={row.value}
                            onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                          />
                          <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold" onClick={() => removeCustomField(index)}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="mt-2 text-[11px] font-semibold text-[var(--gt-blue)]" onClick={addCustomField}>
                      Add custom field
                    </button>
                  </div>
                ) : null}

                <Field label="Custom description" hint="Use this for extra notes, design details, or negotiation context.">
                  <textarea className="w-full min-h-[140px] rounded-lg border border-slate-200 px-3 py-2" value={form.customDescription} onChange={(e) => setForm({ ...form, customDescription: e.target.value })} />
                </Field>

            </div>
            ) : null}

            {step === 5 ? (
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Preview summary</h3>
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
                  <p className="text-sm font-semibold text-slate-800">Review all fields before posting</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                    {previewRows.map((row) => (
                      <div key={row.label} className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200/60">
                        <span className="font-semibold text-slate-700">{row.label}:</span> {row.value}
                      </div>
                    ))}
                    {!previewRows.length ? <div className="text-xs text-slate-500">No fields filled yet.</div> : null}
                  </div>
                </div>
            </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={isFirstStep}
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Back
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveDraft}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                {isLastStep ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={createRequest}
                    className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)] disabled:opacity-70"
                  >
                    {saving ? 'Posting...' : 'Post Request'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    className="rounded-lg bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--gt-blue-hover)] disabled:opacity-50"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
        {/* Lead queue for Buying House/Admin */}
        {role === 'buying_house' || role === 'admin' ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Open Buyer Requests</h2>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold">Assign</span> routes a request to an Agent ID so teammates donâ€™t overlap work.
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
                    <th className="py-2 pr-3">Status</th>
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
                      <td className="py-2 pr-3">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                          {String(r.status || 'open').replaceAll('_', ' ')}
                        </span>
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
                        <Field
                          label="Messaging access"
                          hint="Normal: verified goes to inbox, unverified goes to requests. Verified request only: only verified suppliers can message."
                        >
                          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`verified-only-edit-${editForm.id}`}
                                checked={!editForm.verifiedOnly}
                                onChange={() => setEditForm({ ...editForm, verifiedOnly: false })}
                              />
                              Normal
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`verified-only-edit-${editForm.id}`}
                                checked={editForm.verifiedOnly}
                                onChange={() => setEditForm({ ...editForm, verifiedOnly: true })}
                              />
                              Verified request only
                            </label>
                          </div>
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
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-slate-900">{r.title || r.category || 'Buyer Request'}</div>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                            {String(r.status || 'open').replaceAll('_', ' ')}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Qty {r.quantity || '--'} - {r.material || '--'} - Target {r.target_market || '--'} - Delivery {r.delivery_timeline || r.timeline_days || '--'}
                        </div>
                      </div>
                        <div className="shrink-0 flex gap-2">
                        <button type="button" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => duplicateRequest(r)}>
                          Duplicate
                        </button>
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







