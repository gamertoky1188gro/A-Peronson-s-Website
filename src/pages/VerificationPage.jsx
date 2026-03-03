import React, { useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
import { BUYER_COUNTRY_OPTIONS, isEuCountry, verificationRegionFromCountry } from '../../shared/config/geo.js'

const DOCUMENT_MATRIX = {
  common: {
    required: ['company_registration', 'authorized_person_id'],
    optional: ['bank_reference_letter'],
  },
  role: {
    factory: {
      required: ['trade_license', 'tin', 'factory_compliance_certificate', 'bank_proof', 'erc'],
      optional: ['production_floor_video'],
    },
    buying_house: {
      required: ['trade_license', 'tin', 'agency_authorization', 'bank_proof'],
      optional: ['buyer_reference_letter'],
    },
    buyer: {
      required: ['bank_proof'],
      optional: ['purchase_policy'],
    },
  },
  region: {
    eu: {
      required: ['vat', 'eori'],
      optional: ['reach_compliance'],
    },
    us: {
      required: ['ein', 'ior'],
      optional: ['ctpat_statement'],
    },
    apac: {
      required: ['export_license'],
      optional: ['origin_certificate'],
    },
    global: {
      required: ['cross_border_tax_document'],
      optional: ['incoterms_declaration'],
    },
  },
}

const LABELS = {
  company_registration: 'Company Registration',
  trade_license: 'Trade License',
  authorized_person_id: 'Authorized Person ID',
  bank_reference_letter: 'Bank Reference Letter',
  factory_compliance_certificate: 'Factory Compliance Certificate',
  production_floor_video: 'Production Floor Video',
  agency_authorization: 'Agency Authorization Letter',
  buyer_reference_letter: 'Buyer Reference Letter',
  bank_proof: 'Company Bank Proof',
  purchase_policy: 'Purchase Policy',
  vat: 'VAT Registration',
  eori: 'EORI Registration',
  reach_compliance: 'REACH Compliance',
  ein: 'EIN Confirmation',
  ior: 'Importer of Record (IOR)',
  ctpat_statement: 'C-TPAT Statement',
  export_license: 'Export License',
  origin_certificate: 'Certificate of Origin',
  cross_border_tax_document: 'Cross-border Tax Document',
  incoterms_declaration: 'Incoterms Declaration',
  tin: 'TIN Certificate',
  erc: 'ERC Certificate',
}

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()
  if (['approved', 'verified', 'accepted'].includes(value)) return 'approved'
  if (['uploaded', 'submitted', 'pending_review', 'pending'].includes(value)) return 'uploaded'
  return 'missing'
}

function statusClasses(status) {
  if (status === 'approved') return 'bg-green-100 text-green-700 border-green-200'
  if (status === 'uploaded') return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-red-100 text-red-700 border-red-200'
}

function getSubscriptionState(subscription) {
  const normalizedStatus = String(subscription?.status || '').toLowerCase()
  if (['expired', 'inactive', 'canceled'].includes(normalizedStatus)) return 'expired'

  const remainingDays = Number(subscription?.remaining_days)
  if (Number.isFinite(remainingDays)) {
    if (remainingDays <= 0) return 'expired'
    if (remainingDays <= 7) return 'expiring'
    return 'active'
  }

  const renewalDate = subscription?.next_renewal_at || subscription?.renewal_at || subscription?.expires_at
  if (renewalDate) {
    const ms = new Date(renewalDate).getTime() - Date.now()
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
    if (days <= 0) return 'expired'
    if (days <= 7) return 'expiring'
    return 'active'
  }

  if (['active', 'trialing'].includes(normalizedStatus)) return 'active'
  return 'expiring'
}

function uiRegionFromVerification(buyerRegion) {
  const normalized = String(buyerRegion || '').toUpperCase()
  if (normalized === 'EU') return 'eu'
  if (normalized === 'USA') return 'us'
  return 'global'
}

