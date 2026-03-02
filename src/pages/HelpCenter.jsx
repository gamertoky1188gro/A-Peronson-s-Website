import React, { useState } from 'react'
import FloatingAssistant from '../components/FloatingAssistant'

export default function HelpCenter(){
  const [q, setQ] = useState('')
  const faqs = [
    { q: 'How to create Buyer Request?', a: 'Use Buyer Request Management. Buyers can include normal fields plus custom requirement description.' },
    { q: 'How does smart notification work?', a: 'When you search products/requests, your query is saved as a search alert. New matching posts appear in Notifications.' },
    { q: 'How are verified and unverified messages handled?', a: 'Verified users are prioritized for direct inbox routing. Others can still send but remain in request flow.' },
    { q: 'How to manage contracts?', a: 'Use Contract Vault to store digitally signed contract files and track deal artifacts.' },
  ]

  const access = [
    ['Public', '/, /pricing, /about, /terms, /privacy, /help, /login, /signup'],
    ['Any logged-in user', '/feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts, /notifications, /chat, /call'],
    ['Buyer + Buying House + Admin', '/buyer-requests'],
    ['Factory + Buying House + Admin', '/product-management, /partner-network'],
    ['Buying House + Factory + Admin', '/member-management, /org-settings'],
    ['Buying House + Admin', '/owner, /agent, /insights'],
  ]

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-2">Help Center</h1>
          <input placeholder="Search help topics..." value={q} onChange={(e)=>setQ(e.target.value)} className="w-full border px-3 py-2 rounded mb-4" />

          <div className="space-y-3 mb-6">
            {faqs.filter(f=>f.q.toLowerCase().includes(q.toLowerCase())).map((f,i)=> (
              <details key={i} className="bg-white neo-panel cyberpunk-card border rounded p-3">
                <summary className="font-semibold">{f.q}</summary>
                <p className="text-sm text-[#5A5A5A] mt-2">{f.a}</p>
              </details>
            ))}
          </div>

          <section className="bg-white neo-panel cyberpunk-card border rounded p-4">
            <h2 className="text-lg font-semibold mb-3">Page access matrix</h2>
            <div className="space-y-2 text-sm">
              {access.map(([role, pages]) => (
                <div key={role} className="grid grid-cols-12 gap-2 border-b border-white/10 pb-2">
                  <div className="col-span-4 font-semibold">{role}</div>
                  <div className="col-span-8">{pages}</div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside>
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
            <h4 className="font-semibold">Floating Assistant</h4>
            <p className="text-sm text-[#5A5A5A]">Available on all pages to help with setup, settings and quick workflow guidance.</p>
          </div>
        </aside>
      </div>

      <FloatingAssistant />
    </div>
  )
}
