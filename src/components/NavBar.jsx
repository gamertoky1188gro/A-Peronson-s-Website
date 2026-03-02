import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearSession, getCurrentUser, getRoleHome } from '../lib/auth'

const publicLinks = [
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/help', label: 'Help' },
]

const roleLinks = {
  buyer: [
    { to: '/feed', label: 'Feed' },
    { to: '/search', label: 'Search' },
    { to: '/buyer-requests', label: 'Requests' },
    { to: '/chat', label: 'Chat' },
  ],
  factory: [
    { to: '/feed', label: 'Feed' },
    { to: '/product-management', label: 'Products' },
    { to: '/partner-network', label: 'Partner Network' },
    { to: '/member-management', label: 'Members' },
  ],
  buying_house: [
    { to: '/owner', label: 'Owner Dashboard' },
    { to: '/agent', label: 'Agent' },
    { to: '/member-management', label: 'Members' },
    { to: '/partner-network', label: 'Partner Network' },
    { to: '/insights', label: 'Insights' },
  ],
  admin: [
    { to: '/owner', label: 'Owner Dashboard' },
    { to: '/insights', label: 'Insights' },
    { to: '/mvp', label: 'MVP' },
  ],
}

export default function NavBar() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [unique, setUnique] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const links = useMemo(() => {
    if (!user) return publicLinks
    return [...publicLinks, ...(roleLinks[user.role] || [])]
  }, [user])

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/35 bg-white/85 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-950/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-4">
            <Link to={user ? getRoleHome(user.role) : '/'} className="inline-flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">B2B</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">GarTexHub</span>
            </Link>

            <div className="hidden items-center gap-4 md:flex">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm transition-colors ${
                    location.pathname === to
                      ? 'font-semibold text-sky-600 dark:text-sky-400'
                      : 'text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="hidden flex-1 items-center md:flex md:flex-none">
              <input
                placeholder="Search buyers, factories, products..."
                className="w-full rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-700 shadow-sm outline-none ring-sky-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {user ? (
                <label className="hidden items-center gap-2 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 sm:flex dark:border-slate-700 dark:text-slate-300">
                  <span>Unique</span>
                  <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-4 w-4" />
                </label>
              ) : null}

              <button
                onClick={() => setDark(!dark)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Toggle dark mode"
              >
                <span>{dark ? '🌙' : '☀️'}</span>
                <span>{dark ? 'Dark' : 'Light'}</span>
              </button>

              {user ? (
                <>
                  <Link to="/notifications" className="relative rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifications">
                    <span>🔔</span>
                    <span className="absolute -right-0.5 -top-0.5 rounded-full bg-rose-600 px-1 text-[10px] text-white">3</span>
                  </Link>
                  <button onClick={handleLogout} className="px-3 py-2 text-xs rounded-full border">Logout</button>
                </>
              ) : (
                <Link to="/login" className="px-3 py-2 text-xs rounded-full border">Login</Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-md p-2 md:hidden" aria-label="Open menu">
                ☰
              </button>
            </div>
          </div>
        </div>

        {mobileOpen ? (
          <div className="space-y-2 border-t border-slate-200 pb-3 pt-2 md:hidden dark:border-slate-700">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {label}
              </Link>
            ))}
            {!user ? (
              <Link to="/signup" className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">Signup</Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </nav>
  )
}