export default function VerificationPage() {
  const [region, setRegion] = useState('global')
  const [buyerCountry, setBuyerCountry] = useState('')
  const [verification, setVerification] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [error, setError] = useState('')
  const [busyDoc, setBusyDoc] = useState('')
  const [feedback, setFeedback] = useState('')
  const [buyerCountrySaving, setBuyerCountrySaving] = useState(false)
  const fileInputRef = useRef(null)
  const pendingDocRef = useRef('')
  const user = getCurrentUser()

  const role = user?.role || 'buyer'
  const isBuyerEu = role === 'buyer' && isEuCountry(buyerCountry)
  const buyerCountryRegion = role === 'buyer' ? verificationRegionFromCountry(buyerCountry) : 'global'
  const effectiveRegion = role === 'buyer' ? buyerCountryRegion : region
  const token = getToken()
  const hasBuyerCountry = role !== 'buyer' || Boolean(String(buyerCountry || '').trim())

  const regionGuidance = useMemo(() => {
    if (role !== 'buyer') return null
    if (buyerCountryRegion === 'eu') {
      return {
        tone: 'text-emerald-700 border-emerald-200 bg-emerald-50',
        heading: 'EU buyer requirements detected',
        message: 'For EU buyers, submit VAT Registration, EORI Registration, and Company Bank Proof. These are checked for cross-border customs and tax compliance.',
      }
    }
    if (buyerCountryRegion === 'us') {
      return {
        tone: 'text-sky-700 border-sky-200 bg-sky-50',
        heading: 'USA buyer requirements detected',
        message: 'For USA buyers, submit EIN Confirmation, Importer of Record (IOR), and Company Bank Proof. EU-only documents (VAT/EORI) are not required.',
      }
    }
    return {
      tone: 'text-amber-700 border-amber-200 bg-amber-50',
      heading: 'Select buyer country to lock requirements',
      message: 'Choose an EU country for VAT + EORI requirements or select United States for EIN + IOR requirements.',
    }
  }, [role, buyerCountryRegion])

  const documentConfig = useMemo(() => {
    const common = DOCUMENT_MATRIX.common
    const roleConfig = DOCUMENT_MATRIX.role[role] || { required: [], optional: [] }
    const regionConfig = DOCUMENT_MATRIX.region[effectiveRegion] || { required: [], optional: [] }

    return {
      required: [...new Set([...common.required, ...roleConfig.required, ...regionConfig.required])],
      optional: [...new Set([...common.optional, ...roleConfig.optional, ...regionConfig.optional])],
    }
  }, [role, effectiveRegion])

  const statuses = useMemo(() => {
    const docs = verification?.documents || {}
    return Object.fromEntries(Object.entries(docs).map(([key, value]) => [key, normalizeStatus(value)]))
  }, [verification])

  const credibilityScore = useMemo(() => {
    const documents = [...documentConfig.required, ...documentConfig.optional]
    if (!documents.length) return 0
    const points = documents.reduce((acc, docKey) => {
      const status = statuses[docKey] || 'missing'
      if (status === 'approved') return acc + 1
      if (status === 'uploaded') return acc + 0.6
      return acc
    }, 0)
    return Math.round((points / documents.length) * 100)
  }, [documentConfig, statuses])

  async function loadStatus() {
    if (!token) return
    try {
      const [verificationData, subscriptionData] = await Promise.all([
        apiRequest('/verification/me', { token }),
        apiRequest('/subscriptions/me', { token }),
      ])
      setVerification(verificationData)
      setSubscription(subscriptionData)
      setRegion(uiRegionFromVerification(verificationData?.buyer_region))
      setBuyerCountry(String(verificationData?.documents?.buyer_country || ''))
      setError('')
    } catch (err) {
      setError(err.message || 'Could not load verification center data')
    }
  }

  useEffect(() => {
    loadStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (role !== 'buyer') return
    setRegion(buyerCountryRegion)
  }, [role, buyerCountryRegion])

  useEffect(() => {
    if (!token || role !== 'buyer' || !verification) return

    const persistedCountry = String(verification?.documents?.buyer_country || '')
    const persistedRegion = String(verification?.documents?.buyer_region || '')
    const nextRegion = buyerCountryRegion === 'eu' ? 'EU' : (buyerCountryRegion === 'us' ? 'USA' : 'OTHER')

    if (persistedCountry === buyerCountry && persistedRegion === nextRegion) return

    const timeoutId = setTimeout(async () => {
      try {
        setBuyerCountrySaving(true)
        const currentDocs = verification?.documents || {}
        const updatedDocuments = {
          ...currentDocs,
          buyer_country: buyerCountry,
          buyer_region: nextRegion,
        }

        await apiRequest('/verification/me', {
          method: 'POST',
          token,
          body: { documents: updatedDocuments },
        })

        setVerification((prev) => ({ ...(prev || {}), documents: updatedDocuments }))
      } catch {
        setError('Could not save buyer country. Please try refreshing and selecting again.')
      } finally {
        setBuyerCountrySaving(false)
      }
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [buyerCountry, buyerCountryRegion, role, token, verification])

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
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Document upload failed')
      }

      const currentDocs = verification?.documents || {}
      const updatedDocuments = {
        ...currentDocs,
        [documentKey]: 'uploaded',
        ...(role === 'buyer'
          ? {
            buyer_country: buyerCountry,
            buyer_region: isBuyerEu ? 'EU' : (region === 'us' ? 'USA' : 'OTHER'),
          }
          : {}),
      }

      await apiRequest('/verification/me', {
        method: 'POST',
        token,
        body: { documents: updatedDocuments },
      })

      setVerification((prev) => ({ ...(prev || {}), documents: updatedDocuments }))
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

  const renewalState = getSubscriptionState(subscription)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Role and region-specific verification requirements for trusted international sourcing.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Subscription renewal state</p>
          <p className="text-xl font-semibold capitalize">{renewalState}</p>
        </div>
        <div className={`text-xs rounded-full px-3 py-1 border ${statusClasses(renewalState === 'expiring' ? 'uploaded' : renewalState === 'active' ? 'approved' : 'missing')}`}>
          {renewalState === 'active' ? 'Active' : renewalState === 'expiring' ? 'Expiring' : 'Expired'}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-semibold">Document Requirements</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600" htmlFor="region">Region</label>
            <select id="region" value={role === 'buyer' ? buyerCountryRegion : region} onChange={(e) => setRegion(e.target.value)} disabled={role === 'buyer'} className="text-sm border rounded-md px-2 py-1 disabled:bg-slate-100 disabled:text-slate-500">
              <option value="global">Global</option>
              <option value="eu">EU</option>
              <option value="us">US</option>
              <option value="apac">APAC</option>
            </select>
          </div>
          {role === 'buyer' ? <p className="text-xs text-slate-500">Region is auto-mapped from buyer country for compliance.</p> : null}
        </div>

        {role === 'buyer' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
            <label className="text-sm text-slate-600" htmlFor="buyer-country">Buyer Country</label>
            <select id="buyer-country" value={buyerCountry} onChange={(e) => setBuyerCountry(e.target.value)} className="text-sm border rounded-md px-2 py-1">
              <option value="">Select country</option>
              {BUYER_COUNTRY_OPTIONS.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>
            {buyerCountrySaving ? <span className="text-xs text-slate-500">Saving country...</span> : null}
            </div>
            <p className={`text-xs border rounded-md px-2 py-1 ${regionGuidance.tone}`}>
              <span className="font-semibold">{regionGuidance.heading}:</span> {regionGuidance.message}
            </p>
            {!hasBuyerCountry ? <p className="text-xs text-red-600">Buyer country is required before uploading verification documents.</p> : null}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Mandatory documents</h3>
            {documentConfig.required.map((documentKey) => {
              const status = statuses[documentKey] || 'missing'
              return (
                <div key={documentKey} className="rounded-lg border border-slate-200 p-3 flex items-center justify-between gap-3">
                  <p className="font-medium text-sm">{LABELS[documentKey] || documentKey}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs border rounded-full px-2 py-1 font-semibold ${statusClasses(status)}`}>{status}</span>
                    <button onClick={() => openPicker(documentKey)} className="px-3 py-1.5 text-xs rounded-md border border-slate-300 hover:bg-slate-50" disabled={busyDoc === documentKey}>
                      {busyDoc === documentKey ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Optional documents</h3>
            {documentConfig.optional.map((documentKey) => {
              const status = statuses[documentKey] || 'missing'
              return (
                <div key={documentKey} className="rounded-lg border border-slate-200 p-3 flex items-center justify-between gap-3">
                  <p className="font-medium text-sm">{LABELS[documentKey] || documentKey}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs border rounded-full px-2 py-1 font-semibold ${statusClasses(status)}`}>{status}</span>
                    <button onClick={() => openPicker(documentKey)} className="px-3 py-1.5 text-xs rounded-md border border-slate-300 hover:bg-slate-50" disabled={busyDoc === documentKey}>
                      {busyDoc === documentKey ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Credibility score panel</h2>
        <p className="text-3xl font-bold mt-1">{credibilityScore}/100</p>
        <p className="text-sm text-slate-600 mt-2">More licensing proof increases international credibility.</p>
      </section>

      <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelected} />

      <div className="flex items-center gap-3">
        <button onClick={loadStatus} className="px-4 py-2 text-sm rounded-md bg-[#0A66C2] text-white">Refresh status</button>
        {feedback ? <span className="text-sm text-green-700">{feedback}</span> : null}
        {error ? <span className="text-sm text-red-700">{error}</span> : null}
      </div>
    </div>
  )
}
