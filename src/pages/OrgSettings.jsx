import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function OrgSettings(){
  const [tab, setTab] = useState('general')
  const [isOwnerAdmin] = useState(true)

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Organization Settings</h1>
            <p className="text-sm text-[#5A5A5A]">Manage organization profile, verification, branding, security and subscription</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex gap-4 border-b mb-4">
            <button onClick={()=>setTab('general')} className={`px-3 py-2 ${tab==='general'?'border-b-2 border-[#0A66C2]':''}`}>General Info</button>
            <button onClick={()=>setTab('verification')} className={`px-3 py-2 ${tab==='verification'?'border-b-2 border-[#0A66C2]':''}`}>Verification</button>
            <button onClick={()=>setTab('branding')} className={`px-3 py-2 ${tab==='branding'?'border-b-2 border-[#0A66C2]':''}`}>Branding</button>
            <button onClick={()=>setTab('security')} className={`px-3 py-2 ${tab==='security'?'border-b-2 border-[#0A66C2]':''}`}>Security</button>
            <button onClick={()=>setTab('members')} className={`px-3 py-2 ${tab==='members'?'border-b-2 border-[#0A66C2]':''}`}>Members</button>
            <button onClick={()=>setTab('subscription')} className={`px-3 py-2 ${tab==='subscription'?'border-b-2 border-[#0A66C2]':''}`}>Subscription</button>
          </div>

          <div>
            {tab === 'general' && (
              <div>
                <label className="block text-sm">Organization Name</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
                <label className="block text-sm">Industry Category</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
                <label className="block text-sm">Registration Number</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
              </div>
            )}

            {tab === 'verification' && (
              <div>
                <p className="text-sm text-[#5A5A5A]">Upload trade license and certifications</p>
                <div className="mt-3">
                  <button className="px-3 py-2 border rounded">Upload Trade License</button>
                  <button className="px-3 py-2 border rounded ml-2">Upload ISO / WRAP</button>
                </div>
              </div>
            )}

            {tab !== 'general' && !isOwnerAdmin && (
              <div className="p-4 bg-yellow-50 border rounded mt-4">You do not have permission to view this section. Owner/Admin access required.</div>
            )}

            {tab === 'branding' && (
              <div>
                <label className="block text-sm">Primary Contact Email</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
                <label className="block text-sm">Support Contact Number</label>
                <input className="w-full border px-3 py-2 rounded mb-3" />
              </div>
            )}

            {tab === 'security' && (
              <div>
                <label className="flex items-center gap-3"><input type="checkbox"/> Enable 2FA</label>
                <div className="mt-3 text-sm text-[#5A5A5A]">Active sessions and login activity are shown here.</div>
              </div>
            )}

            {tab === 'members' && (
              <div>
                <Link to="/member-management" className="px-3 py-2 bg-[#0A66C2] text-white rounded">Open Member Management</Link>
              </div>
            )}

            {tab === 'subscription' && (
              <div>
                <div className="text-sm">Current Plan: Free</div>
                <button className="mt-3 px-3 py-2 bg-[#0A66C2] text-white rounded">Upgrade</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingAssistant />
    </div>
  )
}
