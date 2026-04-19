/*
  Routes: /verification and /verification-center
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Public Pages:
    /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
  Protected Pages (login required):
    /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    /notifications, /chat, /call, /verification, /verification-center

  Primary responsibilities:
    - Let users upload required verification documents based on role + buyer region.
    - Show verification status per document (submitted, missing, etc.).
    - Enforce subscription rules (verification is subscription-based and renewed).

  Key API endpoints:
    - GET /api/verification/me
    - POST /api/verification/me  (update documents + upload references)
    - GET /api/subscriptions/me

  Notes:
    - Buyer required documents vary by region (EU/USA/OTHER), derived from country.
*/
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
import { BUYER_COUNTRY_OPTIONS, EU_COUNTRIES, isEuCountry } from '../../shared/config/geo.js'

const LABELS = {
  // Human-readable labels for backend document keys.
  company_registration: 'Company Registration',
  trade_license: 'Trade License',
  tin: 'TIN (Tax Identification Number)',
  authorized_person_nid: 'Authorized Person NID',
  bank_proof: 'Company Bank Proof',
  erc: 'ERC (Export Registration Certificate)',

  vat: 'VAT Number',
  eori: 'EORI (Economic Operators Registration and Identification)',
  ein: 'EIN (Employer Identification Number)',
  ior: 'IOR (Importer of Record)',
}

const REQUIRED_BY_ROLE = {
  // Required document keys per role (non-buyers).
  factory: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof', 'erc'],
  buying_house: ['company_registration', 'trade_license', 'tin', 'authorized_person_nid', 'bank_proof'],
}

const REQUIRED_BUYER_BY_REGION = {
  // Buyers have region-specific requirements (derived from their selected country).
  EU: ['company_registration', 'vat', 'eori', 'bank_proof'],
  USA: ['company_registration', 'ein', 'ior', 'bank_proof'],
  OTHER: ['company_registration', 'bank_proof'],
}

function normalizeBuyerRegionFromCountry(country) {
  // Convert a free-form country value into a normalized region bucket.
  // Used to pick the buyer verification checklist.
  const value = String(country || '').trim()
  if (!value) return 'OTHER'
  if (isEuCountry(value)) return 'EU'
  const upper = value.toUpperCase()
  if (upper === 'USA' || upper === 'US' || upper === 'UNITED STATES' || upper === 'UNITED STATES OF AMERICA') return 'USA'
  return 'OTHER'
}

function statusChipClass(status) {
  // Visual chip class for the per-document status.
  if (status === 'submitted') return 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
  return 'bg-rose-50 text-rose-800 ring-1 ring-rose-200'
}

