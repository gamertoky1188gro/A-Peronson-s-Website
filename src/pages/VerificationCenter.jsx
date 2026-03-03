import React, { useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE, apiRequest, getCurrentUser, getToken } from '../lib/auth'
import { EU_COUNTRIES, isEuCountry } from '../../shared/config/geo.js'

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

const EU_DOCUMENT_CREDIBILITY_GUIDANCE = 'For EU onboarding, provide VAT and EORI records issued by competent authorities, with matching legal entity names and recent bank proof on official letterhead. Documents that are recent, verifiable, and consistent across jurisdictions are accepted faster by international compliance teams.'

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

function statusIcon(status) {
  if (status === 'approved') return '✅'
  if (status === 'uploaded') return '🟡'
  return '⬜'
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

function subscriptionLabel(state) {
  if (state === 'active') return 'Active'
  if (state === 'expiring') return 'Expiring'
  return 'Expired'
}

function uiRegionFromVerification(buyerRegion) {
  const normalized = String(buyerRegion || '').toUpperCase()
  if (normalized === 'EU') return 'eu'
  if (normalized === 'USA') return 'us'
  return 'global'
}

export default function VerificationCenter() {
  const [region, setRegion] = useState('global')
  const [buyerCountry, setBuyerCountry] = useState('')
  const [verification, setVerification] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [error, setError] = useState('')
  const [busyDoc, setBusyDoc] = useState('')
  const [feedback, setFeedback] = useState('')
  const fileInputRef = useRef(null)
  const pendingDocRef = useRef('')
  const user = getCurrentUser()

  const role = user?.role || 'buyer'
  const isBuyerEu = role === 'buyer' && isEuCountry(buyerCountry)
  const effectiveRegion = isBuyerEu ? 'eu' : region

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

  const token = getToken()

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

  async function requestUpload(documentKey, file) {
    if (!file || !token) return
    setBusyDoc(documentKey)
    setFeedback('')
    setError('')

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('document_type', documentKey)

      const uploadRes = await fetch(`${API_BASE}/documents/contracts`, {
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
        ...(role === 'buyer' ? {
          buyer_country: buyerCountry,
          buyer_region: isBuyerEu ? 'EU' : (region === 'us' ? 'USA' : 'OTHER'),
        } : {}),
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

  async function saveBuyerCountry(nextCountry) {
    if (!token || role !== 'buyer') return
    setFeedback('')
    setError('')

    const currentDocs = verification?.documents || {}
    const nextRegion = isEuCountry(nextCountry) ? 'EU' : (region === 'us' ? 'USA' : 'OTHER')

    try {
      const updatedDocuments = {
        ...currentDocs,
        buyer_country: nextCountry,
        buyer_region: nextRegion,
      }

      const record = await apiRequest('/verification/me', {
        method: 'POST',
        token,
        body: { documents: updatedDocuments },
      })

      setVerification(record)
      setFeedback(nextRegion === 'EU'
        ? 'EU country selected. buyer_region has been mapped to EU and EU requirements are now active.'
        : 'Buyer country saved.')
    } catch (err) {
      setError(err.message || 'Could not save buyer country')
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

  const renderDocumentRow = (documentKey, mandatory) => {
    const status = statuses[documentKey] || 'missing'
    return (
      <div key={documentKey} className="rounded-lg border border-slate-200 p-3 flex items-center justify-between gap-3">
        <div>
          <div className="font-medium text-sm flex items-center gap-2">
            <span>{statusIcon(status)}</span>
            <span>{LABELS[documentKey] || documentKey}</span>
            {mandatory ? <span className="text-[11px] rounded-full px-2 py-0.5 bg-slate-100">Mandatory</span> : <span className="text-[11px] rounded-full px-2 py-0.5 bg-sky-100 text-sky-700">Optional</span>}
          </div>
          <div className="text-xs text-slate-500 mt-1">Status updates sync to your verification profile.</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs border rounded-full px-2 py-1 font-semibold ${statusClasses(status)}`}>{status}</span>
          <button
            onClick={() => openPicker(documentKey)}
            className="px-3 py-1.5 text-xs rounded-md border border-slate-300 hover:bg-slate-50"
            disabled={busyDoc === documentKey}
          >
            {busyDoc === documentKey ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold">Verification Center</h1>
        <p className="text-sm text-slate-600 mt-1">Role and region specific document proofing for trusted international sourcing.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Monthly renewal state</p>
          <p className="text-xl font-semibold">{subscriptionLabel(renewalState)}</p>
        </div>
        <div className={`text-xs rounded-full px-3 py-1 border ${statusClasses(renewalState === 'expiring' ? 'uploaded' : renewalState === 'active' ? 'approved' : 'missing')}`}>
          {renewalState === 'active' ? 'Verification badge protected' : renewalState === 'expiring' ? 'Renew soon to keep badge visible' : 'Badge hidden until renewal'}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-semibold">Document Requirements</h2>
          {role === 'buyer' ? (
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <label className="text-sm text-slate-600" htmlFor="buyer-country">Buyer Country</label>
              <select
                id="buyer-country"
                value={buyerCountry}
                onChange={(e) => {
                  const nextCountry = e.target.value
                  setBuyerCountry(nextCountry)
                  saveBuyerCountry(nextCountry)
                }}
                className="text-sm border rounded-md px-2 py-1"
              >
                <option value="">Select country</option>
                {EU_COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
              </select>
              <span className={`text-xs rounded-full px-2.5 py-1 border ${isBuyerEu ? 'bg-green-50 text-green-700 border-green-300' : 'bg-slate-50 text-slate-600 border-slate-300'}`}>
                buyer_region: {isBuyerEu ? 'EU' : 'OTHER'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600" htmlFor="region">Region</label>
              <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} className="text-sm border rounded-md px-2 py-1">
                <option value="global">Global</option>
                <option value="eu">EU</option>
                <option value="us">US</option>
                <option value="apac">APAC</option>
              </select>
            </div>
          )}
        </div>

        {isBuyerEu ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <p className="font-semibold">EU buyer documentation activated</p>
            <p className="mt-1">Required for EU profile: Company Registration, VAT Registration, EORI Registration, and Company Bank Proof.</p>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Mandatory</h3>
            {documentConfig.required.map((docKey) => renderDocumentRow(docKey, true))}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Optional</h3>
            {documentConfig.optional.map((docKey) => renderDocumentRow(docKey, false))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Credibility Score: {credibilityScore}/100</h2>
        <p className="text-sm text-slate-600 mt-2">Uploading and maintaining licensing proof increases international buyer trust and improves your match confidence across cross-border sourcing opportunities.</p>
        {isBuyerEu ? <p className="text-sm text-slate-700 mt-3">{EU_DOCUMENT_CREDIBILITY_GUIDANCE}</p> : null}
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
