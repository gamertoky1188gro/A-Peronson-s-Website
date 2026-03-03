import React from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, getToken } from '../lib/auth'

export default function NotificationsCenter(){
  const [tab, setTab] = React.useState('all')
  const [unreadOnly, setUnreadOnly] = React.useState(false)
  const [items, setItems] = React.useState([])

  const load = React.useCallback(async () => {
    const token = getToken()
    if (!token) return
    const data = await apiRequest('/notifications', { token })
    setItems(data)
  }, [])

  React.useEffect(() => {
    load().catch(() => {})
  }, [load])

  async function markRead(id) {
    const token = getToken()
    if (!token) return
    await apiRequest(`/notifications/${id}/read`, { method: 'PATCH', token })
    await load()
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          <div className="mb-4">
            <div className="flex gap-2">
              <button onClick={()=>setTab('all')} className={`px-3 py-2 rounded ${tab==='all'?'bg-[#0A66C2] text-white':''}`}>All</button>
              <button onClick={()=>setTab('smart_search_match')} className={`px-3 py-2 rounded ${tab==='smart_search_match'?'bg-[#0A66C2] text-white':''}`}>Search Matches</button>
              <button onClick={()=>setTab('system')} className={`px-3 py-2 rounded ${tab==='system'?'bg-[#0A66C2] text-white':''}`}>System</button>
            </div>
          </div>

          <div className="space-y-3">
            {items.filter(it => (tab==='all' || it.type===tab) && (!unreadOnly || !it.read)).map(i => (
              <div key={i.id} className="bg-white neo-panel cyberpunk-card border rounded p-3 flex items-center justify-between hover:bg-[#F4F9FF]">
                <div>
                  <div className="font-semibold">{i.message || i.title}</div>
                  <div className="text-sm text-[#5A5A5A]">{new Date(i.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Link to={i.entity_type === 'buyer_request' ? '/buyer-requests' : '/feed'} className="px-3 py-1 bg-[#0A66C2] text-white rounded">View</Link>
                  {!i.read ? <button onClick={() => markRead(i.id)} className="px-3 py-1 border rounded">Mark read</button> : null}
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="lg:col-span-1">
          <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
            <h4 className="font-semibold mb-2">Filters</h4>
            <label className="flex items-center gap-2"><input type="checkbox" checked={unreadOnly} onChange={(e)=>setUnreadOnly(e.target.checked)} /> Unread</label>
          </div>
        </aside>
      </div>

    </div>
  )
}