export default function VerificationPage() {
  const user = getCurrentUser()
  const token = getToken()
  const role = user?.role || 'buyer'

  const [verification, setVerification] = useState(null)
  const [buyerCountry, setBuyerCountry] = useState('')
  const [busyDoc, setBusyDoc] = useState('')
  const [savingCountry, setSavingCountry] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [optionalLicenseInput, setOptionalLicenseInput] = useState('')
  const [renewing, setRenewing] = useState(false)

  const fileInputRef = useRef(null)
  const pendingDocRef = useRef('')

  const buyerRegion = useMemo(() => {
    if (role !== 'buyer') return ''
    return normalizeBuyerRegionFromCountry(buyerCountry)
  }, [buyerCountry, role])

  const requiredDocs = useMemo(() => {
    if (role === 'buyer') return REQUIRED_BUYER_BY_REGION[buyerRegion] || REQUIRED_BUYER_BY_REGION.OTHER
    return REQUIRED_BY_ROLE[role] || []
  }, [buyerRegion, role])

  const documents = verification?.documents || {}
  const optionalLicenses = Array.isArray(documents.optional_licenses) ? documents.optional_licenses.filter(Boolean) : []

  const loadStatus = useCallback(async () => {
    if (!token) return
    setError('')
    setFeedback('')
    try {
      const verificationData = await apiRequest('/verification/me', { token })
      setVerification(verificationData)
      setBuyerCountry(String(verificationData?.documents?.buyer_country || ''))
    } catch (err) {
      setError(err.message || 'Could not load verification center data')
    }
  }, [token])

  useEffect(() => {
    loadStatus()
  }, [loadStatus])

  useEffect(() => {
    if (!token || role !== 'buyer') return
    if (!buyerCountry) return

    const currentCountry = String(verification?.documents?.buyer_country || '')
    const currentRegion = String(verification?.documents?.buyer_region || '')
    const nextRegion = normalizeBuyerRegionFromCountry(buyerCountry)
    if (currentCountry === buyerCountry && currentRegion === nextRegion) return

    const timeoutId = setTimeout(async () => {
      try {
        setSavingCountry(true)
        const updatedDocs = {
          ...(verification?.documents || {}),
          buyer_country: buyerCountry,
          buyer_region: nextRegion,
        }
        await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
        setVerification((prev) => ({ ...(prev || {}), documents: updatedDocs }))
      } catch {
        setError('Could not save buyer country. Please try again.')
      } finally {
        setSavingCountry(false)
      }
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [buyerCountry, role, token, verification])

  async function requestUpload(documentKey, file) {
    if (!file || !token) return
    setBusyDoc(documentKey)
    setFeedback('')
    setError('')

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('type', documentKey)
      form.append('entity_type', 'verification')

      const uploadRes = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })

      const uploadData = await uploadRes.json().catch(() => ({}))
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Document upload failed')

      const updatedDocs = {
        ...(verification?.documents || {}),
        [documentKey]: 'uploaded',
        ...(role === 'buyer' ? { buyer_country: buyerCountry, buyer_region: normalizeBuyerRegionFromCountry(buyerCountry) } : {}),
      }

      await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
      setVerification((prev) => ({ ...(prev || {}), documents: updatedDocs }))
      setFeedback(`${LABELS[documentKey] || documentKey} uploaded and verification state updated.`)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setBusyDoc('')
    }
  }

  function openPicker(documentKey) {
    pendingDocRef.current = documentKey
    fileInputRef.current?.click()
  }

  async function onFileSelected(event) {
    const file = event.target.files?.[0]
    const documentKey = pendingDocRef.current
    event.target.value = ''
    if (!file || !documentKey) return
    await requestUpload(documentKey, file)
  }

  async function addOptionalLicense() {
    const nextValue = optionalLicenseInput.trim()
    if (!nextValue || !token) return
    setOptionalLicenseInput('')
    setFeedback('')
    setError('')
    try {
      const updatedDocs = {
        ...(verification?.documents || {}),
        optional_licenses: [...optionalLicenses, nextValue],
        ...(role === 'buyer' ? { buyer_country: buyerCountry, buyer_region: normalizeBuyerRegionFromCountry(buyerCountry) } : {}),
      }
      const updated = await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
      setVerification(updated)
      setFeedback('Optional license saved.')
    } catch (err) {
      setError(err.message || 'Could not save optional license')
    }
  }

  async function removeOptionalLicense(value) {
    if (!token) return
    setFeedback('')
    setError('')
    try {
      const updatedDocs = {
        ...(verification?.documents || {}),
        optional_licenses: optionalLicenses.filter((x) => x !== value),
        ...(role === 'buyer' ? { buyer_country: buyerCountry, buyer_region: normalizeBuyerRegionFromCountry(buyerCountry) } : {}),
      }
      const updated = await apiRequest('/verification/me', { method: 'POST', token, body: { documents: updatedDocs } })
      setVerification(updated)
      setFeedback('Optional license removed.')
    } catch (err) {
      setError(err.message || 'Could not remove optional license')
    }
  }

  async function handleRenewVerification() {
    if (!token) return
    setError('')
    setFeedback('')
    setRenewing(true)
    try {
      const res = await apiRequest('/verification/renew', { method: 'POST', token })
      if (res?.verification) setVerification(res.verification)
      const price = Number(res?.price_usd || 0)
      setFeedback(`Verification subscription updated. Charged $${price.toFixed(2)}.`)
    } catch (err) {
      setError(err.message || 'Verification payment failed')
    } finally {
      setRenewing(false)
    }
  }

  const credibilityScore = verification?.credibility?.score ?? 0
  const credibilityBadge = verification?.credibility?.badge || 'Basic credibility'
  const verified = Boolean(verification?.verified)
  const reviewStatus = verification?.review_status || (verified ? 'approved' : 'pending')
  const reviewReason = verification?.review_reason || ''
  const remainingDays = Number(verification?.subscription_remaining_days || 0)
  const expiringSoon = Boolean(verification?.expiring_soon)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white dark:bg-white/5 p-5 ring-1 ring-slate-200/60 dark:ring-white/10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Verification Center</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Verification is subscription-based and renews monthly.</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">First month: $1.99 • Renewals: $6.99/month</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Review status: <span className="font-semibold text-slate-700 dark:text-slate-200">{reviewStatus}</span>{reviewReason ? ` • ${reviewReason}` : ''}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Need help? Visit the <a href="/help" className="underline text-slate-700 dark:text-slate-200">Help Center</a>.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white dark:bg-white/5 p-5 md:col-span-2 space-y-4 ring-1 ring-slate-200/60 dark:ring-white/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Your requirements</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Role-based checklist. Uploading more proof increases credibility.</p>
            </div>
            <div className={`rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-bold ${verified ? 'bg-[#0A66C2]/10 text-[#0A66C2] ring-1 ring-[#0A66C2]/30' : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 ring-1 ring-slate-200 dark:ring-white/10'}`}>
              {verified ? 'Verified' : 'Not verified'}
            </div>
          </div>

          {role === 'buyer' ? (
            <div className="rounded-xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 dark:bg-white/5 p-4 ring-1 ring-slate-200/60 dark:ring-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="buyer-country">Buyer Country</label>
                <select
                  id="buyer-country"
                  value={buyerCountry}
                  onChange={(e) => setBuyerCountry(e.target.value)}
                  className="text-sm shadow-borderless dark:shadow-borderlessDark rounded-xl px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 ring-1 ring-slate-200/60 dark:ring-white/10"
                >
                  <option value="">Select country</option>
                  {BUYER_COUNTRY_OPTIONS.map((country) => <option key={country} value={country}>{country}</option>)}
                </select>
                {savingCountry ? <span className="text-xs text-slate-500 dark:text-slate-400">Saving...</span> : null}
                <span className="text-xs text-slate-600 dark:text-slate-300">Region: <span className="font-semibold">{buyerRegion}</span></span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                EU buyers need: <span className="font-semibold">Business Registration + VAT Number + EORI + Bank proof</span>.
                USA buyers need: <span className="font-semibold">Business Registration + EIN + IOR + Bank proof</span>.
              </p>
              <details className="mt-2 rounded-lg bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 ring-1 ring-slate-200/60 dark:ring-white/10">
                <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">Show EU country list</summary>
                <p className="mt-2 leading-relaxed">{EU_COUNTRIES.join(', ')}</p>
              </details>
              {!buyerCountry ? <p className="mt-2 text-xs text-rose-700">Buyer country is required before completing buyer verification.</p> : null}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {requiredDocs.map((documentKey) => {
              const submitted = Boolean(documents?.[documentKey])
              const status = submitted ? 'submitted' : 'missing'
              return (
                <div key={documentKey} className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white dark:bg-slate-950 p-4 flex items-center justify-between gap-3 ring-1 ring-slate-200/60 dark:ring-white/10">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{LABELS[documentKey] || documentKey}</p>
                    <p className="text-[11px] text-slate-500 truncate">{submitted ? 'Submitted' : 'Missing'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-1 text-xs font-bold${statusChipClass(status)}`}>{status}</span>
                    <button
                      type="button"
                      onClick={() => openPicker(documentKey)}
                      disabled={busyDoc === documentKey || (role === 'buyer' && !buyerCountry)}
                      className="rounded-full shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed ring-1 ring-slate-200/60 dark:ring-white/10"
                    >
                      {busyDoc === documentKey ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 dark:bg-white/5 p-4 ring-1 ring-slate-200/60 dark:ring-white/10">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Optional licenses</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Optional proofs can be added anytime. More proof = more trust.</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                value={optionalLicenseInput}
                onChange={(e) => setOptionalLicenseInput(e.target.value)}
                placeholder="e.g. OEKO-TEX, BSCI, WRAP..."
                className="flex-1 rounded-full shadow-borderless dark:shadow-borderlessDark bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 ring-1 ring-slate-200/60 dark:ring-white/10"
              />
              <button
                type="button"
                onClick={addOptionalLicense}
                className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {optionalLicenses.map((lic) => (
                <button
                  key={lic}
                  type="button"
                  onClick={() => removeOptionalLicense(lic)}
                  className="rounded-full shadow-borderless dark:shadow-borderlessDark bg-white dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 ring-1 ring-slate-200/60 dark:ring-white/10"
                  title="Remove"
                >
                  {lic} ✕
                </button>
              ))}
              {!optionalLicenses.length ? <p className="text-xs text-slate-500">No optional licenses yet.</p> : null}
            </div>
          </div>

          {feedback ? <div className="text-sm text-emerald-700">{feedback}</div> : null}
          {error ? <div className="text-sm text-rose-700">{error}</div> : null}
        </div>

        <aside className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white dark:bg-white/5 p-5 space-y-3 ring-1 ring-slate-200/60 dark:ring-white/10">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-50">Credibility</p>
          <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 dark:bg-white/5 p-4 ring-1 ring-slate-200/60 dark:ring-white/10">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">{credibilityScore}/100</p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{credibilityBadge}</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">More licensing proof increases credibility and international trust.</p>
          </div>

          <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 dark:bg-white/5 p-4 ring-1 ring-slate-200/60 dark:ring-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">Subscription</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">{remainingDays > 0 ? 'Active' : 'Inactive'}</p>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">Verification approval requires an active verification subscription.</p>
            {remainingDays ? (
              <p className={`mt-2 text-[11px] ${expiringSoon ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'}`}>
                Remaining: {remainingDays} day{remainingDays === 1 ? '' : 's'} {expiringSoon ? '(expiring soon)' : ''}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleRenewVerification}
            disabled={renewing}
            className="w-full rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-70"
          >
            {renewing ? 'Processing...' : 'Pay / Renew Verification'}
          </button>

          <button
            type="button"
            onClick={loadStatus}
            className="w-full rounded-full shadow-borderless dark:shadow-borderlessDark bg-white dark:bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 ring-1 ring-slate-200/60 dark:ring-white/10"
          >
            Refresh status
          </button>
        </aside>
      </section>

      <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelected} />
    </div>
  )
}
