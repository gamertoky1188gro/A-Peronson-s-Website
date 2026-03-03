import React from 'react'
import FloatingAssistant from '../components/FloatingAssistant'
import AccessDeniedState from '../components/AccessDeniedState'
import useAnalyticsDashboard from '../hooks/useAnalyticsDashboard'

function StatCard({ label, value }) {
  return <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow">{label}<br /><strong className="text-2xl">{value}</strong></div>
}

export default function Insights() {
  const { dashboard, subscription, isEnterprise, loading, error, forbidden } = useAnalyticsDashboard()
  const totals = dashboard?.totals || {}
  const byType = dashboard?.analytics_events?.by_type || {}

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Insights & Analytics <span className="text-sm text-[#5A5A5A]">({isEnterprise ? 'Enterprise' : 'Free'} Plan)</span></h1>
        </div>

        {loading ? <div className="mb-4 p-3 bg-white rounded-xl">Loading analytics…</div> : null}
        {forbidden ? <div className="mb-4"><AccessDeniedState message={error} /></div> : null}
        {!forbidden && error ? <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl">{error}</div> : null}

        {forbidden ? null : (
          <>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Buyer Requests" value={totals.buyer_requests ?? 0} />
              <StatCard label="Active Chats" value={totals.chats ?? 0} />
              <StatCard label="Connected Partners" value={totals.partner_network ?? 0} />
              <StatCard label="Contracts / Documents" value={`${totals.contracts ?? 0} / ${totals.documents ?? 0}`} />
            </div>

            <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
              {!isEnterprise ? (
                <div>
                  <div className="text-sm text-[#5A5A5A]">You are currently on <strong>{subscription?.plan || 'free'}</strong>. Upgrade to Enterprise to unlock event-level analytics and export controls.</div>
                  <div className="mt-4"><button className="px-3 py-2 bg-[#0A66C2] text-white rounded">Upgrade to Enterprise</button></div>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold mb-3">Analytics Events by Type</h3>
                  <div className="space-y-2 text-sm">
                    {Object.keys(byType).length === 0 ? <div className="text-[#5A5A5A]">No analytics events recorded yet.</div> : null}
                    {Object.entries(byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between border rounded-md p-2">
                        <span>{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-2 border rounded">Export CSV</button>
                    <button className="px-3 py-2 border rounded">Download PDF Report</button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <FloatingAssistant />
    </div>
  )
}
