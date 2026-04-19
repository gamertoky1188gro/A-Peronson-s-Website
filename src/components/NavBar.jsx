/*
  Component: NavBar (global)

  Routes impacted:
    - Appears on most routes except immersive pages (/chat and /call) where AppLayout hides it.
    - Public links shown when logged out: /pricing, /about, /help
    - Authenticated icon links shown when logged in: /feed, /search, /contracts, /notifications, /chat, /verification

  Purpose:
    - Provide navigation (public + authenticated).
    - Provide theme toggle (light/dark via `.dark` class on <html>).
    - Provide user search suggestions dropdown (backend user search).
    - Provide unread notification badge (backend notifications list).
    - Provide mobile navigation drawer.

  Key UX patterns:
    - Glassmorphism base via `.nav-glass` (App.css): semi-transparent + blur + subtle shadow.
    - "Active" indicator uses Framer Motion `layoutId="nav-active"` so it smoothly slides between links.
    - Ctrl+K / Cmd+K focuses search.

  Key APIs:
    - GET /api/notifications (unread count)
    - GET /api/users/search?q=... (user suggestion search)
    - POST /api/users/:id/friend-request (connect)
    - POST /api/users/:id/follow (follow)
    - POST /api/chat/rooms (create/start conversation)
    - POST /api/calls (start call)
*/
/* global process */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, DollarSign, FileText, LayoutDashboard, Menu, MessageSquare, Moon, NotebookPen, Search, ShieldCheck, Sun } from 'lucide-react'
import { motion as Motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { apiRequest, clearSession, getCurrentUser, getRoleHome, getToken } from '../lib/auth'
import { connectNotificationsRealtime, subscribeNotificationsRealtime } from '../lib/notificationsRealtime'

// Public navigation (shown for logged-out visitors).
const publicLinks = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/help', label: 'Help' },
  { to: '/support', label: 'Support' },
]

// Auth navigation (shown for logged-in users). Each item maps to a page route + lucide icon.
const authenticatedLinks = [
  { to: '/feed', label: 'Feed', icon: LayoutDashboard },
  { to: '/feed/manage', label: 'Manage Feeds', icon: NotebookPen },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/contracts', label: 'Contracts', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/verification', label: 'Verification', icon: ShieldCheck },
  { to: '/admin', label: 'Admin', icon: ShieldCheck, roles: ['owner', 'admin'] },
]

// Premium-feeling easing curve used across nav animations.
const easePremium = [0.16, 1, 0.3, 1]

// Utility: keep values within a range (used for magnetic hover translation).
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function MagneticNavLink({ to, label, active }) {
  // Reduced motion: when user prefers reduced motion, disable the magnetic movement.
  const reduceMotion = useReducedMotion()
  // Motion values hold the current offset; springs smooth the movement.
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 500, damping: 32, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 500, damping: 32, mass: 0.6 })

  // Active state changes typography + color (also used by the moving `layoutId` pill below).
  const className = `relative inline-flex items-center rounded-full px-3 py-2 text-sm transition-colors ${
    active
      ? 'font-semibold text-gtBlue'
      : 'text-slate-600 hover:text-gtBlue dark:text-slate-300 dark:hover:text-gtBlue'
  }`

  return (
    <Link
      to={to}
      className={className}
      onMouseMove={(e) => {
        if (reduceMotion) return
        // Compute relative mouse position so the label subtly "pulls" toward the cursor.
        const rect = e.currentTarget.getBoundingClientRect()
        const relX = e.clientX - rect.left - rect.width / 2
        const relY = e.clientY - rect.top - rect.height / 2
        const maxX = 3
        const maxY = 2
        x.set(clamp((relX / (rect.width / 2)) * maxX, -maxX, maxX))
        y.set(clamp((relY / (rect.height / 2)) * maxY, -maxY, maxY))
      }}
      onMouseLeave={() => {
        // Spring back to center when cursor leaves.
        x.set(0)
        y.set(0)
      }}
    >
      {active ? (
        // The "active" pill: uses layoutId so it animates between links.
        <Motion.span
          layoutId="nav-active"
          className="absolute inset-x-1 inset-y-1 rounded-full bg-[rgba(10,102,194,0.10)] dark:bg-[rgba(10,102,194,0.16)]"
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        />
      ) : null}
      {/* Text wrapper uses spring x/y to create magnetic feel. */}
      <Motion.span style={{ x: springX, y: springY }} className="relative inline-block">
        {label}
      </Motion.span>
    </Link>
  )
}

