    1 | /*
    2 |   Route: /contracts
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
   13 |     - Provide the "Contract Vault" experience (secure documents + signing workflow visibility).
   14 |     - Filter contracts by state (All/Draft/Pending/Signed/Archived) with animated tab indicator.
   15 |     - Show contract details, signature status, and downloadable artifacts.
   16 | 
   17 |   Key API endpoints (high level):
   18 |     - GET /api/contracts (list)
   19 |     - GET /api/contracts/:id (details)
   20 |     - POST/PATCH for signing/finalizing/archiving (actions depend on role)
   21 | 
   22 |   Major UI/UX patterns:
   23 |     - Secure grid background inside the vault area (visual cue for confidentiality).
   24 |     - Shortcut hint on search (Ctrl/⌘ + K style) where applicable.
   25 |     - Skeleton shimmer for list/detail while loading.
   26 | */
   27 | import React, { useEffect, useMemo, useRef, useState } from 'react'
   28 | import { Link, useLocation } from 'react-router-dom'
   29 | import { motion, useReducedMotion } from 'framer-motion'
   30 | import AccessDeniedState from '../components/AccessDeniedState'
   31 | import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
   32 | import { trackClientEvent } from '../lib/events'
   33 | import JourneyTimeline from '../components/JourneyTimeline'
   34 | 
   35 | const Motion = motion
   36 | 
   37 | function toLabel(status) {
   38 |   // Map backend status -> readable label for UI chips.
   39 |   switch (status) {
   40 |     case 'draft':
   41 |       return 'Draft'
   42 |     case 'pending_signature':
   43 |       return 'Pending signatures'
   44 |     case 'signed':
   45 |       return 'Signed'
   46 |     case 'archived':
   47 |       return 'Archived'
   48 |     default:
   49 |       return 'Pending signatures'
   50 |   }
   51 | }
   52 | 
   53 | function statusClass(status) {
   54 |   // Chip styling for contract status pills (light mode defaults; dark mode handled by parent surfaces).
   55 |   if (status === 'signed') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
   56 |   if (status === 'draft') return 'bg-slate-50 text-slate-700 ring-slate-200'
   57 |   if (status === 'archived') return 'bg-slate-100 text-slate-700 ring-slate-300'
   58 |   return 'bg-amber-50 text-amber-700 ring-amber-200'
   59 | }
   60 | 
   61 | function resolveDownloadUrl(pdfPath) {
   62 |   // Normalize relative file paths returned by the backend into an absolute URL.
   63 |   if (!pdfPath) return ''
   64 |   if (pdfPath.startsWith('http://') || pdfPath.startsWith('https://')) return pdfPath
   65 |   const baseOrigin = API_BASE.replace(/\/api\/*$/, '')
   66 |   return `${baseOrigin}${pdfPath.startsWith('/') ? '' : '/'}${pdfPath}`
   67 | }
   68 | 
   69 | function isOwnerLevel(user) {
   70 |   return user?.role === 'owner' || user?.role === 'admin'
   71 | }
   72 | 
   73 | function canCreateDraft(user) {
   74 |   if (!user?.role) return false
   75 |   return ['owner', 'admin', 'buying_house', 'factory'].includes(user.role)
   76 | }
   77 | 
   78 | function canViewBankingReferences(user, contract) {
   79 |   if (!user || !contract) return false
   80 |   if (isOwnerLevel(user)) return true
   81 |   const uid = String(user.id || '')
   82 |   return uid && (uid === String(contract.uploaded_by) || uid === String(contract.buyer_id) || uid === String(contract.factory_id))
   83 | }
   84 | 
   85 | function safeDash(value) {
   86 |   const text = String(value || '').trim()
   87 |   return text ? text : '\u2014'
   88 | }
   89 | 
   90 | function maskValue(value) {
   91 |   const text = String(value || '').trim()
   92 |   if (!text) return '\u2014'
   93 |   if (text.length <= 4) return '\u2022\u2022\u2022\u2022'
   94 |   return `${text.slice(0, 2)}\u2022\u2022\u2022\u2022${text.slice(-2)}`
   95 | }
   96 | 
   97 | function computeFlow(contract) {
   98 |   const buyerSigned = contract?.buyer_signature_state === 'signed'
   99 |   const factorySigned = contract?.factory_signature_state === 'signed'
  100 |   const hasPdf = Boolean(contract?.artifact?.generated_at && contract?.artifact?.pdf_path)
  101 |   const locked = contract?.artifact?.status === 'locked'
  102 |   const archived = contract?.artifact?.status === 'archived' || Boolean(contract?.archived_at)
  103 |   const draftComplete = !contract?.is_draft
  104 | 
  105 |   const blockers = []
  106 |   if (!buyerSigned) blockers.push('Buyer signature pending')
  107 |   if (!factorySigned) blockers.push('Factory signature pending')
  108 |   if (buyerSigned && factorySigned && !hasPdf) blockers.push('PDF generation pending')
  109 |   if (hasPdf && !locked) blockers.push('Lock pending')
  110 |   if (locked && !archived) blockers.push('Archive pending')
  111 | 
  112 |   const stepState = {
  113 |     draft_creation: draftComplete,
  114 |     buyer_signature: buyerSigned,
  115 |     factory_signature: factorySigned,
  116 |     artifact_finalize: locked,
  117 |     archive: archived,
  118 |   }
  119 | 
  120 |   const nextAction = blockers[0] || 'Complete'
  121 |   return { stepState, hasPdf, locked, archived, blockers, nextAction }
  122 | }
  123 | 
  124 | function canBuyerSign(user, contract) {
  125 |   if (!user || !contract) return false
  126 |   return isOwnerLevel(user) || (user.role === 'buyer' && String(user.id) === String(contract.buyer_id))
  127 | }
  128 | 
  129 | function canFactorySign(user, contract) {
  130 |   if (!user || !contract) return false
  131 |   return isOwnerLevel(user) || (user.role === 'factory' && String(user.id) === String(contract.factory_id))
  132 | }
  133 | 
  134 | function canFinalizeArtifact(user, contract) {
  135 |   if (!user || !contract) return false
  136 |   if (isOwnerLevel(user)) return true
  137 |   return String(user.id) === String(contract.uploaded_by)
  138 | }
  139 | 
  140 | function canArchive(user, contract) {
  141 |   if (!user || !contract) return false
  142 |   return isOwnerLevel(user) || String(user.id) === String(contract.uploaded_by)
  143 | }
  144 | 
  145 | function actionBlockers(user, contract) {
  146 |   const buyerSigned = contract?.buyer_signature_state === 'signed'
  147 |   const factorySigned = contract?.factory_signature_state === 'signed'
  148 |   const hasPdf = Boolean(contract?.artifact?.generated_at && contract?.artifact?.pdf_hash && contract?.artifact?.pdf_path)
  149 |   const locked = contract?.artifact?.status === 'locked'
  150 |   const archived = contract?.artifact?.status === 'archived'
  151 | 
  152 |   const blockers = {
  153 |     buyerSign: '',
  154 |     factorySign: '',
  155 |     lock: '',
  156 |     archive: '',
  157 |   }
  158 | 
  159 |   if (!canBuyerSign(user, contract)) blockers.buyerSign = 'Only owner/admin or the assigned buyer can sign.'
  160 |   else if (buyerSigned) blockers.buyerSign = 'Already signed.'
  161 | 
  162 |   if (!canFactorySign(user, contract)) blockers.factorySign = 'Only owner/admin or the assigned factory can sign.'
  163 |   else if (factorySigned) blockers.factorySign = 'Already signed.'
  164 | 
  165 |   if (!canFinalizeArtifact(user, contract)) blockers.lock = 'Only owner/admin or the draft uploader can lock the PDF.'
  166 |   else if (!buyerSigned || !factorySigned) blockers.lock = 'Both signatures are required first.'
  167 |   else if (!hasPdf) blockers.lock = 'PDF is not generated yet (generated automatically after both signatures).'
  168 |   else if (locked) blockers.lock = 'Already locked.'
  169 | 
  170 |   if (!canArchive(user, contract)) blockers.archive = 'Only owner/admin or the draft uploader can archive.'
  171 |   else if (!hasPdf) blockers.archive = 'Generate PDF first.'
  172 |   else if (!locked) blockers.archive = 'Lock the PDF first.'
  173 |   else if (archived) blockers.archive = 'Already archived.'
  174 | 
  175 |   return blockers
  176 | }
  177 | 
  178 | function StepPill({ done, label }) {
  179 |   return (
  180 |     <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1${done ? 'bg-[#E8F3FF] text-[#0A66C2] ring-[#BBD8FF]' : 'bg-white text-slate-600 ring-slate-200'}`}>
  181 |       <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full${done ? 'bg-[#0A66C2] text-white' : 'bg-slate-100 text-slate-500'}`}>
  182 |         {done ? '\u2713' : '\u2022'}
  183 |       </span>
  184 |       <span>{label}</span>
  185 |     </div>
  186 |   )
  187 | }
  188 | 
  189 | function ContractRow({ contract, active, onSelect }) {
  190 |   const status = contract.lifecycle_status || 'pending_signature'
  191 |   const flow = computeFlow(contract)
  192 |   return (
  193 |     <button
  194 |       type="button"
  195 |       onClick={onSelect}
  196 |       className={`w-full rounded-2xl p-4 text-left transition ring-1${active ? 'bg-indigo-50/60 text-slate-900 ring-indigo-200 shadow-sm dark:bg-white/5 dark:text-slate-100 dark:ring-[#38bdf8]/35' : 'bg-white text-slate-900 ring-slate-200/70 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:ring-slate-800 dark:hover:bg-white/5'}`}
  197 |     >
  198 |       <div className="flex items-start justify-between gap-4">
  199 |         <div className="min-w-0">
  200 |           <div className="flex items-center gap-2">
  201 |             <div className="truncate text-sm font-semibold text-slate-900">{contract.contract_number || contract.id}</div>
  202 |             <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1${statusClass(status)}`}>
  203 |               {toLabel(status)}
  204 |             </span>
  205 |           </div>
  206 |           <div className="mt-1 truncate text-xs text-slate-600">{safeDash(contract.title)}</div>
  207 |           <div className="mt-2 text-xs text-slate-600">
  208 |             <span className="font-semibold text-slate-700">Buyer:</span> {safeDash(contract.buyer_name)} <span className="mx-1">-</span>
  209 |             <span className="font-semibold text-slate-700">Factory:</span> {safeDash(contract.factory_name)}
  210 |           </div>
  211 |         </div>
  212 | 
  213 |         <div className="shrink-0 text-right text-xs text-slate-600">
  214 |           <div>{(contract.updated_at || contract.created_at || '').slice(0, 10) || '\u2014'}</div>
  215 |           <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
  216 |             Next: {flow.nextAction}
  217 |           </div>
  218 |         </div>
  219 |       </div>
  220 | 
  221 |       <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
  222 |         <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Buyer: {contract.buyer_signature_state || 'pending'}</span>
  223 |         <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">Factory: {contract.factory_signature_state || 'pending'}</span>
  224 |         <span className="inline-flex items-center rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">PDF: {flow.hasPdf ? 'ready' : 'pending'}</span>
  225 |       </div>
  226 |     </button>
  227 |   )
  228 | }
  229 | 
  230 | function Drawer({ open, onClose, children }) {
  231 |   if (!open) return null
  232 |   return (
  233 |     <div className="fixed inset-0 z-50 lg:hidden">
  234 |       <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
  235 |       <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl">
  236 |         <div className="mb-4 flex items-center justify-between">
  237 |           <div className="text-sm font-semibold text-slate-900">Contract details</div>
  238 |           <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
  239 |         </div>
  240 |         {children}
  241 |       </div>
  242 |     </div>
  243 |   )
  244 | }
  245 | 
  246 | export default function ContractVault() {
  247 |   const location = useLocation()
  248 |   const journeyParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  249 |   const currentUser = useMemo(() => getCurrentUser(), [])
  250 |   const reduceMotion = useReducedMotion()
  251 |   const [loadingContracts, setLoadingContracts] = useState(true)
  252 |   const searchRef = useRef(null)
  253 |   const isMac = useMemo(() => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])
  254 |   const [contracts, setContracts] = useState([])
  255 |   const [selectedId, setSelectedId] = useState('')
  256 |   const [drawerOpen, setDrawerOpen] = useState(false)
  257 |   const [error, setError] = useState('')
  258 |   const [forbidden, setForbidden] = useState(false)
  259 |   const [saving, setSaving] = useState(false)
  260 |   const [actionError, setActionError] = useState('')
  261 |   const [paymentProofs, setPaymentProofs] = useState([])
  262 |   const [paymentLoading, setPaymentLoading] = useState(false)
  263 |   const [paymentNotice, setPaymentNotice] = useState('')
  264 |   const [auditLog, setAuditLog] = useState([])
  265 |   const [auditLoading, setAuditLoading] = useState(false)
  266 |   const [auditError, setAuditError] = useState('')
  267 |   const [paymentForm, setPaymentForm] = useState({
  268 |     type: 'bank_transfer',
  269 |     transaction_reference: '',
  270 |     bank_name: '',
  271 |     sender_account_name: '',
  272 |     receiver_account_name: '',
  273 |     transaction_date: '',
  274 |     amount: '',
  275 |     currency: 'USD',
  276 |     lc_number: '',
  277 |     lc_type: 'sight',
  278 |     usance_days: '30',
  279 |     usance_custom_days: '',
  280 |     issuing_bank: '',
  281 |     advising_bank: '',
  282 |     applicant_name: '',
  283 |     beneficiary_name: '',
  284 |     issue_date: '',
  285 |     expiry_date: '',
  286 |     document_id: '',
  287 |     document_url: '',
  288 |     document_file: null,
  289 |   })
  290 | 
  291 |   const hasAcceptedProof = useMemo(() => {
  292 |     return (paymentProofs || []).some((proof) => {
  293 |       const type = String(proof?.type || '').toLowerCase()
  294 |       const status = String(proof?.status || '').toLowerCase()
  295 |       if (type === 'bank_transfer') return status === 'received'
  296 |       if (type === 'lc') return status === 'accepted'
  297 |       return false
  298 |     })
  299 |   }, [paymentProofs])
  300 | 
  301 |   const [statusFilter, setStatusFilter] = useState('all')
  302 |   const [query, setQuery] = useState('')
  303 | 
  304 |   const [draftOpen, setDraftOpen] = useState(false)
  305 |   const [draftForm, setDraftForm] = useState({
  306 |     title: '',
  307 |     buyer_name: '',
  308 |     factory_name: '',
  309 |     buyer_id: '',
  310 |     factory_id: '',
  311 |     bank_name: '',
  312 |     beneficiary_name: '',
  313 |     transaction_reference: '',
  314 |   })
  315 | 
  316 |   const loadContracts = async () => {
  317 |     setLoadingContracts(true)
  318 |     try {
  319 |       const token = getToken()
  320 |       if (!token) {
  321 |         setContracts([])
  322 |         setLoadingContracts(false)
  323 |         return
  324 |       }
  325 |       const data = await apiRequest('/documents/contracts', { token })
  326 |       setContracts(Array.isArray(data) ? data : [])
  327 |       setError('')
  328 |       setForbidden(false)
  329 |     } catch (err) {
  330 |       const isForbidden = err.status === 403
  331 |       setForbidden(isForbidden)
  332 |       setError(isForbidden ? 'You do not have permission to view contracts.' : (err.message || 'Failed to load contracts.'))
  333 |       setContracts([])
  334 |     } finally {
  335 |       setLoadingContracts(false)
  336 |     }
  337 |   }
  338 | 
  339 |   const resetPaymentForm = () => {
  340 |     setPaymentForm({
  341 |       type: 'bank_transfer',
  342 |       transaction_reference: '',
  343 |       bank_name: '',
  344 |       sender_account_name: '',
  345 |       receiver_account_name: '',
  346 |       transaction_date: '',
  347 |       amount: '',
  348 |       currency: 'USD',
  349 |       lc_number: '',
  350 |       lc_type: 'sight',
  351 |       usance_days: '30',
  352 |       usance_custom_days: '',
  353 |       issuing_bank: '',
  354 |       advising_bank: '',
  355 |       applicant_name: '',
  356 |       beneficiary_name: '',
  357 |       issue_date: '',
  358 |       expiry_date: '',
  359 |       document_id: '',
  360 |       document_url: '',
  361 |       document_file: null,
  362 |     })
  363 |   }
  364 | 
  365 |   const loadPaymentProofs = async (contractId) => {
  366 |     const token = getToken()
  367 |     if (!token || !contractId) {
  368 |       setPaymentProofs([])
  369 |       return
  370 |     }
  371 |     setPaymentLoading(true)
  372 |     try {
  373 |       const data = await apiRequest(`/payment-proofs?contract_id=${encodeURIComponent(contractId)}`, { token })
  374 |       setPaymentProofs(Array.isArray(data) ? data : [])
  375 |     } catch {
  376 |       setPaymentProofs([])
  377 |     } finally {
  378 |       setPaymentLoading(false)
  379 |     }
  380 |   }
  381 | 
  382 |   const loadAuditTrail = async (contractId) => {
  383 |     const token = getToken()
  384 |     if (!token || !contractId) {
  385 |       setAuditLog([])
  386 |       return
  387 |     }
  388 |     setAuditLoading(true)
  389 |     setAuditError('')
  390 |     try {
  391 |       const data = await apiRequest(`/documents/contracts/${encodeURIComponent(contractId)}/audit`, { token })
  392 |       setAuditLog(Array.isArray(data?.items) ? data.items : [])
  393 |     } catch (err) {
  394 |       if (err.status === 403) {
  395 |         setAuditError('Premium plan required to view the contract audit trail.')
  396 |       } else {
  397 |         setAuditError(err.message || 'Unable to load audit trail.')
  398 |       }
  399 |       setAuditLog([])
  400 |     } finally {
  401 |       setAuditLoading(false)
  402 |     }
  403 |   }
  404 | 
  405 |   const uploadPaymentDocument = async (contractId) => {
  406 |     if (!paymentForm.document_file) return null
  407 |     const token = getToken()
  408 |     if (!token) return null
  409 |     const formData = new FormData()
  410 |     formData.append('file', paymentForm.document_file)
  411 |     formData.append('entity_type', 'payment_proof')
  412 |     formData.append('entity_id', contractId)
  413 |     formData.append('type', `${paymentForm.type}_proof`)
  414 | 
  415 |     const res = await fetch(`${API_BASE}/documents`, {
  416 |       method: 'POST',
  417 |       headers: { Authorization: `Bearer ${token}` },
  418 |       body: formData,
  419 |     })
  420 |     const data = await res.json().catch(() => ({}))
  421 |     if (!res.ok) throw new Error(data.error || 'Upload failed')
  422 |     return data
  423 |   }
  424 | 
  425 |   const submitPaymentProof = async () => {
  426 |     const token = getToken()
  427 |     if (!token || !selected?.id) return
  428 |     setPaymentNotice('')
  429 |     setSaving(true)
  430 |     try {
  431 |       let documentId = paymentForm.document_id
  432 |       let documentUrl = paymentForm.document_url
  433 |       if (paymentForm.document_file) {
  434 |         const uploaded = await uploadPaymentDocument(selected.id)
  435 |         documentId = uploaded?.id || ''
  436 |         documentUrl = uploaded?.file_path || uploaded?.url || ''
  437 |       }
  438 | 
  439 |       const payload = {
  440 |         ...paymentForm,
  441 |         contract_id: selected.id,
  442 |         document_id: documentId || undefined,
  443 |         document_url: documentUrl || undefined,
  444 |       }
  445 | 
  446 |       if (paymentForm.type === 'lc') {
  447 |         let usanceDays = paymentForm.usance_days
  448 |         if (paymentForm.lc_type === 'usance' && String(paymentForm.usance_days) === 'custom') {
  449 |           usanceDays = paymentForm.usance_custom_days
  450 |         }
  451 |         payload.usance_days = paymentForm.lc_type === 'usance' ? usanceDays : undefined
  452 |       } else {
  453 |         payload.lc_type = undefined
  454 |         payload.usance_days = undefined
  455 |       }
  456 |       delete payload.usance_custom_days
  457 | 
  458 |       const created = await apiRequest('/payment-proofs', { method: 'POST', token, body: payload })
  459 |       setPaymentNotice('Payment proof submitted.')
  460 |       setPaymentProofs((prev) => [created, ...prev])
  461 |       resetPaymentForm()
  462 |       trackClientEvent('payment_proof_submitted', { entityType: 'contract', entityId: selected.id })
  463 |     } catch (err) {
  464 |       setPaymentNotice(err.message || 'Unable to submit payment proof')
  465 |     } finally {
  466 |       setSaving(false)
  467 |     }
  468 |   }
  469 | 
  470 |   const updatePaymentStatus = async (proofId, status) => {
  471 |     const token = getToken()
  472 |     if (!token || !proofId) return
  473 |     setPaymentNotice('')
  474 |     setSaving(true)
  475 |     try {
  476 |       const updated = await apiRequest(`/payment-proofs/${encodeURIComponent(proofId)}`, {
  477 |         method: 'PATCH',
  478 |         token,
  479 |         body: { status },
  480 |       })
  481 |       setPaymentProofs((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  482 |       setPaymentNotice('Payment proof status updated.')
  483 |       trackClientEvent('payment_proof_status_updated', { entityType: 'payment_proof', entityId: updated.id, metadata: { status } })
  484 |     } catch (err) {
  485 |       setPaymentNotice(err.message || 'Unable to update status')
  486 |     } finally {
  487 |       setSaving(false)
  488 |     }
  489 |   }
  490 | 
  491 |   useEffect(() => {
  492 |     loadContracts()
  493 |   }, [])
  494 | 
  495 |   useEffect(() => {
  496 |     const handler = (e) => {
  497 |       const key = String(e.key || '').toLowerCase()
  498 |       if (key !== 'k') return
  499 |       if (!(e.ctrlKey || e.metaKey)) return
  500 |       e.preventDefault()
  501 |       searchRef.current?.focus?.()
  502 |     }
  503 |     window.addEventListener('keydown', handler)
  504 |     return () => window.removeEventListener('keydown', handler)
  505 |   }, [])
  506 | 
  507 |   useEffect(() => {
  508 |     if (!selected?.id) return
  509 |     loadAuditTrail(selected.id)
  510 |   }, [selected?.id])
  511 | 
  512 |   const visibleContracts = useMemo(() => {
  513 |     const q = query.trim().toLowerCase()
  514 |     return contracts
  515 |       .filter((c) => (statusFilter === 'all' ? true : (c.lifecycle_status || 'pending_signature') === statusFilter))
  516 |       .filter((c) => {
  517 |         if (!q) return true
  518 |         const haystack = `${c.contract_number || ''} ${c.title || ''} ${c.buyer_name || ''} ${c.factory_name || ''} ${c.id || ''}`.toLowerCase()
  519 |         return haystack.includes(q)
  520 |       })
  521 |       .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
  522 |   }, [contracts, statusFilter, query])
  523 | 
  524 |   const selected = useMemo(() => {
  525 |     if (!selectedId) return null
  526 |     return contracts.find((c) => String(c.id) === String(selectedId)) || null
  527 |   }, [contracts, selectedId])
  528 | 
  529 |   // project.md: call recordings should be stored and retrievable for disputes.
  530 |   // We show recordings linked to the selected contract via `contract_id` on call sessions.
  531 |   const [callItems, setCallItems] = useState([])
  532 |   const [callsLoading, setCallsLoading] = useState(false)
  533 |   const hasRecordedCall = useMemo(() => {
  534 |     return callItems.some((call) => String(call.recording_status || '').toLowerCase() === 'available' && call.recording_url)
  535 |   }, [callItems])
  536 | 
  537 |   const selectedFlow = computeFlow(selected)
  538 |   const selectedActionBlockers = actionBlockers(currentUser, selected)
  539 |   const downloadUrl = resolveDownloadUrl(selected?.artifact?.pdf_path)
  540 |   const canDownload = Boolean(selectedFlow?.hasPdf && downloadUrl)
  541 |   const canReviewPayment = ['factory', 'buying_house', 'owner', 'admin'].includes(String(currentUser?.role || '').toLowerCase())
  542 | 
  543 |   useEffect(() => {
  544 |     const token = getToken()
  545 |     if (!token || !selected?.id) {
  546 |       setCallItems([])
  547 |       return
  548 |     }
  549 | 
  550 |     setCallsLoading(true)
  551 |     apiRequest(`/calls/by-contract/${encodeURIComponent(selected.id)}`, { token })
  552 |       .then((data) => setCallItems(Array.isArray(data?.items) ? data.items : []))
  553 |       .catch(() => setCallItems([]))
  554 |       .finally(() => setCallsLoading(false))
  555 |   }, [selected?.id])
  556 | 
  557 |   useEffect(() => {
  558 |     if (!selected?.id) {
  559 |       setPaymentProofs([])
  560 |       return
  561 |     }
  562 |     loadPaymentProofs(selected.id)
  563 |   }, [selected?.id])
  564 | 
  565 |   useEffect(() => {
  566 |     if (!selected?.id || hasRecordedCall) return
  567 |     trackClientEvent('contract_call_warning', {
  568 |       entityType: 'contract',
  569 |       entityId: selected.id,
  570 |     })
  571 |   }, [hasRecordedCall, selected?.id])
  572 | 
  573 |   const upsertContract = (nextContract) => {
  574 |     if (!nextContract?.id) return
  575 |     setContracts((prev) => {
  576 |       const idx = prev.findIndex((entry) => String(entry.id) === String(nextContract.id))
  577 |       if (idx < 0) return [nextContract, ...prev]
  578 |       const clone = [...prev]
  579 |       clone[idx] = nextContract
  580 |       return clone
  581 |     })
  582 |     setSelectedId(String(nextContract.id))
  583 |   }
  584 | 
  585 |   const runStepAction = async (runner, eventPayload = null) => {
  586 |     setSaving(true)
  587 |     setActionError('')
  588 |     try {
  589 |       const token = getToken()
  590 |       const updated = await runner(token)
  591 |       upsertContract(updated)
  592 |       if (eventPayload?.type && updated?.id) {
  593 |         trackClientEvent(eventPayload.type, {
  594 |           entityType: 'contract',
  595 |           entityId: updated.id,
  596 |           metadata: eventPayload.metadata || {},
  597 |         })
  598 |       }
  599 |     } catch (err) {
  600 |       setActionError(err.message || 'Action failed')
  601 |     } finally {
  602 |       setSaving(false)
  603 |     }
  604 |   }
  605 | 
  606 |   const runStepActionWithProofWarning = async (runner, eventPayload = null) => {
  607 |     if (!hasAcceptedProof) {
  608 |       const proceed = window.confirm(
  609 |         'No accepted payment proof is recorded yet. You can continue, but submitting a bank/LC proof is strongly recommended. Proceed anyway?'
  610 |       )
  611 |       if (!proceed) return
  612 |     }
  613 |     await runStepAction(runner, eventPayload)
  614 |   }
  615 | 
  616 |   const handleCreateDraft = async () => {
  617 |     await runStepAction(async (token) => apiRequest('/documents/contracts/draft', {
  618 |       method: 'POST',
  619 |       token,
  620 |       body: {
  621 |         title: draftForm.title,
  622 |         buyer_name: draftForm.buyer_name,
  623 |         factory_name: draftForm.factory_name,
  624 |         buyer_id: draftForm.buyer_id,
  625 |         factory_id: draftForm.factory_id,
  626 |         bank_name: draftForm.bank_name,
  627 |         beneficiary_name: draftForm.beneficiary_name,
  628 |         transaction_reference: draftForm.transaction_reference,
  629 |       },
  630 |     }), { type: 'contract_draft_created' })
  631 |     setDraftOpen(false)
  632 |     setDraftForm({
  633 |       title: '',
  634 |       buyer_name: '',
  635 |       factory_name: '',
  636 |       buyer_id: '',
  637 |       factory_id: '',
  638 |       bank_name: '',
  639 |       beneficiary_name: '',
  640 |       transaction_reference: '',
  641 |     })
  642 |     await loadContracts()
  643 |   }
  644 | 
  645 |   const openDetails = (contractId) => {
  646 |     setSelectedId(String(contractId))
  647 |     setDrawerOpen(true)
  648 |   }
  649 | 
  650 |   const detailPanel = selected ? (
  651 |     <div className="rounded-2xl borderless-shadow bg-white p-5">
  652 |       <div className="flex items-start justify-between gap-4">
  653 |         <div className="min-w-0">
  654 |           <div className="flex items-center gap-2">
  655 |             <div className="truncate text-lg font-bold text-slate-900">{selected.contract_number || selected.id}</div>
  656 |             <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1${statusClass(selected.lifecycle_status || 'pending_signature')}`}>
  657 |               {toLabel(selected.lifecycle_status || 'pending_signature')}
  658 |             </span>
  659 |           </div>
  660 |           <div className="mt-1 text-sm text-slate-600">{safeDash(selected.title)}</div>
  661 |           <div className="mt-3 text-sm text-slate-700">
  662 |             <span className="font-semibold">Buyer:</span> {safeDash(selected.buyer_name)} <span className="mx-1">-</span>
  663 |             <span className="font-semibold">Factory:</span> {safeDash(selected.factory_name)}
  664 |           </div>
  665 |         </div>
  666 |         <Link to="/help" className="shrink-0 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-semibold text-[#0A66C2] hover:bg-[#D9ECFF]">Help</Link>
  667 |       </div>
  668 | 
  669 |       {actionError ? <div className="mt-4 rounded-xl borderless-shadow bg-rose-50 p-3 text-sm font-semibold text-rose-700">{actionError}</div> : null}
  670 |       <div className="mt-4">
  671 |         <JourneyTimeline title="Journey Timeline" matchId={selected.match_id || journeyParams.get('journey_match_id') || journeyParams.get('match_id') || ''} />
  672 |       </div>
  673 |       {selected.requirement_id ? (
  674 |         <div className="mt-2">
  675 |           <Link to={`/search?requirementId=${encodeURIComponent(selected.requirement_id)}`} className="text-xs font-semibold text-[#0A66C2] hover:underline">Open source requirement</Link>
  676 |         </div>
  677 |       ) : null}
  678 |       {!hasRecordedCall ? (
  679 |         <div className="mt-4 rounded-xl borderless-shadow bg-amber-50 p-3 text-sm font-semibold text-amber-900">
  680 |           <div className="flex flex-wrap items-center justify-between gap-3">
  681 |             <span>Video calls are recommended before finalizing contracts. No recorded call is linked to this contract yet.</span>
  682 |             <Link to="/chat" className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-500">
  683 |               Open chat
  684 |             </Link>
  685 |           </div>
  686 |         </div>
  687 |       ) : null}
  688 | 
  689 |       <div className="mt-5 flex flex-wrap items-center gap-2">
  690 |         <StepPill done={selectedFlow.stepState.draft_creation} label="Draft" />
  691 |         <StepPill done={selectedFlow.stepState.buyer_signature} label="Buyer sign" />
  692 |         <StepPill done={selectedFlow.stepState.factory_signature} label="Factory sign" />
  693 |         <StepPill done={selectedFlow.stepState.artifact_finalize} label="Lock PDF" />
  694 |         <StepPill done={selectedFlow.stepState.archive} label="Archive" />
  695 |       </div>
  696 | 
  697 |       <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
  698 |         <div className="rounded-2xl borderless-shadow bg-white p-4">
  699 |           <div className="text-sm font-semibold text-slate-900">Signatures</div>
  700 |           <div className="mt-2 text-sm text-slate-700">Buyer: <span className="font-semibold">{selected.buyer_signature_state || 'pending'}</span> {selected.buyer_signed_at ? <span className="text-xs text-slate-500">({selected.buyer_signed_at})</span> : null}</div>
  701 |           <div className="mt-1 text-sm text-slate-700">Factory: <span className="font-semibold">{selected.factory_signature_state || 'pending'}</span> {selected.factory_signed_at ? <span className="text-xs text-slate-500">({selected.factory_signed_at})</span> : null}</div>
  702 |           {!hasAcceptedProof ? (
  703 |             <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
  704 |               Warning: No accepted payment proof yet. You may continue, but proof is strongly recommended for safety.
  705 |             </div>
  706 |           ) : null}
  707 |           <div className="mt-4 grid grid-cols-1 gap-2">
  708 |               <button
  709 |                 type="button"
  710 |                 disabled={Boolean(selectedActionBlockers.buyerSign) || saving}
  711 |                 onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
  712 |                   method: 'PATCH',
  713 |                   token,
  714 |                   body: { buyer_signature_state: 'signed', is_draft: false },
  715 |                 }), { type: 'contract_buyer_sign' })}
  716 |                 className="rounded-xl bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
  717 |               >
  718 |                 Buyer sign
  719 |               </button>
  720 |             {selectedActionBlockers.buyerSign ? <div className="text-xs text-amber-700">{selectedActionBlockers.buyerSign}</div> : null}
  721 | 
  722 |               <button
  723 |                 type="button"
  724 |                 disabled={Boolean(selectedActionBlockers.factorySign) || saving}
  725 |                 onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/signatures`, {
  726 |                   method: 'PATCH',
  727 |                   token,
  728 |                   body: { factory_signature_state: 'signed', is_draft: false },
  729 |                 }), { type: 'contract_factory_sign' })}
  730 |                 className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0A66C2] ring-1 ring-[#BBD8FF] hover:bg-[#F6FAFF] disabled:bg-slate-50 disabled:text-slate-400 disabled:ring-slate-200"
  731 |               >
  732 |                 Factory sign
  733 |               </button>
  734 |             <button
  735 |               type="button"
  736 |               disabled={saving}
  737 |               onClick={async () => {
  738 |                 if (!selected?.id) return
  739 |                 setSaving(true)
  740 |                 setActionError('')
  741 |                 try {
  742 |                   const token = getToken()
  743 |                   const res = await apiRequest(`/documents/contracts/${selected.id}/sign-session`, { method: 'POST', token })
  744 |                   if (res?.signing_url) {
  745 |                     window.open(res.signing_url, '_blank')
  746 |                   } else {
  747 |                     setActionError('Unable to create sign session')
  748 |                   }
  749 |                 } catch (err) {
  750 |                   setActionError(err.message || 'Unable to create sign session')
  751 |                 } finally {
  752 |                   setSaving(false)
  753 |                 }
  754 |               }}
  755 |               className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400"
  756 |             >
  757 |               Start e-sign session
  758 |             </button>
  759 |             {selectedActionBlockers.factorySign ? <div className="text-xs text-amber-700">{selectedActionBlockers.factorySign}</div> : null}
  760 |           </div>
  761 |         </div>
  762 | 
  763 |         <div className="rounded-2xl borderless-shadow bg-white p-4">
  764 |           <div className="text-sm font-semibold text-slate-900">Artifact (PDF)</div>
  765 |           <div className="mt-2 text-sm text-slate-700">Status: <span className="font-semibold">{selected.artifact?.status || 'draft'}</span></div>
  766 |           <div className="mt-1 text-xs text-slate-500">PDF generates automatically after both signatures.</div>
  767 | 
  768 |           <div className="mt-4 grid grid-cols-1 gap-2">
  769 |               <button
  770 |                 type="button"
  771 |                 disabled={Boolean(selectedActionBlockers.lock) || saving}
  772 |                 onClick={() => runStepActionWithProofWarning(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
  773 |                   method: 'PATCH',
  774 |                   token,
  775 |                   body: { status: 'locked' },
  776 |                 }), { type: 'contract_locked' })}
  777 |                 className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-400"
  778 |               >
  779 |                 Lock PDF
  780 |               </button>
  781 |             {selectedActionBlockers.lock ? <div className="text-xs text-amber-700">{selectedActionBlockers.lock}</div> : null}
  782 | 
  783 |             <button
  784 |               type="button"
  785 |               disabled={Boolean(selectedActionBlockers.archive) || saving}
  786 |               onClick={() => runStepAction(async (token) => apiRequest(`/documents/contracts/${selected.id}/artifact`, {
  787 |                 method: 'PATCH',
  788 |                 token,
  789 |                 body: { status: 'archived' },
  790 |               }), { type: 'contract_archived' })}
  791 |               className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
  792 |             >
  793 |               Archive
  794 |             </button>
  795 |             {selectedActionBlockers.archive ? <div className="text-xs text-amber-700">{selectedActionBlockers.archive}</div> : null}
  796 | 
  797 |             {canDownload
  798 |               ? <a href={downloadUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-[#0A66C2] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0959A8]">Download PDF</a>
  799 |               : <button type="button" disabled className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500">Download (not ready)</button>}
  800 |           </div>
  801 |         </div>
  802 |       </div>
  803 | 
  804 |       <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4 dark:bg-slate-900/50">
  805 |         <div className="flex items-start justify-between gap-4">
  806 |           <div>
  807 |             <div className="text-sm font-semibold text-slate-900">Banking references (optional)</div>
  808 |             <div className="mt-1 text-xs text-slate-500">For fraud prevention only. No direct payments are processed on-platform.</div>
  809 |           </div>
  810 |           <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
  811 |             {canViewBankingReferences(currentUser, selected) ? 'Visible' : 'Masked'}
  812 |           </div>
  813 |         </div>
  814 | 
  815 |         <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
  816 |           <div>Bank name: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.bank_name) : maskValue(selected.bank_name)}</div>
  817 |           <div>Beneficiary: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.beneficiary_name) : maskValue(selected.beneficiary_name)}</div>
  818 |           <div>Transaction reference: {canViewBankingReferences(currentUser, selected) ? safeDash(selected.transaction_reference) : maskValue(selected.transaction_reference)}</div>
  819 |         </div>
  820 |       </div>
  821 | 
  822 |       <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4 dark:bg-slate-900/50">
  823 |         <div className="flex items-start justify-between gap-4">
  824 |           <div>
  825 |             <div className="text-sm font-semibold text-slate-900">Payment proof workflow</div>
  826 |             <div className="mt-1 text-xs text-slate-500">Submit bank transfer or LC documents. Seller review sets status, disputes trigger internal admin review.</div>
  827 |           </div>
  828 |           <button type="button" onClick={() => loadPaymentProofs(selected.id)} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
  829 |             Refresh
  830 |           </button>
  831 |         </div>
  832 | 
  833 |         <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
  834 |           <label className="text-xs font-semibold text-slate-600">Proof type</label>
  835 |           <div />
  836 |           <select
  837 |             value={paymentForm.type}
  838 |             onChange={(e) => setPaymentForm((prev) => ({ ...prev, type: e.target.value }))}
  839 |             className="rounded-xl borderless-shadow px-3 py-2 text-sm"
  840 |           >
  841 |             <option value="bank_transfer">Bank transfer</option>
  842 |             <option value="lc">Letter of credit (LC)</option>
  843 |           </select>
  844 |           <div />
  845 | 
  846 |           {paymentForm.type === 'bank_transfer' ? (
  847 |             <>
  848 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Transaction reference" value={paymentForm.transaction_reference} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_reference: e.target.value }))} />
  849 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Bank name" value={paymentForm.bank_name} onChange={(e) => setPaymentForm((p) => ({ ...p, bank_name: e.target.value }))} />
  850 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Sender account name" value={paymentForm.sender_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, sender_account_name: e.target.value }))} />
  851 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Receiver/company account name" value={paymentForm.receiver_account_name} onChange={(e) => setPaymentForm((p) => ({ ...p, receiver_account_name: e.target.value }))} />
  852 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.transaction_date} onChange={(e) => setPaymentForm((p) => ({ ...p, transaction_date: e.target.value }))} />
  853 |               <div className="flex gap-2">
  854 |                 <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
  855 |                 <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
  856 |               </div>
  857 |             </>
  858 |           ) : (
  859 |             <>
  860 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="LC number" value={paymentForm.lc_number} onChange={(e) => setPaymentForm((p) => ({ ...p, lc_number: e.target.value }))} />
  861 |               <div className="flex flex-wrap gap-2">
  862 |                 <select
  863 |                   value={paymentForm.lc_type}
  864 |                   onChange={(e) => setPaymentForm((p) => ({ ...p, lc_type: e.target.value }))}
  865 |                   className="rounded-xl borderless-shadow px-3 py-2 text-sm"
  866 |                 >
  867 |                   <option value="sight">Sight LC</option>
  868 |                   <option value="usance">Usance LC</option>
  869 |                 </select>
  870 |                 {paymentForm.lc_type === 'usance' ? (
  871 |                   <>
  872 |                     <select
  873 |                       value={paymentForm.usance_days}
  874 |                       onChange={(e) => setPaymentForm((p) => ({ ...p, usance_days: e.target.value }))}
  875 |                       className="rounded-xl borderless-shadow px-3 py-2 text-sm"
  876 |                     >
  877 |                       <option value="30">30 days</option>
  878 |                       <option value="60">60 days</option>
  879 |                       <option value="90">90 days</option>
  880 |                       <option value="180">180 days</option>
  881 |                       <option value="custom">Custom</option>
  882 |                     </select>
  883 |                     {String(paymentForm.usance_days) === 'custom' ? (
  884 |                       <input
  885 |                         className="w-32 rounded-xl borderless-shadow px-3 py-2 text-sm"
  886 |                         placeholder="Days"
  887 |                         value={paymentForm.usance_custom_days}
  888 |                         onChange={(e) => setPaymentForm((p) => ({ ...p, usance_custom_days: e.target.value }))}
  889 |                       />
  890 |                     ) : null}
  891 |                   </>
  892 |                 ) : null}
  893 |               </div>
  894 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Issuing bank" value={paymentForm.issuing_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, issuing_bank: e.target.value }))} />
  895 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Advising bank" value={paymentForm.advising_bank} onChange={(e) => setPaymentForm((p) => ({ ...p, advising_bank: e.target.value }))} />
  896 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Applicant name" value={paymentForm.applicant_name} onChange={(e) => setPaymentForm((p) => ({ ...p, applicant_name: e.target.value }))} />
  897 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Beneficiary name" value={paymentForm.beneficiary_name} onChange={(e) => setPaymentForm((p) => ({ ...p, beneficiary_name: e.target.value }))} />
  898 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.issue_date} onChange={(e) => setPaymentForm((p) => ({ ...p, issue_date: e.target.value }))} />
  899 |               <input className="rounded-xl borderless-shadow px-3 py-2 text-sm" type="date" value={paymentForm.expiry_date} onChange={(e) => setPaymentForm((p) => ({ ...p, expiry_date: e.target.value }))} />
  900 |               <div className="flex gap-2">
  901 |                 <input className="flex-1 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} />
  902 |                 <input className="w-24 rounded-xl borderless-shadow px-3 py-2 text-sm" placeholder="Currency" value={paymentForm.currency} onChange={(e) => setPaymentForm((p) => ({ ...p, currency: e.target.value }))} />
  903 |               </div>
  904 |             </>
  905 |           )}
  906 | 
  907 |           <div className="sm:col-span-2">
  908 |             <label className="text-xs font-semibold text-slate-600">Upload proof document</label>
  909 |             <input
  910 |               type="file"
  911 |               className="mt-2 text-xs"
  912 |               onChange={(e) => setPaymentForm((p) => ({ ...p, document_file: e.target.files?.[0] || null }))}
  913 |             />
  914 |           </div>
  915 |         </div>
  916 | 
  917 |         <div className="mt-4 flex flex-wrap items-center gap-2">
  918 |           <button
  919 |             type="button"
  920 |             onClick={submitPaymentProof}
  921 |             disabled={saving}
  922 |             className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
  923 |           >
  924 |             Submit proof
  925 |           </button>
  926 |           {paymentNotice ? <span className="text-xs text-slate-500">{paymentNotice}</span> : null}
  927 |         </div>
  928 | 
  929 |         <div className="mt-4 space-y-2">
  930 |           {paymentLoading ? <div className="text-xs text-slate-500">Loading proofs...</div> : null}
  931 |           {!paymentLoading && paymentProofs.length === 0 ? <div className="text-xs text-slate-500">No proofs submitted yet.</div> : null}
  932 |           {paymentProofs.map((proof) => {
  933 |             const proofDocUrl = resolveDownloadUrl(proof.document_url || '')
  934 |             return (
  935 |             <div key={proof.id} className="rounded-xl borderless-shadow bg-slate-50 p-3 text-xs text-slate-700">
  936 |               <div className="flex flex-wrap items-center justify-between gap-2">
  937 |                 <div className="font-semibold">{String(proof.type || '').replace('_', ' ').toUpperCase()}</div>
  938 |                 <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
  939 |                   {proof.status || 'pending'}
  940 |                 </div>
  941 |               </div>
  942 |               <div className="mt-2 grid grid-cols-1 gap-1">
  943 |                 {proof.transaction_reference ? <div>Ref: {proof.transaction_reference}</div> : null}
  944 |                 {proof.lc_number ? <div>LC: {proof.lc_number}</div> : null}
  945 |                 {proof.lc_type ? (
  946 |                   <div>
  947 |                     LC Type: {String(proof.lc_type).toUpperCase()}
  948 |                     {proof.lc_type === 'usance' && proof.usance_days ? ` (${proof.usance_days} days)` : ''}
  949 |                   </div>
  950 |                 ) : null}
  951 |                 {proof.amount ? <div>Amount: {proof.amount} {proof.currency || ''}</div> : null}
  952 |               </div>
  953 |               {proofDocUrl || proof.document_id ? (
  954 |                 <div className="mt-2">
  955 |                   {proofDocUrl ? (
  956 |                     <a href={proofDocUrl} target="_blank" rel="noreferrer" className="text-[10px] font-semibold text-[#0A66C2] hover:underline">Open proof document</a>
  957 |                   ) : (
  958 |                     <span className="text-[10px] text-slate-500">Document linked</span>
  959 |                   )}
  960 |                 </div>
  961 |               ) : null}
  962 |               {canReviewPayment ? (
  963 |                 <div className="mt-2 flex flex-wrap gap-2">
  964 |                   {proof.type === 'bank_transfer' ? (
  965 |                     <>
  966 |                       <button type="button" onClick={() => updatePaymentStatus(proof.id, 'received')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Mark received</button>
  967 |                       <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_check')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending check</button>
  968 |                       <button type="button" onClick={() => updatePaymentStatus(proof.id, 'not_received')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Not received</button>
  969 |                     </>
  970 |                   ) : (
  971 |                     <>
  972 |                       <button type="button" onClick={() => updatePaymentStatus(proof.id, 'accepted')} className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white">Accept</button>
  973 |                       <button type="button" onClick={() => updatePaymentStatus(proof.id, 'pending_review')} className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-semibold text-white">Pending review</button>
  974 |                       <button type="button" onClick={() => updatePaymentStatus(proof.id, 'rejected')} className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold text-white">Reject</button>
  975 |                     </>
  976 |                   )}
  977 |                 </div>
  978 |               ) : null}
  979 |             </div>
  980 |           )})}
  981 |         </div>
  982 |       </div>
  983 | 
  984 |       <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4">
  985 |         <div className="flex items-start justify-between gap-4">
  986 |           <div>
  987 |             <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Call recordings</div>
  988 |             <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">Recorded calls are stored for dispute resolution and security (project.md).</div>
  989 |           </div>
  990 |           <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-200">
  991 |             {callsLoading ? 'Loading...' : `${callItems.filter((c) => c.recording_url).length} available`}
  992 |           </div>
  993 |         </div>
  994 | 
  995 |         <div className="mt-3 space-y-3">
  996 |           {callItems.map((call) => {
  997 |             const url = resolveDownloadUrl(call.recording_url)
  998 |             const canPlay = Boolean(call.recording_status === 'available' && url)
  999 |             return (
 1000 |               <div key={call.id} className="rounded-xl borderless-shadow bg-slate-50 p-3 dark:bg-black/20">
 1001 |                 <div className="flex items-start justify-between gap-3">
 1002 |                   <div className="min-w-0">
 1003 |                     <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{safeDash(call.title) || 'Call session'}</div>
 1004 |                     <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
 1005 |                       {safeDash(call.status)} - {call.created_at ? new Date(call.created_at).toLocaleString() : '\u2014'}
 1006 |                     </div>
 1007 |                   </div>
 1008 |                   <div className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-200">
 1009 |                     {String(call.recording_status || 'pending')}
 1010 |                   </div>
 1011 |                 </div>
 1012 | 
 1013 |                 {canPlay ? (
 1014 |                   <div className="mt-3">
 1015 |                     <video
 1016 |                       src={url}
 1017 |                       controls
 1018 |                       className="w-full rounded-lg bg-black/5 dark:bg-black/30"
 1019 |                       onPlay={async () => {
 1020 |                         try {
 1021 |                           const token = getToken()
 1022 |                           if (!token) return
 1023 |                           await apiRequest(`/calls/${encodeURIComponent(call.id)}/recording/viewed`, { method: 'POST', token })
 1024 |                         } catch {
 1025 |                           // silent
 1026 |                         }
 1027 |                       }}
 1028 |                     />
 1029 |                   </div>
 1030 |                 ) : (
 1031 |                   <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">Recording not available yet.</div>
 1032 |                 )}
 1033 |               </div>
 1034 |             )
 1035 |           })}
 1036 |           {!callsLoading && callItems.length === 0 ? (
 1037 |             <div className="text-sm text-slate-600 dark:text-slate-300">No calls linked to this contract yet.</div>
 1038 |           ) : null}
 1039 |         </div>
 1040 |       </div>
 1041 | 
 1042 |       <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4">
 1043 |         <div className="text-sm font-semibold text-slate-900">Artifact audit</div>
 1044 |         <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
 1045 |           <div>Status: {safeDash(selected.artifact?.status)}</div>
 1046 |           <div>Generated at: {safeDash(selected.artifact?.generated_at)}</div>
 1047 |           <div>Version: {selected.artifact?.version ?? 0}</div>
 1048 |           <div className="break-all text-xs text-slate-600">Hash: {safeDash(selected.artifact?.pdf_hash)}</div>
 1049 |           <div className="text-xs text-slate-600">
 1050 |             Signer IDs: Buyer {safeDash(selected.artifact?.signer_ids?.buyer_id)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signer_ids?.factory_id)}
 1051 |           </div>
 1052 |           <div className="text-xs text-slate-600">
 1053 |             Signature timestamps: Buyer {safeDash(selected.artifact?.signature_timestamps?.buyer_signed_at)} <span className="mx-1">-</span> Factory {safeDash(selected.artifact?.signature_timestamps?.factory_signed_at)}
 1054 |           </div>
 1055 |         </div>
 1056 |       </div>
 1057 | 
 1058 |       <div className="mt-5 rounded-2xl borderless-shadow bg-white p-4">
 1059 |         <div className="flex items-center justify-between gap-4">
 1060 |           <div className="text-sm font-semibold text-slate-900">Contract Audit Trail</div>
 1061 |           <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600">Premium</div>
 1062 |         </div>
 1063 |         {auditLoading ? (
 1064 |           <div className="mt-3 text-sm text-slate-600">Loading audit trail...</div>
 1065 |         ) : auditError ? (
 1066 |           <div className="mt-3 rounded-lg borderless-shadow bg-amber-50 p-3 text-xs text-amber-800">
 1067 |             {auditError}
 1068 |           </div>
 1069 |         ) : auditLog.length ? (
 1070 |           <div className="mt-3 space-y-2 text-xs text-slate-600">
 1071 |             {auditLog.map((entry) => (
 1072 |               <div key={entry.id || `${entry.timestamp}-${entry.note}`} className="rounded-lg borderless-shadow bg-slate-50 p-3">
 1073 |                 <div className="flex items-center justify-between gap-3">
 1074 |                   <span className="font-semibold text-slate-900">{entry.action || 'update'}</span>
 1075 |                   <span>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '\u2014'}</span>
 1076 |                 </div>
 1077 |                 <div className="mt-1 text-slate-600">{entry.note || 'Audit entry recorded.'}</div>
 1078 |                 {entry.actor_name || entry.actor_id ? (
 1079 |                   <div className="mt-2 text-[11px] text-slate-500">By {entry.actor_name || entry.actor_id}</div>
 1080 |                 ) : null}
 1081 |               </div>
 1082 |             ))}
 1083 |           </div>
 1084 |         ) : (
 1085 |           <div className="mt-3 text-sm text-slate-600">No audit entries yet.</div>
 1086 |         )}
 1087 |       </div>
 1088 |     </div>
 1089 |   ) : (
 1090 |     <div className="rounded-2xl borderless-shadow bg-white p-10 text-center text-sm text-slate-600">
 1091 |       Select a contract to see details.
 1092 |     </div>
 1093 |   )
 1094 | 
 1095 |   return (
 1096 |     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors duration-500 ease-in-out">
 1097 |       <div className="mx-auto max-w-7xl p-4 sm:p-6">
 1098 |         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
 1099 |           <div>
 1100 |             <div className="text-xs font-semibold text-[var(--gt-blue)]">Vault</div>
 1101 |             <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Contract Vault</h1>
 1102 |             <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Draft → Sign → PDF artifact → Lock → Archive</p>
 1103 |           </div>
 1104 |           <div className="flex flex-wrap items-center gap-2">
 1105 |             <Link to="/owner" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Dashboard</Link>
 1106 |             <Link to="/notifications" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200/70 transition hover:bg-slate-50 active:scale-95 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/8">Notifications</Link>
 1107 |             <button
 1108 |               type="button"
 1109 |               disabled={!canCreateDraft(currentUser)}
 1110 |               onClick={() => setDraftOpen(true)}
 1111 |               className="rounded-full bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--gt-blue-hover)] active:scale-95 disabled:bg-slate-200 disabled:text-slate-500"
 1112 |             >
 1113 |               New draft
 1114 |             </button>
 1115 |           </div>
 1116 |         </div>
 1117 | 
 1118 |         {forbidden ? <AccessDeniedState message={error || 'Access denied.'} /> : null}
 1119 |         {!forbidden && error ? <div className="mb-4 rounded-2xl borderless-shadow bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}
 1120 | 
 1121 |         {!forbidden ? (
 1122 |           <div className="secure-grid grid grid-cols-1 gap-6 lg:grid-cols-12">
 1123 |             <div className="lg:col-span-5">
 1124 |               <div className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
 1125 |                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 1126 |                   <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contracts</div>
 1127 |                   <button type="button" onClick={loadContracts} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/8">Refresh</button>
 1128 |                 </div>
 1129 | 
 1130 |                 <div className="mt-4 grid gap-3">
 1131 |                   <div className="relative">
 1132 |                     <input
 1133 |                       ref={searchRef}
 1134 |                       value={query}
 1135 |                       onChange={(e) => setQuery(e.target.value)}
 1136 |                       placeholder="Search by number, buyer, factory, title..."
 1137 |                       className="w-full rounded-xl bg-white px-3 py-2 pr-16 text-sm text-slate-800 shadow-inner ring-1 ring-slate-200/70 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
 1138 |                     />
 1139 |                     <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-white/10">
 1140 |                       {isMac ? '⌘ K' : 'Ctrl K'}
 1141 |                     </span>
 1142 |                   </div>
 1143 | 
 1144 |                   <div className="flex flex-wrap items-center gap-2">
 1145 |                     {[
 1146 |                       { key: 'all', label: 'All' },
 1147 |                       { key: 'draft', label: 'Draft' },
 1148 |                       { key: 'pending_signature', label: 'Pending' },
 1149 |                       { key: 'signed', label: 'Signed' },
 1150 |                       { key: 'archived', label: 'Archived' },
 1151 |                     ].map((chip) => (
 1152 |                       <motion.button
 1153 |                         key={chip.key}
 1154 |                         type="button"
 1155 |                         onClick={() => setStatusFilter(chip.key)}
 1156 |                         whileTap={reduceMotion ? undefined : { scale: 0.98 }}
 1157 |                         className={`relative rounded-full px-3 py-1 text-xs font-semibold transition ring-1${
 1158 |                           statusFilter === chip.key
 1159 |                             ? 'bg-white text-indigo-700 ring-indigo-200 dark:bg-white/5 dark:text-[#38bdf8] dark:ring-[#38bdf8]/35'
 1160 |                             : 'bg-white/60 text-slate-700 ring-slate-200/70 hover:bg-white dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
 1161 |                         }`}
 1162 |                       >
 1163 |                         {statusFilter === chip.key ? (
 1164 |                           <motion.span
 1165 |                             layoutId="contract-filter"
 1166 |                             className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-white/10"
 1167 |                             transition={{ type: 'spring', stiffness: 420, damping: 34 }}
 1168 |                           />
 1169 |                         ) : null}
 1170 |                         <span className="relative">{chip.label}</span>
 1171 |                       </motion.button>
 1172 |                     ))}
 1173 |                   </div>
 1174 |                 </div>
 1175 |               </div>
 1176 | 
 1177 |               <div className="mt-4 grid gap-3">
 1178 |                 {loadingContracts ? (
 1179 |                   <div className="grid gap-3">
 1180 |                     {Array.from({ length: 5 }).map((_, i) => (
 1181 |                       <div key={`contract-skel-${i}`} className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
 1182 |                         <div className="flex items-start justify-between gap-3">
 1183 |                           <div className="min-w-0 flex-1 space-y-2">
 1184 |                             <div className="h-3 w-1/3 rounded-full skeleton" />
 1185 |                             <div className="h-3 w-2/3 rounded-full skeleton" />
 1186 |                             <div className="h-3 w-1/2 rounded-full skeleton" />
 1187 |                           </div>
 1188 |                           <div className="h-7 w-20 rounded-full skeleton" />
 1189 |                         </div>
 1190 |                         <div className="mt-3 flex flex-wrap gap-2">
 1191 |                           <div className="h-6 w-24 rounded-full skeleton" />
 1192 |                           <div className="h-6 w-24 rounded-full skeleton" />
 1193 |                           <div className="h-6 w-20 rounded-full skeleton" />
 1194 |                         </div>
 1195 |                       </div>
 1196 |                     ))}
 1197 |                   </div>
 1198 |                 ) : visibleContracts.length ? visibleContracts.map((c, idx) => (
 1199 |                   <motion.div
 1200 |                     key={c.id}
 1201 |                     initial={reduceMotion ? false : { opacity: 0, y: 14 }}
 1202 |                     animate={reduceMotion ? false : { opacity: 1, y: 0 }}
 1203 |                     transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
 1204 |                     className="hidden lg:block"
 1205 |                   >
 1206 |                     <ContractRow
 1207 |                       contract={c}
 1208 |                       active={String(c.id) === String(selectedId)}
 1209 |                       onSelect={() => setSelectedId(String(c.id))}
 1210 |                     />
 1211 |                   </motion.div>
 1212 |                 )) : (
 1213 |                   <div className="rounded-2xl bg-[#ffffff] p-8 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:text-slate-300 dark:ring-slate-800">
 1214 |                     No contracts found.
 1215 |                   </div>
 1216 |                 )}
 1217 | 
 1218 |                 {visibleContracts.length ? (
 1219 |                   <div className="grid gap-3 lg:hidden">
 1220 |                     {visibleContracts.map((c) => (
 1221 |                       <ContractRow
 1222 |                         key={c.id}
 1223 |                         contract={c}
 1224 |                         active={String(c.id) === String(selectedId)}
 1225 |                         onSelect={() => openDetails(c.id)}
 1226 |                       />
 1227 |                     ))}
 1228 |                   </div>
 1229 |                 ) : null}
 1230 |               </div>
 1231 |             </div>
 1232 | 
 1233 |             <div className="hidden lg:col-span-7 lg:block">
 1234 |               {detailPanel}
 1235 |             </div>
 1236 |           </div>
 1237 |         ) : null}
 1238 | 
 1239 |         <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
 1240 |           {detailPanel}
 1241 |         </Drawer>
 1242 | 
 1243 |         {draftOpen ? (
 1244 |           <div className="fixed inset-0 z-50">
 1245 |             <div className="absolute inset-0 bg-slate-900/30" onClick={() => setDraftOpen(false)} />
 1246 |             <div className="absolute left-1/2 top-10 w-[min(40rem,92vw)] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl">
 1247 |               <div className="flex items-start justify-between gap-4">
 1248 |                 <div>
 1249 |                   <div className="text-xs font-semibold text-[#0A66C2]">New</div>
 1250 |                   <div className="mt-1 text-lg font-bold text-slate-900">Create contract draft</div>
 1251 |                   <div className="mt-1 text-xs text-slate-600">Banking references are optional and should be used only for fraud prevention.</div>
 1252 |                 </div>
 1253 |                 <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100">Close</button>
 1254 |               </div>
 1255 | 
 1256 |               <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
 1257 |                 <input value={draftForm.title} onChange={(e) => setDraftForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
 1258 |                 <input value={draftForm.buyer_name} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_name: e.target.value }))} placeholder="Buyer name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
 1259 |                 <input value={draftForm.factory_name} onChange={(e) => setDraftForm((p) => ({ ...p, factory_name: e.target.value }))} placeholder="Factory name" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
 1260 |                 <input value={draftForm.buyer_id} onChange={(e) => setDraftForm((p) => ({ ...p, buyer_id: e.target.value }))} placeholder="Buyer user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
 1261 |                 <input value={draftForm.factory_id} onChange={(e) => setDraftForm((p) => ({ ...p, factory_id: e.target.value }))} placeholder="Factory user ID" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
 1262 |                 <div className="hidden sm:block" />
 1263 | 
 1264 |                 <input value={draftForm.bank_name} onChange={(e) => setDraftForm((p) => ({ ...p, bank_name: e.target.value }))} placeholder="Bank name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
 1265 |                 <input value={draftForm.beneficiary_name} onChange={(e) => setDraftForm((p) => ({ ...p, beneficiary_name: e.target.value }))} placeholder="Beneficiary name (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none" />
 1266 |                 <input value={draftForm.transaction_reference} onChange={(e) => setDraftForm((p) => ({ ...p, transaction_reference: e.target.value }))} placeholder="Transaction reference (optional)" className="rounded-xl borderless-shadow px-3 py-2 text-sm outline-none sm:col-span-2" />
 1267 |               </div>
 1268 | 
 1269 |               <div className="mt-6 flex items-center justify-end gap-2">
 1270 |                 <button type="button" onClick={() => setDraftOpen(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">Cancel</button>
 1271 |                 <button
 1272 |                   type="button"
 1273 |                   disabled={!canCreateDraft(currentUser) || saving}
 1274 |                   onClick={handleCreateDraft}
 1275 |                   className="rounded-full bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500"
 1276 |                 >
 1277 |                   Create draft
 1278 |                 </button>
 1279 |               </div>
 1280 |             </div>
 1281 |           </div>
 1282 |         ) : null}
 1283 |       </div>
 1284 |     </div>
 1285 |   )
 1286 | }
 1287 | 