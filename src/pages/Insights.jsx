import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function Insights(){
  const [isEnterprise] = React.useState(false)
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#0A66C2]">GarTexHub</Link>
          <div className="flex items-center gap-4">
            <input placeholder="Search insights..." className="px-3 py-2 rounded" />
            <label className="flex items-center gap-2 text-sm">
              <span className="text-gray-700 text-xs">Unique</span>
              <input type="checkbox" className="h-4 w-8" />
            </label>
            <Link to="/owner" className="text-sm">Owner</Link>
            <Link to="/insights" className="text-sm font-semibold text-[#0A66C2]">Insights</Link>
            <div className="w-9 h-9 bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] rounded-full"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Insights & Analytics <span className="text-sm text-[#5A5A5A]">(Enterprise Only)</span></h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-xl shadow">Total Buyer Requests Handled<br/><strong className="text-2xl">1,234</strong></div>
          <div className="p-4 bg-white rounded-xl shadow">Conversion Rate<br/><strong className="text-2xl">12%</strong></div>
          <div className="p-4 bg-white rounded-xl shadow">Active Factories<br/><strong className="text-2xl">56</strong></div>
          <div className="p-4 bg-white rounded-xl shadow">Response Time<br/><strong className="text-2xl">18h</strong></div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          {!isEnterprise ? (
            <div>
              <div className="text-sm text-[#5A5A5A]">Limited insights available on Free plan. Upgrade to Enterprise for full analytics.</div>
              <div className="mt-4"><button className="px-3 py-2 bg-[#0A66C2] text-white rounded">Upgrade to Enterprise</button></div>
            </div>
          ) : (
            <>
              <div className="text-sm text-[#5A5A5A]">Charts placeholder (line/bar/pie)</div>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-2 border rounded">Export CSV</button>
                <button className="px-3 py-2 border rounded">Download PDF Report</button>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Agent Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th>Agent Name</th>
                        <th>Requests</th>
                        <th>Deals Closed</th>
                        <th>Response Time</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Ali</td>
                        <td>120</td>
                        <td>34</td>
                        <td>12h</td>
                        <td>4.6</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      <FloatingAssistant />
    </div>
  )
}
