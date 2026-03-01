import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function ChatInterface(){
  const [active, setActive] = useState(null)
  const chats = [
    { id: 1, name: 'Global Apparel Co', last: 'Can you share sample pics?', unread: 2, verified: true },
    { id: 2, name: 'Premier Textile', last: 'We can do MOQ 200', unread: 0, verified: true },
  ]

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <input className="w-full border px-3 py-2 rounded" placeholder="Search chats" />
            <div className="mt-4 space-y-2">
              {chats.map(c => (
                <div key={c.id} className={`p-2 rounded cursor-pointer ${active===c.id? 'bg-[#F4F9FF]':''}`} onClick={()=>setActive(c.id)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{c.name} {c.verified && <span className="text-[#0A66C2]">✓</span>}</div>
                      <div className="text-sm text-[#5A5A5A]">{c.last}</div>
                    </div>
                    {c.unread>0 && <div className="text-xs bg-[#0A66C2] text-white px-2 py-1 rounded">{c.unread}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-4 h-[60vh] flex flex-col">
            {active? (
              <>
                <div className="flex items-center justify-between border-b pb-3 mb-3">
                  <div>
                    <div className="font-semibold">{chats.find(x=>x.id===active).name}</div>
                    <div className="text-sm text-[#5A5A5A]">Verified Partner</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded">📹 Video Call</button>
                    <button className="px-3 py-1 border rounded">📞 Audio Call</button>
                    <button className="px-3 py-1 border rounded">📅 Schedule</button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto mb-3">
                  <div className="space-y-3">
                    <div className="self-start bg-white p-2 rounded shadow">Hello, we can supply samples.</div>
                    <div className="self-end bg-[#0A66C2] text-white p-2 rounded">Thanks — please send specs.</div>
                    <div className="text-center text-sm text-[#5A5A5A]">System: Lead claimed by Agent Riz</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 border px-3 py-2 rounded" placeholder="Write a message..." />
                  <button className="px-4 py-2 bg-[#0A66C2] text-white rounded">Send</button>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-[#5A5A5A]">Select a chat to begin</div>
            )}
          </div>
        </main>
      </div>

      <FloatingAssistant />
    </div>
  )
}
