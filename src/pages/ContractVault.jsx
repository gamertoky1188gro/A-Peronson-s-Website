import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'
import { API_BASE, apiRequest, getToken } from '../lib/auth'

function toLabel(status) {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'pending_signature':
      return 'Pending Signature'
    case 'signed':
      return 'Signed'
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

export default function ContractVault(){
  const [filter, setFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selected, setSelected] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [contracts, setContracts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const loadContracts = async () => {
      try {
        const token = getToken()
        if (!token) {
          if (mounted) setContracts([])
          return
        }
        const data = await apiRequest('/documents/contracts', { token })
        if (mounted) {
          setContracts(Array.isArray(data) ? data : [])
          setError('')
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load contracts')
          setContracts([])
        }
      }
    }
    loadContracts()
    return () => { mounted = false }
  }, [])

  const visibleContracts = useMemo(() => contracts.filter((c) => {
    if (filter !== 'all' && c.lifecycle_status !== filter) return false
    const effectiveDate = c.updated_at || c.created_at
    if (fromDate && effectiveDate < fromDate) return false
    if (toDate && effectiveDate > `${toDate}T23:59:59`) return false
    return true
  }), [contracts, filter, fromDate, toDate])

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🔒 Contract Vault <span className="ml-2 text-sm text-gray-500">Encrypted & Timestamped</span></h1>
              <p className="text-sm text-[#5A5A5A]">Securely stored agreements & signed documents</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} className="px-3 py-2 border rounded mr-2" />
              <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} className="px-3 py-2 border rounded mr-2" />
              <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="px-3 py-2 border rounded">
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="pending_signature">Pending Signature</option>
                <option value="signed">Signed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="grid gap-4">
            {visibleContracts.map(c => {
              const status = c.lifecycle_status || 'pending_signature'
              const pdfUrl = resolveDownloadUrl(c.artifact?.pdf_path)
              return (
                <div key={c.id} className="bg-white neo-panel cyberpunk-card rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <div onClick={() => { setSelected(c); setDrawerOpen(true) }} className="cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{c.contract_number || c.id}</div>
                      <div className={`text-sm px-2 py-1 rounded ${statusStyle(status)}`}>{toLabel(status)}</div>
                    </div>
                    <div className="text-sm text-[#5A5A5A]">Buyer: {c.buyer_name || '—'} • Factory: {c.factory_name || '—'}</div>
                    <div className="text-sm text-[#5A5A5A]">Updated: {(c.updated_at || c.created_at || '').slice(0, 10)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelected(c); setDrawerOpen(true) }} className="px-3 py-1 border rounded">Details</button>
                    {pdfUrl ? <a href={pdfUrl} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded">Download PDF</a> : <span className="px-3 py-1 border rounded text-gray-400">No PDF</span>}
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
          <aside className="w-96 bg-white neo-panel cyberpunk-card border-l shadow-xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">{selected.contract_number || selected.id}</h3>
                <div className="text-sm text-[#5A5A5A]">{selected.buyer_name || '—'} • {selected.factory_name || '—'}</div>
              </div>
              <button onClick={()=>{setDrawerOpen(false); setSelected(null)}} className="px-2 py-1">Close</button>
            </div>

            <section className="mb-4">
              <h4 className="font-semibold">Contract Status</h4>
              <p className="text-sm text-[#5A5A5A]">{toLabel(selected.lifecycle_status || 'pending_signature')}</p>
            </section>

            <section className="mb-4">
              <h4 className="font-semibold">Digital Signatures</h4>
              <div className="text-sm text-[#5A5A5A]">Buyer: {selected.buyer_signature_state || 'pending'}</div>
              <div className="text-sm text-[#5A5A5A]">Factory: {selected.factory_signature_state || 'pending'}</div>
            </section>

            <section className="mb-4">
              <h4 className="font-semibold">Final Artifact</h4>
              <div className="text-sm text-[#5A5A5A]">Status: {selected.artifact?.status || 'draft'}</div>
              <div className="text-xs text-[#5A5A5A] break-all">Hash: {selected.artifact?.pdf_hash || 'N/A'}</div>
            </section>

            <div className="flex gap-2 mt-6">
              {resolveDownloadUrl(selected.artifact?.pdf_path)
                ? <a href={resolveDownloadUrl(selected.artifact?.pdf_path)} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#0A66C2] text-white rounded">Download PDF</a>
                : <button disabled className="px-4 py-2 bg-gray-300 text-white rounded">Download PDF</button>}
            </div>
          </aside>
        </div>
      )}

      <FloatingAssistant />
    </div>
  )
}
