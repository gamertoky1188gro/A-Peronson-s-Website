    1 | import { findUserById } from './userService.js'
    2 | import { getVerification, getVerificationPublicSummary } from './verificationService.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { readJson } from '../utils/jsonStore.js'
    5 | import { listProducts } from './productService.js'
    6 | 
    7 | const CONNECTION_FILE = 'user_connections.json'
    8 | const REQUIREMENTS_FILE = 'requirements.json'
    9 | const PRODUCTS_FILE = 'company_products.json'
   10 | const PARTNER_REQUESTS_FILE = 'partner_requests.json'
   11 | 
   12 | function cleanUserPublic(user) {
   13 |   if (!user) return null
   14 |   const profile = user.profile || {}
   15 | 
   16 |   return {
   17 |     id: user.id,
   18 |     name: user.name,
   19 |     role: user.role,
   20 |     verified: Boolean(user.verified),
   21 |     subscription_status: user.subscription_status || 'free',
   22 |     created_at: user.created_at || '',
   23 |     profile: {
   24 |       country: profile.country || '',
   25 |       industry: profile.industry || '',
   26 |       organization_name: profile.organization_name || profile.organization || '',
   27 |       profile_image: profile.profile_image || '',
   28 |       certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
   29 |       monthly_capacity: profile.monthly_capacity || '',
   30 |       moq: profile.moq || '',
   31 |       lead_time_days: profile.lead_time_days || '',
   32 |       about: sanitizeString(profile.about || '', 1200),
   33 |       tags: Array.isArray(profile.tags) ? profile.tags : [],
   34 |     },
   35 |     flags: {
   36 |       has_bank_proof: Boolean(profile.bank_proof),
   37 |       has_export_license: Boolean(profile.export_license),
   38 |     },
   39 |   }
   40 | }
   41 | 
   42 | function connectionSnapshot(connections, viewerId, targetId) {
   43 |   const following = connections.some((row) => row.type === 'follow' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'active')
   44 | 
   45 |   const friends = connections.some((row) => {
   46 |     const samePair = (row.requester_id === viewerId && row.receiver_id === targetId) || (row.requester_id === targetId && row.receiver_id === viewerId)
   47 |     if (!samePair) return false
   48 |     const status = String(row.status || '').toLowerCase()
   49 |     if (row.type === 'friend' && ['active', 'accepted'].includes(status)) return true
   50 |     if (row.type === 'friend_request' && ['active', 'accepted'].includes(status)) return true
   51 |     return false
   52 |   })
   53 | 
   54 |   if (friends) return { following, friend_status: 'friends' }
   55 | 
   56 |   const outgoingPending = connections.some((row) => row.type === 'friend_request' && row.requester_id === viewerId && row.receiver_id === targetId && row.status === 'pending')
   57 |   if (outgoingPending) return { following, friend_status: 'requested' }
   58 | 
   59 |   const incomingPending = connections.some((row) => row.type === 'friend_request' && row.requester_id === targetId && row.receiver_id === viewerId && row.status === 'pending')
   60 |   if (incomingPending) return { following, friend_status: 'incoming' }
   61 | 
   62 |   return { following, friend_status: 'none' }
   63 | }
   64 | 
   65 | function sortNewest(a, b) {
   66 |   return String(b.created_at || '').localeCompare(String(a.created_at || ''))
   67 | }
   68 | 
   69 | export async function getProfileOverview(viewerId, profileUserId) {
   70 |   const user = await findUserById(profileUserId)
   71 |   if (!user) return 'not_found'
   72 | 
   73 |   const viewer = viewerId ? await findUserById(viewerId) : null
   74 |   const isAdmin = Boolean(viewer && ['admin', 'owner'].includes(viewer.role))
   75 | 
   76 |   const [connections, requirements, products, partnerRequests] = await Promise.all([
   77 |     readJson(CONNECTION_FILE),
   78 |     readJson(REQUIREMENTS_FILE),
   79 |     readJson(PRODUCTS_FILE),
   80 |     readJson(PARTNER_REQUESTS_FILE),
   81 |   ])
   82 | 
   83 |   const safeUser = cleanUserPublic(user)
   84 |   const relationship = viewerId === profileUserId ? { following: false, friend_status: 'self' } : connectionSnapshot(connections, viewerId, profileUserId)
   85 | 
   86 |   const verificationRecord = await getVerification(profileUserId)
   87 |   const verification_summary = getVerificationPublicSummary(user, verificationRecord)
   88 | 
   89 |   const counts = {
   90 |     requests: requirements.filter((r) => r.buyer_id === profileUserId).length,
   91 |     products: products.filter((p) => p.company_id === profileUserId).length,
   92 |     connected_factories: null,
   93 |   }
   94 | 
   95 |   if (user.role === 'buying_house') {
   96 |     const connected = partnerRequests.filter((r) => r.status === 'connected' && (r.requester_id === profileUserId || r.target_id === profileUserId))
   97 |     counts.connected_factories = connected.length
   98 |   }
   99 | 
  100 |   return {
  101 |     user: safeUser,
  102 |     rating_key: `user:${profileUserId}`,
  103 |     relationship,
  104 |     verification_summary,
  105 |     counts,
  106 |     viewer_permissions: {
  107 |       is_self: viewerId === profileUserId,
  108 |       is_admin: isAdmin,
  109 |     },
  110 |   }
  111 | }
  112 | 
  113 | export async function getProfileRequestsPage(_viewerId, profileUserId, { cursor = 0, limit = 12 } = {}) {
  114 |   const user = await findUserById(profileUserId)
  115 |   if (!user) return 'not_found'
  116 |   if (user.role !== 'buyer') return 'invalid_role'
  117 | 
  118 |   const requirements = await readJson(REQUIREMENTS_FILE)
  119 |   const all = requirements.filter((r) => r.buyer_id === profileUserId).sort(sortNewest)
  120 |   const pageItems = all.slice(cursor, cursor + limit)
  121 |   const nextCursor = cursor + limit < all.length ? cursor + limit : null
  122 | 
  123 |   return { items: pageItems, cursor, next_cursor: nextCursor, total: all.length }
  124 | }
  125 | 
  126 | export async function getProfileProductsPage(_viewerId, profileUserId, { cursor = 0, limit = 12 } = {}) {
  127 |   const user = await findUserById(profileUserId)
  128 |   if (!user) return 'not_found'
  129 |   if (!['factory', 'buying_house'].includes(user.role)) return 'invalid_role'
  130 | 
  131 |   const viewer = _viewerId ? await findUserById(_viewerId) : null
  132 |   const isAdmin = viewer && ['admin', 'owner'].includes(viewer.role)
  133 |   const includeDrafts = _viewerId === profileUserId || isAdmin
  134 | 
  135 |   const products = await listProducts({
  136 |     companyId: profileUserId,
  137 |     includeDrafts,
  138 |     viewerId: viewer?.id || '',
  139 |     viewerRole: viewer?.role || '',
  140 |   })
  141 |   const all = products.sort(sortNewest)
  142 |   const pageItems = all.slice(cursor, cursor + limit)
  143 |   const nextCursor = cursor + limit < all.length ? cursor + limit : null
  144 | 
  145 |   return { items: pageItems, cursor, next_cursor: nextCursor, total: all.length }
  146 | }
  147 | 
  148 | export async function getProfilePartnerNetworkSummary(viewerId, profileUserId) {
  149 |   const user = await findUserById(profileUserId)
  150 |   if (!user) return 'not_found'
  151 |   if (user.role !== 'buying_house') return 'invalid_role'
  152 | 
  153 |   const [requests, users] = await Promise.all([readJson(PARTNER_REQUESTS_FILE), readJson('users.json')])
  154 |   const usersById = new Map(users.map((u) => [u.id, u]))
  155 | 
  156 |   const connected = requests.filter((r) => r.status === 'connected' && (r.requester_id === profileUserId || r.target_id === profileUserId))
  157 |   const factories = connected
  158 |     .map((r) => (r.requester_id === profileUserId ? r.target_id : r.requester_id))
  159 |     .map((id) => usersById.get(id))
  160 |     .filter((u) => u && u.role === 'factory')
  161 |     .map((u) => ({ id: u.id, name: u.name, verified: Boolean(u.verified) }))
  162 | 
  163 |   const viewer = usersById.get(viewerId)
  164 |   const isAdmin = viewer && ['admin', 'owner'].includes(viewer.role)
  165 |   const showList = viewerId === profileUserId || isAdmin
  166 | 
  167 |   if (!showList) {
  168 |     return { total_connected: factories.length }
  169 |   }
  170 | 
  171 |   return { total_connected: factories.length, factories }
  172 | }
  173 | 