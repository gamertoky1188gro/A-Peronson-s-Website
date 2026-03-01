import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function PartnerNetwork(){
  const [query, setQuery] = useState('')
  const factories = [
    { id: 'F-101', name: 'Premier Textile', category: 'Knitted', verified: true, deals: 12, connected: true },
    { id: 'F-202', name: 'Eco Fabrics Ltd', category: 'Sustainable', verified: true, deals: 5, connected: false },
  ]
  const [tab, setTab] = useState('connected')

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Partner Network</h1>
            <p className="text-sm text-[#5A5A5A]">Manage connected factories and requests</p>
          </div>
          <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md">+ Connect Factory</button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search factories" className="px-3 py-2 border rounded w-72" />
          <select className="px-3 py-2 border rounded">
            <option value="">All Categories</option>
            <option>Garments</option>
            <option>Textile</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <button onClick={()=>setTab('connected')} className={`px-3 py-2 rounded ${tab==='connected'?'bg-[#0A66C2] text-white':'border'}`}>Connected</button>
            <button onClick={()=>setTab('pending')} className={`px-3 py-2 rounded ${tab==='pending'?'bg-[#0A66C2] text-white':'border'}`}>Pending Requests</button>
            <button onClick={()=>setTab('suggested')} className={`px-3 py-2 rounded ${tab==='suggested'?'bg-[#0A66C2] text-white':'border'}`}>Suggested Partners</button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {factories.map(f => (
            <div key={f.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded"></div>
                  <div>
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-sm text-[#5A5A5A]">{f.category}</div>
                  </div>
                </div>
                {f.verified && <div className="text-sm text-[#0A66C2] font-semibold">✓ Verified</div>}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#5A5A5A]">Active Deals: {f.deals}</div>
                <div className="flex items-center gap-2">
                  <Link to={`/factory/${f.id}`} className="px-3 py-1 bg-[#0A66C2] text-white rounded">View Profile</Link>
                  {f.connected ? (
                    <button className="px-3 py-1 border rounded text-sm">Disconnect</button>
                  ) : (
                    <button className="px-3 py-1 border rounded text-sm">Connect</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
