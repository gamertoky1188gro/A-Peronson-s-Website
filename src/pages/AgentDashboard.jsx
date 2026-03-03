import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAnalyticsDashboard from '../hooks/useAnalyticsDashboard'

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('requests')
  const { dashboard, subscription, isEnterprise, loading, error } = useAnalyticsDashboard()
  const totals = dashboard?.totals || {}

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 space-y-3 sticky top-20">
            <Link to="/agent?tab=requests" className="block font-semibold text-[#0A66C2] cursor-pointer">📋 My Requests</Link>
            <div className="text-sm text-[#5A5A5A]">Assigned: {totals.open_buyer_requests ?? 0}</div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 mt-4 sticky top-56">
            <Link to="/agent?tab=chats" className="block font-semibold text-[#0A66C2] cursor-pointer mb-3">💬 My Chats</Link>
            <div className="text-sm text-[#5A5A5A] mt-2">Active conversations: {totals.chats ?? 0}</div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 mt-4">
            <Link to="/agent?tab=factories" className="block font-semibold text-[#0A66C2] cursor-pointer mb-3">🏭 Connected Factories</Link>
            <div className="text-sm text-[#5A5A5A]">{totals.partner_network ?? 0} connected</div>
          </div>

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4 mt-4">
            <h3 className="font-semibold mb-2">Plan</h3>
            <div className="text-sm text-[#5A5A5A]">{subscription?.plan || 'free'} plan</div>
            <div className="text-sm text-[#5A5A5A]">{isEnterprise ? 'Enterprise analytics on' : 'Free analytics view'}</div>
          </div>

          <Link to="/login" className="block w-full mt-4 px-3 py-2 text-center bg-red-50 text-red-600 rounded-md font-medium hover:bg-red-100">Logout</Link>
        </aside>

        <main className="lg:col-span-3 space-y-4">
          {loading ? <div className="bg-white rounded-xl p-4">Loading agent metrics…</div> : null}
          {error ? <div className="bg-red-50 text-red-600 rounded-xl p-4">{error}</div> : null}

          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3 border-b pb-3">
              <h3 className="font-semibold">Agent Activity</h3>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('requests')} className={`px-3 py-1 rounded ${activeTab === 'requests' ? 'bg-[#0A66C2] text-white' : 'border'}`}>Requests</button>
                <button onClick={() => setActiveTab('chats')} className={`px-3 py-1 rounded ${activeTab === 'chats' ? 'bg-[#0A66C2] text-white' : 'border'}`}>Chats</button>
              </div>
            </div>

            {activeTab === 'requests' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#F4F9FF]"><div className="text-sm text-[#5A5A5A]">Buyer Requests</div><div className="text-xl font-semibold">{totals.buyer_requests ?? 0}</div></div>
                <div className="p-3 rounded-lg bg-[#F4F9FF]"><div className="text-sm text-[#5A5A5A]">Open Requests</div><div className="text-xl font-semibold">{totals.open_buyer_requests ?? 0}</div></div>
                <div className="p-3 rounded-lg bg-[#F4F9FF]"><div className="text-sm text-[#5A5A5A]">Contracts / Docs</div><div className="text-xl font-semibold">{`${totals.contracts ?? 0} / ${totals.documents ?? 0}`}</div></div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-[#5A5A5A]">Active chat threads: {totals.chats ?? 0}</div>
                <div className="text-sm text-[#5A5A5A]">Messages exchanged: {totals.messages ?? 0}</div>
                <div className="text-sm text-[#5A5A5A]">Partner factories connected: {totals.partner_network ?? 0}</div>
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  )
}
