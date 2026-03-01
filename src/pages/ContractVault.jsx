import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function ContractVault(){
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selected, setSelected] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const contracts = [
    { id: 'GTX-2026-00021', buyer: 'TexWorld GmbH', factory: 'Dhaka Knit Ltd', status: 'Signed', date: '2026-02-12' },
    { id: 'GTX-2026-00022', buyer: 'RetailCo', factory: 'Premier Textile', status: 'Pending', date: '2026-02-20' },
  ]

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 bg-[#0F3D91] text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">GarTexHub</Link>
          <div className="flex items-center gap-4">
            <input placeholder="Search contracts..." value={query} onChange={(e)=>setQuery(e.target.value)} className="px-3 py-2 rounded" />
            <label className="flex items-center gap-2 text-sm">
              <span className="text-white text-xs">Unique</span>
              <input type="checkbox" className="h-4 w-8" />
            </label>
            <Link to="/notifications" className="text-white">🔔</Link>
            <Link to="/owner" className="text-white">👤</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
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
                <option value="signed">Signed</option>
                <option value="pending">Pending</option>
                <option value="disputed">Disputed</option>
              </select>
              <button className="px-4 py-2 bg-[#0A66C2] text-white rounded">Upload Contract</button>
            </div>
          </div>

          <div className="grid gap-4">
            {contracts.map(c => (
              <div key={c.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div onClick={() => { setSelected(c); setDrawerOpen(true) }} className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{c.id}</div>
                    <div className={`text-sm px-2 py-1 rounded ${c.status==='Signed'? 'bg-green-100 text-green-700' : c.status==='Pending'? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{c.status}</div>
                  </div>
                  <div className="text-sm text-[#5A5A5A]">Buyer: {c.buyer} • Factory: {c.factory}</div>
                  <div className="text-sm text-[#5A5A5A]">Signed Date: {c.date}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelected(c); setDrawerOpen(true) }} className="px-3 py-1 border rounded">View PDF</button>
                  <button className="px-3 py-1 border rounded">Download</button>
                  <button onClick={() => { setSelected(c); setDrawerOpen(true) }} className="px-3 py-1 border rounded">View Meeting Record</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Slide-over drawer for contract details */}
      {drawerOpen && selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={()=>{setDrawerOpen(false); setSelected(null)}}></div>
          <aside className="w-96 bg-white border-l shadow-xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">{selected.id}</h3>
                <div className="text-sm text-[#5A5A5A]">{selected.buyer} • {selected.factory}</div>
              </div>
              <button onClick={()=>{setDrawerOpen(false); setSelected(null)}} className="px-2 py-1">Close</button>
            </div>

            <section className="mb-4">
              <h4 className="font-semibold">Summary (AI)</h4>
              <p className="text-sm text-[#5A5A5A]">Auto-generated short summary of the contract contents and key obligations.</p>
            </section>

            <section className="mb-4">
              <h4 className="font-semibold">Digital Signatures</h4>
              <div className="text-sm text-[#5A5A5A]">Signed by: Buyer Representative, Factory Rep</div>
            </section>

            <section className="mb-4">
              <h4 className="font-semibold">Timeline</h4>
              <ul className="text-sm text-[#5A5A5A] list-disc ml-5">
                <li>2026-02-10: Contract created</li>
                <li>2026-02-12: Signed</li>
              </ul>
            </section>

            <section className="mb-4">
              <h4 className="font-semibold">Meeting Logs</h4>
              <div className="text-sm text-[#5A5A5A]">Recording: meeting-gtx-2026-00021.mp3</div>
            </section>

            <div className="flex gap-2 mt-6">
              <button className="px-4 py-2 bg-[#0A66C2] text-white rounded">Download PDF</button>
              <button className="px-4 py-2 border rounded">Download Recording</button>
            </div>
          </aside>
        </div>
      )}

      <FloatingAssistant />
    </div>
  )
}
