import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function MemberManagement(){
  const [search, setSearch] = useState('')
  const members = [
    { id: 'M-001', name: 'Alice', role: 'Manager', requests: 12, score: 92, status: 'Active' },
    { id: 'M-002', name: 'Riz', role: 'Agent', requests: 8, score: 84, status: 'Active' },
  ]

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* Nav */}
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Member Management</h1>
            <p className="text-sm text-[#5A5A5A]">Manage sub-accounts and permissions</p>
          </div>
          <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md">+ Add New Member</button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="mb-4 flex items-center gap-3">
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search members" className="px-3 py-2 border rounded w-64" />
            <div className="text-sm text-[#5A5A5A]">Free plan limit: 10 members</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[#5A5A5A]">
                  <th className="py-2 px-3">Member Name</th>
                  <th className="py-2 px-3">Member ID</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Assigned Requests</th>
                  <th className="py-2 px-3">Performance</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} className="border-t">
                    <td className="py-2 px-3">{m.name}</td>
                    <td className="py-2 px-3">{m.id}</td>
                    <td className="py-2 px-3">{m.role}</td>
                    <td className="py-2 px-3">{m.requests}</td>
                    <td className="py-2 px-3">{m.score}</td>
                    <td className="py-2 px-3">{m.status}</td>
                    <td className="py-2 px-3">
                      <button className="px-2 py-1 bg-[#0A66C2] text-white rounded mr-2">Edit</button>
                      <button className="px-2 py-1 border rounded mr-2">Reset</button>
                      <button className="px-2 py-1 border rounded text-red-600">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
