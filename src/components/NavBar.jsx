import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, FileText, LayoutDashboard, Menu, MessageSquare, Moon, Search, ShieldCheck, Sun } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { apiRequest, clearSession, getCurrentUser, getRoleHome, getToken } from '../lib/auth'

const publicLinks = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/help', label: 'Help' },
]

const authenticatedLinks = [
  { to: '/feed', label: 'Feed', icon: LayoutDashboard },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/contracts', label: 'Contracts', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/verification', label: 'Verification', icon: ShieldCheck },
]

const easePremium = [0.16, 1, 0.3, 1]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function MagneticNavLink({ to, label, active }) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 500, damping: 32, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 500, damping: 32, mass: 0.6 })

  const className = `relative inline-flex items-center rounded-full px-3 py-2 text-sm transition-colors ${
    active
      ? 'font-semibold text-sky-600 dark:text-sky-400'
      : 'text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400'
  }`

  return (
    <Link
      to={to}
      className={className}
      onMouseMove={(e) => {
        if (reduceMotion) return
        const rect = e.currentTarget.getBoundingClientRect()
        const relX = e.clientX - rect.left - rect.width / 2
        const relY = e.clientY - rect.top - rect.height / 2
        const maxX = 3
        const maxY = 2
        x.set(clamp((relX / (rect.width / 2)) * maxX, -maxX, maxX))
        y.set(clamp((relY / (rect.height / 2)) * maxY, -maxY, maxY))
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {active ? (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-x-1 inset-y-1 rounded-full bg-sky-500/10 dark:bg-white/10"
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />
      ) : null}
      <motion.span style={{ x: springX, y: springY }} className="relative inline-block">
        {label}
      </motion.span>
    </Link>
  )
}

function IconNavLink({ to, label, active, Icon, badgeCount = 0 }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="group relative flex items-center justify-center">
      <motion.div
        whileHover={reduceMotion ? undefined : { scale: 1.08, y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98, y: 0 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
      >
        <Link
          to={to}
          className={`relative rounded-full p-2 transition-colors ${
            active
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400'
          } hover:bg-slate-100/50 dark:hover:bg-slate-800/50`}
          aria-label={label}
        >
          {active ? (
            <motion.span
              layoutId="nav-active"
              className="absolute inset-0 rounded-full bg-sky-500/10 dark:bg-white/10"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          ) : null}
          <span className="relative inline-flex">
            <Icon className="h-5 w-5" />
            {badgeCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gradient-to-tr from-red-500 to-pink-500 opacity-35" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-red-500 to-pink-500" />
              </span>
            ) : null}
          </span>
        </Link>
      </motion.div>

      <span className="pointer-events-none absolute top-full z-50 mt-2 w-max origin-top scale-0 rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-slate-700">
        {label}
      </span>
    </div>
  )
}

export default function NavBar() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [actionStatus, setActionStatus] = useState('')
  const [actionBusyKey, setActionBusyKey] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const userId = user?.id || ''
  const searchInputRef = useRef(null)
  const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])

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
    const handler = (e) => {
      const key = String(e.key || '').toLowerCase()
      if (key !== 'k') return
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      searchInputRef.current?.focus?.()
      setSearchOpen(true)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0)
      return
    }
    const token = getToken()
    if (!token) {
      setUnreadCount(0)
      return
    }
    try {
      const data = await apiRequest('/notifications', { token })
      const rows = Array.isArray(data) ? data : []
      setUnreadCount(rows.filter((n) => !n?.read).length)
    } catch {
      setUnreadCount(0)
    }
  }, [userId])

  useEffect(() => {
    refreshUnreadCount()
  }, [refreshUnreadCount, location.pathname])

  const fetchUserSuggestions = useCallback(async (query) => {
    if (!userId) return
    try {
      const data = await apiRequest(`/users/search?q=${encodeURIComponent(query)}`, { token: getToken() })
      setSearchResults(Array.isArray(data?.users) ? data.users : [])
    } catch (err) {
      setSearchResults([])
      setSearchError(err.message || 'Search failed')
    } finally {
      setSearchLoading(false)
    }
  }, [userId])

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
    setActionStatus('')

    const timer = window.setTimeout(() => {
      fetchUserSuggestions(query)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [fetchUserSuggestions, searchQuery, userId])

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  const updateRelationState = (targetId, relation) => {
    if (!targetId) return
    setSearchResults((previous) => previous.map((item) => (item.id === targetId ? { ...item, ...(relation || {}) } : item)))
  }

  const followUser = async (targetId) => {
    const token = getToken()
    if (!targetId) return
    if (!token) {
      setSearchError('Please login to follow users.')
      return
    }

    const key = `follow:${targetId}`
    setActionBusyKey(key)
    setSearchError('')
    setActionStatus('')
    try {
      const response = await apiRequest(`/users/${targetId}/follow`, { method: 'POST', token })
      updateRelationState(targetId, response?.relation || { following: true })
      setActionStatus('Followed successfully.')
      const query = searchQuery.trim()
      if (query) fetchUserSuggestions(query)
    } catch (err) {
      setSearchError(err.message || 'Unable to follow user')
      setActionStatus('Follow failed.')
    } finally {
      setActionBusyKey('')
    }
  }

  const addFriend = async (targetId) => {
    const token = getToken()
    if (!targetId) return
    if (!token) {
      setSearchError('Please login to add friends.')
      return
    }

    const key = `friend:${targetId}`
    setActionBusyKey(key)
    setSearchError('')
    setActionStatus('')
    try {
      const response = await apiRequest(`/users/${targetId}/friend-request`, { method: 'POST', token })
      updateRelationState(targetId, response?.relation || { friend_status: 'requested' })
      setActionStatus('Friend request sent.')
      const query = searchQuery.trim()
      if (query) fetchUserSuggestions(query)
    } catch (err) {
      setSearchError(err.message || 'Unable to add friend')
      setActionStatus('Friend request failed.')
    } finally {
      setActionBusyKey('')
    }
  }


  const messageFriend = async (targetId) => {
    const token = getToken()
    if (!token) {
      setSearchError('Please login to message friends.')
      return
    }

    const key = `message:${targetId}`
    setActionBusyKey(key)
    setSearchError('')
    try {
      await apiRequest(`/messages/friend/${targetId}`, {
        method: 'POST',
        token,
        body: { message: 'Hi! Great to connect with you.' },
      })
      setSearchOpen(false)
      navigate('/chat')
    } catch (err) {
      setSearchError(err.message || 'Unable to start direct message')
    } finally {
      setActionBusyKey('')
    }
  }

  const callFriend = async (targetId) => {
    const token = getToken()
    if (!token) {
      setSearchError('Please login to call friends.')
      return
    }

    const key = `call:${targetId}`
    setActionBusyKey(key)
    setSearchError('')
    try {
      const result = await apiRequest(`/calls/friend/${targetId}/join`, {
        method: 'POST',
        token,
      })
      const callId = result?.call?.id
      const matchId = result?.call?.match_id
      if (!callId) throw new Error('Unable to create call session')
      setSearchOpen(false)
      navigate(`/call?callId=${encodeURIComponent(callId)}${matchId ? `&matchId=${encodeURIComponent(matchId)}` : ''}`)
    } catch (err) {
      setSearchError(err.message || 'Unable to start friend call')
    } finally {
      setActionBusyKey('')
    }
  }

  return (
    <nav className="nav-glass sticky top-0 z-50 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-4">
            <Link to={user ? getRoleHome(user.role) : '/'} className="inline-flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">B2B</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">GarTexHub</span>
            </Link>

            <div className="hidden items-center gap-4 md:flex">
              {!user ? (
                // Public Links (Text)
                publicLinks.map(({ to, label }, idx) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05, ease: easePremium }}
                  >
                    <MagneticNavLink to={to} label={label} active={location.pathname === to} />
                  </motion.div>
                ))
              ) : (
                // Authenticated Links (Icons with Tooltip)
                authenticatedLinks.map(({ to, label, icon: Icon }, idx) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05, ease: easePremium }}
                  >
                    <IconNavLink to={to} label={label} Icon={Icon} active={location.pathname === to} badgeCount={to === '/notifications' ? unreadCount : 0} />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative hidden items-center md:flex md:flex-none w-[320px] focus-within:w-[420px] transition-[width] duration-300">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search users..."
                className="w-full rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 pr-16 text-sm text-slate-700 shadow-inner outline-none ring-sky-300/30 transition focus:ring-2 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-100"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/70 bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500 dark:border-slate-700/60 dark:bg-slate-950/50 dark:text-slate-400">
                {isMac ? '⌘ K' : 'Ctrl K'}
              </span>

              {user && searchOpen && searchQuery.trim().length >= 1 ? (
                <div className="absolute right-0 top-11 z-50 w-[360px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {searchLoading ? <p className="px-2 py-3 text-xs text-slate-500">Searching...</p> : null}
                  {!searchLoading && searchError ? <p className="px-2 py-3 text-xs text-rose-500">{searchError}</p> : null}
                  {!searchLoading && !searchError && searchResults.length === 0 ? <p className="px-2 py-3 text-xs text-slate-500">No users found.</p> : null}
                  {!searchLoading && !searchError && searchResults.length > 0 ? <p className="px-2 pb-2 text-[11px] text-slate-500">Suggestions</p> : null}
                  {actionStatus ? <p className="px-2 pb-2 text-[11px] text-emerald-600">{actionStatus}</p> : null}

                  {!searchLoading && !searchError && searchResults.map((result) => (
                    <div key={result.id} className="mb-1 rounded-lg border border-slate-100 px-2 py-2 last:mb-0 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{result.name}{result.is_self ? ' (You)' : ''}</p>
                          <p className="text-xs text-slate-500">{result.role} · {result.email}</p>
                        </div>
                        {result.verified ? <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Verified</span> : null}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          disabled={result.is_self || result.following || actionBusyKey === `follow:${result.id}`}
                          onClick={() => followUser(result.id)}
                          className="rounded-md border border-sky-300 px-2 py-1 text-xs font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-700 dark:text-sky-300"
                        >
                          {actionBusyKey === `follow:${result.id}` ? 'Following...' : (result.is_self ? 'Follow' : (result.following ? 'Following' : 'Follow (optional)'))}
                        </button>
                        <button
                          disabled={result.is_self || ['friends', 'requested', 'self'].includes(result.friend_status) || actionBusyKey === `friend:${result.id}`}
                          onClick={() => addFriend(result.id)}
                          className="rounded-md border border-indigo-300 px-2 py-1 text-xs font-semibold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-700 dark:text-indigo-300"
                        >
                          {actionBusyKey === `friend:${result.id}` ? 'Sending...' : (result.is_self ? 'Add Friend' : (result.friend_status === 'incoming' ? 'Accept Friend' : 'Add Friend'))}
                        </button>
                        {result.friend_status === 'friends' ? (
                          <>
                            <button
                              disabled={actionBusyKey === `message:${result.id}`}
                              onClick={() => messageFriend(result.id)}
                              className="rounded-md border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-700 dark:text-emerald-300"
                            >
                              Message
                            </button>
                            <button
                              disabled={actionBusyKey === `call:${result.id}`}
                              onClick={() => callFriend(result.id)}
                              className="rounded-md border border-violet-300 px-2 py-1 text-xs font-semibold text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-violet-700 dark:text-violet-300"
                            >
                              Call
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setDark(!dark)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{dark ? 'Light' : 'Dark'}</span>
              </button>

              {user ? (
                <>
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

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200/60 bg-white/70 p-2 text-slate-700 shadow-sm md:hidden dark:border-slate-800/60 dark:bg-slate-950/60 dark:text-slate-100"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
          />
          <div className="absolute left-4 right-4 top-20 rounded-2xl bg-white/90 p-3 shadow-2xl ring-1 ring-slate-200/70 backdrop-blur-md dark:bg-slate-950/85 dark:ring-slate-800/60">
            <div className="space-y-1">
              {!user ? (
                publicLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100/60 active:scale-[0.98] dark:text-slate-100 dark:hover:bg-slate-800/50"
                  >
                    {label}
                  </Link>
                ))
              ) : (
                authenticatedLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100/60 active:scale-[0.98] dark:text-slate-100 dark:hover:bg-slate-800/50"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{label}</span>
                    {to === '/notifications' && unreadCount > 0 ? (
                      <span className="rounded-full bg-gradient-to-tr from-red-500 to-pink-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    ) : null}
                  </Link>
                ))
              )}

              {!user ? (
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.98] dark:bg-white/10 dark:hover:bg-white/15"
                >
                  Signup
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
