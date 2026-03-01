import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function Insights(){
  const [isEnterprise] = React.useState(false)
  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Insights & Analytics <span className="text-sm text-[#5A5A5A]">(Enterprise Only)</span></h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow">Total Buyer Requests Handled<br/><strong className="text-2xl">1,234</strong></div>
          <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow">Conversion Rate<br/><strong className="text-2xl">12%</strong></div>
          <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow">Active Factories<br/><strong className="text-2xl">56</strong></div>
          <div className="p-4 bg-white neo-panel cyberpunk-card rounded-xl shadow">Response Time<br/><strong className="text-2xl">18h</strong></div>
        </div>

        <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
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
