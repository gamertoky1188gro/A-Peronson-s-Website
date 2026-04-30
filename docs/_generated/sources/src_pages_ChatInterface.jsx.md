    1 | /*
    2 |   Route: /chat
    3 |   Access: Protected (login required)
    4 |   Allowed roles: buyer, buying_house, factory, owner, admin, agent
    5 | 
    6 |   Public Pages:
    7 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    8 |   Protected Pages (login required):
    9 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
   10 |     /notifications, /chat, /call, /verification, /verification-center
   11 | 
   12 |   Primary responsibilities:
   13 |     - Provide real-time-ish messaging UI: conversations list + message thread.
   14 |     - Enforce buying-house "conversation lock" rules (ownership/permissions) per backend.
   15 |     - Support sending attachments/media and viewing shared docs (contract-adjacent UX).
   16 | 
   17 |   Key API endpoints (high level):
   18 |     - GET /api/chat/rooms, GET /api/chat/rooms/:id/messages
   19 |     - POST /api/chat/rooms, POST /api/chat/messages
   20 |     - Any lock/permission endpoints (depending on server implementation)
   21 | 
   22 |   Notes:
   23 |     - AppLayout hides NavBar/Footer for /chat (immersive route).
   24 |     - This file is large; comments focus on major blocks (state/effects/render sections).
   25 | */
   26 | import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
   27 | import { Link, useLocation, useNavigate } from 'react-router-dom'
   28 | import {
   29 |   Bell,
   30 |   ChevronDown,
   31 |   ChevronUp,
   32 |   CircleHelp,
   33 |   Download,
   34 |   EllipsisVertical,
   35 |   Filter,
   36 |   Flag,
   37 |   FolderOpen,
   38 |   Home,
   39 |   Info,
   40 |   Lock,
   41 |   LogOut,
   42 |   MessageCircle,
   43 |   Phone,
   44 |   Plus,
   45 |   Search,
   46 |   SendHorizontal,
   47 |   VolumeX,
   48 | } from 'lucide-react'
   49 | import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
   50 | import { trackClientEvent } from '../lib/events'
   51 | import { consumeLeadSource } from '../lib/leadSource'
   52 | import AttachmentPreviewModal from '../components/chat/AttachmentPreviewModal'
   53 | import MarkdownMessage from '../components/chat/MarkdownMessage'
   54 | import FileAttachmentCard from '../components/chat/FileAttachmentCard'
   55 | import JourneyTimeline from '../components/JourneyTimeline'
   56 | 
   57 | const WS_BASE = (() => {
   58 |   if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
   59 |   const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
   60 |   return `${protocol}//${window.location.host}/ws`
   61 | })()
   62 | 
   63 | const CHAT_NAV_ITEMS = [
   64 |   { to: '/feed', label: 'Feed', icon: Home },
   65 |   { to: '/search', label: 'Search', icon: Search },
   66 |   { to: '/notifications', label: 'Alerts', icon: Bell },
   67 |   { to: '/chat', label: 'Chat', icon: MessageCircle },
   68 |   { to: '/contracts', label: 'Vault', icon: FolderOpen },
   69 |   { to: '/help', label: 'Help', icon: CircleHelp },
   70 | ]
   71 | 
   72 | 
   73 | 
   74 | const PANEL_STYLE = {
   75 |   background: 'rgb(16, 13, 34)',
   76 |   boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
   77 | }
   78 | 
   79 | const RIGHT_PANEL_STYLE = {
   80 |   background: '#100D22',
   81 |   boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
   82 | }
   83 | 
   84 | 
   85 | 
   86 | function sortByNewest(a, b) {
   87 |   return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
   88 | }
   89 | 
   90 | function sortByOldest(a, b) {
   91 |   return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
   92 | }
   93 | 
   94 | function normalizeThreads(messages = [], currentUserId = '') {
   95 |   const byMatchId = new Map()
   96 |   const latestByOther = new Map()
   97 | 
   98 |   messages.forEach((message) => {
   99 |     if (!message?.match_id) return
  100 |     const existing = byMatchId.get(message.match_id)
  101 |     const lock = message.conversation_lock || existing?.lock || null
  102 |     const isOther = currentUserId && message.sender_id && message.sender_id !== currentUserId
  103 |     const otherCandidate = isOther ? message : null
  104 | 
  105 |     if (!existing) {
  106 |       byMatchId.set(message.match_id, {
  107 |         id: message.match_id,
  108 |         matchId: message.match_id,
  109 |         requestId: message.request_id || String(message.match_id).split(':')[0],
  110 |         name: formatDisplayName(message.sender_name || message.company_name || message.sender_company_name, message.sender_id),
  111 |         avatar: message.sender_avatar_url || message.sender_avatar || '',
  112 |         senderId: message.sender_id,
  113 |         verified: Boolean(message.sender_verified),
  114 |         last: String(message.message || '').trim(),
  115 |         unread: Number(message.unread_count || 0),
  116 |         lastReadAt: message.last_read_at || null,
  117 |         timestamp: message.timestamp,
  118 |         lock,
  119 |         isFriendThread: String(message.match_id || '').startsWith('friend:'),
  120 |         friendRequestStatus: message.friend_request_status || null,
  121 |         friendRequestDirection: message.friend_request_direction || null,
  122 |         policyStatus: message.policy_status || 'delivered',
  123 |         policyPriority: message.policy_priority || null,
  124 |         policyReason: message.policy_reason || '',
  125 |         retryAfterSeconds: Number(message.retry_after_seconds || 0),
  126 |       })
  127 |       if (otherCandidate) {
  128 |         latestByOther.set(message.match_id, otherCandidate)
  129 |       }
  130 |       return
  131 |     }
  132 | 
  133 |     if (new Date(message.timestamp || 0).getTime() > new Date(existing.timestamp || 0).getTime()) {
  134 |       byMatchId.set(message.match_id, {
  135 |         ...existing,
  136 |         last: String(message.message || '').trim() || existing.last,
  137 |         timestamp: message.timestamp,
  138 |         lock,
  139 |         isFriendThread: existing.isFriendThread || String(message.match_id || '').startsWith('friend:'),
  140 |         friendRequestStatus: message.friend_request_status || existing.friendRequestStatus || null,
  141 |         friendRequestDirection: message.friend_request_direction || existing.friendRequestDirection || null,
  142 |         unread: Number(message.unread_count || existing.unread || 0),
  143 |         lastReadAt: message.last_read_at || existing.lastReadAt || null,
  144 |         policyStatus: message.policy_status || existing.policyStatus || 'delivered',
  145 |         policyPriority: message.policy_priority || existing.policyPriority || null,
  146 |         policyReason: message.policy_reason || existing.policyReason || '',
  147 |         retryAfterSeconds: Number(message.retry_after_seconds || existing.retryAfterSeconds || 0),
  148 |       })
  149 |     }
  150 | 
  151 |     const existingOther = latestByOther.get(message.match_id)
  152 |     if (otherCandidate) {
  153 |       if (!existingOther || new Date(message.timestamp || 0).getTime() > new Date(existingOther.timestamp || 0).getTime()) {
  154 |         latestByOther.set(message.match_id, otherCandidate)
  155 |       }
  156 |     }
  157 |   })
  158 | 
  159 |   const normalized = [...byMatchId.values()].map((thread) => {
  160 |     const other = latestByOther.get(thread.matchId)
  161 |     if (!other) return thread
  162 |     return {
  163 |       ...thread,
  164 |       name: formatDisplayName(other.sender_name || other.company_name || other.sender_company_name, other.sender_id),
  165 |       avatar: other.sender_avatar_url || other.sender_avatar || thread.avatar,
  166 |       senderId: other.sender_id,
  167 |       verified: Boolean(other.sender_verified),
  168 |     }
  169 |   })
  170 | 
  171 |   return normalized.sort(sortByNewest)
  172 | }
  173 | 
  174 | function lockStatusLabel(lock, thread = null) {
  175 |   if (thread?.isFriendThread) {
  176 |     if (thread.friendRequestStatus === 'pending' && thread.friendRequestDirection === 'incoming') return 'Incoming friend request'
  177 |     if (thread.friendRequestStatus === 'pending' && thread.friendRequestDirection === 'outgoing') return 'Friend request pending'
  178 |     return 'Direct friend chat'
  179 |   }
  180 | 
  181 |   if (!lock || lock.status === 'unclaimed') return 'Unclaimed'
  182 |   if (lock.lock_type === 'verified_first' && lock.status !== 'granted') {
  183 |     return `Verified first message by ${lock.claimed_by_name || 'supplier'}`
  184 |   }
  185 |   if (lock.status === 'claimed') return `Claimed by ${lock.claimed_by_name || 'you'}`
  186 |   if (lock.status === 'granted') return 'Access granted'
  187 |   return `Claimed by ${lock.claimed_by_name || (lock.lock_type === 'verified_first' ? 'another supplier' : 'another agent')}`
  188 | }
  189 | 
  190 | const IMAGE_ATTACHMENT_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'apng', 'webp', 'avif', 'svg', 'ico'])
  191 | const VIDEO_ATTACHMENT_EXTS = new Set(['mp4', 'mov', 'avi', 'wmv', 'webm', 'mkv', 'flv', '3gp', 'mpg', 'mpeg', 'm4v', 'amv'])
  192 | 
  193 | function safeAttachmentExt(attachment) {
  194 |   const candidates = [attachment?.name, attachment?.url].map((value) => String(value || '').trim()).filter(Boolean)
  195 |   if (candidates.length === 0) return ''
  196 | 
  197 |   const raw = candidates[0]
  198 |   const cleaned = raw.split('*')[0].split('#')[0]
  199 |   const tail = cleaned.split('/').pop() || cleaned
  200 |   const match = tail.match(/\.([a-z0-9]+)$/i)
  201 |   return match ? match[1].toLowerCase() : ''
  202 | }
  203 | 
  204 | function isImageExt(attachment) {
  205 |   const ext = safeAttachmentExt(attachment)
  206 |   return IMAGE_ATTACHMENT_EXTS.has(ext)
  207 | }
  208 | 
  209 | function isVideoExt(attachment) {
  210 |   const ext = safeAttachmentExt(attachment)
  211 |   return VIDEO_ATTACHMENT_EXTS.has(ext)
  212 | }
  213 | 
  214 | function isImageMessage(message) {
  215 |   return message?.type === 'image' || String(message?.attachment?.mime_type || '').startsWith('image/') || isImageExt(message?.attachment)
  216 | }
  217 | 
  218 | function isVideoMessage(message) {
  219 |   return message?.type === 'video' || String(message?.attachment?.mime_type || '').startsWith('video/') || isVideoExt(message?.attachment)
  220 | }
  221 | 
  222 | function toAbsoluteAssetUrl(url = '') {
  223 |   if (!url) return ''
  224 |   if (url.startsWith('http://') || url.startsWith('https://')) return url
  225 |   const apiUrl = import.meta.env.VITE_API_URL || '/api'
  226 |   const base = apiUrl.replace(/\/api\/*$/, '')
  227 |   return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  228 | }
  229 | 
  230 | function truncateId(value = '', size = 8) {
  231 |   const normalized = String(value || '')
  232 |   if (normalized.length <= size) return normalized
  233 |   return `${normalized.slice(0, size)}...`
  234 | }
  235 | 
  236 | function formatDisplayName(name, fallbackId) {
  237 |   if (name && String(name).trim()) return String(name).trim()
  238 |   const cleaned = String(fallbackId || '')
  239 |     .replace(/^friend:/i, '')
  240 |     .replace(/[_:.@-]+/g, ' ')
  241 |     .replace(/\s+/g, ' ')
  242 |     .trim()
  243 |   return cleaned || 'Unknown contact'
  244 | }
  245 | 
  246 | function getInitials(label = '') {
  247 |   const words = String(label).trim().split(/\s+/).filter(Boolean)
  248 |   if (words.length === 0) return 'U'
  249 |   if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  250 |   return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase()
  251 | }
  252 | 
  253 | function formatTime(iso) {
  254 |   if (!iso) return '--:--'
  255 |   return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()
  256 | }
  257 | 
  258 | function extractFirstUrl(text = '') {
  259 |   const match = String(text).match(/https*:\/\/[^\s]+/i)
  260 |   return match ? match[0] : ''
  261 | }
  262 | 
  263 | function avatarUrl(avatar = '') {
  264 |   return String(avatar || '').trim()
  265 | }
  266 | 
  267 | function dateDividerLabel(iso) {
  268 |   if (!iso) return 'Recent'
  269 |   const date = new Date(iso)
  270 |   const now = new Date()
  271 |   const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  272 |   const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  273 |   const dayDiff = Math.floor((startToday - startDate) / 86400000)
  274 |   if (dayDiff <= 0) return 'Today'
  275 |   if (dayDiff === 1) return 'Yesterday'
  276 |   return date.toLocaleDateString()
  277 | }
  278 | 
  279 | function formatPresence(iso) {
  280 |   if (!iso) return 'No recent activity'
  281 |   const ms = Date.now() - new Date(iso).getTime()
  282 |   const mins = Math.floor(ms / 60000)
  283 |   if (mins < 2) return 'Online'
  284 |   if (mins < 60) return `Last seen ${mins}m ago`
  285 |   const hours = Math.floor(mins / 60)
  286 |   if (hours < 24) return `Last seen ${hours}h ago`
  287 |   return `Last seen ${new Date(iso).toLocaleDateString()}`
  288 | }
  289 | 
  290 | function extractLatestNote(notes = [], prefix = '') {
  291 |   const matches = (Array.isArray(notes) ? notes : [])
  292 |     .filter((note) => String(note.note || '').startsWith(prefix))
  293 |     .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
  294 |   return matches[0] || null
  295 | }
  296 | 
  297 | function splitSuggestedReply(noteText = '') {
  298 |   const raw = String(noteText || '')
  299 |   const marker = 'Suggested reply:'
  300 |   if (!raw.includes(marker)) return { text: raw.trim(), suggested: '' }
  301 |   const parts = raw.split(marker)
  302 |   return { text: parts[0].trim(), suggested: parts.slice(1).join(marker).trim() }
  303 | }
  304 | 
  305 | function friendCounterpartyId(matchId = '', currentUserId = '') {
  306 |   if (!matchId.startsWith('friend:')) return ''
  307 |   const parts = String(matchId).split(':')
  308 |   if (parts.length !== 3) return ''
  309 |   const a = parts[1]
  310 |   const b = parts[2]
  311 |   if (!currentUserId) return ''
  312 |   if (a === currentUserId) return b
  313 |   if (b === currentUserId) return a
  314 |   return ''
  315 | }
  316 | 
  317 | function linkPreviewMeta(url = '') {
  318 |   try {
  319 |     const parsed = new URL(url)
  320 |     return {
  321 |       host: parsed.hostname.replace(/^www\./i, ''),
  322 |       title: parsed.hostname.replace(/^www\./i, ''),
  323 |       description: parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : 'Shared link',
  324 |     }
  325 |   } catch {
  326 |     return { host: 'link', title: 'Shared link', description: url || 'Open link' }
  327 |   }
  328 | }
  329 | 
  330 | export default function ChatInterface() {
  331 |   const [themeMode, setThemeMode] = useState(() => {
  332 |     try {
  333 |       return localStorage.getItem('chat-theme-mode') || 'dark'
  334 |     } catch {
  335 |       return 'dark'
  336 |     }
  337 |   })
  338 |   const [priorityInbox, setPriorityInbox] = useState([])
  339 |   // ... rest of state ...
  340 |   const [messageRequests, setMessageRequests] = useState([])
  341 |   const [activeThreadId, setActiveThreadId] = useState(null)
  342 |   const [loading, setLoading] = useState(true)
  343 |   const [error, setError] = useState('')
  344 |   const [query, setQuery] = useState('')
  345 |   const [scheduleStatus, setScheduleStatus] = useState('')
  346 |   const [callHistoryByThread, setCallHistoryByThread] = useState({})
  347 |   const [messagesByThread, setMessagesByThread] = useState({})
  348 |   const [draftMessage, setDraftMessage] = useState('')
  349 |   const [isLiveMessagingEnabled] = useState(true)
  350 |   const [, setChatConnectionStatus] = useState('offline')
  351 |   const [uploading, setUploading] = useState(false)
  352 |   const [uploadStatus, setUploadStatus] = useState('')
  353 |   const [policyFeedback, setPolicyFeedback] = useState({ reason: '', retryAfter: 0 })
  354 |   const [callPromptThread, setCallPromptThread] = useState(null)
  355 |   const [previewAttachment, setPreviewAttachment] = useState(null)
  356 |   const [accordionState, setAccordionState] = useState({
  357 |     sharedDocument: true,
  358 |     sharedMedia: true,
  359 |     sharedPost: true,
  360 |   })
  361 |   const [presenceMap, setPresenceMap] = useState({})
  362 |   const [notice, setNotice] = useState(null)
  363 |   const [aiSuggesting, setAiSuggesting] = useState(false)
  364 |   const [aiError, setAiError] = useState('')
  365 |   const [aiSummary, setAiSummary] = useState(null)
  366 |   const [aiSummaryLoading, setAiSummaryLoading] = useState(false)
  367 |   const [aiSummaryError, setAiSummaryError] = useState('')
  368 |   const [aiNegotiation, setAiNegotiation] = useState(null)
  369 |   const [aiNegotiationLoading, setAiNegotiationLoading] = useState(false)
  370 |   const [aiNegotiationError, setAiNegotiationError] = useState('')
  371 |   const [leadSummary, setLeadSummary] = useState(null)
  372 |   const [leadLoading, setLeadLoading] = useState(false)
  373 |   const [prequalOverride, setPrequalOverride] = useState(false)
  374 | 
  375 |   const wsRef = useRef(null)
  376 |   const fileInputRef = useRef(null)
  377 |   const reconnectTimerRef = useRef(null)
  378 |   const activeThreadMatchIdRef = useRef('')
  379 |   const pendingMatchIdRef = useRef('')
  380 |   const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  381 |   const navigate = useNavigate()
  382 |   const location = useLocation()
  383 |   const isLight = themeMode === 'light'
  384 |   const userRole = String(currentUser?.role || '').toLowerCase()
  385 |   const isBuyerUser = userRole === 'buyer'
  386 |   const isAdminUser = ['owner', 'admin'].includes(userRole)
  387 | 
  388 |   const presenceStatus = useCallback((userId) => presenceMap?.[userId]?.status || 'offline', [presenceMap])
  389 |   const presenceLastSeen = useCallback((userId) => presenceMap?.[userId]?.last_seen || null, [presenceMap])
  390 | 
  391 |   const theme = useMemo(() => ({
  392 |     pageBg: isLight ? '#f8fafc' : 'rgb(4, 0, 23)',
  393 |     panelBg: isLight ? '#ffffff' : 'rgb(16, 13, 34)',
  394 |     rightPanelBg: isLight ? '#ffffff' : '#100D22',
  395 |     subPanelBg: isLight ? '#fcfdfe' : '#100D22',
  396 |     tileBg: isLight ? '#f1f5f9' : '#171031',
  397 |     threadIdleBg: isLight ? 'transparent' : '#101328',
  398 |     threadActiveBg: isLight ? '#f0f7ff' : '#2f295c',
  399 |     textPrimary: isLight ? '#1e293b' : '#ffffff',
  400 |     textMuted: isLight ? '#64748b' : '#8e93b4',
  401 |     inputBg: isLight ? '#f1f5f9' : '#171031',
  402 |     shadow: isLight ? '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)' : '0 10px 40px rgba(0,0,0,0.45)',
  403 |     accent: '#4f46e5',
  404 |   }), [isLight])
  405 | 
  406 |   useEffect(() => {
  407 |     try {
  408 |       localStorage.setItem('chat-theme-mode', themeMode)
  409 |     } catch {
  410 |       // no-op
  411 |     }
  412 |   }, [themeMode])
  413 | 
  414 |   useEffect(() => {
  415 |     if (location.state?.notice) {
  416 |       setNotice(location.state.notice)
  417 |       navigate(location.pathname, { replace: true, state: {} })
  418 |     }
  419 |     if (location.state?.matchId) {
  420 |       pendingMatchIdRef.current = String(location.state.matchId)
  421 |       navigate(location.pathname, { replace: true, state: {} })
  422 |     }
  423 | 
  424 |     const params = new URLSearchParams(location.search || '')
  425 |     const matchId = params.get('match_id')
  426 |     if (matchId) pendingMatchIdRef.current = String(matchId)
  427 |   }, [location.state, location.pathname, location.search, navigate])
  428 | 
  429 |   const loadInbox = useCallback(async () => {
  430 | 
  431 |     setLoading(true)
  432 |     setError('')
  433 | 
  434 |     try {
  435 |       const token = getToken()
  436 |       let liveUser = getCurrentUser()
  437 |       if (token && !liveUser?.id) {
  438 |         try {
  439 |           liveUser = await apiRequest('/users/me', { token })
  440 |         } catch {
  441 |           liveUser = null
  442 |         }
  443 |       }
  444 |       setCurrentUser(liveUser)
  445 |       const currentUserId = liveUser?.id || ''
  446 |       if (!token) {
  447 |         setPriorityInbox([])
  448 |         setMessageRequests([])
  449 |         setError('Please sign in to view your inbox.')
  450 |         return
  451 |       }
  452 | 
  453 |       const data = await apiRequest('/messages/inbox', { token })
  454 |       const priority = normalizeThreads(data?.priority || [], currentUserId)
  455 |       const requests = normalizeThreads(data?.request_pool || [], currentUserId)
  456 |       const allMatchIds = [...new Set([...priority, ...requests].map((thread) => thread.matchId).filter(Boolean))]
  457 | 
  458 |       const friendCounterpartyIds = [...new Set(
  459 |         [...priority, ...requests]
  460 |           .filter((thread) => thread.isFriendThread)
  461 |           .map((thread) => friendCounterpartyId(thread.matchId, currentUserId))
  462 |           .filter(Boolean)
  463 |       )]
  464 | 
  465 |       let userById = {}
  466 |       if (friendCounterpartyIds.length > 0) {
  467 |         const lookup = await apiRequest('/users/lookup', { method: 'POST', token, body: { ids: friendCounterpartyIds } })
  468 |         userById = (lookup?.users || []).reduce((acc, user) => {
  469 |           acc[user.id] = user
  470 |           return acc
  471 |         }, {})
  472 |       }
  473 | 
  474 |       const applyFriendDisplay = (threads) => threads.map((thread) => {
  475 |         if (!thread.isFriendThread) return thread
  476 |         const counterpartyId = friendCounterpartyId(thread.matchId, currentUserId)
  477 |         const user = userById[counterpartyId]
  478 |         if (!user) return { ...thread, senderId: counterpartyId || thread.senderId }
  479 |         return {
  480 |           ...thread,
  481 |           name: formatDisplayName(user.name, user.id),
  482 |           avatar: user.avatar_url || user.avatar || thread.avatar,
  483 |           senderId: user.id,
  484 |           verified: Boolean(user.verified),
  485 |         }
  486 |       })
  487 | 
  488 |       setPriorityInbox(applyFriendDisplay(priority))
  489 |       setMessageRequests(applyFriendDisplay(requests))
  490 |       setActiveThreadId((currentThreadId) => {
  491 |         const pendingMatchId = pendingMatchIdRef.current
  492 |         if (pendingMatchId) {
  493 |           const matchThread = [...priority, ...requests].find((thread) => thread.matchId === pendingMatchId)
  494 |           pendingMatchIdRef.current = ''
  495 |           if (matchThread) return matchThread.id
  496 |         }
  497 |         const threadStillVisible = [...priority, ...requests].some((thread) => thread.id === currentThreadId)
  498 |         if (threadStillVisible) return currentThreadId
  499 |         if (priority.length > 0) return priority[0].id
  500 |         if (requests.length > 0) return requests[0].id
  501 |         return null
  502 |       })
  503 | 
  504 |       if (allMatchIds.length > 0) {
  505 |       const callHistoryResponse = await apiRequest(`/calls/history?match_ids=${allMatchIds.join(',')}`, { token })
  506 |         const grouped = (callHistoryResponse?.items || []).reduce((acc, item) => {
  507 |           const key = item.match_id || item.context?.chat_thread_id
  508 |           if (!key) return acc
  509 |           if (!acc[key]) acc[key] = []
  510 |           acc[key].push(item)
  511 |           return acc
  512 |         }, {})
  513 |         setCallHistoryByThread(grouped)
  514 |       } else {
  515 |         setCallHistoryByThread({})
  516 |       }
  517 |     } catch (err) {
  518 |       setPriorityInbox([])
  519 |       setMessageRequests([])
  520 |       setError(err.message || 'Failed to load inbox')
  521 |     } finally {
  522 |       setLoading(false)
  523 |     }
  524 |   }, [])
  525 | 
  526 |   const loadThreadMessages = useCallback(async (matchId) => {
  527 |     const token = getToken()
  528 |     if (!token || !matchId) return
  529 | 
  530 |     try {
  531 |       const data = await apiRequest(`/messages/${matchId}`, { token })
  532 |       setMessagesByThread((previous) => ({
  533 |         ...previous,
  534 |         [matchId]: Array.isArray(data) ? data.sort(sortByOldest) : [],
  535 |       }))
  536 |     } catch {
  537 |       setMessagesByThread((previous) => ({
  538 |         ...previous,
  539 |         [matchId]: [],
  540 |       }))
  541 |     }
  542 |   }, [])
  543 | 
  544 |   useEffect(() => {
  545 |     loadInbox()
  546 |   }, [loadInbox])
  547 | 
  548 |   const filteredPriorityInbox = useMemo(() => {
  549 |     if (!query.trim()) return priorityInbox
  550 |     const search = query.toLowerCase()
  551 |     return priorityInbox.filter((thread) => thread.name.toLowerCase().includes(search) || thread.last.toLowerCase().includes(search))
  552 |   }, [priorityInbox, query])
  553 | 
  554 |   const filteredRequests = useMemo(() => {
  555 |     if (!query.trim()) return messageRequests
  556 |     const search = query.toLowerCase()
  557 |     return messageRequests.filter((thread) => thread.name.toLowerCase().includes(search) || thread.last.toLowerCase().includes(search))
  558 |   }, [messageRequests, query])
  559 | 
  560 |   const allVisibleThreads = useMemo(() => [...filteredPriorityInbox, ...filteredRequests], [filteredPriorityInbox, filteredRequests])
  561 |   const activeThread = allVisibleThreads.find((thread) => thread.id === activeThreadId)
  562 |   activeThreadMatchIdRef.current = activeThread?.matchId || ''
  563 | 
  564 |   useEffect(() => {
  565 |     const token = getToken()
  566 |     if (!token || !activeThread?.matchId || activeThread?.isFriendThread) {
  567 |       setLeadSummary(null)
  568 |       setPrequalOverride(false)
  569 |       setAiSummary(null)
  570 |       setAiNegotiation(null)
  571 |       return
  572 |     }
  573 | 
  574 |     setLeadLoading(true)
  575 |     apiRequest(`/leads/by-match/${encodeURIComponent(activeThread.matchId)}`, { token })
  576 |       .then((data) => setLeadSummary(data || null))
  577 |       .catch(() => setLeadSummary(null))
  578 |       .finally(() => setLeadLoading(false))
  579 |   }, [activeThread?.matchId, activeThread?.isFriendThread])
  580 | 
  581 |   useEffect(() => {
  582 |     if (!leadSummary?.notes) {
  583 |       setAiSummary(null)
  584 |       setAiNegotiation(null)
  585 |       return
  586 |     }
  587 | 
  588 |     const summaryNote = extractLatestNote(leadSummary.notes, 'AI Summary:')
  589 |     if (summaryNote?.note) {
  590 |       const parsed = splitSuggestedReply(String(summaryNote.note).replace(/^AI Summary:\\s*/i, ''))
  591 |       setAiSummary({
  592 |         text: parsed.text,
  593 |         suggestedReply: parsed.suggested,
  594 |         updatedAt: summaryNote.created_at || null,
  595 |       })
  596 |     } else {
  597 |       setAiSummary(null)
  598 |     }
  599 | 
  600 |     const negotiationNote = extractLatestNote(leadSummary.notes, 'AI Negotiation:')
  601 |     if (negotiationNote?.note) {
  602 |       const parsed = splitSuggestedReply(String(negotiationNote.note).replace(/^AI Negotiation:\\s*/i, ''))
  603 |       setAiNegotiation({
  604 |         guidance: parsed.text,
  605 |         suggestedReply: parsed.suggested,
  606 |         updatedAt: negotiationNote.created_at || null,
  607 |       })
  608 |     } else {
  609 |       setAiNegotiation(null)
  610 |     }
  611 |   }, [leadSummary])
  612 |   const activeCallHistory = useMemo(() => {
  613 |     if (!activeThread?.matchId) return []
  614 |     return callHistoryByThread[activeThread.matchId] || []
  615 |   }, [activeThread, callHistoryByThread])
  616 |   const hasRecordedCall = useMemo(() => {
  617 |     return activeCallHistory.some((call) => String(call.recording_status || '').toLowerCase() === 'available' && call.recording_url)
  618 |   }, [activeCallHistory])
  619 |   const activeMessages = useMemo(() => {
  620 |     if (!activeThread?.matchId) return []
  621 |     return messagesByThread[activeThread.matchId] || []
  622 |   }, [activeThread, messagesByThread])
  623 | 
  624 |   function parsePrequal(notes = []) {
  625 |     const rows = Array.isArray(notes) ? notes : []
  626 |     const match = rows.find((n) => String(n.note || '').startsWith('AI Pre-Qual Summary')) || null
  627 |     if (!match) return null
  628 |     const text = String(match.note || '')
  629 |     const scoreMatch = text.match(/Score\s+([0-9.]+)/i)
  630 |     const missingMatch = text.match(/Missing:\s*([^|]+)/i)
  631 |     return {
  632 |       raw: text,
  633 |       score: scoreMatch ? Number(scoreMatch[1]) : null,
  634 |       missing: missingMatch ? missingMatch[1].trim() : '',
  635 |     }
  636 |   }
  637 | 
  638 |   const prequal = useMemo(() => parsePrequal(leadSummary?.notes || []), [leadSummary])
  639 |   const prequalNeedsInfo = Number.isFinite(prequal?.score) ? prequal.score < 0.6 : false
  640 |   const prequalCanOverride = Boolean(currentUser?.verified || isAdminUser)
  641 |   const prequalBlocked = prequalNeedsInfo && !isBuyerUser && !prequalOverride && prequalCanOverride
  642 |   const prequalHardBlocked = prequalNeedsInfo && !isBuyerUser && !prequalCanOverride
  643 | 
  644 |   useEffect(() => {
  645 |     if (!activeThread?.matchId || hasRecordedCall) return
  646 |     trackClientEvent('call_warning_shown', {
  647 |       entityType: 'chat_thread',
  648 |       entityId: activeThread.matchId,
  649 |     })
  650 |   }, [activeThread?.matchId, hasRecordedCall])
  651 | 
  652 |   const lockMeta = activeThread?.lock || null
  653 |   const lockStatus = lockMeta?.status || 'unclaimed'
  654 |   const lockType = lockMeta?.lock_type || null
  655 |   const isAgentUser = userRole === 'agent'
  656 |   const shouldRespectLock = lockType === 'verified_first'
  657 |     ? !isBuyerUser && !isAdminUser
  658 |     : lockType === 'agent_claim'
  659 |       ? isAgentUser
  660 |       : isAgentUser
  661 |     const isLockRestricted = shouldRespectLock && lockStatus === 'request_access'
  662 |     const isLockOwner = Boolean(lockMeta && lockMeta?.claimed_by === currentUser?.id && !activeThread?.isFriendThread)
  663 |   const canSendMessage = !isLockRestricted && !prequalBlocked && !prequalHardBlocked
  664 | 
  665 |   const sharedMedia = useMemo(() => {
  666 |     return activeMessages
  667 |       .filter((message) => (isImageMessage(message) || isVideoMessage(message)) && message?.attachment?.url)
  668 |       .slice(-9)
  669 |       .reverse()
  670 |   }, [activeMessages])
  671 | 
  672 |   const sharedLinks = useMemo(() => {
  673 |     return activeMessages
  674 |       .filter((message) => message?.attachment?.url && !isImageMessage(message) && !isVideoMessage(message))
  675 |       .slice(-6)
  676 |       .reverse()
  677 |   }, [activeMessages])
  678 | 
  679 |   const sharedPosts = useMemo(() => {
  680 |     return activeMessages.filter((message) => message?.type === 'post').slice(-6).reverse()
  681 |   }, [activeMessages])
  682 | 
  683 |   const participantIds = useMemo(() => {
  684 |     const ids = new Set()
  685 |     activeMessages.forEach((m) => {
  686 |       if (m.sender_id) ids.add(m.sender_id)
  687 |     })
  688 |     if (activeThread?.senderId) ids.add(activeThread.senderId)
  689 |     if (currentUser?.id) ids.add(currentUser.id)
  690 |     return Array.from(ids)
  691 |   }, [activeMessages, activeThread, currentUser])
  692 | 
  693 |   useEffect(() => {
  694 |     if (!activeThread?.matchId) return
  695 |     loadThreadMessages(activeThread.matchId)
  696 |   }, [activeThread, loadThreadMessages])
  697 | 
  698 |   useEffect(() => {
  699 |     const token = getToken()
  700 |     if (!token || !activeThread?.matchId) return
  701 |     apiRequest(`/messages/${encodeURIComponent(activeThread.matchId)}/read`, { method: 'POST', token })
  702 |       .then((data) => {
  703 |         const lastReadAt = data?.last_read_at || new Date().toISOString()
  704 |         const updateThread = (thread) => {
  705 |           if (thread.id !== activeThread.id) return thread
  706 |           return { ...thread, unread: 0, lastReadAt }
  707 |         }
  708 |         setPriorityInbox((prev) => prev.map(updateThread))
  709 |         setMessageRequests((prev) => prev.map(updateThread))
  710 |       })
  711 |       .catch(() => {
  712 |         // ignore read errors
  713 |       })
  714 |   }, [activeThread?.matchId, activeThread?.id])
  715 | 
  716 |   const refreshPresence = useCallback(async (ids) => {
  717 |     const token = getToken()
  718 |     if (!token || !ids || ids.length === 0) return
  719 |     try {
  720 |       const data = await apiRequest('/presence', { method: 'POST', token, body: { user_ids: ids } })
  721 |       if (data?.presence) setPresenceMap(data.presence)
  722 |     } catch {
  723 |       // silent
  724 |     }
  725 |   }, [])
  726 | 
  727 |   useEffect(() => {
  728 |     if (participantIds.length === 0) return
  729 |     refreshPresence(participantIds)
  730 |   }, [participantIds, refreshPresence])
  731 | 
  732 |   useEffect(() => {
  733 |     if (!isLiveMessagingEnabled) {
  734 |       setChatConnectionStatus('offline')
  735 |       if (wsRef.current) {
  736 |         wsRef.current.close()
  737 |         wsRef.current = null
  738 |       }
  739 |       if (reconnectTimerRef.current) {
  740 |         window.clearTimeout(reconnectTimerRef.current)
  741 |         reconnectTimerRef.current = null
  742 |       }
  743 |       return undefined
  744 |     }
  745 | 
  746 |     let isActive = true
  747 | 
  748 |     const connect = () => {
  749 |       const token = getToken()
  750 |       if (!token) {
  751 |         setChatConnectionStatus('offline')
  752 |         return
  753 |       }
  754 | 
  755 |       setChatConnectionStatus('connecting')
  756 |       const ws = new WebSocket(WS_BASE)
  757 |       wsRef.current = ws
  758 | 
  759 |       ws.onopen = () => {
  760 |         if (!isActive) return
  761 |         setChatConnectionStatus('online')
  762 |         ws.send(JSON.stringify({
  763 |           type: 'identify',
  764 |           token,
  765 |         }))
  766 |         const matchId = activeThreadMatchIdRef.current
  767 |         if (matchId) {
  768 |           ws.send(JSON.stringify({
  769 |             type: 'join_chat_room',
  770 |             match_id: matchId,
  771 |             token,
  772 |           }))
  773 |         }
  774 |       }
  775 | 
  776 |       ws.onmessage = (event) => {
  777 |         if (!isActive) return
  778 |         const payload = JSON.parse(String(event.data || '{}'))
  779 | 
  780 |         if (payload.type === 'joined_chat_room') {
  781 |           const roomMatchId = payload.match_id
  782 |           const history = Array.isArray(payload.messages) ? payload.messages.sort(sortByOldest) : []
  783 |           setMessagesByThread((previous) => ({ ...previous, [roomMatchId]: history }))
  784 |           return
  785 |         }
  786 | 
  787 |         if (payload.type === 'chat_message') {
  788 |           const roomMatchId = payload.match_id
  789 |           const incomingMessage = payload.message
  790 |           if (!roomMatchId || !incomingMessage?.id) return
  791 |           setMessagesByThread((previous) => {
  792 |             const existing = previous[roomMatchId] || []
  793 |             if (existing.some((message) => message.id === incomingMessage.id)) return previous
  794 |             return {
  795 |               ...previous,
  796 |               [roomMatchId]: [...existing, incomingMessage].sort(sortByOldest),
  797 |             }
  798 |           })
  799 |           return
  800 |         }
  801 | 
  802 |         if (payload.type === 'incoming_call') {
  803 |           const from = payload?.from || {}
  804 |           if (!payload?.call_id) return
  805 |           setCallPromptThread({
  806 |             id: payload.match_id || payload.call_id,
  807 |             matchId: payload.match_id || '',
  808 |             callId: payload.call_id,
  809 |             name: from.name || from.email || 'Caller',
  810 |             avatar: from.avatar || '',
  811 |             senderId: from.id || '',
  812 |             verified: Boolean(from.verified),
  813 |             direction: 'incoming',
  814 |           })
  815 |           return
  816 |         }
  817 | 
  818 |         if (payload.type === 'chat_error') {
  819 |           setChatConnectionStatus('online')
  820 |           const retryAfter = Number(payload.retry_after_seconds || 0)
  821 |           if (payload.reason || retryAfter > 0) {
  822 |             setPolicyFeedback({ reason: payload.reason || payload.error || 'policy_blocked', retryAfter })
  823 |           }
  824 |           if (!String(payload.error || '').toLowerCase().includes('forbidden')) {
  825 |             setError(payload.error || 'Live messaging issue')
  826 |           }
  827 |         }
  828 |       }
  829 | 
  830 |       ws.onerror = () => {
  831 |         if (isActive) setChatConnectionStatus('online')
  832 |       }
  833 | 
  834 |       ws.onclose = () => {
  835 |         if (!isActive) return
  836 |         setChatConnectionStatus('offline')
  837 |         if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current)
  838 |         reconnectTimerRef.current = window.setTimeout(connect, 1500)
  839 |       }
  840 |     }
  841 | 
  842 |     connect()
  843 | 
  844 |     return () => {
  845 |       isActive = false
  846 |       if (reconnectTimerRef.current) {
  847 |         window.clearTimeout(reconnectTimerRef.current)
  848 |         reconnectTimerRef.current = null
  849 |       }
  850 |       if (wsRef.current) {
  851 |         wsRef.current.close()
  852 |         wsRef.current = null
  853 |       }
  854 |     }
  855 |   }, [isLiveMessagingEnabled])
  856 | 
  857 |   useEffect(() => {
  858 |     if (!isLiveMessagingEnabled) return
  859 |     const token = getToken()
  860 |     const matchId = activeThread?.matchId || ''
  861 |     if (!token || !matchId) return
  862 |     const ws = wsRef.current
  863 |     if (!ws || ws.readyState !== WebSocket.OPEN) return
  864 |     ws.send(JSON.stringify({
  865 |       type: 'join_chat_room',
  866 |       match_id: matchId,
  867 |       token,
  868 |     }))
  869 |   }, [isLiveMessagingEnabled, activeThread?.matchId])
  870 | 
  871 |   useEffect(() => {
  872 |     const token = getToken()
  873 |     if (!token) return undefined
  874 | 
  875 |     const interval = window.setInterval(async () => {
  876 |       if (callPromptThread?.direction === 'incoming') return
  877 |       try {
  878 |         const data = await apiRequest('/calls/pending', { token })
  879 |         const invite = (data?.invites || [])[0]
  880 |         if (!invite?.call_id) return
  881 |         const from = invite?.from || {}
  882 |         setCallPromptThread({
  883 |           id: invite.match_id || invite.call_id,
  884 |           matchId: invite.match_id || '',
  885 |           callId: invite.call_id,
  886 |           name: from.name || from.email || 'Caller',
  887 |           avatar: from.avatar || '',
  888 |           senderId: from.id || '',
  889 |           verified: Boolean(from.verified),
  890 |           direction: 'incoming',
  891 |         })
  892 |       } catch {
  893 |         // silent
  894 |       }
  895 |     }, 2000)
  896 | 
  897 |     return () => window.clearInterval(interval)
  898 |   }, [callPromptThread])
  899 | 
  900 |   async function startInstantCall(thread) {
  901 |     const token = getToken()
  902 |     if (!token || !thread?.matchId) {
  903 |       setScheduleStatus('Please sign in and select a valid thread before starting a call.')
  904 |       return
  905 |     }
  906 | 
  907 |     const participantIds = new Set()
  908 |     const currentUserId = currentUser?.id || ''
  909 |     if (thread.isFriendThread) {
  910 |       const parts = String(thread.matchId || '').split(':')
  911 |       if (parts.length === 3) {
  912 |         if (parts[1]) participantIds.add(parts[1])
  913 |         if (parts[2]) participantIds.add(parts[2])
  914 |       }
  915 |     } else {
  916 |       activeMessages.forEach((message) => {
  917 |         if (message?.sender_id) participantIds.add(message.sender_id)
  918 |       })
  919 |       if (thread.senderId) participantIds.add(thread.senderId)
  920 |     }
  921 |     if (currentUserId) participantIds.delete(currentUserId)
  922 | 
  923 |     setScheduleStatus('Starting call room...')
  924 |     try {
  925 |       const result = await apiRequest('/calls/join', {
  926 |         method: 'POST',
  927 |         token,
  928 |         body: {
  929 |           match_id: thread.matchId,
  930 |           chat_thread_id: thread.matchId,
  931 |           title: `Call with ${thread.name}`,
  932 |           participant_ids: [...participantIds],
  933 |         },
  934 |       })
  935 |       const callId = result?.call?.id
  936 |       if (!callId) throw new Error('Unable to open call room')
  937 |       setScheduleStatus('Call room ready. Redirecting...')
  938 |       trackClientEvent('call_start', {
  939 |         entityType: 'call_session',
  940 |         entityId: callId,
  941 |         metadata: { match_id: thread.matchId },
  942 |       })
  943 |       navigate(`/call?callId=${encodeURIComponent(callId)}&matchId=${encodeURIComponent(thread.matchId)}`)
  944 |     } catch (err) {
  945 |       setScheduleStatus(err.message || 'Failed to start call')
  946 |     }
  947 |   }
  948 | 
  949 |   function closeCallPrompt() {
  950 |     setCallPromptThread(null)
  951 |   }
  952 | 
  953 |   async function acceptCallPrompt() {
  954 |     if (!callPromptThread) return
  955 |     const thread = callPromptThread
  956 |     setCallPromptThread(null)
  957 |     if (thread.callId) {
  958 |       navigate(`/call?callId=${encodeURIComponent(thread.callId)}&matchId=${encodeURIComponent(thread.matchId || '')}`)
  959 |       return
  960 |     }
  961 |   }
  962 | 
  963 |   async function sendAttachment(file) {
  964 |     const token = getToken()
  965 |     if (!token || !activeThread?.matchId || !file) return
  966 |     if (!canSendMessage) {
  967 |       const message = prequalHardBlocked
  968 |         ? 'AI pre-qualification requires more buyer info. Only verified suppliers can override.'
  969 |         : prequalBlocked
  970 |           ? 'AI pre-qualification flagged missing fields. Ask the buyer for details or override to send.'
  971 |           : (lockMeta?.lock_type === 'verified_first'
  972 |               ? 'This buyer request is locked by a verified supplier. Request access before sharing files.'
  973 |               : 'This conversation is locked. Request access before sharing files.')
  974 |       setNotice({ title: 'Access required', message, type: 'error' })
  975 |       return
  976 |     }
  977 | 
  978 |     setUploading(true)
  979 |     setUploadStatus('Uploading file...')
  980 |     try {
  981 |       const leadSource = consumeLeadSource()
  982 |       const formData = new FormData()
  983 |       formData.append('file', file)
  984 |       formData.append('message', draftMessage.trim())
  985 |       if (leadSource?.type) formData.append('source_type', leadSource.type)
  986 |       if (leadSource?.id) formData.append('source_id', leadSource.id)
  987 |       if (leadSource?.label) formData.append('source_label', leadSource.label)
  988 | 
  989 |       const apiBase = import.meta.env.VITE_API_URL || '/api'
  990 |       const response = await fetch(`${apiBase}/messages/${encodeURIComponent(activeThread.matchId)}/upload`, {
  991 |         method: 'POST',
  992 |         headers: {
  993 |           Authorization: `Bearer ${token}`,
  994 |         },
  995 |         body: formData,
  996 |       })
  997 | 
  998 |       const payload = await response.json().catch(() => ({}))
  999 |       if (!response.ok) throw new Error(payload.error || 'Upload failed')
 1000 | 
 1001 |       setMessagesByThread((previous) => ({
 1002 |         ...previous,
 1003 |         [activeThread.matchId]: [...(previous[activeThread.matchId] || []), payload].sort(sortByOldest),
 1004 |       }))
 1005 |       setDraftMessage('')
 1006 |       setUploadStatus('File sent.')
 1007 |       await loadInbox()
 1008 |     } catch (err) {
 1009 |       const msg = err.message || 'Unable to upload file'
 1010 |       if (msg.toLowerCase().includes('verified-only')) {
 1011 |         setNotice({
 1012 |           title: 'Verified suppliers only',
 1013 |           message: 'This buyer accepts messages only from verified suppliers. Verify your account to unlock direct access and priority visibility.',
 1014 |           type: 'error',
 1015 |         })
 1016 |       } else {
 1017 |         setUploadStatus(msg)
 1018 |       }
 1019 |     } finally {
 1020 |       setUploading(false)
 1021 |       if (fileInputRef.current) fileInputRef.current.value = ''
 1022 |     }
 1023 |   }
 1024 | 
 1025 |   function openAttachmentPreview(attachment, absoluteUrlOverride = '') {
 1026 |     const rawUrl = absoluteUrlOverride || attachment?.url || ''
 1027 |     if (!rawUrl) return
 1028 |     setPreviewAttachment({
 1029 |       url: absoluteUrlOverride ? absoluteUrlOverride : toAbsoluteAssetUrl(rawUrl),
 1030 |       name: attachment?.name || 'Attachment',
 1031 |       mimeType: attachment?.mime_type || attachment?.mimeType || '',
 1032 |     })
 1033 |   }
 1034 | 
 1035 |   function renderMessageBody(message, isOwn = false) {
 1036 |     const attachmentUrl = toAbsoluteAssetUrl(message?.attachment?.url || '')
 1037 | 
 1038 |     if (isImageMessage(message) && attachmentUrl) {
 1039 |       return (
 1040 |         <div className="space-y-1">
 1041 |           {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
 1042 |           <button
 1043 |             type="button"
 1044 |             onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
 1045 |             className="block w-full overflow-hidden rounded-xl borderless-shadow text-left transition-opacity hover:opacity-95"
 1046 |             title="View image"
 1047 |           >
 1048 |             <img src={attachmentUrl} alt={message?.attachment?.name || 'Shared image'} className="max-h-64 w-full object-cover" />
 1049 |           </button>
 1050 |           <a
 1051 |             href={attachmentUrl}
 1052 |             download={message?.attachment?.name || undefined}
 1053 |             target="_blank"
 1054 |             rel="noreferrer"
 1055 |             className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200"
 1056 |           >
 1057 |             <Download size={12} />
 1058 |             Download
 1059 |           </a>
 1060 |         </div>
 1061 |       )
 1062 |     }
 1063 | 
 1064 |     if (isVideoMessage(message) && attachmentUrl) {
 1065 |       return (
 1066 |         <div className="space-y-1">
 1067 |           {message.message ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
 1068 |           <button
 1069 |             type="button"
 1070 |             onClick={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
 1071 |             className="relative block w-full overflow-hidden rounded-xl borderless-shadow text-left"
 1072 |             title="View video"
 1073 |           >
 1074 |             <video src={attachmentUrl} muted playsInline preload="metadata" className="max-h-64 w-full object-cover" />
 1075 |             <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
 1076 |               <div className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold text-white">Play</div>
 1077 |             </div>
 1078 |           </button>
 1079 |           <a
 1080 |             href={attachmentUrl}
 1081 |             download={message?.attachment?.name || undefined}
 1082 |             target="_blank"
 1083 |             rel="noreferrer"
 1084 |             className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 underline underline-offset-2 dark:text-blue-200"
 1085 |           >
 1086 |             <Download size={12} />
 1087 |             Download
 1088 |           </a>
 1089 |         </div>
 1090 |       )
 1091 |     }
 1092 | 
 1093 |     if (message?.attachment?.url) {
 1094 |       return (
 1095 |         <div className="space-y-1">
 1096 |           {message.message && message.message !== 'Shared a file' ? <div className="mb-1"><MarkdownMessage text={message.message} /></div> : null}
 1097 |           <FileAttachmentCard
 1098 |             attachment={message?.attachment}
 1099 |             url={attachmentUrl}
 1100 |             isOwn={isOwn}
 1101 |             isLight={isLight}
 1102 |             onOpen={() => openAttachmentPreview(message?.attachment, attachmentUrl)}
 1103 |           />
 1104 |         </div>
 1105 |       )
 1106 |     }
 1107 | 
 1108 |     const firstUrl = extractFirstUrl(message?.message || '')
 1109 |     if (firstUrl) {
 1110 |       const meta = linkPreviewMeta(firstUrl)
 1111 |       return (
 1112 |         <div className="space-y-2">
 1113 |           <MarkdownMessage text={message.message} />
 1114 |           <a href={firstUrl} target="_blank" rel="noreferrer" className="block rounded-xl borderless-shadow bg-slate-50 p-2 dark:bg-black/20">
 1115 |             <div className="mb-2 h-24 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 dark:bg-[#1f2448] dark:text-[#b8bfe8]">
 1116 |               {meta.host}
 1117 |             </div>
 1118 |             <div className="text-sm font-semibold">{meta.title}</div>
 1119 |             <div className="text-xs opacity-70">{meta.description}</div>
 1120 |           </a>
 1121 |         </div>
 1122 |       )
 1123 |     }
 1124 | 
 1125 |     return <MarkdownMessage text={message.message} />
 1126 |   }
 1127 | 
 1128 |   function buildAiReplyPrompt() {
 1129 |     const threadName = activeThreadDisplayName || 'this contact'
 1130 |     const recent = activeMessages.slice(-6).map((msg) => {
 1131 |       const sender = msg.sender_id === currentUser?.id ? 'Me' : (msg.sender_name || 'Contact')
 1132 |       const text = String(msg.message || '').trim()
 1133 |       return text ? `${sender}: ${text}` : `${sender}: [attachment]`
 1134 |     }).join('\n')
 1135 | 
 1136 |     return [
 1137 |       'Draft a concise, professional reply for a B2B textile sourcing conversation.',
 1138 |       `Thread with: ${threadName}`,
 1139 |       'Recent messages:',
 1140 |       recent || '(no recent messages)',
 1141 |       'Reply guidelines: short, polite, confirm requirements, ask missing info if needed.',
 1142 |     ].join('\n')
 1143 |   }
 1144 | 
 1145 |   async function requestAiSuggestion() {
 1146 |     const token = getToken()
 1147 |     if (!token || !activeThread?.matchId) return
 1148 |     setAiSuggesting(true)
 1149 |     setAiError('')
 1150 |     try {
 1151 |       const prompt = buildAiReplyPrompt()
 1152 |       const res = await apiRequest('/assistant/ask', { method: 'POST', token, body: { question: prompt } })
 1153 |       const suggestion = res?.matched_answer || res?.answer || res?.reply || ''
 1154 |       if (!suggestion) {
 1155 |         setAiError('AI could not generate a suggestion yet.')
 1156 |       } else {
 1157 |         setDraftMessage(String(suggestion).trim())
 1158 |       }
 1159 |     } catch (err) {
 1160 |       setAiError(err.message || 'Unable to generate AI suggestion')
 1161 |     } finally {
 1162 |       setAiSuggesting(false)
 1163 |     }
 1164 |   }
 1165 | 
 1166 |   async function requestAiSummary() {
 1167 |     const token = getToken()
 1168 |     if (!token || !activeThread?.matchId) return
 1169 |     setAiSummaryLoading(true)
 1170 |     setAiSummaryError('')
 1171 |     try {
 1172 |       const res = await apiRequest('/assistant/conversation-summary', {
 1173 |         method: 'POST',
 1174 |         token,
 1175 |         body: { match_id: activeThread.matchId, force: true },
 1176 |       })
 1177 |       const summaryText = String(res?.summary || '').trim()
 1178 |       const suggested = String(res?.suggested_reply || '').trim()
 1179 |       if (!summaryText) {
 1180 |         setAiSummaryError('AI summary not available yet.')
 1181 |       } else {
 1182 |         setAiSummary({
 1183 |           text: summaryText,
 1184 |           suggestedReply: suggested,
 1185 |           updatedAt: new Date().toISOString(),
 1186 |         })
 1187 |       }
 1188 |     } catch (err) {
 1189 |       setAiSummaryError(err.message || 'Unable to generate AI summary')
 1190 |     } finally {
 1191 |       setAiSummaryLoading(false)
 1192 |     }
 1193 |   }
 1194 | 
 1195 |   async function requestNegotiationHelper() {
 1196 |     const token = getToken()
 1197 |     if (!token || !activeThread?.matchId) return
 1198 |     setAiNegotiationLoading(true)
 1199 |     setAiNegotiationError('')
 1200 |     try {
 1201 |       const res = await apiRequest('/assistant/negotiation', {
 1202 |         method: 'POST',
 1203 |         token,
 1204 |         body: { match_id: activeThread.matchId },
 1205 |       })
 1206 |       const guidance = String(res?.guidance || '').trim()
 1207 |       const suggested = String(res?.suggested_reply || '').trim()
 1208 |       if (!guidance) {
 1209 |         setAiNegotiationError('AI negotiation helper is not ready yet.')
 1210 |       } else {
 1211 |         setAiNegotiation({
 1212 |           guidance,
 1213 |           suggestedReply: suggested,
 1214 |           updatedAt: new Date().toISOString(),
 1215 |         })
 1216 |       }
 1217 |     } catch (err) {
 1218 |       setAiNegotiationError(err.message || 'Unable to generate negotiation help')
 1219 |     } finally {
 1220 |       setAiNegotiationLoading(false)
 1221 |     }
 1222 |   }
 1223 | 
 1224 |   useEffect(() => {
 1225 |     if (!policyFeedback.retryAfter || policyFeedback.retryAfter <= 0) return undefined
 1226 |     const timer = window.setInterval(() => {
 1227 |       setPolicyFeedback((prev) => ({ ...prev, retryAfter: Math.max(0, Number(prev.retryAfter || 0) - 1) }))
 1228 |     }, 1000)
 1229 |     return () => window.clearInterval(timer)
 1230 |   }, [policyFeedback.retryAfter])
 1231 | 
 1232 |   async function sendMessage() {
 1233 |     const token = getToken()
 1234 |     if (!token || !activeThread?.matchId) return
 1235 | 
 1236 |     const content = draftMessage.trim()
 1237 |     if (!content) return
 1238 |     if (!canSendMessage) {
 1239 |       const message = prequalHardBlocked
 1240 |         ? 'AI pre-qualification requires more buyer info. Only verified suppliers can override.'
 1241 |         : prequalBlocked
 1242 |           ? 'AI pre-qualification flagged missing fields. Ask the buyer for details or override to send.'
 1243 |           : (lockMeta?.lock_type === 'verified_first'
 1244 |               ? 'This buyer request is locked by a verified supplier. Request access to continue.'
 1245 |               : 'This conversation is locked by another agent. Request access to continue.')
 1246 |       setNotice({ title: 'Access required', message, type: 'error' })
 1247 |       return
 1248 |     }
 1249 | 
 1250 |     try {
 1251 |       const leadSource = consumeLeadSource()
 1252 |       const sourcePayload = leadSource?.type ? {
 1253 |         source_type: leadSource.type,
 1254 |         source_id: leadSource.id,
 1255 |         source_label: leadSource.label,
 1256 |       } : {}
 1257 |       // Optimistic local append of the user's message so UI feels instant.
 1258 |       // The server will still be the source of truth after `loadInbox()`.
 1259 |       if (isLiveMessagingEnabled && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
 1260 |         wsRef.current.send(JSON.stringify({
 1261 |           type: 'chat_message',
 1262 |           match_id: activeThread.matchId,
 1263 |           token,
 1264 |           message: content,
 1265 |           message_type: 'text',
 1266 |           ...sourcePayload,
 1267 |         }))
 1268 |       } else {
 1269 |         const created = await apiRequest(`/messages/${activeThread.matchId}`, {
 1270 |           method: 'POST',
 1271 |           token,
 1272 |           body: {
 1273 |             message: content,
 1274 |             type: 'text',
 1275 |             ...sourcePayload,
 1276 |           },
 1277 |         })
 1278 |         setMessagesByThread((previous) => ({
 1279 |           ...previous,
 1280 |           [activeThread.matchId]: [...(previous[activeThread.matchId] || []), created].sort(sortByOldest),
 1281 |         }))
 1282 |       }
 1283 | 
 1284 |       trackClientEvent('message_sent', {
 1285 |         entityType: 'chat_thread',
 1286 |         entityId: activeThread.matchId,
 1287 |         metadata: {
 1288 |           length: content.length,
 1289 |           role: currentUser?.role || '',
 1290 |         },
 1291 |       })
 1292 | 
 1293 |       // Chatbot (project.md): optionally generate an immediate "first response" from the company side.
 1294 |       // This does NOT replace the human reply; it just handles common questions and can hand off to an agent.
 1295 |       try {
 1296 |         const botRes = await apiRequest('/chatbot/reply', {
 1297 |           method: 'POST',
 1298 |           token,
 1299 |           body: { match_id: activeThread.matchId, message: content },
 1300 |         })
 1301 |         if (botRes?.reply) {
 1302 |           setMessagesByThread((previous) => ({
 1303 |             ...previous,
 1304 |             [activeThread.matchId]: [...(previous[activeThread.matchId] || []), botRes.reply].sort(sortByOldest),
 1305 |           }))
 1306 |         }
 1307 |       } catch {
 1308 |         // Silent: chatbot is best-effort and should never block messaging.
 1309 |       }
 1310 | 
 1311 |       setDraftMessage('')
 1312 |       setPolicyFeedback({ reason: '', retryAfter: 0 })
 1313 |       await loadInbox()
 1314 |     } catch (err) {
 1315 |       const msg = err.message || 'Unable to send message'
 1316 |       const retryAfter = Number(err?.details?.policy?.retry_after_seconds || err?.details?.retry_after_seconds || 0)
 1317 |       const reason = err?.details?.policy?.reason || err?.details?.reason || ''
 1318 |       if (reason || retryAfter > 0) setPolicyFeedback({ reason: reason || msg, retryAfter })
 1319 |       if (msg.toLowerCase().includes('verified-only')) {
 1320 |         setNotice({
 1321 |           title: 'Verified suppliers only',
 1322 |           message: 'This buyer accepts messages only from verified suppliers. Verify your account to unlock direct access and priority visibility.',
 1323 |           type: 'error',
 1324 |         })
 1325 |       } else {
 1326 |         setError(msg)
 1327 |       }
 1328 |     }
 1329 |   }
 1330 | 
 1331 |   async function requestAccess() {
 1332 |     const token = getToken()
 1333 |     if (!token || !activeThread?.requestId) return
 1334 |     try {
 1335 |       await apiRequest(`/conversations/${encodeURIComponent(activeThread.requestId)}/request-access`, { method: 'POST', token })
 1336 |       setNotice({ title: 'Access requested', message: 'The lock owner has been notified.', type: 'info' })
 1337 |       await loadInbox()
 1338 |     } catch (err) {
 1339 |       setNotice({ title: 'Request failed', message: err.message || 'Unable to request access', type: 'error' })
 1340 |     }
 1341 |   }
 1342 | 
 1343 |   async function grantAccess() {
 1344 |     const token = getToken()
 1345 |     if (!token || !activeThread?.requestId) return
 1346 |     const targetUserId = window.prompt('Grant access to user ID', '') || ''
 1347 |     if (!targetUserId.trim()) return
 1348 |     try {
 1349 |       await apiRequest(`/conversations/${encodeURIComponent(activeThread.requestId)}/grant`, {
 1350 |         method: 'POST',
 1351 |         token,
 1352 |         body: { target_user_id: targetUserId.trim() },
 1353 |       })
 1354 |       setNotice({ title: 'Access granted', message: `User ${targetUserId} can now join this conversation.`, type: 'info' })
 1355 |       await loadInbox()
 1356 |     } catch (err) {
 1357 |       setNotice({ title: 'Grant failed', message: err.message || 'Unable to grant access', type: 'error' })
 1358 |     }
 1359 |   }
 1360 | 
 1361 |   async function transferAccess() {
 1362 |     const token = getToken()
 1363 |     if (!token || !activeThread?.requestId) return
 1364 |     const targetUserId = window.prompt('Transfer to agent/user ID', '') || ''
 1365 |     if (!targetUserId.trim()) return
 1366 |     try {
 1367 |       await apiRequest(`/conversations/${encodeURIComponent(activeThread.requestId)}/transfer`, {
 1368 |         method: 'POST',
 1369 |         token,
 1370 |         body: { target_user_id: targetUserId.trim() },
 1371 |       })
 1372 |       setNotice({
 1373 |         title: 'Conversation transferred',
 1374 |         message: `Ownership moved to ${targetUserId}. You no longer have messaging access.`,
 1375 |         type: 'info',
 1376 |       })
 1377 |       await loadInbox()
 1378 |     } catch (err) {
 1379 |       setNotice({ title: 'Transfer failed', message: err.message || 'Unable to transfer conversation', type: 'error' })
 1380 |     }
 1381 |   }
 1382 | 
 1383 |   const activeThreadDisplayName = formatDisplayName(activeThread?.name, activeThread?.senderId || activeThread?.matchId)
 1384 |   const activeThreadInitials = getInitials(activeThreadDisplayName)
 1385 |   const activeAvatar = avatarUrl(activeThread?.avatar)
 1386 |   const visibleError = String(error || '').toLowerCase().includes('forbidden') ? '' : error
 1387 |   const todayLabel = dateDividerLabel(activeMessages[activeMessages.length - 1]?.timestamp)
 1388 | 
 1389 |   return (
 1390 |     <div
 1391 |       className="h-screen w-screen font-['Poppins',sans-serif] text-white chat-interface-container overflow-hidden"
 1392 |       style={{
 1393 |         background: theme.pageBg,
 1394 |         color: theme.textPrimary,
 1395 |       }}
 1396 |     >
 1397 |       <style>{`
 1398 |         .chat-interface-container *,
 1399 |         .chat-interface-container *:before,
 1400 |         .chat-interface-container *:after {
 1401 |           outline: none !important;
 1402 |         }
 1403 |         .chat-interface-container input::placeholder {
 1404 |           color: ${isLight ? '#94a3b8' : '#7f86ae'} !important;
 1405 |         }
 1406 |         .chat-markdown {
 1407 |           font-size: 13px;
 1408 |           line-height: 1.45;
 1409 |           color: inherit;
 1410 |           word-break: break-word;
 1411 |         }
 1412 |         .chat-markdown > :first-child { margin-top: 0; }
 1413 |         .chat-markdown > :last-child { margin-bottom: 0; }
 1414 |         .chat-markdown p { margin: 0.25rem 0; }
 1415 |         .chat-markdown h1, .chat-markdown h2, .chat-markdown h3, .chat-markdown h4, .chat-markdown h5, .chat-markdown h6 {
 1416 |           margin: 0.45rem 0 0.25rem;
 1417 |           font-weight: 800;
 1418 |           line-height: 1.25;
 1419 |         }
 1420 |         .chat-markdown h1 { font-size: 1.15rem; }
 1421 |         .chat-markdown h2 { font-size: 1.08rem; }
 1422 |         .chat-markdown h3 { font-size: 1.02rem; }
 1423 |         .chat-markdown ul, .chat-markdown ol { margin: 0.25rem 0; padding-left: 1.2rem; }
 1424 |         .chat-markdown ul { list-style: disc; }
 1425 |         .chat-markdown ol { list-style: decimal; }
 1426 |         .chat-markdown li { margin: 0.12rem 0; }
 1427 |         .chat-markdown blockquote {
 1428 |           margin: 0.35rem 0;
 1429 |           padding-left: 0.75rem;
 1430 |           box-shadow: inset 3px 0 0 ${isLight ? '#cbd5e1' : '#2f295c'};
 1431 |           color: ${isLight ? '#334155' : '#cdd2ff'};
 1432 |           opacity: ${isLight ? 0.9 : 0.95};
 1433 |         }
 1434 |         .chat-markdown code {
 1435 |           font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
 1436 |           font-size: 0.92em;
 1437 |           padding: 0.12rem 0.28rem;
 1438 |           border-radius: 0.35rem;
 1439 |           background: ${isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(0,0,0,0.35)'};
 1440 |         }
 1441 |         .chat-markdown pre {
 1442 |           margin: 0.35rem 0;
 1443 |           padding: 0.75rem;
 1444 |           border-radius: 0.85rem;
 1445 |           overflow-x: auto;
 1446 |           background: ${isLight ? '#0b1020' : 'rgba(0,0,0,0.35)'};
 1447 |           color: #e2e8f0;
 1448 |         }
 1449 |         .chat-markdown pre code {
 1450 |           padding: 0;
 1451 |           background: transparent;
 1452 |         }
 1453 |         .chat-markdown table {
 1454 |           width: 100%;
 1455 |           border-collapse: collapse;
 1456 |           margin: 0.4rem 0;
 1457 |           font-size: 12px;
 1458 |         }
 1459 |         .chat-markdown th, .chat-markdown td {
 1460 |           box-shadow: inset 0 0 0 1px ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.12)'};
 1461 |           padding: 0.35rem 0.5rem;
 1462 |         }
 1463 |         .chat-markdown th {
 1464 |           background: ${isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)'};
 1465 |           font-weight: 700;
 1466 |         }
 1467 |         .chat-markdown input[type="checkbox"] {
 1468 |           accent-color: var(--gt-blue);
 1469 |         }
 1470 |         .chat-markdown hr {
 1471 |           height: 1px;
 1472 |           box-shadow: inset 0 -1px 0 ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.12)'};
 1473 |           margin: 0.5rem 0;
 1474 |         }
 1475 |       `}</style>
 1476 |       {notice ? (
 1477 |         <div className="mx-3 mt-2 rounded-xl px-4 py-3 text-sm font-medium shadow-sm"
 1478 |           style={{ background: notice.type === 'error' ? '#fee2e2' : '#e0f2fe', color: '#0f172a' }}>
 1479 |           <div className="flex items-center justify-between gap-4">
 1480 |             <div>
 1481 |               <div className="text-[13px] font-semibold">{notice.title || 'Notice'}</div>
 1482 |               <div className="text-[12px] opacity-80">{notice.message || ''}</div>
 1483 |             </div>
 1484 |             <button onClick={() => setNotice(null)} className="text-xs font-semibold">Dismiss</button>
 1485 |           </div>
 1486 |         </div>
 1487 |       ) : null}
 1488 |       <AttachmentPreviewModal
 1489 |         open={Boolean(previewAttachment)}
 1490 |         attachment={previewAttachment}
 1491 |         onClose={() => setPreviewAttachment(null)}
 1492 |       />
 1493 |       {callPromptThread ? (
 1494 |         <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
 1495 |           <div className="w-full max-w-sm rounded-2xl borderless-shadow bg-[#14122b] p-6 text-white shadow-2xl">
 1496 |             <div className="flex items-center gap-4">
 1497 |               {callPromptThread.avatar ? (
 1498 |                 <img
 1499 |                   src={avatarUrl(callPromptThread.avatar)}
 1500 |                   alt={callPromptThread.name}
 1501 |                   className="h-16 w-16 rounded-full object-cover"
 1502 |                 />
 1503 |               ) : (
 1504 |                 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2744] text-lg font-bold">
 1505 |                   {getInitials(formatDisplayName(callPromptThread.name, callPromptThread.senderId))}
 1506 |                 </div>
 1507 |               )}
 1508 |               <div>
 1509 |                 <p className="text-sm text-slate-300">{callPromptThread.direction === 'incoming' ? 'Incoming call' : 'Calling'}</p>
 1510 |                 <p className="text-lg font-semibold">{formatDisplayName(callPromptThread.name, callPromptThread.senderId)}</p>
 1511 |                 <p className="text-xs text-slate-400">{callPromptThread.direction === 'incoming' ? 'Accept to join the call.' : 'Ready to start the call*'}</p>
 1512 |               </div>
 1513 |             </div>
 1514 |             <div className="mt-6 flex items-center justify-between gap-3">
 1515 |               <button
 1516 |                 onClick={closeCallPrompt}
 1517 |                 className="flex-1 rounded-xl borderless-shadow bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20"
 1518 |               >
 1519 |                 Decline
 1520 |               </button>
 1521 |               <button
 1522 |                 onClick={acceptCallPrompt}
 1523 |                 className="flex-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
 1524 |               >
 1525 |                 Accept
 1526 |               </button>
 1527 |             </div>
 1528 |           </div>
 1529 |         </div>
 1530 |       ) : null}
 1531 |       <div className="grid h-full w-full grid-cols-1 gap-2 p-2 md:grid-cols-[62px_1fr] lg:grid-cols-[62px_minmax(260px,22vw)_1fr] xl:grid-cols-[62px_minmax(260px,20vw)_1fr_minmax(280px,22vw)]">
 1532 |         <aside className="hidden md:flex h-full rounded-[22px] p-2 flex-col items-center justify-between py-1" style={{ background: 'transparent', boxShadow: 'none' }}>
 1533 |           <div className="space-y-2">
 1534 |             <button
 1535 |               className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[12px] shadow-none text-lg transition-colors${
 1536 |                 isLight ? 'bg-white text-orange-400 shadow-sm' : 'bg-[#171031] text-[#D4FF59]'
 1537 |               }`}
 1538 |               onClick={() => setThemeMode((value) => (value === 'light' ? 'dark' : 'light'))}
 1539 |               title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
 1540 |             >
 1541 |               {isLight ? '??' : '??'}
 1542 |             </button>
 1543 |             {CHAT_NAV_ITEMS.map((item) => {
 1544 |               const Icon = item.icon
 1545 |               const isActive = location.pathname === item.to
 1546 |               return (
 1547 |                 <Link
 1548 |                   key={item.to}
 1549 |                   to={item.to}
 1550 |                   className={`relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all${
 1551 |                     isActive
 1552 |                       ? (isLight ? 'bg-[var(--gt-blue)] text-white' : 'bg-[rgba(10,102,194,0.18)] text-[#D4FF59]')
 1553 |                       : (isLight ? 'text-slate-400 hover:bg-white hover:text-[var(--gt-blue)]' : 'bg-[#171031] text-[#8f95bb] hover:text-white')
 1554 |                   }`}
 1555 |                   title={item.label}
 1556 |                 >
 1557 |                   <Icon size={18} strokeWidth={1.5} />
 1558 |                 </Link>
 1559 |               )
 1560 |             })}
 1561 |           </div>
 1562 |           <button
 1563 |             className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors"
 1564 |             style={{ background: isLight ? '#ffffff' : theme.tileBg, color: isLight ? '#ef4444' : '#8f95bb' }}
 1565 |             onClick={() => navigate('/login')}
 1566 |             title="Logout"
 1567 |           >
 1568 |             <LogOut size={18} strokeWidth={1.5} />
 1569 |           </button>
 1570 |         </aside>
 1571 | 
 1572 |         <aside className="hidden lg:block rounded-[24px] p-5 overflow-hidden borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
 1573 |           <div className="mb-6">
 1574 |             <h2 className="text-xl font-bold tracking-tight">Messages</h2>
 1575 |             <p className="text-xs font-medium" style={{ color: theme.textMuted }}>{currentUser?.email || 'No email available'}</p>
 1576 |           </div>
 1577 | 
 1578 |           <div className="relative mb-6">
 1579 |             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
 1580 |             <input
 1581 |               className="h-11 w-full appearance-none rounded-[14px] borderless-shadow pl-10 pr-11 text-[13px] outline-none transition-all"
 1582 |               style={{ background: theme.inputBg, color: theme.textPrimary }}
 1583 |               placeholder="Search conversations..."
 1584 |               value={query}
 1585 |               onChange={(event) => setQuery(event.target.value)}
 1586 |             />
 1587 |           </div>
 1588 | 
 1589 |           <div className="mb-3 flex items-center justify-between px-1">
 1590 |             <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>Direct Messages</h3>
 1591 |             <span className="text-[10px] font-bold text-[var(--gt-blue)]">{allVisibleThreads.length}</span>
 1592 |           </div>
 1593 | 
 1594 |           <div className="h-[calc(100vh-250px)] space-y-1 overflow-auto pr-1 custom-scrollbar">
 1595 |             {loading ? <div className="p-4 text-center text-sm text-slate-400">Loading inbox...</div> : null}
 1596 |             {!loading && visibleError ? <div className="p-4 text-center text-sm text-red-400">{visibleError}</div> : null}
 1597 |             {!loading &&
 1598 |               !visibleError &&
 1599 |               [...filteredPriorityInbox, ...filteredRequests].map((thread) => {
 1600 |                 const threadName = formatDisplayName(thread.name, thread.senderId || thread.id)
 1601 |                 const isActive = activeThreadId === thread.id
 1602 |                 const hasUnread = Number(thread.unread || 0) > 0
 1603 |                 return (
 1604 |                   <button
 1605 |                     key={thread.id}
 1606 |                     className={`group w-full rounded-[16px] px-3 py-3 text-left transition-all${hasUnread && !isActive ? 'ring-1 ring-[var(--gt-blue)]/20' : ''}`}
 1607 |                     style={{ background: isActive ? theme.threadActiveBg : (hasUnread ? (isLight ? '#eef6ff' : '#1b1f3b') : 'transparent') }}
 1608 |                     onClick={() => setActiveThreadId(thread.id)}
 1609 |                   >
 1610 |                     <div className="flex items-center gap-3">
 1611 |                   <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
 1612 |                       <div className="relative flex-shrink-0">
 1613 |                         {thread.avatar ? (
 1614 |                           <img src={avatarUrl(thread.avatar)} alt={threadName} className="h-11 w-11 rounded-full object-cover shadow-sm" />
 1615 |                         ) : (
 1616 |                           <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold shadow-sm${isActive ? 'bg-[var(--gt-blue)] text-white' : 'bg-slate-100 text-slate-500'}`}>{getInitials(threadName)}</div>
 1617 |                         )}
 1618 |                         <span
 1619 |                           className="absolute bottom-0 right-0 h-3 w-3 rounded-full"
 1620 |                           style={{
 1621 |                             background: presenceStatus(thread.senderId) === 'online' ? '#22c55e' : '#94a3b8',
 1622 |                             boxShadow: `0 0 0 2px ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.18)'}`,
 1623 |                           }}
 1624 |                         />
 1625 |                       </div>
 1626 |                       <div className="min-w-0 flex-1">
 1627 |                         <div className="flex items-center justify-between gap-1">
 1628 |                           <p className={`truncate text-[14px] font-semibold${isActive ? 'text-[var(--gt-blue)]' : ''}`}>{threadName}</p>
 1629 |                           <div className="ml-2 flex flex-shrink-0 items-center gap-1">
 1630 |                             {thread.policyStatus && thread.policyStatus !== 'delivered' ? (
 1631 |                               <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">Queued</span>
 1632 |                             ) : null}
 1633 |                             {thread.policyPriority ? (
 1634 |                               <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700">{thread.policyPriority}</span>
 1635 |                             ) : null}
 1636 |                             <span className="text-[10px] font-medium text-slate-400">{formatTime(thread.timestamp)}</span>
 1637 |                           </div>
 1638 |                         </div>
 1639 |                         <div className="flex items-center justify-between gap-2">
 1640 |                           <p className={`truncate text-xs${isActive ? 'text-slate-600' : hasUnread ? 'text-slate-700' : 'text-slate-400'}`}>{thread.last || 'No messages'}</p>
 1641 |                           {hasUnread ? (
 1642 |                             <span className="min-w-[18px] rounded-full bg-[var(--gt-blue)] px-2 py-0.5 text-[10px] font-bold text-white">
 1643 |                               {thread.unread}
 1644 |                             </span>
 1645 |                           ) : null}
 1646 |                         </div>
 1647 |                       </div>
 1648 |                     </div>
 1649 |                   </button>
 1650 |                 )
 1651 |               })}
 1652 |           </div>
 1653 |         </aside>
 1654 | 
 1655 |         <main className="rounded-[24px] p-0 flex flex-col h-full overflow-hidden borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
 1656 |           {activeThread ? (
 1657 |             <>
 1658 |               <div className="flex items-center justify-between px-6 py-4 borderless-divider-b">
 1659 |                 <div className="flex items-center gap-3">
 1660 |                   <div className="relative">
 1661 |                     {activeAvatar ? (
 1662 |                       <img src={activeAvatar} alt={activeThreadDisplayName} className="h-10 w-10 rounded-full object-cover shadow-sm" />
 1663 |                     ) : (
 1664 |                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">{activeThreadInitials}</div>
 1665 |                     )}
 1666 |                     <span
 1667 |                       className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full"
 1668 |                       style={{
 1669 |                         background: presenceStatus(activeThread?.senderId) === 'online' ? '#22c55e' : '#94a3b8',
 1670 |                         boxShadow: `0 0 0 2px ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.18)'}`,
 1671 |                       }}
 1672 |                     />
 1673 |                   </div>
 1674 |                   <div>
 1675 |                     <p className="text-sm font-bold tracking-tight">{activeThreadDisplayName}</p>
 1676 |                     <p className="text-[11px] font-medium text-slate-400">
 1677 |                       {presenceStatus(activeThread?.senderId) === 'online'
 1678 |                         ? 'Online'
 1679 |                         : formatPresence(presenceLastSeen(activeThread?.senderId))}
 1680 |                     </p>
 1681 |                     {lockMeta && !activeThread?.isFriendThread ? (
 1682 |                       <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
 1683 |                         {lockStatusLabel(lockMeta, activeThread)}
 1684 |                       </span>
 1685 |                     ) : null}
 1686 |                   </div>
 1687 |                 </div>
 1688 |                 <div className="flex items-center gap-3">
 1689 |                   <Link to={activeThread?.matchId ? `/contracts?journey_match_id=${encodeURIComponent(activeThread.matchId)}` : '/contracts'} className="rounded-full bg-[#E8F3FF] px-3 py-1 text-[11px] font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Contract draft</Link>
 1690 |                   {isLockOwner ? (
 1691 |                     <button
 1692 |                       onClick={grantAccess}
 1693 |                       className="rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
 1694 |                       title="Grant access to another member"
 1695 |                     >
 1696 |                       Grant access
 1697 |                     </button>
 1698 |                   ) : null}
 1699 |                   {(isLockOwner || isAdminUser) ? (
 1700 |                     <button
 1701 |                       onClick={transferAccess}
 1702 |                       className="rounded-full borderless-shadow px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
 1703 |                       title="Transfer this conversation to another agent"
 1704 |                     >
 1705 |                       Transfer
 1706 |                     </button>
 1707 |                   ) : null}
 1708 |                   <button
 1709 |                     onClick={() => startInstantCall(activeThread)}
 1710 |                     className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50"
 1711 |                     title="Start call"
 1712 |                   >
 1713 |                     <Phone size={16} />
 1714 |                   </button>
 1715 |                   <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
 1716 |                     <Search size={16} />
 1717 |                   </button>
 1718 |                   <button className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-slate-400 transition-colors hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800/50">
 1719 |                     <EllipsisVertical size={16} />
 1720 |                   </button>
 1721 |                 </div>
 1722 |               </div>
 1723 | 
 1724 |               <div className="px-6 pb-3">
 1725 |                 <JourneyTimeline title="Journey Timeline" matchId={activeThread?.matchId || ''} />
 1726 |               </div>
 1727 | 
 1728 |               {!hasRecordedCall ? (
 1729 |                 <div className="mx-6 mt-4 rounded-xl borderless-shadow bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
 1730 |                   <div className="flex flex-wrap items-center justify-between gap-3">
 1731 |                     <span>
 1732 |                       Video calls are recommended for trust. No recorded call exists yet for this conversation.
 1733 |                     </span>
 1734 |                     <button
 1735 |                       type="button"
 1736 |                       onClick={() => startInstantCall(activeThread)}
 1737 |                       className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500"
 1738 |                     >
 1739 |                       Start call
 1740 |                     </button>
 1741 |                   </div>
 1742 |                 </div>
 1743 |               ) : null}
 1744 | 
 1745 |               <div className="flex-1 space-y-4 overflow-auto p-6 custom-scrollbar" style={{ background: isLight ? '#f8fafc' : 'transparent' }}>
 1746 |                 <div className="flex justify-center mb-6">
 1747 |                   <span className="rounded-full bg-transparent borderless-shadow px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{todayLabel}</span>
 1748 |                 </div>
 1749 |                 {activeMessages.length > 0 ? (
 1750 |                   activeMessages.map((message) => {
 1751 |                     const isOwn = message.sender_id === currentUser?.id
 1752 |                     const isBot = message?.type === 'bot' || Boolean(message?.meta?.bot)
 1753 |                     const readCutoff = activeThread?.lastReadAt ? new Date(activeThread.lastReadAt).getTime() : 0
 1754 |                     const messageTs = new Date(message.timestamp || 0).getTime()
 1755 |                     const isRead = Number.isFinite(readCutoff) && Number.isFinite(messageTs) && messageTs <= readCutoff
 1756 |                     const showReadTick = !isOwn && isRead
 1757 |                     return (
 1758 |                       <div key={message.id} className={`flex${isOwn ? 'justify-end' : 'justify-start'}`}>
 1759 |                         <div className={`group relative max-w-[80%] sm:max-w-[70%] rounded-[20px] px-4 py-3 text-[13.5px] shadow-sm transition-all ${
 1760 |                           isOwn 
 1761 |                             ? 'bg-[var(--gt-blue)] text-white rounded-br-none' 
 1762 |                             : isBot
 1763 |                               ? `${isLight ? 'bg-[#EFF6FF] ring-1 ring-[#BFDBFE]' : 'bg-[#0B1224] ring-1 ring-white/5'} rounded-bl-none`
 1764 |                               : `${isLight ? 'bg-white ring-1 ring-slate-200/70' : 'bg-[#2a2744]'} rounded-bl-none`
 1765 |                         }`} style={!isOwn ? { color: theme.textPrimary } : undefined}>
 1766 |                           {isBot ? (
 1767 |                             <div className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-[var(--gt-blue)]">
 1768 |                               AI Assistant
 1769 |                             </div>
 1770 |                           ) : null}
 1771 |                           {renderMessageBody(message, isOwn)}
 1772 |                           <div className={`mt-1 flex items-center gap-2 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-60${isOwn ? 'text-white' : 'text-slate-400'}`}>
 1773 |                             <span>{formatTime(message.timestamp)}</span>
 1774 |                             {message.policy_status && message.policy_status !== 'delivered' ? (
 1775 |                               <span className="inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">
 1776 |                                 {message.policy_status === 'needs_review' ? 'Needs review' : 'Queued'}
 1777 |                               </span>
 1778 |                             ) : null}
 1779 |                             {message.policy_priority ? (
 1780 |                               <span className="inline-flex items-center rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-600">{message.policy_priority}</span>
 1781 |                             ) : null}
 1782 |                             {showReadTick ? (
 1783 |                               <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">
 1784 |                                 ✓ Read
 1785 |                               </span>
 1786 |                             ) : null}
 1787 |                           </div>
 1788 |                         </div>
 1789 |                       </div>
 1790 |                     )
 1791 |                   })
 1792 |                 ) : (
 1793 |                   <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400 italic">No messages yet. Start the conversation!</div>
 1794 |                 )}
 1795 |               </div>
 1796 | 
 1797 |               <div className="p-4 borderless-divider-t">
 1798 |                 {isLockRestricted ? (
 1799 |                   <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
 1800 |                     <span>
 1801 |                       Conversation locked by {lockMeta?.claimed_by_name || (lockMeta?.lock_type === 'verified_first' ? 'verified supplier' : 'another agent')}.
 1802 |                     </span>
 1803 |                     <button
 1804 |                       type="button"
 1805 |                       onClick={requestAccess}
 1806 |                       className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white"
 1807 |                     >
 1808 |                       Request access
 1809 |                     </button>
 1810 |                   </div>
 1811 |                 ) : null}
 1812 |                 {prequalNeedsInfo ? (
 1813 |                   <div className="mb-3 rounded-xl borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
 1814 |                     <div className="flex flex-wrap items-center justify-between gap-2">
 1815 |                       <span>
 1816 |                         AI pre-qual flagged missing info. {prequal?.missing ? `Missing: ${prequal.missing}.` : 'Request more details before negotiating.'}
 1817 |                       </span>
 1818 |                       {prequalCanOverride ? (
 1819 |                         <button
 1820 |                           type="button"
 1821 |                           onClick={() => setPrequalOverride(true)}
 1822 |                           className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white"
 1823 |                         >
 1824 |                           Allow send anyway
 1825 |                         </button>
 1826 |                       ) : null}
 1827 |                     </div>
 1828 |                     {prequalHardBlocked ? (
 1829 |                       <div className="mt-1 text-[10px] text-amber-800">
 1830 |                         Only verified suppliers can override this pre-qualification gate.
 1831 |                       </div>
 1832 |                     ) : null}
 1833 |                   </div>
 1834 |                 ) : null}
 1835 |                 <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
 1836 |                   <span>AI Suggested Reply</span>
 1837 |                   <button
 1838 |                     type="button"
 1839 |                     onClick={requestAiSuggestion}
 1840 |                     disabled={aiSuggesting || !activeThread?.matchId}
 1841 |                     className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
 1842 |                   >
 1843 |                     {aiSuggesting ? 'Thinking...' : 'Generate'}
 1844 |                   </button>
 1845 |                 </div>
 1846 |                 {aiError ? <div className="mb-2 text-[11px] font-semibold text-rose-600">{aiError}</div> : null}
 1847 |                 <div className="relative flex items-center gap-2 rounded-[18px] p-1.5" style={{ background: theme.inputBg }}>
 1848 |                   <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50" onClick={() => fileInputRef.current?.click()} disabled={uploading || !canSendMessage}>
 1849 |                     <Plus size={20} />
 1850 |                   </button>
 1851 |                   <textarea
 1852 |                     rows={1}
 1853 |                     className="flex-1 resize-none bg-transparent px-2 py-2 text-[14px] leading-5 outline-none placeholder:text-slate-400"
 1854 |                     style={{ color: theme.textPrimary, maxHeight: 140 }}
 1855 |                     placeholder={canSendMessage ? 'Write a message...' : 'Conversation locked. Request access to reply.'}
 1856 |                     disabled={!canSendMessage}
 1857 |                     value={draftMessage}
 1858 |                     onChange={(event) => setDraftMessage(event.target.value)}
 1859 |                     onKeyDown={(event) => {
 1860 |                       if (event.key === 'Enter' && !event.shiftKey) {
 1861 |                         event.preventDefault()
 1862 |                         sendMessage()
 1863 |                       }
 1864 |                     }}
 1865 |                   />
 1866 |                   <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) sendAttachment(file) }} disabled={!canSendMessage} />
 1867 |                   <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gt-blue)] text-white shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-60" onClick={sendMessage} disabled={!canSendMessage}>
 1868 |                     <SendHorizontal size={18} />
 1869 |                   </button>
 1870 |                 </div>
 1871 |                 {policyFeedback.reason ? (
 1872 |                   <p className="mt-2 px-4 text-[11px] font-medium text-rose-500">
 1873 |                     Blocked: {policyFeedback.reason}{policyFeedback.retryAfter > 0 ? ` • Retry in ${policyFeedback.retryAfter}s` : ''}
 1874 |                   </p>
 1875 |                 ) : null}
 1876 |                 {uploadStatus || scheduleStatus ? (
 1877 |                   <p className="mt-2 px-4 text-[11px] font-medium text-[var(--gt-blue)]">{uploadStatus || scheduleStatus}</p>
 1878 |                 ) : null}
 1879 |               </div>
 1880 |             </>
 1881 |           ) : <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-4">
 1882 |                 <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center dark:bg-slate-800/30">
 1883 |                   <MessageCircle size={32} className="opacity-20" />
 1884 |                 </div>
 1885 |                 <p className="text-sm font-medium">Select a conversation to start chatting</p>
 1886 |               </div>}
 1887 |         </main>
 1888 | 
 1889 |         <aside className="hidden xl:block rounded-[24px] p-6 h-full overflow-auto borderless-shadow" style={{ background: theme.panelBg, boxShadow: theme.shadow }}>
 1890 |           {activeThread ? (
 1891 |             <>
 1892 |               <div className="mb-8 text-center">
 1893 |                 <div className="mx-auto mb-4 h-24 w-24 rounded-full shadow-md">
 1894 |                   {activeAvatar ? (
 1895 |                     <img src={activeAvatar} alt={activeThreadDisplayName} className="h-full w-full rounded-full object-cover" />
 1896 |                   ) : (
 1897 |                     <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400">{activeThreadInitials}</div>
 1898 |                   )}
 1899 |                 </div>
 1900 |                 <h3 className="text-lg font-bold tracking-tight">{activeThreadDisplayName}</h3>
 1901 |                 <p className="text-xs font-medium text-slate-400 tracking-wide">@{truncateId(activeThread.senderId || activeThread.matchId, 16)}</p>
 1902 |               </div>
 1903 | 
 1904 |               {leadLoading ? (
 1905 |                 <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800/30">
 1906 |                   Loading AI pre-qualification summary...
 1907 |                 </div>
 1908 |               ) : prequal ? (
 1909 |                 <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
 1910 |                   <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Pre-Qual Summary</p>
 1911 |                   <p className="mt-1">Score: <span className="font-semibold">{prequal.score ?? '--'}</span></p>
 1912 |                   <p className="mt-1">Missing: {prequal.missing || 'None'}</p>
 1913 |                 </div>
 1914 |               ) : null}
 1915 | 
 1916 |               <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
 1917 |                 <div className="flex items-center justify-between gap-2">
 1918 |                   <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Conversation Summary</p>
 1919 |                   <button
 1920 |                     type="button"
 1921 |                     onClick={requestAiSummary}
 1922 |                     disabled={aiSummaryLoading || !activeThread?.matchId}
 1923 |                     className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
 1924 |                   >
 1925 |                     {aiSummaryLoading ? 'Summarizing...' : 'Refresh'}
 1926 |                   </button>
 1927 |                 </div>
 1928 |                 {aiSummaryError ? <div className="mt-2 text-[10px] font-semibold text-rose-600">{aiSummaryError}</div> : null}
 1929 |                 {aiSummary?.text ? (
 1930 |                   <>
 1931 |                     <p className="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">{aiSummary.text}</p>
 1932 |                     {aiSummary.suggestedReply ? (
 1933 |                       <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiSummary.suggestedReply}</p>
 1934 |                     ) : null}
 1935 |                   </>
 1936 |                 ) : (
 1937 |                   <p className="mt-2 text-[10px] text-slate-400 italic">No summary yet.</p>
 1938 |                 )}
 1939 |               </div>
 1940 | 
 1941 |               <div className="mb-6 rounded-2xl borderless-shadow bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/30">
 1942 |                 <div className="flex items-center justify-between gap-2">
 1943 |                   <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">AI Negotiation Helper</p>
 1944 |                   <button
 1945 |                     type="button"
 1946 |                     onClick={requestNegotiationHelper}
 1947 |                     disabled={aiNegotiationLoading || !activeThread?.matchId}
 1948 |                     className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
 1949 |                   >
 1950 |                     {aiNegotiationLoading ? 'Thinking...' : 'Generate'}
 1951 |                   </button>
 1952 |                 </div>
 1953 |                 {aiNegotiationError ? <div className="mt-2 text-[10px] font-semibold text-rose-600">{aiNegotiationError}</div> : null}
 1954 |                 {aiNegotiation?.guidance ? (
 1955 |                   <>
 1956 |                     <p className="mt-2 whitespace-pre-wrap text-[11px] text-slate-700 dark:text-slate-200">{aiNegotiation.guidance}</p>
 1957 |                     {aiNegotiation.suggestedReply ? (
 1958 |                       <p className="mt-2 text-[11px] text-slate-500">Suggested reply: {aiNegotiation.suggestedReply}</p>
 1959 |                     ) : null}
 1960 |                   </>
 1961 |                 ) : (
 1962 |                   <p className="mt-2 text-[10px] text-slate-400 italic">Generate guidance for this thread.</p>
 1963 |                 )}
 1964 |               </div>
 1965 | 
 1966 |               <div className="mb-8 grid grid-cols-4 gap-3">
 1967 |                 {[
 1968 |                   { icon: Flag, title: 'Report' },
 1969 |                   { icon: Lock, title: 'Block' },
 1970 |                   { icon: Info, title: 'Info' },
 1971 |                   { icon: VolumeX, title: 'Mute' }
 1972 |                 ].map((action, i) => (
 1973 |                   <button key={i} className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70" title={action.title}>
 1974 |                     <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-transparent text-slate-400 dark:text-slate-500">
 1975 |                       <action.icon size={16} strokeWidth={2} />
 1976 |                     </div>
 1977 |                   </button>
 1978 |                 ))}
 1979 |               </div>
 1980 | 
 1981 |               <div className="space-y-4">
 1982 |                 {[
 1983 |                   { id: 'sharedDocument', label: 'Documents', count: sharedLinks.length, icon: FolderOpen },
 1984 |                   { id: 'sharedMedia', label: 'Media', count: sharedMedia.length, icon: Search },
 1985 |                   { id: 'sharedPost', label: 'Posts', count: sharedPosts.length, icon: Home }
 1986 |                 ].map((section) => (
 1987 |                   <div key={section.id} className="overflow-hidden rounded-[18px] borderless-shadow">
 1988 |                     <button 
 1989 |                       className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50" 
 1990 |                       style={{ background: isLight ? '#f8fafc' : '#101328', color: theme.textMuted }}
 1991 |                       onClick={() => setAccordionState(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
 1992 |                     >
 1993 |                       <div className="flex items-center gap-2">
 1994 |                         <section.icon size={14} className="opacity-50" />
 1995 |                         <span>{section.label} <span className="ml-1 opacity-50">({section.count})</span></span>
 1996 |                       </div>
 1997 |                       {accordionState[section.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
 1998 |                     </button>
 1999 |                     {accordionState[section.id] && (
 2000 |                       <div className="p-3 bg-white dark:bg-transparent">
 2001 |                         {section.id === 'sharedDocument' && (
 2002 |                           <div className="space-y-2">
 2003 |                             {sharedLinks.length > 0 ? sharedLinks.map(item => {
 2004 |                               const url = toAbsoluteAssetUrl(item.attachment?.url || '')
 2005 |                               return (
 2006 |                                 <button
 2007 |                                   key={item.id}
 2008 |                                   type="button"
 2009 |                                   onClick={() => openAttachmentPreview(item.attachment, url)}
 2010 |                                   className="flex w-full items-center gap-2 rounded-xl borderless-shadow bg-slate-50/50 p-2.5 text-left text-[11px] font-medium transition-colors dark:bg-slate-800/30"
 2011 |                                   title="Preview"
 2012 |                                 >
 2013 |                                   <div className="h-6 w-6 rounded bg-white flex items-center justify-center shadow-xs dark:bg-slate-700"><Plus size={12} className="opacity-30" /></div>
 2014 |                                   <span className="truncate flex-1">{item.attachment?.name || 'File'}</span>
 2015 |                                 </button>
 2016 |                               )
 2017 |                             }) : <p className="text-[10px] text-slate-400 italic text-center py-2">No documents shared</p>}
 2018 |                           </div>
 2019 |                         )}
 2020 |                         {section.id === 'sharedMedia' && (
 2021 |                           <div className="grid grid-cols-3 gap-1.5">
 2022 |                             {sharedMedia.length > 0 ? sharedMedia.slice(0, 6).map(item => {
 2023 |                               const url = toAbsoluteAssetUrl(item.attachment?.url || '')
 2024 |                               const isVideo = isVideoMessage(item)
 2025 |                               return (
 2026 |                                 <button
 2027 |                                   key={item.id}
 2028 |                                   type="button"
 2029 |                                   onClick={() => openAttachmentPreview(item.attachment, url)}
 2030 |                                   className="relative aspect-square overflow-hidden rounded-lg"
 2031 |                                   title="View"
 2032 |                                 >
 2033 |                                   {isVideo ? (
 2034 |                                     <>
 2035 |                                       <video src={url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
 2036 |                                       <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
 2037 |                                         <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white">Play</div>
 2038 |                                       </div>
 2039 |                                     </>
 2040 |                                   ) : (
 2041 |                                     <img src={url} alt="" className="h-full w-full object-cover transition-transform hover:scale-110" />
 2042 |                                   )}
 2043 |                                 </button>
 2044 |                               )
 2045 |                             }) : <p className="col-span-3 text-[10px] text-slate-400 italic text-center py-2">No media shared</p>}
 2046 |                           </div>
 2047 |                         )}
 2048 |                         {section.id === 'sharedPost' && (
 2049 |                           <div className="space-y-2">
 2050 |                             {sharedPosts.length > 0 ? sharedPosts.map(item => (
 2051 |                               <div key={item.id} style={{ background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.03)' }}>
 2052 |                                 <p className="line-clamp-2 leading-relaxed opacity-80">{item.message}</p>
 2053 |                               </div>
 2054 |                             )) : <p className="text-[10px] text-slate-400 italic text-center py-2">No posts shared</p>}
 2055 |                           </div>
 2056 |                         )}
 2057 |                       </div>
 2058 |                     )}
 2059 |                   </div>
 2060 |                 ))}
 2061 |               </div>
 2062 |             </>
 2063 |           ) : <div className="flex h-full flex-col items-center justify-center text-slate-400 text-xs italic">Details will appear here</div>}
 2064 |         </aside>
 2065 |       </div>
 2066 |     </div>
 2067 |   )
 2068 | }
 2069 | 
 2070 | 