import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function OwnerDashboard() {
  const [active, setActive] = useState('home')

  const stats = {
    activeRequests: 12,
    activeConversations: 7,
    completedDeals: 48,
    responseRate: '88%',
  }

  const members = [
    { id: 1, name: 'Alice', role: 'Manager', status: 'Active' },
    { id: 2, name: 'Riz', role: 'Agent', status: 'Active' },
  ]

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      {/* TOP NAVIGATION */}
      
      {/* Shared global NavBar */}


      <div className="max-w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-6 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 space-y-2 sticky top-20">
            <Link to="/owner" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'home' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('home')}>📊 Dashboard Home</Link>
            <Link to="/owner?tab=requests" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'requests' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('requests')}>📋 Buyer Requests</Link>
            <Link to="/owner?tab=chats" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'chats' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('chats')}>💬 Chats</Link>
            <Link to="/owner?tab=network" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'network' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('network')}>🏭 Partner Network</Link>
            <Link to="/owner?tab=members" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'members' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('members')}>👥 Member Management</Link>
            <Link to="/owner?tab=contracts" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'contracts' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('contracts')}>📄 Contracts Vault</Link>
            <Link to="/owner?tab=insights" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'insights' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('insights')}>📈 Insights & Analytics</Link>
            <Link to="/owner?tab=settings" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'settings' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('settings')}>⚙️ Organization Settings</Link>
            <Link to="/owner?tab=subscription" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'subscription' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('subscription')}>💳 Subscription</Link>
            <Link to="/login" className="block p-3 rounded-md cursor-pointer font-medium hover:bg-red-50 text-red-600">🚪 Logout</Link>
          </div>
        </aside>

        <main className="lg:col-span-5 space-y-6">
          {active === 'home' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md">
                  <div className="text-sm text-[#5A5A5A]">Active Requests</div>
                  <div className="font-semibold text-xl">{stats.activeRequests}</div>
                </div>
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md">
                  <div className="text-sm text-[#5A5A5A]">Active Conversations</div>
                  <div className="font-semibold text-xl">{stats.activeConversations}</div>
                </div>
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md">
                  <div className="text-sm text-[#5A5A5A]">Completed Deals</div>
                  <div className="font-semibold text-xl">{stats.completedDeals}</div>
                </div>
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md">
                  <div className="text-sm text-[#5A5A5A]">Response Rate</div>
                  <div className="font-semibold text-xl">{stats.responseRate}</div>
                </div>
              </div>

              <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <div className="space-y-2 text-sm text-[#5A5A5A]">
                  <div className="p-2 bg-[#F4F9FF] rounded-md">Agent Alice reassigned request #23</div>
                  <div className="p-2 bg-[#F4F9FF] rounded-md">New contract signed: RetailCo</div>
                </div>
              </div>
            </div>
          )}

          {active === 'requests' && (
            <div>
              <h3 className="font-semibold mb-3">Buyer Requests</h3>
              <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#5A5A5A]">
                      <th className="py-2">Title</th>
                      <th>Status</th>
                      <th>Assigned</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2">Knit Polo - 2000 units</td>
                      <td>Open</td>
                      <td>Alice</td>
                      <td><button className="px-2 py-1 bg-[#0A66C2] text-white rounded-md">Reassign</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'members' && (
            <div>
              <h3 className="font-semibold mb-3">Members</h3>
              <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
                <div className="space-y-2">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-sm text-[#5A5A5A]">{m.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">{m.status}</div>
                        <button className="px-2 py-1 bg-[#0A66C2] text-white rounded-md hover:bg-[#083B75]">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-[#083B75]">Add Member</button>
                </div>
              </div>
            </div>
          )}

          {active === 'network' && (
            <div>
              <h3 className="font-semibold mb-3">Partner Network</h3>
              <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-100 rounded-md">Factory A</div>
                  <div className="p-3 bg-gray-100 rounded-md">Factory B</div>
                  <div className="p-3 bg-gray-100 rounded-md">Factory C</div>
                </div>
              </div>
            </div>
          )}

          {active === 'contracts' && (
            <div>
              <h3 className="font-semibold mb-3">Contracts Vault</h3>
              <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>Contract_Q1_2025.pdf</div>
                    <div className="flex gap-2"><button className="px-2 py-1 bg-[#0A66C2] text-white rounded-md">Download</button></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === 'insights' && (
            <div>
              <h3 className="font-semibold mb-3">Insights & Analytics</h3>
              <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
                <div className="text-sm text-[#5A5A5A]">(Graphs placeholder) Monthly deal volume, conversion rate, agent performance</div>
              </div>
            </div>
          )}
        </main>
      </div>

      <FloatingAssistant />
    </div>
  )
}
