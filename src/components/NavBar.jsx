import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar(){
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark' } catch { return false }
  })
  const [unique, setUnique] = useState(false)
  const location = useLocation()

  useEffect(()=>{
    const root = document.documentElement
    if(dark){
      root.classList.add('dark')
      localStorage.setItem('theme','dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme','light')
    }
  },[dark])

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="font-bold text-lg text-[#0A66C2] dark:text-white">GarTexHub</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/about" className={`text-sm ${location.pathname==='/about'?'text-[#0A66C2] font-semibold':''}`}>About</Link>
              <Link to="/feed" className={`text-sm ${location.pathname==='/feed'?'text-[#0A66C2] font-semibold':''}`}>Feed</Link>
              <Link to="/pricing" className={`text-sm ${location.pathname==='/pricing'?'text-[#0A66C2] font-semibold':''}`}>Pricing</Link>
              <Link to="/help" className={`text-sm ${location.pathname==='/help'?'text-[#0A66C2] font-semibold':''}`}>Help</Link>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden sm:flex items-center flex-1 md:flex-none">
              <input placeholder="Search..." className="w-full md:w-72 px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-xs">Unique</span>
                <input type="checkbox" checked={unique} onChange={(e)=>setUnique(e.target.checked)} className="h-4 w-5" />
              </label>

              <button onClick={()=>setDark(!dark)} className="px-3 py-2 rounded-md border dark:border-gray-600">
                {dark? '🌙 Dark' : '☀️ Light'}
              </button>

              <Link to="/notifications" className="relative">
                <span className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">🔔</span>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">3</span>
              </Link>

              <Link to="/owner" className="hidden sm:block">
                <div className="w-9 h-9 bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] rounded-full"></div>
              </Link>

              <div className="md:hidden">
                <button className="p-2">☰</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
