import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AccessDeniedState from '../components/AccessDeniedState'
import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'

function toLabel(status) {
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
  if (status === 'signed') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  if (status === 'draft') return 'bg-slate-50 text-slate-700 ring-slate-200'
  if (status === 'archived') return 'bg-slate-100 text-slate-700 ring-slate-300'
  return 'bg-amber-50 text-amber-700 ring-amber-200'
}

function resolveDownloadUrl(pdfPath) {
  if (!pdfPath) return ''
  if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) return pdfPath
  const baseOrigin = API_BASE.replace(/\/api\/?$/, '')
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
      className={`w-full rounded-2xl border p-4 text-left transition ${active ? 'border-[#0A66C2] bg-[#F6FAFF]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
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
            <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">•</span>
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
  const [contracts, setContracts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

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
    try {
      const token = getToken()
      if (!token) {
        setContracts([])
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
    }
  }

  useEffect(() => {
    loadContracts()
  }, [])

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

  const selectedFlow = computeFlow(selected)
  const selectedActionBlockers = actionBlockers(currentUser, selected)
  const downloadUrl = resolveDownloadUrl(selected?.artifact?.pdf_path)
  const canDownload = Boolean(selectedFlow?.hasPdf && downloadUrl)

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

  const runStepAction = async (runner) => {
    setSaving(true)
    setActionError('')
    try {
      const token = getToken()
      const updated = await runner(token)
      upsertContract(updated)
    } catch (err) {
      setActionError(err.message || 'Action failed')
    } finally {
      setSaving(false)
    }
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
    }))
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
            <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">•</span>
            <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
          </div>
        </div>
        <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
      </div>

      {actionError ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}

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
          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.buyerSign) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
                method: 'PATCH',
                token,
                body: { buyer_signature_state: 'signed', is_draft: false },
              }))}
              className="rounded-xl bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
            >
              Buyer sign
            </button>
            {selectedActionBlockers.buyerSign ? <div className="text-xs text-amber-700">{selectedActionBlockers.buyerSign}</div> : null}

            <button
              type="button"
              disabled={Boolean(selectedActionBlockers.factorySign) || saving}
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
                method: 'PATCH',
                token,
                body: { factory_signature_state: 'signed', is_draft: false },
              }))}
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
              onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
                method: 'PATCH',
                token,
                body: { status: 'locked' },
              }))}
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
              }))}
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

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
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

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">Artifact audit</div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
          <div>Status: {safeDash(selected.artifact?.status)}</div>
          <div>Generated at: {safeDash(selected.artifact?.generated_at)}</div>
          <div>Version: {selected.artifact?.version ?? 0}</div>
          <div className="break-all text-xs text-slate-600">Hash: {safeDash(selected.artifact?.pdf_hash)}</div>
          <div className="text-xs text-slate-600">
            Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
          </div>
          <div className="text-xs text-slate-600">
            Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">•</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
      Select a contract to see details.
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold text-[#0A66C2]">Vault</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Contract Vault</h1>
            <p className="mt-1 text-sm text-slate-600">Draft → Sign → PDF artifact → Lock → Archive</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Dashboard</Link>
            <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Notifications</Link>
            <button
              type="button"
              disabled={!canCreateDraft(currentUser)}
              onClick={() => setDraftOpen(true)}
              className="rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
            >
              New draft
            </button>
          </div>
        </div>

        {forbidden ? <AccessDeniedState message={error || 'Access denied.'} /> : null}
        {!forbidden && error ? <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}

        {!forbidden ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-semibold text-slate-900">Contracts</div>
                  <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200">Refresh</button>
                </div>

                <div className="mt-4 grid gap-3">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by number, buyer, factory, title..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#0A66C2]"
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'draft', label: 'Draft' },
                      { key: 'pending_signature', label: 'Pending' },
                      { key: 'signed', label: 'Signed' },
                      { key: 'archived', label: 'Archived' },
                    ].map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => setStatusFilter(chip.key)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusFilter === chip.key ? 'bg-[#E8F3FF] text-[#0A66C2] ring-[#BBD8FF]' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'}`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {visibleContracts.length ? visibleContracts.map((c) => (
                  <div key={c.id} className="hidden lg:block">
                    <ContractRow
                      contract={c}
                      active={String(c.id) === String(selectedId)}
                      onSelect={() => setSelectedId(String(c.id))}
                    />
                  </div>
                )) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
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

