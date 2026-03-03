import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'
import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'

const FLOW_STEPS = ['draft_creation', 'buyer_signature', 'factory_signature', 'artifact_finalize', 'archive']

function toLabel(status) {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'pending_signature':
      return 'Pending Signature'
    case 'signed':
      return 'Signed / Finalized'
    case 'archived':
      return 'Archived'
    default:
      return 'Pending Signature'
  }
}

function statusStyle(status) {
  if (status === 'signed') return 'bg-green-100 text-green-700'
  if (status === 'draft') return 'bg-gray-100 text-gray-700'
  if (status === 'archived') return 'bg-slate-200 text-slate-700'
  return 'bg-orange-100 text-orange-700'
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

function computeFlow(contract) {
  const buyerSigned = contract?.buyer_signature_state === 'signed'
  const factorySigned = contract?.factory_signature_state === 'signed'
  const finalized = contract?.artifact?.status === 'locked'
  const archived = contract?.artifact?.status === 'archived' || Boolean(contract?.archived_at)
  const draftComplete = !contract?.is_draft

  const blockers = []
  if (!buyerSigned) blockers.push('Buyer signature pending')
  if (!factorySigned) blockers.push('Factory signature pending')
  if (!finalized && buyerSigned && factorySigned) blockers.push('Final artifact not finalized (PDF/hash required)')
  if (!archived && finalized) blockers.push('Archive not completed')

  const stepState = {
    draft_creation: draftComplete,
    buyer_signature: buyerSigned,
    factory_signature: factorySigned,
    artifact_finalize: finalized,
    archive: archived,
  }

  return { stepState, blockers, finalized }
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
  if (String(user.id) === String(contract.uploaded_by)) return true
  return user.role === 'buying_house' || user.role === 'factory'
}

function canArchive(user, contract) {
  if (!user || !contract) return false
  return isOwnerLevel(user) || String(user.id) === String(contract.uploaded_by)
}

export default function ContractVault(){
  const [filter, setFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selected, setSelected] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [contracts, setContracts] = useState([])
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [saving, setSaving] = useState(false)
  const [draftForm, setDraftForm] = useState({ title: '', buyer_name: '', factory_name: '', buyer_id: '', factory_id: '' })
  const [artifactForm, setArtifactForm] = useState({ pdf_path: '', pdf_hash: '' })
  const currentUser = useMemo(() => getCurrentUser(), [])

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
    } catch (err) {
      setError(err.status === 403 ? 'You do not have permission to view these contracts.' : (err.message || 'Failed to load contracts'))
      setContracts([])
    }
  }

  useEffect(() => {
    loadContracts()
  }, [])

  const visibleContracts = useMemo(() => contracts.filter((c) => {
    if (filter !== 'all' && c.lifecycle_status !== filter) return false
    const effectiveDate = c.updated_at || c.created_at
    if (fromDate && effectiveDate < fromDate) return false
    if (toDate && effectiveDate > `${toDate}T23:59:59`) return false
    return true
  }), [contracts, filter, fromDate, toDate])

  const upsertContract = (nextContract) => {
    setContracts((prev) => {
      const idx = prev.findIndex((entry) => entry.id === nextContract.id)
      if (idx < 0) return [nextContract, ...prev]
      const clone = [...prev]
      clone[idx] = nextContract
      return clone
    })
    setSelected(nextContract)
  }

  const runStepAction = async (runner) => {
    setSaving(true)
    setActionError('')
    try {
      const token = getToken()
      const updated = await runner(token)
      if (updated?.id) upsertContract(updated)
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
      },
    }))
    await loadContracts()
  }

  const selectedFlow = computeFlow(selected)
  const selectedDownloadUrl = resolveDownloadUrl(selected?.artifact?.pdf_path)
  const canDownloadSelected = selectedFlow.finalized && Boolean(selectedDownloadUrl)

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">Dashboard</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/owner" className="block">Overview</Link>
              <Link to="/buyer-requests" className="block">Buyer Requests</Link>
              <Link to="/chat" className="block">Chats</Link>
              <Link to="/partner-network" className="block">Partner Network</Link>
              <Link to="/contracts" className="block font-semibold text-[#0F3D91]">Contract Vault</Link>
              <Link to="/insights" className="block">Analytics</Link>
              <Link to="/org-settings" className="block">Settings</Link>
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold">🔒 Contract Vault <span className="ml-2 text-sm text-gray-500">Encrypted & Timestamped</span></h1>
              <p className="text-sm text-[#5A5A5A]">Step-driven execution from draft through signatures, artifact finalization, and archive.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} className="px-3 py-2 border rounded" />
              <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} className="px-3 py-2 border rounded" />
              <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="px-3 py-2 border rounded">
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="pending_signature">Pending Signature</option>
                <option value="signed">Signed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <section className="bg-white border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Step 1 · Draft creation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              <input placeholder="Contract title" value={draftForm.title} onChange={(e) => setDraftForm((prev) => ({ ...prev, title: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="Buyer name" value={draftForm.buyer_name} onChange={(e) => setDraftForm((prev) => ({ ...prev, buyer_name: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="Factory name" value={draftForm.factory_name} onChange={(e) => setDraftForm((prev) => ({ ...prev, factory_name: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="Buyer user ID" value={draftForm.buyer_id} onChange={(e) => setDraftForm((prev) => ({ ...prev, buyer_id: e.target.value }))} className="px-3 py-2 border rounded" />
              <input placeholder="Factory user ID" value={draftForm.factory_id} onChange={(e) => setDraftForm((prev) => ({ ...prev, factory_id: e.target.value }))} className="px-3 py-2 border rounded" />
            </div>
            <button disabled={!canCreateDraft(currentUser) || saving} onClick={handleCreateDraft} className="px-4 py-2 rounded bg-[#0A66C2] text-white disabled:bg-gray-300">
              Create Draft (POST /documents/contracts/draft)
            </button>
            {!canCreateDraft(currentUser) && <p className="text-xs text-amber-700 mt-2">Your role cannot create contract drafts.</p>}
          </section>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {actionError && <div className="text-sm text-red-600">{actionError}</div>}

          <div className="grid gap-4">
            {visibleContracts.map(c => {
              const status = c.lifecycle_status || 'pending_signature'
              const flow = computeFlow(c)
              const pdfUrl = resolveDownloadUrl(c.artifact?.pdf_path)
              const canDownload = flow.finalized && Boolean(pdfUrl)
              return (
                <div key={c.id} className="bg-white neo-panel cyberpunk-card rounded-lg shadow-sm p-4 flex items-center justify-between gap-4">
                  <div onClick={() => { setSelected(c); setDrawerOpen(true); setArtifactForm({ pdf_path: c.artifact?.pdf_path || '', pdf_hash: c.artifact?.pdf_hash || '' }) }} className="cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{c.contract_number || c.id}</div>
                      <div className={`text-sm px-2 py-1 rounded ${statusStyle(status)}`}>{toLabel(status)}</div>
                    </div>
                    <div className="text-sm text-[#5A5A5A]">Buyer: {c.buyer_name || '—'} • Factory: {c.factory_name || '—'}</div>
                    <div className="text-sm text-[#5A5A5A]">Blockers: {flow.blockers.length ? flow.blockers.join(' · ') : 'None'}</div>
                    <div className="text-sm text-[#5A5A5A]">Updated: {(c.updated_at || c.created_at || '').slice(0, 10)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelected(c); setDrawerOpen(true); setArtifactForm({ pdf_path: c.artifact?.pdf_path || '', pdf_hash: c.artifact?.pdf_hash || '' }) }} className="px-3 py-1 border rounded">Details</button>
                    {canDownload ? <a href={pdfUrl} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded">Download PDF</a> : <span className="px-3 py-1 border rounded text-gray-400">Finalize artifact to download</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {drawerOpen && selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={()=>{setDrawerOpen(false); setSelected(null)}}></div>
          <aside className="w-[32rem] bg-white neo-panel cyberpunk-card border-l shadow-xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">{selected.contract_number || selected.id}</h3>
                <div className="text-sm text-[#5A5A5A]">{selected.buyer_name || '—'} • {selected.factory_name || '—'}</div>
              </div>
              <button onClick={()=>{setDrawerOpen(false); setSelected(null)}} className="px-2 py-1">Close</button>
            </div>

            <section className="mb-4">
              <h4 className="font-semibold">Lifecycle timeline</h4>
              <ol className="mt-2 space-y-2 text-sm">
                {FLOW_STEPS.map((step, idx) => {
                  const done = selectedFlow.stepState[step]
                  const labels = {
                    draft_creation: 'Draft created and shared',
                    buyer_signature: 'Buyer signature',
                    factory_signature: 'Factory signature',
                    artifact_finalize: 'Artifact finalized (PDF/hash locked)',
                    archive: 'Archived',
                  }
                  return (
                    <li key={step} className="flex items-start gap-2">
                      <span className={`inline-block w-5 h-5 rounded-full text-center text-xs leading-5 ${done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{idx + 1}</span>
                      <span>{labels[step]} {done ? '✓' : '• pending'}</span>
                    </li>
                  )
                })}
              </ol>
              <div className="text-xs text-[#5A5A5A] mt-2">Blockers: {selectedFlow.blockers.length ? selectedFlow.blockers.join(' · ') : 'None'}</div>
            </section>

            <section className="mb-4">
              <h4 className="font-semibold">Step actions (role-sensitive)</h4>
              <div className="space-y-2 mt-2 text-sm">
                <button
                  disabled={!canBuyerSign(currentUser, selected) || saving || selected.buyer_signature_state === 'signed'}
                  onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
                    method: 'PATCH',
                    token,
                    body: { buyer_signature_state: 'signed', is_draft: false },
                  }))}
                  className="w-full px-3 py-2 border rounded disabled:text-gray-400"
                >
                  Step 2 · Buyer signature (PATCH /signatures)
                </button>

                <button
                  disabled={!canFactorySign(currentUser, selected) || saving || selected.factory_signature_state === 'signed'}
                  onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
                    method: 'PATCH',
                    token,
                    body: { factory_signature_state: 'signed', is_draft: false },
                  }))}
                  className="w-full px-3 py-2 border rounded disabled:text-gray-400"
                >
                  Step 3 · Factory signature (PATCH /signatures)
                </button>

                <div className="border rounded p-2">
                  <div className="font-medium mb-2">Step 4 · Artifact finalize</div>
                  <input placeholder="PDF path" value={artifactForm.pdf_path} onChange={(e) => setArtifactForm((prev) => ({ ...prev, pdf_path: e.target.value }))} className="w-full px-3 py-2 border rounded mb-2" />
                  <input placeholder="PDF hash" value={artifactForm.pdf_hash} onChange={(e) => setArtifactForm((prev) => ({ ...prev, pdf_hash: e.target.value }))} className="w-full px-3 py-2 border rounded mb-2" />
                  <button
                    disabled={!canFinalizeArtifact(currentUser, selected) || saving || selected.buyer_signature_state !== 'signed' || selected.factory_signature_state !== 'signed'}
                    onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
                      method: 'PATCH',
                      token,
                      body: { status: 'locked', pdf_path: artifactForm.pdf_path, pdf_hash: artifactForm.pdf_hash },
                    }))}
                    className="w-full px-3 py-2 border rounded disabled:text-gray-400"
                  >
                    Finalize artifact (PATCH /artifact)
                  </button>
                </div>

                <button
                  disabled={!canArchive(currentUser, selected) || saving || selected.artifact?.status !== 'locked'}
                  onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
                    method: 'PATCH',
                    token,
                    body: { status: 'archived' },
                  }))}
                  className="w-full px-3 py-2 border rounded disabled:text-gray-400"
                >
                  Step 5 · Archive (PATCH /artifact)
                </button>
              </div>
            </section>

            <section className="mb-4 text-sm text-[#5A5A5A]">
              <h4 className="font-semibold text-black">Digital signatures</h4>
              <div>Buyer: {selected.buyer_signature_state || 'pending'}</div>
              <div>Factory: {selected.factory_signature_state || 'pending'}</div>
            </section>

            <section className="mb-4 text-sm text-[#5A5A5A]">
              <h4 className="font-semibold text-black">Final artifact</h4>
              <div>Status: {selected.artifact?.status || 'draft'}</div>
              <div className="text-xs break-all">Hash: {selected.artifact?.pdf_hash || 'N/A'}</div>
            </section>

            <div className="flex gap-2 mt-6">
              {canDownloadSelected
                ? <a href={selectedDownloadUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#0A66C2] text-white rounded">Download PDF</a>
                : <button disabled className="px-4 py-2 bg-gray-300 text-white rounded">Download after finalization</button>}
            </div>
          </aside>
        </div>
      )}

      <FloatingAssistant />
    </div>
  )
}
