    1 | /*
    2 |   Routes: /verification and /verification-center
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
   13 |     - Let users upload required verification documents based on role + buyer region.
   14 |     - Show verification status per document (submitted, missing, etc.).
   15 |     - Enforce subscription rules (verification is subscription-based and renewed).
   16 | 
   17 |   Key API endpoints:
   18 |     - GET /api/verification/me
   19 |     - POST /api/verification/me  (update documents + upload references)
   20 |     - GET /api/subscriptions/me
   21 | 
   22 |   Notes:
   23 |     - Buyer required documents vary by region (EU/USA/OTHER), derived from country.
   24 | */
   25 | import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
   26 | import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
   27 | import { BUYER_COUNTRY_OPTIONS, isEuCountry } from '../../shared/config/geo.js'
   28 | 
   29 | const LABELS = {
   30 |   // Human-readable labels for backend document keys.
   31 |   company_registration: 'Company Registration',
   32 |   trade_license: 'Trade License',
   33 |   tin: 'TIN (Tax Identification Number)',
   34 |   authorized_person_nid: 'Authorized Person NID',
   35 |   bank_proof: 'Company Bank Proof',
   36 |   erc: 'ERC (Export Registration Certificate)',
   37 | 
   38 |   vat: 'VAT Number',
   39 |   eori: 'EORI (Economic Operators Registration and Identification)',
   40 |   ein: 'EIN (Employer Identification Number)',
   41 |   ior: 'IOR (Importer of Record)',
   42 | }
   43 | 
   44 | const REQUIRED_BY_ROLE = {
   45 |   // Required document keys per role (non-buyers).
   46 |   factory: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof', 'erc'],
   47 |   buying_house: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof'],
   48 | }
   49 | 
   50 | const REQUIRED_BUYER_BY_REGION = {
   51 |   // Buyers have region-specific requirements (derived from their selected country).
   52 |   EU: ['company_registration', 'vat', 'eori', 'bank_proof'],
   53 |   USA: ['company_registration', 'ein', 'ior', 'bank_proof'],
   54 |   OTHER: ['company_registration', 'bank_proof'],
   55 | }
   56 | 
   57 | function normalizeBuyerRegionFromCountry(country) {
   58 |   // Convert a free-form country value into a normalized region bucket.
   59 |   // Used to pick the buyer verification checklist.
   60 |   const value = String(country || '').trim()
   61 |   if (!value) return 'OTHER'
   62 |   if (isEuCountry(value)) return 'EU'
   63 |   const upper = value.toUpperCase()
   64 |   if (upper === 'USA' || upper === 'US' || upper === 'UNITED STATES' || upper === 'UNITED STATES OF AMERICA') return 'USA'
   65 |   return 'OTHER'
   66 | }
   67 | 
   68 | function statusChipClass(status) {
   69 |   // Visual chip class for the per-document status.
   70 |   if (status === 'submitted') return 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
   71 |   return 'bg-rose-50 text-rose-800 ring-1 ring-rose-200'
   72 | }
   73 | 
   74 | export default function VerificationPage() {
   75 |   const user = getCurrentUser()
   76 |   const token = getToken()
   77 |   const role = user?.role || 'buyer'
   78 | 
   79 |   const [verification, setVerification] = useState(null)
   80 |   const [buyerCountry, setBuyerCountry] = useState('')
   81 |   const [busyDoc, setBusyDoc] = useState('')
   82 |   const [savingCountry, setSavingCountry] = useState(false)
   83 |   const [error, setError] = useState('')
   84 |   const [feedback, setFeedback] = useState('')
   85 |   const [optionalLicenseInput, setOptionalLicenseInput] = useState('')
   86 |   const [renewing, setRenewing] = useState(false)
   87 | 
   88 |   const fileInputRef = useRef(null)
   89 |   const pendingDocRef = useRef('')
   90 | 
   91 |   const buyerRegion = useMemo(() => {
   92 |     if (role !== 'buyer') return ''
   93 |     return normalizeBuyerRegionFromCountry(buyerCountry)
   94 |   }, [buyerCountry, role])
   95 | 
   96 |   const requiredDocs = useMemo(() => {
   97 |     if (role === 'buyer') return REQUIRED_BUYER_BY_REGION[buyerRegion] || REQUIRED_BUYER_BY_REGION.OTHER
   98 |     return REQUIRED_BY_ROLE[role] || []
   99 |   }, [buyerRegion, role])
  100 | 
  101 |   const documents = verification?.documents || {}
  102 |   const optionalLicenses = Array.isArray(documents.optional_licenses) ? documents.optional_licenses.filter(Boolean) : []
  103 | 
  104 |   const loadStatus = useCallback(async () => {
  105 |     if (!token) return
  106 |     setError('')
  107 |     setFeedback('')
  108 |     try {
  109 |       const verificationData = await apiRequest('/verification/me', { token })
  110 |       setVerification(verificationData)
  111 |       setBuyerCountry(String(verificationData?.documents?.buyer_country || ''))
  112 |     } catch (err) {
  113 |       setError(err.message || 'Could not load verification center data')
  114 |     }
  115 |   }, [token])
  116 | 
  117 |   useEffect(() => {
  118 |     loadStatus()
  119 |   }, [loadStatus])
  120 | 
  121 |   useEffect(() => {
  122 |     if (!token || role !== 'buyer') return
  123 |     if (!buyerCountry) return
  124 | 
  125 |     const currentCountry = String(verification?.documents?.buyer_country || '')
  126 |     const currentRegion = String(verification?.documents?.buyer_region || '')
  127 |     const nextRegion = normalizeBuyerRegionFromCountry(buyerCountry)
  128 |     if (currentCountry === buyerCountry && currentRegion === nextRegion) return
  129 | 
  130 |     const timeoutId = setTimeout(async () => {
  131 |       try {
  132 |         setSavingCountry(true)
  133 |         const updatedDocs = {
  134 |           ...(verification?.documents || {}),
  135 |           buyer_country: buyerCountry,
  136 |           buyer_region: nextRegion,
  137 |         }
  138 |         await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
  139 |         setVerification((prev) => ({ ...(prev || {}), documents: updatedDocs }))
  140 |       } catch {
  141 |         setError('Could not save buyer country. Please try again.')
  142 |       } finally {
  143 |         setSavingCountry(false)
  144 |       }
  145 |     }, 350)
  146 | 
  147 |     return () => clearTimeout(timeoutId)
  148 |   }, [buyerCountry, role, token, verification])
  149 | 
  150 |   async function requestUpload(documentKey, file) {
  151 |     if (!file || !token) return
  152 |     setBusyDoc(documentKey)
  153 |     setFeedback('')
  154 |     setError('')
  155 | 
  156 |     try {
  157 |       const form = new FormData()
  158 |       form.append('file', file)
  159 |       form.append('type', documentKey)
  160 |       form.append('entity_type', 'verification')
  161 | 
  162 |       const uploadRes = await fetch(`${API_BASE}/documents`, {
  163 |         method: 'POST',
  164 |         headers: { Authorization: `Bearer ${token}` },
  165 |         body: form,
  166 |       })
  167 | 
  168 |       const uploadData = await uploadRes.json().catch(() => ({}))
  169 |       if (!uploadRes.ok) throw new Error(uploadData.error || 'Document upload failed')
  170 | 
  171 |       const updatedDocs = {
  172 |         ...(verification?.documents || {}),
  173 |         [documentKey]: 'uploaded',
  174 |         ...(role === 'buyer' ? { buyer_country: buyerCountry, buyer_region: normalizeBuyerRegionFromCountry(buyerCountry) } : {}),
  175 |       }
  176 | 
  177 |       await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
  178 |       setVerification((prev) => ({ ...(prev || {}), documents: updatedDocs }))
  179 |       setFeedback(`${LABELS[documentKey] || documentKey} uploaded and verification state updated.`)
  180 |     } catch (err) {
  181 |       setError(err.message || 'Upload failed')
  182 |     } finally {
  183 |       setBusyDoc('')
  184 |     }
  185 |   }
  186 | 
  187 |   function openPicker(documentKey) {
  188 |     pendingDocRef.current = documentKey
  189 |     fileInputRef.current?.click()
  190 |   }
  191 | 
  192 |   async function onFileSelected(event) {
  193 |     const file = event.target.files?.[0]
  194 |     const documentKey = pendingDocRef.current
  195 |     event.target.value = ''
  196 |     if (!file || !documentKey) return
  197 |     await requestUpload(documentKey, file)
  198 |   }
  199 | 
  200 |   async function addOptionalLicense() {
  201 |     const nextValue = optionalLicenseInput.trim()
  202 |     if (!nextValue || !token) return
  203 |     setOptionalLicenseInput('')
  204 |     setFeedback('')
  205 |     setError('')
  206 |     try {
  207 |       const updatedDocs = {
  208 |         ...(verification?.documents || {}),
  209 |         optional_licenses: [...optionalLicenses, nextValue],
  210 |         ...(role === 'buyer' ? { buyer_country: buyerCountry, buyer_region: normalizeBuyerRegionFromCountry(buyerCountry) } : {}),
  211 |       }
  212 |       const updated = await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
  213 |       setVerification(updated)
  214 |       setFeedback('Optional license saved.')
  215 |     } catch (err) {
  216 |       setError(err.message || 'Could not save optional license')
  217 |     }
  218 |   }
  219 | 
  220 |   async function removeOptionalLicense(value) {
  221 |     if (!token) return
  222 |     setFeedback('')
  223 |     setError('')
  224 |     try {
  225 |       const updatedDocs = {
  226 |         ...(verification?.documents || {}),
  227 |         optional_licenses: optionalLicenses.filter((x) => x !== value),
  228 |         ...(role === 'buyer' ? { buyer_country: buyerCountry, buyer_region: normalizeBuyerRegionFromCountry(buyerCountry) } : {}),
  229 |       }
  230 |       const updated = await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
  231 |       setVerification(updated)
  232 |       setFeedback('Optional license removed.')
  233 |     } catch (err) {
  234 |       setError(err.message || 'Could not remove optional license')
  235 |     }
  236 |   }
  237 | 
  238 |   async function handleRenewVerification() {
  239 |     if (!token) return
  240 |     setError('')
  241 |     setFeedback('')
  242 |     setRenewing(true)
  243 |     try {
  244 |       const res = await apiRequest('/verification/renew', { method: 'POST', token })
  245 |       if (res?.verification) setVerification(res.verification)
  246 |       const price = Number(res?.price_usd || 0)
  247 |       setFeedback(`Verification subscription updated. Charged $${price.toFixed(2)}.`)
  248 |     } catch (err) {
  249 |       setError(err.message || 'Verification payment failed')
  250 |     } finally {
  251 |       setRenewing(false)
  252 |     }
  253 |   }
  254 | 
  255 |   const credibilityScore = verification?.credibility?.score ?? 0
  256 |   const credibilityBadge = verification?.credibility?.badge || 'Basic credibility'
  257 |   const verified = Boolean(verification?.verified)
  258 |   const reviewStatus = verification?.review_status || (verified ? 'approved' : 'pending')
  259 |   const reviewReason = verification?.review_reason || ''
  260 |   const remainingDays = Number(verification?.subscription_remaining_days || 0)
  261 |   const expiringSoon = Boolean(verification?.expiring_soon)
  262 | 
  263 |   return (
  264 |     <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
  265 |       <header className="rounded-2xl borderless-shadow bg-white p-5">
  266 |         <h1 className="text-2xl font-bold">Verification Center</h1>
  267 |         <p className="text-sm text-slate-600 mt-1">Verification is subscription-based and renews monthly.</p>
  268 |         <p className="text-xs text-slate-500 mt-1">First month: $1.99 â€¢ Renewals: $6.99/month</p>
  269 |         <p className="text-xs text-slate-500 mt-2">Review status: <span className="font-semibold">{reviewStatus}</span>{reviewReason ? ` â€¢ ${reviewReason}` : ''}</p>
  270 |         <p className="text-xs text-slate-500 mt-2">Need help* Visit the <a href="/help" className="underline text-slate-700">Help Center</a>.</p>
  271 |       </header>
  272 | 
  273 |       <section className="grid gap-4 md:grid-cols-3">
  274 |         <div className="rounded-2xl borderless-shadow bg-white p-5 md:col-span-2 space-y-4">
  275 |           <div className="flex items-start justify-between gap-3">
  276 |             <div>
  277 |               <p className="text-sm font-bold text-slate-900">Your requirements</p>
  278 |               <p className="text-[11px] text-slate-500">Role-based checklist. Uploading more proof increases credibility.</p>
  279 |             </div>
  280 |             <div className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200'}`}>
  281 |               {verified ? 'Verified' : 'Not verified'}
  282 |             </div>
  283 |           </div>
  284 | 
  285 |           {role === 'buyer' ? (
  286 |             <div className="rounded-xl borderless-shadow bg-slate-50 p-4">
  287 |               <div className="flex flex-wrap items-center gap-2">
  288 |                 <label className="text-sm font-semibold text-slate-700" htmlFor="buyer-country">Buyer Country</label>
  289 |                 <select
  290 |                   id="buyer-country"
  291 |                   value={buyerCountry}
  292 |                   onChange={(e) => setBuyerCountry(e.target.value)}
  293 |                   className="text-sm borderless-shadow rounded-xl px-3 py-2 bg-white"
  294 |                 >
  295 |                   <option value="">Select country</option>
  296 |                   {BUYER_COUNTRY_OPTIONS.map((country) => <option key={country} value={country}>{country}</option>)}
  297 |                 </select>
  298 |                 {savingCountry ? <span className="text-xs text-slate-500">Saving...</span> : null}
  299 |                 <span className="text-xs text-slate-600">Region: <span className="font-semibold">{buyerRegion}</span></span>
  300 |               </div>
  301 |               {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
  302 |             </div>
  303 |           ) : null}
  304 | 
  305 |           <div className="grid gap-3 md:grid-cols-2">
  306 |             {requiredDocs.map((documentKey) => {
  307 |               const submitted = Boolean(documents?.[documentKey])
  308 |               const status = submitted ? 'submitted' : 'missing'
  309 |               return (
  310 |                 <div key={documentKey} className="rounded-2xl borderless-shadow bg-white p-4 flex items-center justify-between gap-3">
  311 |                   <div className="min-w-0">
  312 |                     <p className="text-sm font-semibold text-slate-900 truncate">{LABELS[documentKey] || documentKey}</p>
  313 |                     <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
  314 |                   </div>
  315 |                   <div className="flex items-center gap-2">
  316 |                     <span className={`rounded-full borderless-shadow px-3 py-1 text-xs font-bold${statusChipClass(status)}`}>{status}</span>
  317 |                     <button
  318 |                       type="button"
  319 |                       onClick={() => openPicker(documentKey)}
  320 |                       disabled={busyDoc === documentKey || (role === 'buyer' && !buyerCountry)}
  321 |                       className="rounded-full borderless-shadow px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
  322 |                     >
  323 |                       {busyDoc === documentKey ? 'Uploading...' : 'Upload'}
  324 |                     </button>
  325 |                   </div>
  326 |                 </div>
  327 |               )
  328 |             })}
  329 |           </div>
  330 | 
  331 |           <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
  332 |             <p className="text-sm font-bold text-slate-900">Optional licenses</p>
  333 |             <p className="mt-1 text-[11px] text-slate-500">Optional proofs can be added anytime. More proof = more trust.</p>
  334 |             <div className="mt-3 flex flex-col sm:flex-row gap-2">
  335 |               <input
  336 |                 value={optionalLicenseInput}
  337 |                 onChange={(e) => setOptionalLicenseInput(e.target.value)}
  338 |                 placeholder="e.g. OEKO-TEX, BSCI, WRAP..."
  339 |                 className="flex-1 rounded-full borderless-shadow bg-white px-4 py-2 text-sm"
  340 |               />
  341 |               <button
  342 |                 type="button"
  343 |                 onClick={addOptionalLicense}
  344 |                 className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
  345 |               >
  346 |                 Add
  347 |               </button>
  348 |             </div>
  349 |             <div className="mt-3 flex flex-wrap gap-2">
  350 |               {optionalLicenses.map((lic) => (
  351 |                 <button
  352 |                   key={lic}
  353 |                   type="button"
  354 |                   onClick={() => removeOptionalLicense(lic)}
  355 |                   className="rounded-full borderless-shadow bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50"
  356 |                   title="Remove"
  357 |                 >
  358 |                   {lic} ✕
  359 |                 </button>
  360 |               ))}
  361 |               {!optionalLicenses.length ? <p className="text-xs text-slate-500">No optional licenses yet.</p> : null}
  362 |             </div>
  363 |           </div>
  364 | 
  365 |           {feedback ? <div className="text-sm text-emerald-700">{feedback}</div> : null}
  366 |           {error ? <div className="text-sm text-rose-700">{error}</div> : null}
  367 |         </div>
  368 | 
  369 |         <aside className="rounded-2xl borderless-shadow bg-white p-5 space-y-3">
  370 |           <p className="text-sm font-bold text-slate-900">Credibility</p>
  371 |           <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
  372 |             <p className="text-3xl font-extrabold text-slate-900">{credibilityScore}/100</p>
  373 |             <p className="mt-1 text-sm font-semibold text-slate-800">{credibilityBadge}</p>
  374 |             <p className="mt-2 text-xs text-slate-600">More licensing proof increases credibility and international trust.</p>
  375 |           </div>
  376 | 
  377 |           <div className="rounded-2xl borderless-shadow bg-slate-50 p-4">
  378 |             <p className="text-xs text-slate-500">Subscription</p>
  379 |             <p className="mt-1 text-sm font-semibold text-slate-900">{remainingDays > 0 ? 'Active' : 'Inactive'}</p>
  380 |             <p className="mt-1 text-[11px] text-slate-600">Verification approval requires an active verification subscription.</p>
  381 |             {remainingDays ? (
  382 |               <p className={`mt-2 text-[11px]${expiringSoon ? 'text-amber-700' : 'text-slate-600'}`}>
  383 |                 Remaining: {remainingDays} day{remainingDays === 1 ? '' : 's'} {expiringSoon ? '(expiring soon)' : ''}
  384 |               </p>
  385 |             ) : null}
  386 |           </div>
  387 | 
  388 |           <button
  389 |             type="button"
  390 |             onClick={handleRenewVerification}
  391 |             disabled={renewing}
  392 |             className="w-full rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-70"
  393 |           >
  394 |             {renewing ? 'Processing...' : 'Pay / Renew Verification'}
  395 |           </button>
  396 | 
  397 |           <button
  398 |             type="button"
  399 |             onClick={loadStatus}
  400 |             className="w-full rounded-full borderless-shadow bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
  401 |           >
  402 |             Refresh status
  403 |           </button>
  404 |         </aside>
  405 |       </section>
  406 | 
  407 |       <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelected} />
  408 |     </div>
  409 |   )
  410 | }
  411 | 
  412 | 