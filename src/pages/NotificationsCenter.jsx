import React from 'react'
import { Link } from 'react-router-dom'
import FloatingAssistant from '../components/FloatingAssistant'

export default function NotificationsCenter(){
  const [tab, setTab] = React.useState('all')
  const [unreadOnly, setUnreadOnly] = React.useState(false)
  const items = [
    { id:1, type:'request', title:'New Buyer Request Matching "Cotton Polo"', time:'2 hours ago', unread:true },
    { id:2, type:'system', title:'Agent Rahim has taken lead on Request #9821', time:'10 mins ago', unread:true },
  ]

  return (
    <div className="min-h-screen bg-white">
      
      {/* Shared global NavBar */}


      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded">Mark All as Read</button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-2">
              <button onClick={()=>setTab('all')} className={`px-3 py-2 rounded ${tab==='all'?'bg-[#0A66C2] text-white':''}`}>All</button>
              <button onClick={()=>setTab('requests')} className={`px-3 py-2 rounded ${tab==='requests'?'bg-[#0A66C2] text-white':''}`}>Requests</button>
              <button onClick={()=>setTab('messages')} className={`px-3 py-2 rounded ${tab==='messages'?'bg-[#0A66C2] text-white':''}`}>Messages</button>
              <button onClick={()=>setTab('system')} className={`px-3 py-2 rounded ${tab==='system'?'bg-[#0A66C2] text-white':''}`}>System</button>
            </div>
          </div>

          <div className="space-y-3">
            {items.filter(it => (tab==='all' || it.type===tab) && (!unreadOnly || it.unread)).map(i => (
              <div key={i.id} className="bg-white border rounded p-3 flex items-center justify-between hover:bg-[#F4F9FF]">
                <div>
                  <div className="font-semibold">{i.title}</div>
                  <div className="text-sm text-[#5A5A5A]">{i.time}</div>
                </div>
                <div>
                  <Link to="/" className="px-3 py-1 bg-[#0A66C2] text-white rounded">View</Link>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold mb-2">Filters</h4>
            <label className="flex items-center gap-2"><input type="checkbox" checked={unreadOnly} onChange={(e)=>setUnreadOnly(e.target.checked)} /> Unread</label>
            <div className="mt-3">
              <button className="px-3 py-2 bg-[#0A66C2] text-white rounded">Mark All as Read</button>
            </div>
          </div>
        </aside>
      </div>

      <FloatingAssistant />
    </div>
  )
}
