    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { moderateTextOrRedact } from './policyService.js'
    5 | import { createReport } from './reportService.js'
    6 | import { createNotification } from './notificationService.js'
    7 | import { getRequirementById } from './requirementService.js'
    8 | 
    9 | const FILE = 'social_interactions.json'
   10 | 
   11 | export async function addComment(user, entityType, entityId, text, parentId = '') {
   12 |   const all = await readJson(FILE)
   13 |   let safeText = sanitizeString(text, 800)
   14 |   const safeParentId = sanitizeString(parentId, 120)
   15 |   let parent = null
   16 |   let rootId = ''
   17 |   let depth = 0
   18 | 
   19 |   try {
   20 |     const moderated = await moderateTextOrRedact({
   21 |       actor: user,
   22 |       text: safeText,
   23 |       entity_type: 'comment',
   24 |       entity_id: `${sanitizeString(entityType, 60)}:${sanitizeString(entityId, 120)}`,
   25 |     })
   26 |     safeText = moderated.text
   27 |   } catch {
   28 |     // silent
   29 |   }
   30 | 
   31 |   if (safeParentId) {
   32 |     parent = all.find((row) => row.id === safeParentId && row.interaction_type === 'comment')
   33 |     if (!parent) {
   34 |       const err = new Error('Parent comment not found')
   35 |       err.status = 400
   36 |       throw err
   37 |     }
   38 |     if (parent.entity_type !== sanitizeString(entityType, 60) || parent.entity_id !== sanitizeString(entityId, 120)) {
   39 |       const err = new Error('Parent comment must belong to the same entity')
   40 |       err.status = 400
   41 |       throw err
   42 |     }
   43 | 
   44 |     const visited = new Set()
   45 |     let cursor = parent
   46 |     while (cursor?.parent_id) {
   47 |       if (visited.has(cursor.parent_id)) {
   48 |         const err = new Error('Invalid parent chain detected')
   49 |         err.status = 400
   50 |         throw err
   51 |       }
   52 |       visited.add(cursor.parent_id)
   53 |       cursor = all.find((row) => row.id === cursor.parent_id && row.interaction_type === 'comment')
   54 |     }
   55 | 
   56 |     rootId = parent.root_id || parent.id
   57 |     depth = Math.max(Number(parent.depth || 0) + 1, 1)
   58 |   }
   59 | 
   60 |   const row = {
   61 |     id: crypto.randomUUID(),
   62 |     interaction_type: 'comment',
   63 |     entity_type: sanitizeString(entityType, 60),
   64 |     entity_id: sanitizeString(entityId, 120),
   65 |     actor_id: user.id,
   66 |     actor_name: user.name,
   67 |     actor_verified: Boolean(user.verified),
   68 |     text: safeText,
   69 |     parent_id: safeParentId || '',
   70 |     root_id: rootId,
   71 |     depth,
   72 |     created_at: new Date().toISOString(),
   73 |   }
   74 |   if (!row.root_id) {
   75 |     row.root_id = row.id
   76 |     row.depth = 0
   77 |   }
   78 |   all.push(row)
   79 |   await writeJson(FILE, all)
   80 | 
   81 |   if (String(entityType || '').toLowerCase() === 'buyer_request') {
   82 |     try {
   83 |       const requirement = await getRequirementById(entityId)
   84 |       const users = await readJson('users.json')
   85 |       const category = String(requirement?.category || '').toLowerCase()
   86 |       const industry = String(requirement?.industry || '').toLowerCase()
   87 |       const targets = users.filter((u) => {
   88 |         const role = String(u?.role || '').toLowerCase()
   89 |         if (!u?.verified) return false
   90 |         if (!(role === 'factory' || role === 'buying_house')) return false
   91 |         if (!category && !industry) return true
   92 |         const profile = u?.profile || {}
   93 |         const categories = Array.isArray(profile?.categories) ? profile.categories.map((c) => String(c || '').toLowerCase()) : []
   94 |         const profileIndustry = String(profile?.industry || '').toLowerCase()
   95 |         return (category && categories.includes(category)) || (industry && profileIndustry === industry)
   96 |       })
   97 |       await Promise.all(targets.map((target) => createNotification(target.id, {
   98 |         type: 'buyer_request_comment',
   99 |         entity_type: 'buyer_request',
  100 |         entity_id: entityId,
  101 |         message: `New comment on buyer request "${requirement?.title || requirement?.category || 'Request'}".`,
  102 |         meta: {
  103 |           request_id: entityId,
  104 |           category: requirement?.category || '',
  105 |           industry: requirement?.industry || '',
  106 |           actor_id: user?.id,
  107 |           comment_id: row.id,
  108 |         },
  109 |       })))
  110 |     } catch {
  111 |       // non-blocking
  112 |     }
  113 |   }
  114 | 
  115 |   return row
  116 | }
  117 | 
  118 | export async function addAction(user, entityType, entityId, action, reason = '') {
  119 |   const all = await readJson(FILE)
  120 |   const row = {
  121 |     id: crypto.randomUUID(),
  122 |     interaction_type: action,
  123 |     entity_type: sanitizeString(entityType, 60),
  124 |     entity_id: sanitizeString(entityId, 120),
  125 |     actor_id: user.id,
  126 |     actor_name: user.name,
  127 |     actor_verified: Boolean(user.verified),
  128 |     text: sanitizeString(reason, 800),
  129 |     created_at: new Date().toISOString(),
  130 |   }
  131 |   all.push(row)
  132 |   await writeJson(FILE, all)
  133 | 
  134 |   if (String(action || '').toLowerCase() === 'report') {
  135 |     await createReport({
  136 |       actor: user,
  137 |       entity_type: sanitizeString(entityType, 60),
  138 |       entity_id: sanitizeString(entityId, 120),
  139 |       reason: reason || 'Reported content',
  140 |       metadata: { interaction_id: row.id },
  141 |     })
  142 |   }
  143 | 
  144 |   return row
  145 | }
  146 | 
  147 | export async function listInteractions(entityType, entityId) {
  148 |   const all = await readJson(FILE)
  149 |   const rows = all.filter((x) => x.entity_type === entityType && x.entity_id === entityId)
  150 |   const comments = rows
  151 |     .filter((x) => x.interaction_type === 'comment')
  152 |     .map((comment) => {
  153 |       if (!comment.parent_id) {
  154 |         return {
  155 |           ...comment,
  156 |           root_id: comment.root_id || comment.id,
  157 |           depth: Number.isFinite(Number(comment.depth)) ? Number(comment.depth) : 0,
  158 |         }
  159 |       }
  160 |       return {
  161 |         ...comment,
  162 |         root_id: comment.root_id || comment.parent_id || comment.id,
  163 |         depth: Number.isFinite(Number(comment.depth)) ? Number(comment.depth) : 1,
  164 |       }
  165 |     })
  166 |   return {
  167 |     comments,
  168 |     share_count: rows.filter((x) => x.interaction_type === 'share').length,
  169 |     report_count: rows.filter((x) => x.interaction_type === 'report').length,
  170 |   }
  171 | }
  172 | 