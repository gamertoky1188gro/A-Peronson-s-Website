import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('requests')
  const [searchQuery, setSearchQuery] = useState('')
  const requests = [
    { 
      id: 1, 
      buyerLogo: '🏢', 
      buyerName: 'RetailCo', 
      title: 'Knit polos - 1200 units', 
      status: 'Claimed', 
      aiSummary: 'Need durable pique fabric, multi-color',
      claimed: true 
    },
    { 
      id: 2, 
      buyerLogo: '🏢', 
      buyerName: 'StreetStyle', 
      title: 'Denim jackets - 800 units', 
      status: 'Available', 
      aiSummary: 'Require heavy denim, hardware details',
      claimed: false 
    },
  ]

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-full px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#0A66C2]">GarTexHub</Link>

          <input
            type="text"
            placeholder="Global Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 mx-8 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
          />

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">🔔</button>
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] rounded-full"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4 space-y-3 sticky top-20">
            <Link to="/agent?tab=requests" className="block font-semibold text-[#0A66C2] cursor-pointer">📋 My Requests</Link>
            <div className="text-sm text-[#5A5A5A]">Assigned: 2</div>
            <div className="mt-2">
              <button className="px-3 py-2 bg-[#0A66C2] text-white rounded-md w-full hover:bg-[#083B75]">View Dashboard</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 mt-4 sticky top-56">
            <Link to="/agent?tab=chats" className="block font-semibold text-[#0A66C2] cursor-pointer mb-3">💬 My Chats</Link>
            <div className="text-sm text-[#5A5A5A] mt-2">Active conversations: 3</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 mt-4">
            <Link to="/agent?tab=factories" className="block font-semibold text-[#0A66C2] cursor-pointer mb-3">🏭 Connected Factories</Link>
            <div className="text-sm text-[#5A5A5A]">12 connected (View Only)</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 mt-4">
            <h3 className="font-semibold mb-2">My Performance</h3>
            <div className="text-sm text-[#5A5A5A] space-y-1">
              <div>Completion Rate: <strong>90%</strong></div>
              <div>Response Time: <strong>6 hrs</strong></div>
              <div>Active Leads: <strong>5</strong></div>
            </div>
          </div>

          <Link to="/login" className="block w-full mt-4 px-3 py-2 text-center bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100">Logout</Link>
        </aside>

        <main className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3 border-b pb-3">
              <h3 className="font-semibold">Assigned Requests</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('requests')} 
                  className={`px-3 py-1 rounded ${activeTab === 'requests' ? 'bg-[#0A66C2] text-white' : 'border'}`}
                >
                  Requests
                </button>
                <button 
                  onClick={() => setActiveTab('chats')} 
                  className={`px-3 py-1 rounded ${activeTab === 'chats' ? 'bg-[#0A66C2] text-white' : 'border'}`}
                >
                  Chats
                </button>
              </div>
            </div>

            {activeTab === 'requests' && (
              <div className="space-y-3">
                {requests.map(r => (
                  <div key={r.id} className="border border-gray-100 rounded-md p-3 flex items-start justify-between hover:shadow-sm transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{r.buyerLogo}</div>
                        <div>
                          <div className="font-semibold">{r.buyerName}</div>
                          <div className="text-sm text-[#5A5A5A]">{r.title}</div>
                        </div>
                      </div>
                      <div className="text-sm text-[#5A5A5A] mt-2 ml-10">{r.aiSummary}</div>
                    </div>
                    <div className="text-sm text-[#5A5A5A] flex flex-col items-end gap-2 ml-4">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.claimed ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/agent/request/${r.id}`} className="px-3 py-1 bg-[#0A66C2] text-white rounded-md hover:bg-[#083B75]">
                          {r.claimed ? 'View' : 'Claim & Start'}
                        </Link>
                        <Link to={`/agent/chat/${r.id}`} className="px-3 py-1 border rounded-md hover:bg-gray-50">Message</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'chats' && (
              <div>
                <div className="h-64 bg-gray-50 rounded-md p-3 text-sm text-[#5A5A5A] flex items-center justify-center">
                  <div>
                    <div className="text-center mb-4">💬 Chat with Buyer</div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">📞 Call</button>
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">📅 Schedule</button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <input className="flex-1 border border-gray-200 rounded-md px-3 py-2" placeholder="Write a message..." />
                  <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-[#083B75]">Send</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <FloatingAssistant />
    </div>
  )
}
