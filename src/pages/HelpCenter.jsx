import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function HelpCenter(){
  const [q, setQ] = useState('')
  const faqs = [
    { q: 'How to create Buyer Request?', a: 'Use Post New Request from your dashboard and follow steps.' },
    { q: 'How to manage contracts?', a: 'Visit Contract Vault to upload and download signed agreements.' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#0A66C2]">GarTexHub</Link>
          <div className="flex items-center gap-4">
            <input placeholder="Search help topics..." value={q} onChange={(e)=>setQ(e.target.value)} className="px-3 py-2 rounded" />
            <label className="flex items-center gap-2 text-sm">
              <span className="text-gray-700 text-xs">Unique</span>
              <input type="checkbox" className="h-4 w-8" />
            </label>
            <Link to="/help" className="text-sm font-semibold text-[#0A66C2]">Help</Link>
            <Link to="/feed" className="text-sm">Feed</Link>
            <div className="w-9 h-9 bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] rounded-full"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-2">Help Center</h1>
          <input placeholder="Search help topics..." value={q} onChange={(e)=>setQ(e.target.value)} className="w-full border px-3 py-2 rounded mb-4" />

          <div className="space-y-3">
            {faqs.filter(f=>f.q.toLowerCase().includes(q.toLowerCase())).map((f,i)=> (
              <details key={i} className="bg-white border rounded p-3">
                <summary className="font-semibold">{f.q}</summary>
                <p className="text-sm text-[#5A5A5A] mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </main>

        <aside>
          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold">Floating Assistant</h4>
            <p className="text-sm text-[#5A5A5A]">Ask a question or browse FAQs — assistant will match topics.</p>
          </div>
        </aside>
      </div>

      <FloatingAssistant />
    </div>
  )
}