function IconNavLink({ to, label, active, Icon, badgeCount = 0 }) {
  const reduceMotion = useReducedMotion()
  const IconComponent = Icon
  return (
    // Wrapper is `group` so the tooltip can animate on hover.
    <div className="group relative flex items-center justify-center">
      <Motion.div
        // Hover bounce: subtle scale + lift to signal interactivity.
        whileHover={reduceMotion ? undefined : { scale: 1.08, y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98, y: 0 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
      >
        <Link
          to={to}
          // Visual: rounded icon button with soft hover background (light + dark).
          className={`relative rounded-full p-2 transition-colors${
            active
              ? 'text-gtBlue'
              : 'text-slate-600 hover:text-gtBlue dark:text-slate-300 dark:hover:text-gtBlue'
          }hover:bg-slate-100/50 dark:hover:bg-slate-800/50`}
          aria-label={label}
        >
          {active ? (
            // Active pill behind the icon (also uses layoutId for smooth transitions).
            <Motion.span
              layoutId="nav-active"
              className="absolute inset-0 rounded-full bg-[rgba(10,102,194,0.10)] dark:bg-[rgba(10,102,194,0.16)]"
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            />
          ) : null}
          <span className="relative inline-flex">
            <IconComponent className="h-5 w-5" />
            {badgeCount > 0 ? (
              // Notification dot + ping layer (ping sits behind the solid dot).
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gradient-to-tr from-red-500 to-pink-500 opacity-35" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-red-500 to-pink-500" />
              </span>
            ) : null}
          </span>
        </Link>
      </Motion.div>

      {/* Tooltip: hidden by default; fades/scales in on group hover. */}
      <span className="pointer-events-none absolute top-full z-50 mt-2 w-max origin-top scale-0 rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-slate-700">
        {label}
      </span>
    </div>
  )
}

export default function NavBar() {
  // Theme preference: read on first render; subsequent changes sync to <html class="dark"> + localStorage.
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  // Mobile nav drawer open/close state.
  const [mobileOpen, setMobileOpen] = useState(false)
  // Global user search input + dropdown state (suggestions list).
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchError, setSearchError] = useState('')
  // Unread badge count for notifications icon.
  const [unreadCount, setUnreadCount] = useState(0)
  // Small ephemeral feedback strings for inline actions (follow/connect/message/call).
  const [actionStatus, setActionStatus] = useState('')
  // Used to disable only the button that's currently running (prevents double-submits).
  const [actionBusyKey, setActionBusyKey] = useState('')

  // Current route used to highlight active link and to re-run unread refresh on navigation.
  const location = useLocation()
  const navigate = useNavigate()
  // Session user is stored client-side; when absent we show public links.
  const user = getCurrentUser()
  const userId = user?.id || ''
  // Ref to focus the search input via Ctrl/Cmd+K.
  const searchInputRef = useRef(null)
  // Used to render the correct keyboard shortcut hint depending on platform.
  const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])

  useEffect(() => {
    // Toggle `.dark` class on <html> so Tailwind `dark:` variants activate.
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
    // Global shortcut to focus search (mirrors modern SaaS patterns).
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
      flushSync(() => { setUnreadCount(rows.filter((n) => !n?.read).length) })
    } catch {
      flushSync(() => { setUnreadCount(0) })
    }
  }, [userId])

  useEffect(() => {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') return
    refreshUnreadCount()
  }, [refreshUnreadCount, location.pathname])

  useEffect(() => {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') return undefined
    if (!userId) return undefined
    const token = getToken()
    if (!token) return undefined

    connectNotificationsRealtime(token)
    const unsubscribe = subscribeNotificationsRealtime((msg) => {
      if (!msg) return
      if (msg.type === 'notification_created' || msg.type === 'notification_read') {
        refreshUnreadCount()
      }
    })

    return unsubscribe
  }, [userId, refreshUnreadCount])

  const fetchUserSuggestions = useCallback(async (query) => {
    if (!userId) return
    try {
      const data = await apiRequest(`/users/search?q=${encodeURIComponent(query)}`, { token: getToken() })
      flushSync(() => { setSearchResults(Array.isArray(data?.users) ? data.users : []) })
    } catch (err) {
      flushSync(() => {
        setSearchResults([])
        setSearchError(err.message || 'Search failed')
      })
    } finally {
      flushSync(() => { setSearchLoading(false) })
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

  // Add a ref to the mobile menu container
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen]);

  return (
    // Top navigation shell.
    // Glass nav: translucent background + blur + subtle divider shadow (Tailwind-only).
    // `sticky top-0 z-50` keeps the nav pinned and above content during scroll.
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-dividerB ring-1 ring-slate-200/60 dark:bg-slate-950/75 dark:shadow-dividerBDark dark:ring-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          {/* Left cluster: brand + primary nav (desktop). */}
          <div className="flex items-center gap-4">
            {/* Brand: routes to role home when authenticated, otherwise routes to landing page. */}
            <Link to={user ? getRoleHome(user.role) : '/'} className="inline-flex items-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">B2B</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">GarTexHub</span>
            </Link>

            {/* Desktop-only nav list (hidden on mobile). */}
            <div className="hidden items-center gap-4 md:flex">
              {!user ? (
                // Public Links (Text)
                publicLinks.map(({ to, label }, idx) => (
                  <Motion.div
                    key={to}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx ? 0.05 : 0, ease: easePremium }}
                  >
                    <MagneticNavLink to={to} label={label} active={location.pathname === to} />
                  </Motion.div>
                ))
              ) : (
                // Authenticated Links (Icons with Tooltip)
                authenticatedLinks
                  .filter((link) => !link.roles || link.roles.includes(String(user?.role || '').toLowerCase()))
                  .map(({ to, label, icon: Icon }, idx) => (
                  <Motion.div
                    key={to}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx ? 0.05 : 0, ease: easePremium }}
                  >
                    {/* IconNavLink = icon button + tooltip + animated active pill + unread ping for notifications. */}
                    <IconNavLink to={to} label={label} Icon={Icon} active={location.pathname === to} badgeCount={to === '/notifications' ? unreadCount : 0} />
                  </Motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right cluster: desktop search + theme/auth actions + mobile menu button. */}
          <div className="flex w-full items-center gap-3 md:w-auto">
            {/* Desktop search:
                - Expands width on focus (`transition-[width]` + `focus-within:w-[420px]`)
                - Shows shortcut hint chip (Ctrl/Cmd + K)
                - Shows suggestion dropdown for authenticated users
            */}
            <div className="relative hidden items-center md:flex md:flex-none w-[320px] focus-within:w-[420px] transition-[width] duration-300">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => {
                  // Controlled input: update query state; dropdown opens as user types.
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search users..."
                className="w-full rounded-full shadow-borderless dark:shadow-borderlessDark bg-white/70 px-4 py-2 pr-16 text-sm text-slate-700 shadow-inner outline-none ring-sky-300/30 transition focus:ring-2 dark:bg-slate-900/60 dark:text-slate-100"
              />
              {/* Shortcut hint chip shown inside the input (visual only). */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow-borderless dark:shadow-borderlessDark bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                {isMac ? 'Cmd K' : 'Ctrl K'}
              </span>

              {user && searchOpen && searchQuery.trim().length >= 1 ? (
                <div className="absolute right-0 top-11 z-50 w-[360px] rounded-xl shadow-borderless dark:shadow-borderlessDark bg-white p-2 shadow-xl dark:bg-slate-900">
                  {searchLoading ? <p className="px-2 py-3 text-xs text-slate-500">Searching...</p> : null}
                  {!searchLoading && searchError ? <p className="px-2 py-3 text-xs text-rose-500">{searchError}</p> : null}
                  {!searchLoading && !searchError && searchResults.length === 0 ? <p className="px-2 py-3 text-xs text-slate-500">No users found.</p> : null}
                  {!searchLoading && !searchError && searchResults.length > 0 ? <p className="px-2 pb-2 text-[11px] text-slate-500">Suggestions</p> : null}
                  {actionStatus ? <p className="px-2 pb-2 text-[11px] text-emerald-600">{actionStatus}</p> : null}

                  {!searchLoading && !searchError && searchResults.map((result) => (
                    <div key={result.id} className="mb-1 rounded-lg shadow-borderless dark:shadow-borderlessDark px-2 py-2 last:mb-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{result.name}{result.is_self ? ' (You)' : ''}</p>
                          <p className="text-xs text-slate-500">{result.role} - {result.email}</p>
                        </div>
                        {result.verified ? <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Verified</span> : null}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          disabled={result.is_self || result.following || actionBusyKey === `follow:${result.id}`}
                          onClick={() => followUser(result.id)}
                          className="rounded-md shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-sky-300"
                        >
                          {actionBusyKey === `follow:${result.id}` ? 'Following...' : (result.is_self ? 'Follow' : (result.following ? 'Following' : 'Follow (optional)'))}
                        </button>
                        <button
                          disabled={result.is_self || ['friends', 'requested', 'self'].includes(result.friend_status) || actionBusyKey === `friend:${result.id}`}
                          onClick={() => addFriend(result.id)}
                          className="rounded-md shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs font-semibold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-indigo-300"
                        >
                          {actionBusyKey === `friend:${result.id}` ? 'Sending...' : (result.is_self ? 'Add Friend' : (result.friend_status === 'incoming' ? 'Accept Friend' : 'Add Friend'))}
                        </button>
                        {result.friend_status === 'friends' ? (
                          <>
                            <button
                              disabled={actionBusyKey === `message:${result.id}`}
                              onClick={() => messageFriend(result.id)}
                              className="rounded-md shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-300"
                            >
                              Message
                            </button>
                            <button
                              disabled={actionBusyKey === `call:${result.id}`}
                              onClick={() => callFriend(result.id)}
                              className="rounded-md shadow-borderless dark:shadow-borderlessDark px-2 py-1 text-xs font-semibold text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-violet-300"
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
                className="inline-flex items-center gap-2 rounded-full shadow-borderless dark:shadow-borderlessDark bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:text-slate-100"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{dark ? 'Light' : 'Dark'}</span>
              </button>

              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-full shadow-borderless dark:shadow-borderlessDark bg-white/70 p-2 text-slate-700 shadow-sm md:hidden dark:bg-slate-950/60 dark:text-slate-100"
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
          <div
            ref={mobileMenuRef}
            className="absolute left-4 right-4 top-20 rounded-2xl bg-white/90 p-3 shadow-2xl ring-1 ring-slate-200/70 backdrop-blur-md dark:bg-slate-950/85 dark:ring-slate-800/60"
          >
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
                authenticatedLinks
                  .filter((link) => !link.roles || link.roles.includes(String(user?.role || '').toLowerCase()))
                  .map(({ to, label, icon }) => {
                    const IconComponent = icon
                    return (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100/60 active:scale-[0.98] dark:text-slate-100 dark:hover:bg-slate-800/50"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="flex-1">{label}</span>
                        {to === '/notifications' && unreadCount > 0 ? (
                          <span className="rounded-full bg-gradient-to-tr from-red-500 to-pink-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        ) : null}
                      </Link>
                    )
                  })
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

              <div className="mt-4 shadow-dividerT dark:shadow-dividerTDark pt-3">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Legal</p>
                <Link
                  to="/terms"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-100/60 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-slate-800/50"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center rounded-xl px-3 py-2 text-xs text-slate-600 hover:bg-slate-100/60 active:scale-[0.98] dark:text-slate-400 dark:hover:bg-slate-800/50"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
