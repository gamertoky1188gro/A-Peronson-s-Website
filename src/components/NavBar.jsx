import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiRequest, clearSession, getCurrentUser, getRoleHome, getToken } from '../lib/auth'

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
    { to: '/verification', label: 'Verification' },
  ],
  factory: [
    { to: '/feed', label: 'Feed' },
    { to: '/product-management', label: 'Products' },
    { to: '/partner-network', label: 'Partner Network' },
    { to: '/member-management', label: 'Members' },
    { to: '/verification', label: 'Verification' },
  ],
  buying_house: [
    { to: '/owner', label: 'Owner Dashboard' },
    { to: '/agent', label: 'Agent' },
    { to: '/member-management', label: 'Members' },
    { to: '/verification', label: 'Verification' },
    { to: '/partner-network', label: 'Partner Network' },
    { to: '/insights', label: 'Insights' },
  ],
  admin: [
    { to: '/owner', label: 'Owner Dashboard' },
    { to: '/insights', label: 'Insights' },
    { to: '/mvp', label: 'MVP' },
    { to: '/verification', label: 'Verification' },
  ],
}

export default function NavBar() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [unique, setUnique] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [actionBusyKey, setActionBusyKey] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const userId = user?.id || ''
  const userRole = user?.role || ''

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

  useEffect(() => {
    if (!userId) return undefined

    const query = searchQuery.trim()
    if (query.length < 1) {
      setSearchResults([])
      setSearchError('')
      return undefined
    }

    setSearchLoading(true)
    setSearchError('')

    const timer = window.setTimeout(async () => {
      try {
        const data = await apiRequest(`/users/search?q=${encodeURIComponent(query)}`, { token: getToken() })
        setSearchResults(Array.isArray(data?.users) ? data.users : [])
      } catch (err) {
        setSearchResults([])
        setSearchError(err.message || 'Search failed')
      } finally {
        setSearchLoading(false)
      }
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchQuery, userId])

  const links = useMemo(() => {
    if (!userId) return publicLinks
    return [...publicLinks, ...(roleLinks[userRole] || [])]
  }, [userId, userRole])

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  const updateRelationState = (targetId, relation) => {
    if (!targetId || !relation) return
    setSearchResults((previous) => previous.map((item) => (item.id === targetId ? { ...item, ...relation } : item)))
  }

  const followUser = async (targetId) => {
    const key = `follow:${targetId}`
    setActionBusyKey(key)
    try {
      const response = await apiRequest(`/users/${targetId}/follow`, { method: 'POST', token: getToken() })
      updateRelationState(targetId, response?.relation)
    } catch (err) {
      setSearchError(err.message || 'Unable to follow user')
    } finally {
      setActionBusyKey('')
    }
  }

  const addFriend = async (targetId) => {
    const key = `friend:${targetId}`
    setActionBusyKey(key)
    try {
      const response = await apiRequest(`/users/${targetId}/friend-request`, { method: 'POST', token: getToken() })
      updateRelationState(targetId, response?.relation)
    } catch (err) {
      setSearchError(err.message || 'Unable to add friend')
    } finally {
      setActionBusyKey('')
    }
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
            <div className="relative hidden flex-1 items-center md:flex md:flex-none">
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search users..."
                className="w-full rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-700 shadow-sm outline-none ring-sky-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />

              {user && searchOpen && searchQuery.trim().length >= 1 ? (
                <div className="absolute right-0 top-11 z-50 w-[360px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {searchLoading ? <p className="px-2 py-3 text-xs text-slate-500">Searching...</p> : null}
                  {!searchLoading && searchError ? <p className="px-2 py-3 text-xs text-rose-500">{searchError}</p> : null}
                  {!searchLoading && !searchError && searchResults.length === 0 ? <p className="px-2 py-3 text-xs text-slate-500">No users found.</p> : null}
                  {!searchLoading && !searchError && searchResults.length > 0 ? <p className="px-2 pb-2 text-[11px] text-slate-500">Suggestions</p> : null}

                  {!searchLoading && !searchError && searchResults.map((result) => (
                    <div key={result.id} className="mb-1 rounded-lg border border-slate-100 px-2 py-2 last:mb-0 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{result.name}{result.is_self ? ' (You)' : ''}</p>
                          <p className="text-xs text-slate-500">{result.role} · {result.email}</p>
                        </div>
                        {result.verified ? <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Verified</span> : null}
                      </div>

                      <div className="mt-2 flex gap-2">
                        <button
                          disabled={result.is_self || result.following || actionBusyKey === `follow:${result.id}`}
                          onClick={() => followUser(result.id)}
                          className="rounded-md border border-sky-300 px-2 py-1 text-xs font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-700 dark:text-sky-300"
                        >
                          {result.is_self ? 'Follow' : (result.following ? 'Following' : 'Follow (optional)')}
                        </button>
                        <button
                          disabled={result.is_self || ['friends', 'requested', 'self'].includes(result.friend_status) || actionBusyKey === `friend:${result.id}`}
                          onClick={() => addFriend(result.id)}
                          className="rounded-md border border-indigo-300 px-2 py-1 text-xs font-semibold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-700 dark:text-indigo-300"
                        >
                          {result.is_self ? 'Add Friend' : (result.friend_status === 'incoming' ? 'Accept Friend' : 'Add Friend')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
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
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
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
