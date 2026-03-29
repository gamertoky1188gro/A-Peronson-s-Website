/*
  Route: /contracts
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Provide the "Contract Vault" experience (secure documents + signing workflow visibility).
    - Filter contracts by state (All/Draft/Pending/Signed/Archived) with animated tab indicator.
    - Show contract details, signature status, and downloadable artifacts.

  Key API endpoints (high level):
    - GET /api/contracts (list)
    - GET /api/contracts/:id (details)
    - POST/PATCH for signing/finalizing/archiving (actions depend on role)

  Major UI/UX patterns:
    - Secure grid background inside the vault area (visual cue for confidentiality).
    - Shortcut hint on search (Ctrl/⌘ + K style) where applicable.
    - Skeleton shimmer for list/detail while loading.
*/
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import AccessDeniedState from '../components/AccessDeniedState'
import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
import { trackClientEvent } from '../lib/events'

const Motion = motion

function toLabel(status) {
  // Map backend status -> readable label for UI chips.
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'pending_signature':
      return 'Pending signatures'
    case 'signed':
      return 'Signed'
    case 'archived':
      return 'Archived'
    default:
      return 'Pending signatures'
  }
}

function statusClass(status) {
  // Chip styling for contract status pills (light mode defaults; dark mode handled by parent surfaces).
  if (status === 'signed') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  if (status === 'draft') return 'bg-slate-50 text-slate-700 ring-slate-200'
  if (status === 'archived') return 'bg-slate-100 text-slate-700 ring-slate-300'
  return 'bg-amber-50 text-amber-700 ring-amber-200'
}

