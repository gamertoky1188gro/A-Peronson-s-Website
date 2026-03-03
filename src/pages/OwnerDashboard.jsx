import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'
import useAnalyticsDashboard from '../hooks/useAnalyticsDashboard'

function SeriesList({ title, items }) {
  return (
    <div className="bg-[#F9FBFD] rounded-lg p-3">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="space-y-2 text-sm">
        {items.length === 0 ? <div className="text-[#5A5A5A]">No data yet.</div> : null}
        {items.map((item) => (
          <div key={item.month} className="grid grid-cols-[72px_1fr_32px] items-center gap-2">
            <span>{item.month}</span>
            <div className="h-2 bg-blue-100 rounded">
              <div className="h-2 bg-[#0A66C2] rounded" style={{ width: `${Math.min(100, item.count * 10)}%` }} />
            </div>
            <span>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OwnerDashboard() {
  const [active, setActive] = useState('home')
  const { dashboard, subscription, isEnterprise, loading, error } = useAnalyticsDashboard()

  const totals = dashboard?.totals || {}

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
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
            <Link to="/owner?tab=subscription" className={`block p-3 rounded-md cursor-pointer font-medium ${active === 'subscription' ? 'bg-[#F4F9FF] text-[#0A66C2]' : 'hover:bg-gray-50 neo-panel cyberpunk-card'}`} onClick={() => setActive('subscription')}>💳 Subscription</Link>
            <Link to="/login" className="block p-3 rounded-md cursor-pointer font-medium hover:bg-red-50 text-red-600">🚪 Logout</Link>
          </div>
        </aside>

        <main className="lg:col-span-5 space-y-6">
          {loading ? <div className="bg-white rounded-xl p-4">Loading dashboard metrics…</div> : null}
          {error ? <div className="bg-red-50 text-red-600 rounded-xl p-4">{error}</div> : null}

          {active === 'home' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md"><div className="text-sm text-[#5A5A5A]">Buyer Requests</div><div className="font-semibold text-xl">{totals.buyer_requests ?? 0}</div></div>
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md"><div className="text-sm text-[#5A5A5A]">Active Chats</div><div className="font-semibold text-xl">{totals.chats ?? 0}</div></div>
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md"><div className="text-sm text-[#5A5A5A]">Partner Network</div><div className="font-semibold text-xl">{totals.partner_network ?? 0}</div></div>
                <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow-md"><div className="text-sm text-[#5A5A5A]">Contracts / Docs</div><div className="font-semibold text-xl">{`${totals.contracts ?? 0} / ${totals.documents ?? 0}`}</div></div>
              </div>

              <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-md p-4">
                <h3 className="font-semibold mb-2">Subscription & Access</h3>
                <div className="text-sm text-[#5A5A5A]">Current plan: <strong>{subscription?.plan || 'free'}</strong></div>
                <div className="text-sm text-[#5A5A5A] mt-1">{isEnterprise ? 'Enterprise analytics enabled.' : 'Free plan: advanced analytics are limited.'}</div>
              </div>
            </div>
          )}

          {active === 'requests' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Buyer Requests</h3><p className="text-sm text-[#5A5A5A]">Total: {totals.buyer_requests ?? 0} | Open: {totals.open_buyer_requests ?? 0}</p></div>}
          {active === 'chats' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Chats</h3><p className="text-sm text-[#5A5A5A]">Active chat threads: {totals.chats ?? 0}. Messages sent: {totals.messages ?? 0}.</p></div>}
          {active === 'network' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Partner Network</h3><p className="text-sm text-[#5A5A5A]">Connected factory partners: {totals.partner_network ?? 0}. Total factory profiles: {totals.factories ?? 0}.</p></div>}
          {active === 'contracts' && <div className="bg-white rounded-xl shadow-md p-4"><h3 className="font-semibold mb-2">Contracts Vault</h3><p className="text-sm text-[#5A5A5A]">Contracts uploaded: {totals.contracts ?? 0}. Total documents: {totals.documents ?? 0}.</p></div>}

          {active === 'insights' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Insights & Analytics</h3>
              {!isEnterprise ? <div className="bg-yellow-50 rounded-xl p-4 text-sm text-[#5A5A5A]">Upgrade to Enterprise to unlock advanced monthly trends and analytics event breakdown.</div> : null}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SeriesList title="Buyer Requests / Month" items={dashboard?.series?.buyer_requests || []} />
                <SeriesList title="Chats / Month" items={dashboard?.series?.chats || []} />
                <SeriesList title="Documents / Month" items={dashboard?.series?.documents || []} />
              </div>
            </div>
          )}
        </main>
      </div>

      <FloatingAssistant />
    </div>
  )
}