function resolveDownloadUrl(pdfPath) {
  // Normalize relative file paths returned by the backend into an absolute URL.
  if (!pdfPath) return ''
  if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) return pdfPath
  const baseOrigin = API_BASE.replace(/\/api\/*$/, '')
  return `${baseOrigin}${pdfPath.startsWith('/') ? '' : '/'}${pdfPath}`
}

function isOwnerLevel(user) {
  return user?.role === 'owner' || user?.role === 'admin'
}

function canCreateDraft(user) {
  if (!user?.role) return false
  return ['owner', 'admin', 'buying_house', 'factory'].includes(user.role)
}

function canViewBankingReferences(user, contract) {
  if (!user || !contract) return false
  if (isOwnerLevel(user)) return true
  const uid = String(user.id || '')
  return uid && (uid === String(contract.uploaded_by) || uid === String(contract.buyer_id) || uid === String(contract.factory_id))
}

function safeDash(value) {
  const text = String(value || '').trim()
  return text ? text : '\u2014'
}

function maskValue(value) {
  const text = String(value || '').trim()
  if (!text) return '\u2014'
  if (text.length <= 4) return '\u2022\u2022\u2022\u2022'
  return `${text.slice(0, 2)}\u2022\u2022\u2022\u2022${text.slice(-2)}`
}

function computeFlow(contract) {
  const buyerSigned = contract?.buyer_signature_state === 'signed'
  const factorySigned = contract?.factory_signature_state === 'signed'
  const hasPdf = Boolean(contract?.artifact?.generated_at && contract?.artifact?.pdf_path)
  const locked = contract?.artifact?.status === 'locked'
  const archived = contract?.artifact?.status === 'archived' || Boolean(contract?.archived_at)
  const draftComplete = !contract?.is_draft

  const blockers = []
  if (!buyerSigned) blockers.push('Buyer signature pending')
  if (!factorySigned) blockers.push('Factory signature pending')
  if (buyerSigned && factorySigned && !hasPdf) blockers.push('PDF generation pending')
  if (hasPdf && !locked) blockers.push('Lock pending')
  if (locked && !archived) blockers.push('Archive pending')

  const stepState = {
    draft_creation: draftComplete,
    buyer_signature: buyerSigned,
    factory_signature: factorySigned,
    artifact_finalize: locked,
    archive: archived,
  }

  const nextAction = blockers[0] || 'Complete'
  return { stepState, hasPdf, locked, archived, blockers, nextAction }
}

function canBuyerSign(user, contract) {
  if (!user || !contract) return false
  return isOwnerLevel(user) || (user.role === 'buyer' && String(user.id) === String(contract.buyer_id))
}

function canFactorySign(user, contract) {
  if (!user || !contract) return false
  return isOwnerLevel(user) || (user.role === 'factory' && String(user.id) === String(contract.factory_id))
}

function canFinalizeArtifact(user, contract) {
  if (!user || !contract) return false
  if (isOwnerLevel(user)) return true
  return String(user.id) === String(contract.uploaded_by)
}

function canArchive(user, contract) {
  if (!user || !contract) return false
  return isOwnerLevel(user) || String(user.id) === String(contract.uploaded_by)
}

function actionBlockers(user, contract) {
  const buyerSigned = contract?.buyer_signature_state === 'signed'
  const factorySigned = contract?.factory_signature_state === 'signed'
  const hasPdf = Boolean(contract?.artifact?.generated_at && contract?.artifact?.pdf_hash && contract?.artifact?.pdf_path)
  const locked = contract?.artifact?.status === 'locked'
  const archived = contract?.artifact?.status === 'archived'

  const blockers = {
    buyerSign: '',
    factorySign: '',
    lock: '',
    archive: '',
  }

  if (!canBuyerSign(user, contract)) blockers.buyerSign = 'Only owner/admin or the assigned buyer can sign.'
  else if (buyerSigned) blockers.buyerSign = 'Already signed.'

  if (!canFactorySign(user, contract)) blockers.factorySign = 'Only owner/admin or the assigned factory can sign.'
  else if (factorySigned) blockers.factorySign = 'Already signed.'

  if (!canFinalizeArtifact(user, contract)) blockers.lock = 'Only owner/admin or the draft uploader can lock the PDF.'
  else if (!buyerSigned || !factorySigned) blockers.lock = 'Both signatures are required first.'
  else if (!hasPdf) blockers.lock = 'PDF is not generated yet (generated automatically after both signatures).'
  else if (locked) blockers.lock = 'Already locked.'

  if (!canArchive(user, contract)) blockers.archive = 'Only owner/admin or the draft uploader can archive.'
  else if (!hasPdf) blockers.archive = 'Generate PDF first.'
  else if (!locked) blockers.archive = 'Lock the PDF first.'
  else if (archived) blockers.archive = 'Already archived.'

  return blockers
}

function StepPill({ done, label }) {
  return (
    <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${done ? 'bg-[#E8F3FF] text-[#0A66C2] ring-[#BBD8FF]' : 'bg-white text-slate-600 ring-slate-200'}`}>
      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-[#0A66C2] text-white' : 'bg-slate-100 text-slate-500'}`}>
        {done ? '\u2713' : '\u2022'}
      </span>
      <span>{label}</span>
    </div>
  )
}

function ContractRow({ contract, active, onSelect }) {
  const status = contract.lifecycle_status || 'pending_signature'
  const flow = computeFlow(contract)
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl p-4 text-left transition ring-1 ${active ? 'bg-indigo-50/60 text-slate-900 ring-indigo-200 shadow-sm dark:bg-white/5 dark:text-slate-100 dark:ring-[#38bdf8]/35' : 'bg-white text-slate-900 ring-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-white/5'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
            <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass(status)}`}>
              {toLabel(status)}
            </span>
          </div>
          <div className="mt-1 truncate text-xs text-slate-600">{safeDash(contract.title)}</div>
          <div className="mt-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
          </div>
        </div>

        <div className="shrink-0 text-right text-xs text-slate-600">
          <div>{(contract.updated_at || contract.created_at || '').slice(0, 10) || '\u2014'}</div>
          <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
            Next: {flow.nextAction}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Buyer: {contract.buyer_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
        <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
      </div>
    </button>
  )
}

function Drawer({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Contract details</div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function ContractVault() {
  const currentUser = useMemo(() => getCurrentUser(), [])
  const reduceMotion = useReducedMotion()
  const [loadingContracts, setLoadingContracts] = useState(true)
  const searchRef = useRef(null)
  const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])
  const [contracts, setContracts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')
  const [paymentProofs, setPaymentProofs] = useState([])
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentNotice, setPaymentNotice] = useState('')
  const [auditLog, setAuditLog] = useState([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditError, setAuditError] = useState('')
  const [paymentForm, setPaymentForm] = useState({
    type: 'bank_transfer',
    transaction_reference: '',
    bank_name: '',
    sender_account_name: '',
    receiver_account_name: '',
    transaction_date: '',
    amount: '',
    currency: 'USD',
    lc_number: '',
    lc_type: 'sight',
    usance_days: '30',
    usance_custom_days: '',
    issuing_bank: '',
    advising_bank: '',
    applicant_name: '',
    beneficiary_name: '',
    issue_date: '',
    expiry_date: '',
    document_id: '',
    document_url: '',
    document_file: null,
  })

  const hasAcceptedProof = useMemo(() => {
    return (paymentProofs || []).some((proof) => {
      const type = String(proof?.type || '').toLowerCase()
      const status = String(proof?.status || '').toLowerCase()
      if (type === 'bank_transfer') return status === 'received'
      if (type === 'lc') return status === 'accepted'
      return false
    })
  }, [paymentProofs])

  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')

  const [draftOpen, setDraftOpen] = useState(false)
  const [draftForm, setDraftForm] = useState({
    title: '',
    buyer_name: '',
    factory_name: '',
    buyer_id: '',
    factory_id: '',
    bank_name: '',
    beneficiary_name: '',
    transaction_reference: '',
  })

  const loadContracts = async () => {
    setLoadingContracts(true)
    try {
      const token = getToken()
      if (!token) {
        setContracts([])
        setLoadingContracts(false)
        return
      }
      const data = await apiRequest('/documents/contracts', { token })
      setContracts(Array.isArray(data) ? data : [])
      setError('')
      setForbidden(false)
    } catch (err) {
      const isForbidden = err.status === 403
      setForbidden(isForbidden)
      setError(isForbidden ? 'You do not have permission to view contracts.' : (err.message || 'Failed to load contracts.'))
      setContracts([])
    } finally {
      setLoadingContracts(false)
    }
  }

  const resetPaymentForm = () => {
    setPaymentForm({
      type: 'bank_transfer',
      transaction_reference: '',
      bank_name: '',
      sender_account_name: '',
      receiver_account_name: '',
      transaction_date: '',
      amount: '',
      currency: 'USD',
      lc_number: '',
      lc_type: 'sight',
      usance_days: '30',
      usance_custom_days: '',
      issuing_bank: '',
      advising_bank: '',
      applicant_name: '',
      beneficiary_name: '',
      issue_date: '',
      expiry_date: '',
      document_id: '',
      document_url: '',
      document_file: null,
    })
  }

  const loadPaymentProofs = async (contractId) => {
    const token = getToken()
    if (!token || !contractId) {
      setPaymentProofs([])
      return
    }
    setPaymentLoading(true)
    try {
      const data = await apiRequest(`/payment-proofs?contract_id=${encodeURIComponent(contractId)}`, { token })
      setPaymentProofs(Array.isArray(data) ? data : [])
    } catch {
      setPaymentProofs([])
    } finally {
      setPaymentLoading(false)
    }
  }

  const loadAuditTrail = async (contractId) => {
    const token = getToken()
    if (!token || !contractId) {
      setAuditLog([])
      return
    }
    setAuditLoading(true)
    setAuditError('')
    try {
      const data = await apiRequest(`/documents/contracts/${encodeURIComponent(contractId)}/audit`, { token })
      setAuditLog(Array.isArray(data?.items) ? data.items : [])
    } catch (err) {
      if (err.status === 403) {
        setAuditError('Premium plan required to view the contract audit trail.')
      } else {
        setAuditError(err.message || 'Unable to load audit trail.')
      }
      setAuditLog([])
    } finally {
      setAuditLoading(false)
    }
  }

  const uploadPaymentDocument = async (contractId) => {
    if (!paymentForm.document_file) return null
    const token = getToken()
    if (!token) return null
    const formData = new FormData()
    formData.append('file', paymentForm.document_file)
    formData.append('entity_type', 'payment_proof')
    formData.append('entity_id', contractId)
    formData.append('type', `${paymentForm.type}_proof`)

    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data
  }

  const submitPaymentProof = async () => {
    const token = getToken()
    if (!token || !selected?.id) return
    setPaymentNotice('')
    setSaving(true)
    try {
      let documentId = paymentForm.document_id
      let documentUrl = paymentForm.document_url
      if (paymentForm.document_file) {
        const uploaded = await uploadPaymentDocument(selected.id)
        documentId = uploaded?.id || ''
        documentUrl = uploaded?.file_path || uploaded?.url || ''
      }

      const payload = {
        ...paymentForm,
        contract_id: selected.id,
        document_id: documentId || undefined,
        document_url: documentUrl || undefined,
      }

      if (paymentForm.type === 'lc') {
        let usanceDays = paymentForm.usance_days
        if (paymentForm.lc_type === 'usance' && String(paymentForm.usance_days) === 'custom') {
          usanceDays = paymentForm.usance_custom_days
        }
        payload.usance_days = paymentForm.lc_type === 'usance' ? usanceDays : undefined
      } else {
        payload.lc_type = undefined
        payload.usance_days = undefined
      }
      delete payload.usance_custom_days

      const created = await apiRequest('/payment-proofs', { method: 'POST', token, body: payload })
      setPaymentNotice('Payment proof submitted.')
      setPaymentProofs((prev) => [created, ...prev])
      resetPaymentForm()
      trackClientEvent('payment_proof_submitted', { entityType: 'contract', entityId: selected.id })
    } catch (err) {
      setPaymentNotice(err.message || 'Unable to submit payment proof')
    } finally {
      setSaving(false)
    }
  }

  const updatePaymentStatus = async (proofId, status) => {
    const token = getToken()
    if (!token || !proofId) return
    setPaymentNotice('')
    setSaving(true)
    try {
      const updated = await apiRequest(`/payment-proofs/${encodeURIComponent(proofId)}`, {
        method: 'PATCH',
        token,
        body: { status },
      })
      setPaymentProofs((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setPaymentNotice('Payment proof status updated.')
      trackClientEvent('payment_proof_status_updated', { entityType: 'payment_proof', entityId: updated.id, metadata: { status } })
    } catch (err) {
      setPaymentNotice(err.message || 'Unable to update status')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadContracts()
  }, [])

  useEffect(() => {
    const handler = (e) => {
      const key = String(e.key || '').toLowerCase()
      if (key !== 'k') return
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      searchRef.current?.focus?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!selected?.id) return
    loadAuditTrail(selected.id)
  }, [selected?.id])

  const visibleContracts = useMemo(() => {
    const q = query.trim().toLowerCase()
    return contracts
      .filter((c) => (statusFilter === 'all' ? true : (c.lifecycle_status || 'pending_signature') === statusFilter))
      .filter((c) => {
        if (!q) return true
        const haystack = `${c.contract_number || ''} ${c.title || ''} ${c.buyer_name || ''} ${c.factory_name || ''} ${c.id || ''}`.toLowerCase()
        return haystack.includes(q)
      })
      .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
  }, [contracts, statusFilter, query])

  const selected = useMemo(() => {
    if (!selectedId) return null
    return contracts.find((c) => String(c.id) === String(selectedId)) || null
  }, [contracts, selectedId])

  // project.md: call recordings should be stored and retrievable for disputes.
  // We show recordings linked to the selected contract via `contract_id` on call sessions.
  const [callItems, setCallItems] = useState([])
  const [callsLoading, setCallsLoading] = useState(false)
  const hasRecordedCall = useMemo(() => {
    return callItems.some((call) => String(call.recording_status || '').toLowerCase() === 'available' && call.recording_url)
  }, [callItems])

  const selectedFlow = computeFlow(selected)
  const selectedActionBlockers = actionBlockers(currentUser, selected)
  const downloadUrl = resolveDownloadUrl(selected?.artifact?.pdf_path)
  const canDownload = Boolean(selectedFlow?.hasPdf && downloadUrl)
  const canReviewPayment = ['factory', 'buying_house', 'owner', 'admin'].includes(String(currentUser?.role || '').toLowerCase())

  useEffect(() => {
    const token = getToken()
    if (!token || !selected?.id) {
      setCallItems([])
      return
    }

    setCallsLoading(true)
    apiRequest(`/calls/by-contract/${encodeURIComponent(selected.id)}`, { token })
      .then((data) => setCallItems(Array.isArray(data?.items) ? data.items : []))
      .catch(() => setCallItems([]))
      .finally(() => setCallsLoading(false))
  }, [selected?.id])

  useEffect(() => {
    if (!selected?.id) {
      setPaymentProofs([])
      return
    }
    loadPaymentProofs(selected.id)
  }, [selected?.id])

  useEffect(() => {
    if (!selected?.id || hasRecordedCall) return
    trackClientEvent('contract_call_warning', {
      entityType: 'contract',
      entityId: selected.id,
    })
  }, [hasRecordedCall, selected?.id])

  const upsertContract = (nextContract) => {
    if (!nextContract?.id) return
    setContracts((prev) => {
      const idx = prev.findIndex((entry) => String(entry.id) === String(nextContract.id))
      if (idx < 0) return [nextContract, ...prev]
      const clone = [...prev]
      clone[idx] = nextContract
      return clone
    })
    setSelectedId(String(nextContract.id))
  }

  const runStepAction = async (runner, eventPayload = null) => {
    setSaving(true)
    setActionError('')
    try {
      const token = getToken()
      const updated = await runner(token)
      upsertContract(updated)
      if (eventPayload?.type && updated?.id) {
        trackClientEvent(eventPayload.type, {
          entityType: 'contract',
          entityId: updated.id,
          metadata: eventPayload.metadata || {},
        })
      }
    } catch (err) {
      setActionError(err.message || 'Action failed')
    } finally {
      setSaving(false)
    }
  }

  const runStepActionWithProofWarning = async (runner, eventPayload = null) => {
    if (!hasAcceptedProof) {
      const proceed = window.confirm(
        'No accepted payment proof is recorded yet. You can continue, but submitting a bank/LC proof is strongly recommended. Proceed anyway?'
      )
      if (!proceed) return
    }
    await runStepAction(runner, eventPayload)
  }

  const handleCreateDraft = async () => {
    await runStepAction(async (token) => apiRequest('/documents/contracts/draft', {
      method: 'POST',
      token,
      body: {
        title: draftForm.title,
        buyer_name: draftForm.buyer_name,
        factory_name: draftForm.factory_name,
        buyer_id: draftForm.buyer_id,
        factory_id: draftForm.factory_id,
        bank_name: draftForm.bank_name,
        beneficiary_name: draftForm.beneficiary_name,
        transaction_reference: draftForm.transaction_reference,
      },
    }), { type: 'contract_draft_created' })
    setDraftOpen(false)
    setDraftForm({
      title: '',
      buyer_name: '',
      factory_name: '',
      buyer_id: '',
      factory_id: '',
      bank_name: '',
      beneficiary_name: '',
      transaction_reference: '',
    })
    await loadContracts()
  }

  const openDetails = (contractId) => {
    setSelectedId(String(contractId))
    setDrawerOpen(true)
  }

  const detailPanel = selected ? (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
              {toLabel(selected.lifecycle_status || 'pending_signature')}
            </span>
          </div>
          <div className="mt-1 text-sm text-slate-600">{safeDash(selected.title)}</div>
          <div className="mt-3 text-sm text-slate-700">
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">-</span>
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
      {!hasRecordedCall ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.</span>
            <Link to="/chat" className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500">
              Open chat
            </Link>
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <StepPill done={selectedFlow.stepState.draft_creation} label="Draft" />
        <StepPill done={selectedFlow.stepState.buyer_signature} label="Buyer sign" />
        <StepPill done={selectedFlow.stepState.factory_signature} label="Factory sign" />
        <StepPill done={selectedFlow.stepState.artifact_finalize} label="Lock PDF" />
        <StepPill done={selectedFlow.stepState.archive} label="Archive" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Signatures</div>
          <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
          <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
          {!hasAcceptedProof ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
              Warning: No accepted payment proof yet. You may continue, but proof is strongly recommended for safety.
            </div>
          ) : null}
          <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.buyerSign) || saving}
                onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
                  method: 'PATCH',
                  token,
                  body: { buyer_signature_state: 'signed', is_draft: false },
                }), { type: 'contract_buyer_sign' })}
                className="rounded-xl bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
              >
                Buyer sign
              </button>
            {selectedActionBlockers.buyerSign ? <div className="text-xs text-amber-700">{selectedActionBlockers.buyerSign}</div> : null}

              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.factorySign) || saving}
                onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
                  method: 'PATCH',
                  token,
                  body: { factory_signature_state: 'signed', is_draft: false },
                }), { type: 'contract_factory_sign' })}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0A66C2] ring-1 ring-[#BBD8FF] hover:bg-[#F6FAFF] disabled:bg-slate-50 disabled:text-slate-400 disabled:ring-slate-200"
              >
                Factory sign
              </button>
            {selectedActionBlockers.factorySign ? <div className="text-xs text-amber-700">{selectedActionBlockers.factorySign}</div> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Artifact (PDF)</div>
          <div className="mt-2 text-sm text-slate-700">Status: <span className="font-semibold">{selected.artifact?.status || 'draft'}</span></div>
          <div className="mt-1 text-xs text-slate-500">PDF generates automatically after both signatures.</div>

          <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                disabled={Boolean(selectedActionBlockers.lock) || saving}
                onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
                  method: 'PATCH',
                  token,
                  body: { status: 'locked' },
                }), { type: 'contract_locked' })}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400"
              >
                Lock PDF
              </button>
            {selectedActionBlockers.lock ? <div className="text-xs text-amber-700">{selectedActionBlockers.lock}</div> : null}

            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.archive) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
                method: 'PATCH',
                token,
                body: { status: 'archived' },
              }), { type: 'contract_archived' })}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
            >
              Archive
            </button>
            {selectedActionBlockers.archive ? <div className="text-xs text-amber-700">{selectedActionBlockers.archive}</div> : null}

            {canDownload
              ? <a href={downloadUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#0A66C2] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0959A8]">Download PDF</a>
              : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Banking references (optional)</div>
            <div className="mt-1 text-xs text-slate-500">For fraud prevention only. No direct payments are processed on-platform.</div>
          </div>
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {canViewBankingReferences(currentUser, selected) ? 'Visible' : 'Masked'}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Bank name: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.bank_name) : maskValue(selected.bank_name)}</div>
          <div>Beneficiary: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.beneficiary_name) : maskValue(selected.beneficiary_name)}</div>
          <div>Transaction reference: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.transaction_reference) : maskValue(selected.transaction_reference)}</div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">Payment proof workflow</div>
            <div className="mt-1 text-xs text-slate-500">Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review.</div>
          </div>
          <button type="button" onClick={() => loadPaymentProofs(selected.id)} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
            Refresh
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-600">Proof type</label>
          <div />
          <select
            value={paymentForm.type}
            onChange={(e) => setPaymentForm((prev) => ({ ...prev, type: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="bank_transfer">Bank transfer</option>
            <option value="lc">Letter of credit (LC)</option>
          </select>
          <div />

          {paymentForm.type === 'bank_transfer' ? (
            <>
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Transaction reference" value={paymentForm.transaction_reference} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_reference: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Bank name" value={paymentForm.bank_name} onChange={(e) => setPaymentForm((p) => ({ ...p, bank_name: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
          ) : (
            <>
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="LC number" value={paymentForm.lc_number} onChange={(e) => setPaymentForm((p) => ({ ...p, lc_number: e.target.value }))} />
              <div className="flex flex-wrap gap-2">
                <select
                  value={paymentForm.lc_type}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, lc_type: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="sight">Sight LC</option>
                  <option value="usance">Usance LC</option>
                </select>
                {paymentForm.lc_type === 'usance' ? (
                  <>
                    <select
                      value={paymentForm.usance_days}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, usance_days: e.target.value }))}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="custom">Custom</option>
                    </select>
                    {String(paymentForm.usance_days) === 'custom' ? (
                      <input
                        className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Days"
                        value={paymentForm.usance_custom_days}
                        onChange={(e) => setPaymentForm((p) => ({ ...p, usance_custom_days: e.target.value }))}
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Issuing bank" value={paymentForm.issuing_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, issuing_bank: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Advising bank" value={paymentForm.advising_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, advising_bank: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
              <div className="flex gap-2">
                <input className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
                <input className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-600">Upload proof document</label>
            <input
              type="file"
              className="mt-2 text-xs"
              onChange={(e) => setPaymentForm((p) => ({ ...p, document_file: e.target.files?.[0] || null }))}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={submitPaymentProof}
            disabled={saving}
            className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            Submit proof
          </button>
          {paymentNotice ? <span className="text-xs text-slate-500">{paymentNotice}</span> : null}
        </div>

        <div className="mt-4 space-y-2">
          {paymentLoading ? <div className="text-xs text-slate-500">Loading proofs...</div> : null}
          {!paymentLoading && paymentProofs.length === 0 ? <div className="text-xs text-slate-500">No proofs submitted yet.</div> : null}
          {paymentProofs.map((proof) => {
            const proofDocUrl = resolveDownloadUrl(proof.document_url || '')
            return (
            <div key={proof.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{String(proof.type || '').replace('_', ' ').toUpperCase()}</div>
                <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                  {proof.status || 'pending'}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1">
                {proof.transaction_reference ? <div>Ref: {proof.transaction_reference}</div> : null}
                {proof.lc_number ? <div>LC: {proof.lc_number}</div> : null}
                {proof.lc_type ? (
                  <div>
                    LC Type: {String(proof.lc_type).toUpperCase()}
                    {proof.lc_type === 'usance' && proof.usance_days ? ` (${proof.usance_days} days)` : ''}
                  </div>
                ) : null}
                {proof.amount ? <div>Amount: {proof.amount} {proof.currency || ''}</div> : null}
              </div>
              {proofDocUrl || proof.document_id ? (
                <div className="mt-2">
                  {proofDocUrl ? (
                    <a href={proofDocUrl} target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-[#0A66C2] hover:underline">Open proof document</a>
                  ) : (
                    <span className="text-[10px] text-slate-500">Document linked</span>
                  )}
                </div>
              ) : null}
              {canReviewPayment ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {proof.type === 'bank_transfer' ? (
                    <>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'received')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Mark received</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'accepted')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Accept</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
                      <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          )})}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Call recordings</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">Recorded calls are stored for dispute resolution and security (project.md).</div>
          </div>
          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200">
            {callsLoading ? 'Loading...' : `${callItems.filter((c) => c.recording_url).length} available`}
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {callItems.map((call) => {
            const url = resolveDownloadUrl(call.recording_url)
            const canPlay = Boolean(call.recording_status === 'available' && url)
            return (
              <div key={call.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-black/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{safeDash(call.title) || 'Call session'}</div>
                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {safeDash(call.status)} - {call.created_at ? new Date(call.created_at).toLocaleString() : '\u2014'}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-200">
                    {String(call.recording_status || 'pending')}
                  </div>
                </div>

                {canPlay ? (
                  <div className="mt-3">
                    <video
                      src={url}
                      controls
                      className="w-full rounded-lg bg-black/5 dark:bg-black/30"
                      onPlay={async () => {
                        try {
                          const token = getToken()
                          if (!token) return
                          await apiRequest(`/calls/${encodeURIComponent(call.id)}/recording/viewed`, { method: 'POST', token })
                        } catch {
                          // silent
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">Recording not available yet.</div>
                )}
              </div>
            )
          })}
          {!callsLoading && callItems.length === 0 ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">No calls linked to this contract yet.</div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">Artifact audit</div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Status: {safeDash(selected.artifact?.status)}</div>
          <div>Generated at: {safeDash(selected.artifact?.generated_at)}</div>
          <div>Version: {selected.artifact?.version ?? 0}</div>
          <div className="break-all text-xs text-slate-600">Hash: {safeDash(selected.artifact?.pdf_hash)}</div>
          <div className="text-xs text-slate-600">
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-900">Contract Audit Trail</div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">Premium</div>
        </div>
        {auditLoading ? (
          <div className="mt-3 text-sm text-slate-600">Loading audit trail...</div>
        ) : auditError ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            {auditError}
          </div>
        ) : auditLog.length ? (
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            {auditLog.map((entry) => (
              <div key={entry.id || `${entry.timestamp}-${entry.note}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900">{entry.action || 'update'}</span>
                  <span>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '\u2014'}</span>
                </div>
                <div className="mt-1 text-slate-600">{entry.note || 'Audit entry recorded.'}</div>
                {entry.actor_name || entry.actor_id ? (
                  <div className="mt-2 text-[11px] text-slate-500">By {entry.actor_name || entry.actor_id}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-600">No audit entries yet.</div>
        )}
      </div>
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
      Select a contract to see details.
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-[var(--gt-blue)]">Vault</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
              onClick={() => setDraftOpen(true)}
              className="rounded-full bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:bg-slate-200 disabled:text-slate-500"
            >
              New draft
            </button>
          </div>
        </div>

        {forbidden ? <AccessDeniedState message={error || 'Access denied.'} /> : null}
        {!forbidden && error ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}

        {!forbidden ? (
          <div className="secure-grid grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contracts</div>
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="relative">
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by number, buyer, factory, title..."
                      className="w-full rounded-xl bg-white px-3 py-2 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
                      {isMac ? '⌘ K' : 'Ctrl K'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'draft', label: 'Draft' },
                      { key: 'pending_signature', label: 'Pending' },
                      { key: 'signed', label: 'Signed' },
                      { key: 'archived', label: 'Archived' },
                    ].map((chip) => (
                      <motion.button
                        key={chip.key}
                        type="button"
                        onClick={() => setStatusFilter(chip.key)}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                        className={`relative rounded-full px-3 py-1 text-xs font-semibold transition ring-1 ${
                          statusFilter === chip.key
                            ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
                            : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
                        }`}
                      >
                        {statusFilter === chip.key ? (
                          <motion.span
                            layoutId="contract-filter"
                            className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          />
                        ) : null}
                        <span className="relative">{chip.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {loadingContracts ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={`contract-skel-${i}`} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-3 w-1/3 rounded-full skeleton" />
                            <div className="h-3 w-2/3 rounded-full skeleton" />
                            <div className="h-3 w-1/2 rounded-full skeleton" />
                          </div>
                          <div className="h-7 w-20 rounded-full skeleton" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <div className="h-6 w-24 rounded-full skeleton" />
                          <div className="h-6 w-24 rounded-full skeleton" />
                          <div className="h-6 w-20 rounded-full skeleton" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : visibleContracts.length ? visibleContracts.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
                    className="hidden lg:block"
                  >
                    <ContractRow
                      contract={c}
                      active={String(c.id) === String(selectedId)}
                      onSelect={() => setSelectedId(String(c.id))}
                    />
                  </motion.div>
                )) : (
                  <div className="rounded-2xl bg-[#ffffff] p-8 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800">
                    No contracts found.
                  </div>
                )}

                {visibleContracts.length ? (
                  <div className="grid gap-3 lg:hidden">
                    {visibleContracts.map((c) => (
                      <ContractRow
                        key={c.id}
                        contract={c}
                        active={String(c.id) === String(selectedId)}
                        onSelect={() => openDetails(c.id)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="hidden lg:col-span-7 lg:block">
              {detailPanel}
            </div>
          </div>
        ) : null}

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {detailPanel}
        </Drawer>

        {draftOpen ? (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDraftOpen(false)} />
            <div className="absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#0A66C2]">New</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">Create contract draft</div>
                  <div className="mt-1 text-xs text-slate-600">Banking references are optional and should be used only for fraud prevention.</div>
                </div>
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <div className="hidden sm:block" />

                <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2]" />
                <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A66C2] sm:col-span-2" />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
                <button
                  type="button"
                  disabled={!canCreateDraft(currentUser) || saving}
                  onClick={handleCreateDraft}
                  className="rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Create draft
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

