import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AccessDeniedState from '../components/AccessDeniedState'
import { apiRequest, clearSession, getCurrentUser, getToken, saveSession } from '../lib/auth'
import { startRegistration } from '@simplewebauthn/browser'

const emptyKnowledge = { type: 'faq', question: '', answer: '', keywords: '' }
const TAB_KEYS = [
  'general',
  'verification',
  'branding',
  'security',
  'members',
  'subscription',
  'boosts',
  'assistant_knowledge',
]

const HELP_COPY = {
  general: {
    title: 'Automation & Handoff',
    description: 'Control chatbot coverage and when human agents get notified. Use this to keep early conversations fast.',
  },
  verification: {
    title: 'Verification Health',
    description: 'Verification is subscription-based. Keep documents current to preserve the badge and trust signals.',
  },
  branding: {
    title: 'Brand Touchpoints',
    description: 'Add consistent contact info so buyers know who to reach and trust.',
  },
  security: {
    title: 'Security Checks',
    description: 'Enable 2FA and monitor active sessions to keep the org secure.',
  },
  members: {
    title: 'Team Access',
    description: 'Invite agents and manage assignments for shared sourcing workflows.',
  },
  subscription: {
    title: 'Plan & Billing',
    description: 'Track verification renewal timing and wallet balance for premium access.',
  },
  boosts: {
    title: 'Boost Add-On',
    description: 'Boosted profiles and feed posts appear higher in search and discovery surfaces.',
  },
  assistant_knowledge: {
    title: 'Assistant Knowledge',
    description: 'Train the assistant with organization-specific FAQs so the AI responses stay aligned.',
  },
}

export default function OrgSettings() {
  const [searchParams] = useSearchParams()
  const initialTab = useMemo(() => {
    const candidate = searchParams.get('tab') || 'general'
    return TAB_KEYS.includes(candidate) ? candidate : 'general'
  }, [searchParams])
  const [tab, setTab] = useState(initialTab)
  const currentUser = useMemo(() => getCurrentUser(), [])
  const isOrgManager = ['owner', 'admin', 'buying_house', 'factory'].includes(String(currentUser?.role || '').toLowerCase())
  const [remainingDays, setRemainingDays] = useState(0)
  const [subscriptionPlan, setSubscriptionPlan] = useState('free')
  const [walletBalance, setWalletBalance] = useState(0)
  const [walletRestricted, setWalletRestricted] = useState(0)
  const [verification, setVerification] = useState(null)
  const [billingFeedback, setBillingFeedback] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [entitlements, setEntitlements] = useState(null)
  const [chatbotEnabled, setChatbotEnabled] = useState(() => Boolean(currentUser?.chatbot_enabled || currentUser?.profile?.chatbot_enabled))
  const [handoffMode, setHandoffMode] = useState(() => String(currentUser?.handoff_mode || currentUser?.profile?.handoff_mode || 'notify_agent'))
  const [autoReplyGreeting, setAutoReplyGreeting] = useState('')
  const [autoReplySignature, setAutoReplySignature] = useState('')
  const [autoReplyFallback, setAutoReplyFallback] = useState('')
  const [autoReplyTone, setAutoReplyTone] = useState('professional')
  const [autoReplyQualification, setAutoReplyQualification] = useState('')
  const [autoReplyFeedback, setAutoReplyFeedback] = useState('')
  const [loadingAutoReply, setLoadingAutoReply] = useState(false)
  const [autoSaveSearchAlerts, setAutoSaveSearchAlerts] = useState(() => {
    const raw = currentUser?.profile?.auto_save_search_alerts
    if (raw === undefined || raw === null || raw === '') return true
    return raw === true || String(raw).toLowerCase() === 'true'
  })
  const [mainProcesses, setMainProcesses] = useState(() => (currentUser?.profile?.main_processes || []).join(', '))
  const [yearsInBusiness, setYearsInBusiness] = useState(() => String(currentUser?.profile?.years_in_business || ''))
  const [handlesMultipleFactories, setHandlesMultipleFactories] = useState(() => Boolean(currentUser?.profile?.handles_multiple_factories))
  const [teamSeats, setTeamSeats] = useState(() => String(currentUser?.profile?.team_seats || ''))
  const [exportPorts, setExportPorts] = useState(() => (currentUser?.profile?.export_ports || []).join(', '))
  const [locationLat, setLocationLat] = useState(() => String(currentUser?.profile?.location_lat || ''))
  const [locationLng, setLocationLng] = useState(() => String(currentUser?.profile?.location_lng || ''))
  const [brandName, setBrandName] = useState(() => String(currentUser?.profile?.brand_name || ''))
  const [brandTagline, setBrandTagline] = useState(() => String(currentUser?.profile?.brand_tagline || ''))
  const [brandWebsite, setBrandWebsite] = useState(() => String(currentUser?.profile?.brand_website || ''))
  const [brandLogoUrl, setBrandLogoUrl] = useState(() => String(currentUser?.profile?.brand_logo_url || ''))
  const [brandCoverUrl, setBrandCoverUrl] = useState(() => String(currentUser?.profile?.brand_cover_url || ''))
  const [brandColor, setBrandColor] = useState(() => String(currentUser?.profile?.brand_color || ''))
  const [brandAccent, setBrandAccent] = useState(() => String(currentUser?.profile?.brand_accent || ''))
  const [accountManagerName, setAccountManagerName] = useState(() => String(currentUser?.profile?.account_manager_name || ''))
  const [accountManagerEmail, setAccountManagerEmail] = useState(() => String(currentUser?.profile?.account_manager_email || ''))
  const [accountManagerPhone, setAccountManagerPhone] = useState(() => String(currentUser?.profile?.account_manager_phone || ''))
  const [entries, setEntries] = useState([])
  const [knowledgeForm, setKnowledgeForm] = useState(emptyKnowledge)
  const [editingId, setEditingId] = useState('')
  const [faqFeedback, setFaqFeedback] = useState('')
  const [boosts, setBoosts] = useState([])
  const [boostScope, setBoostScope] = useState('feed')
  const [boostDuration, setBoostDuration] = useState('7')
  const [boostMultiplier, setBoostMultiplier] = useState('1.5')
  const [boostPrice, setBoostPrice] = useState('9.99')
  const [boostFeedback, setBoostFeedback] = useState('')
  const [loadingBoosts, setLoadingBoosts] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteFeedback, setDeleteFeedback] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [passkeys, setPasskeys] = useState(() => Array.isArray(currentUser?.passkeys) ? currentUser.passkeys : [])
  const [passkeyName, setPasskeyName] = useState('')
  const [passkeyBusy, setPasskeyBusy] = useState(false)
  const [passkeyNotice, setPasskeyNotice] = useState('')
  const [passkeyError, setPasskeyError] = useState('')

  const verificationStatus = useMemo(() => {
    if (remainingDays <= 0) return 'expired'
    if (remainingDays <= 7) return 'expiring_soon'
    return 'verified_active'
  }, [remainingDays])

  const loadBilling = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const [sub, remaining, wallet, v] = await Promise.all([
        apiRequest('/subscriptions/me', { token }),
        apiRequest('/subscriptions/me/remaining-days', { token }),
        apiRequest('/wallet/me', { token }),
        apiRequest('/verification/me', { token }),
      ])
      setSubscriptionPlan(sub?.plan || 'free')
      setRemainingDays(Number(remaining?.remaining_days || 0))
      setWalletBalance(Number(wallet?.balance_usd || 0))
      setWalletRestricted(Number(wallet?.restricted_balance_usd || 0))
      setVerification(v || null)
    } catch (err) {
      setBillingFeedback(err.message || 'Unable to load subscription status')
    }
  }, [])

  const loadEntitlements = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const me = await apiRequest('/users/me', { token })
      setEntitlements(me?.entitlements || null)
    } catch {
      setEntitlements(null)
    }
  }, [])

  const loadPasskeys = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const data = await apiRequest('/auth/passkeys', { token })
      setPasskeys(Array.isArray(data?.passkeys) ? data.passkeys : [])
    } catch {
      setPasskeys([])
    }
  }, [])

  const loadChatbotSettings = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoadingAutoReply(true)
    setAutoReplyFeedback('')
    try {
      const data = await apiRequest('/chatbot/settings', { token })
      const settings = data?.settings || {}
      setAutoReplyGreeting(String(settings?.auto_reply_greeting || ''))
      setAutoReplySignature(String(settings?.auto_reply_signature || ''))
      setAutoReplyFallback(String(settings?.auto_reply_fallback || ''))
      setAutoReplyTone(String(settings?.auto_reply_tone || 'professional'))
      setAutoReplyQualification(String(settings?.auto_reply_qualification_prompt || ''))
    } catch (err) {
      setAutoReplyFeedback(err.message || 'Unable to load auto-reply settings')
    } finally {
      setLoadingAutoReply(false)
    }
  }, [])

  useEffect(() => {
    loadBilling()
    loadEntitlements()
    loadPasskeys()
  }, [loadBilling, loadEntitlements, loadPasskeys])

  async function registerPasskey() {
    const token = getToken()
    if (!token) {
      setPasskeyError('Please login again to register a passkey.')
      return
    }
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      setPasskeyError('Passkeys are not supported on this device/browser.')
      return
    }
    setPasskeyError('')
    setPasskeyNotice('')
    setPasskeyBusy(true)
    try {
      const optionsRes = await apiRequest('/auth/passkey/registration/options', { method: 'POST', token })
      const credential = await startRegistration(optionsRes.options)
      const verifyRes = await apiRequest('/auth/passkey/registration/verify', {
        method: 'POST',
        token,
        body: { credential, nickname: passkeyName },
      })
      setPasskeys(Array.isArray(verifyRes?.passkeys) ? verifyRes.passkeys : [])
      setPasskeyNotice('Passkey added successfully.')
      setPasskeyName('')
    } catch (err) {
      setPasskeyError(err.message || 'Unable to register passkey.')
    } finally {
      setPasskeyBusy(false)
    }
  }

  async function removePasskey(credentialId) {
    const token = getToken()
    if (!token || !credentialId) return
    setPasskeyError('')
    setPasskeyNotice('')
    try {
      const data = await apiRequest(`/auth/passkeys/${encodeURIComponent(credentialId)}`, { method: 'DELETE', token })
      setPasskeys(Array.isArray(data?.passkeys) ? data.passkeys : [])
      setPasskeyNotice('Passkey removed.')
    } catch (err) {
      setPasskeyError(err.message || 'Unable to remove passkey.')
    }
  }

  useEffect(() => {
    if (!TAB_KEYS.includes(initialTab)) return
    setTab(initialTab)
  }, [initialTab])

  const loadFaqs = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) return
      const data = await apiRequest('/assistant/knowledge', { token })
      setEntries(data.entries || [])
      setFaqFeedback('')
    } catch (err) {
      setFaqFeedback(err.status === 403 ? 'Access denied' : err.message)
    }
  }, [])

  function resetForm() {
    setKnowledgeForm(emptyKnowledge)
    setEditingId('')
  }

  function selectForEdit(entry) {
    setEditingId(entry.id)
    setKnowledgeForm({
      type: entry.type || 'faq',
      question: entry.question || '',
      answer: entry.answer || '',
      keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : '',
    })
  }

  async function saveFaq(e) {
    e.preventDefault()
    const token = getToken()
    if (!token) {
      setFaqFeedback('Please login again to edit assistant knowledge')
      return
    }

    const payload = {
      type: knowledgeForm.type,
      question: knowledgeForm.question,
      answer: knowledgeForm.answer,
      keywords: knowledgeForm.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    }

    try {
      if (editingId) {
        await apiRequest(`/assistant/knowledge/${editingId}`, { method: 'PUT', token, body: payload })
        setFaqFeedback('Knowledge entry updated')
      } else {
        await apiRequest('/assistant/knowledge', { method: 'POST', token, body: payload })
        setFaqFeedback('Knowledge entry added')
      }
      resetForm()
      await loadFaqs()
    } catch (err) {
      setFaqFeedback(err.status === 403 ? 'Access denied' : err.message)
    }
  }

  async function removeFaq(entryId) {
    const token = getToken()
    if (!token) return
    try {
      await apiRequest(`/assistant/knowledge/${entryId}`, { method: 'DELETE', token })
      if (editingId === entryId) resetForm()
      setFaqFeedback('FAQ entry removed')
      await loadFaqs()
    } catch (err) {
      setFaqFeedback(err.status === 403 ? 'Access denied' : err.message)
  }
  }

  const statusChipClasses = {
    verified_active: 'bg-green-100 text-green-700',
    expiring_soon: 'bg-amber-100 text-amber-700',
    expired: 'bg-red-100 text-red-700',
  }

  const statusLabel = {
    verified_active: 'Verified active',
    expiring_soon: 'Expiring soon',
    expired: 'Expired (renew to restore badge)',
  }

  async function saveGeneralSettings() {
    const token = getToken()
    if (!token) return
    setBillingFeedback('')
    try {
          const updated = await apiRequest('/users/me/profile', {
        method: 'PATCH',
        token,
        body: {
          chatbot_enabled: Boolean(chatbotEnabled),
          handoff_mode: handoffMode,
          auto_save_search_alerts: Boolean(autoSaveSearchAlerts),
          main_processes: mainProcesses.split(',').map((p) => p.trim()).filter(Boolean),
          years_in_business: yearsInBusiness,
          handles_multiple_factories: Boolean(handlesMultipleFactories),
          team_seats: teamSeats,
          export_ports: exportPorts.split(',').map((p) => p.trim()).filter(Boolean),
          location_lat: locationLat,
          location_lng: locationLng,
        },
      })
      // Keep local session user aligned with server profile changes.
      saveSession(updated, token)
      setBillingFeedback('Settings updated')
    } catch (err) {
      setBillingFeedback(err.message || 'Unable to save settings')
    }
  }

  async function renewVerification() {
    const token = getToken()
    if (!token) return
    setBillingFeedback('Renewing verification subscription...')
    try {
      await apiRequest('/verification/renew', { method: 'POST', token })
      setBillingFeedback('Renewed successfully.')
      await loadBilling()
    } catch (err) {
      setBillingFeedback(err.message || 'Renew failed')
    }
  }

  async function saveBrandingSettings() {
    const token = getToken()
    if (!token) return
    setBillingFeedback('')
    try {
      const updated = await apiRequest('/users/me/profile', {
        method: 'PATCH',
        token,
        body: {
          brand_name: brandName,
          brand_tagline: brandTagline,
          brand_website: brandWebsite,
          brand_logo_url: brandLogoUrl,
          brand_cover_url: brandCoverUrl,
          brand_color: brandColor,
          brand_accent: brandAccent,
          account_manager_name: accountManagerName,
          account_manager_email: accountManagerEmail,
          account_manager_phone: accountManagerPhone,
        },
      })
      saveSession(updated, token)
      setBillingFeedback('Branding updated')
    } catch (err) {
      setBillingFeedback(err.message || 'Unable to save branding')
    }
  }

  async function redeemCoupon() {
    const token = getToken()
    if (!token) return
    const code = couponCode.trim()
    if (!code) {
      setBillingFeedback('Enter a coupon code first.')
      return
    }
    setBillingFeedback('Redeeming coupon...')
    try {
      await apiRequest('/wallet/redeem', { method: 'POST', token, body: { code } })
      setCouponCode('')
      setBillingFeedback('Coupon applied successfully.')
      await loadBilling()
    } catch (err) {
      setBillingFeedback(err.message || 'Coupon redemption failed')
    }
  }

  async function deleteAccount() {
    const token = getToken()
    if (!token) {
      setDeleteFeedback('Please login again to delete your account.')
      return
    }
    if (!deletePassword) {
      setDeleteFeedback('Password is required to delete your account.')
      return
    }
    const confirmed = window.confirm('This will permanently disable your account. Continue?')
    if (!confirmed) return
    setDeletingAccount(true)
    setDeleteFeedback('')
    try {
      await apiRequest('/users/me', { method: 'DELETE', token, body: { password: deletePassword } })
      clearSession()
      setDeleteFeedback('Account deleted. You have been logged out.')
      window.location.href = '/login'
    } catch (err) {
      setDeleteFeedback(err.message || 'Unable to delete account')
    } finally {
      setDeletingAccount(false)
    }
  }

  const loadBoosts = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoadingBoosts(true)
    setBoostFeedback('')
    try {
      const data = await apiRequest('/boosts/me', { token })
      setBoosts(Array.isArray(data?.items) ? data.items : [])
    } catch (err) {
      setBoosts([])
      setBoostFeedback(err.message || 'Unable to load boosts')
    } finally {
      setLoadingBoosts(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'boosts') {
      loadBoosts()
    }
  }, [loadBoosts, tab])

  useEffect(() => {
    if (tab === 'general') {
      loadChatbotSettings()
    }
  }, [loadChatbotSettings, tab])

  async function purchaseBoost() {
    const token = getToken()
    if (!token) return
    setBoostFeedback('Processing boost purchase...')
    try {
      const payload = {
        scope: boostScope,
        duration_days: Number(boostDuration || 7),
        multiplier: Number(boostMultiplier || 1.5),
        price_usd: Number(boostPrice || 9.99),
      }
      await apiRequest('/boosts', { method: 'POST', token, body: payload })
      setBoostFeedback('Boost activated.')
      await loadBoosts()
      await loadBilling()
    } catch (err) {
      setBoostFeedback(err.message || 'Boost purchase failed')
    }
  }

  async function cancelBoost(boostId) {
    const token = getToken()
    if (!token || !boostId) return
    setBoostFeedback('Cancelling boost...')
    try {
      await apiRequest(`/boosts/${encodeURIComponent(boostId)}/cancel`, { method: 'POST', token })
      setBoostFeedback('Boost cancelled.')
      await loadBoosts()
    } catch (err) {
      setBoostFeedback(err.message || 'Unable to cancel boost')
    }
  }

  function remainingLabel(endsAt) {
    if (!endsAt) return '--'
    const diff = new Date(endsAt).getTime() - Date.now()
    if (!Number.isFinite(diff)) return '--'
    if (diff <= 0) return 'Expired'
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
    return `${days} day(s)`
  }

  return (
    <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Organization Settings</h1>
            <p className="text-sm text-[#5A5A5A]">Manage organization profile, verification, branding, security and subscription</p>
          </div>
        </div>

        {!isOrgManager ? <AccessDeniedState message="Only organization managers (Owner/Admin/Buying House/Factory) can manage organization settings." /> : null}

        {isOrgManager ? (

        <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow p-4">
          <div className="flex gap-4 border-b mb-4 flex-wrap">
            <button onClick={() => setTab('general')} className={`px-3 py-2 ${tab === 'general' ? 'border-b-2 border-[#0A66C2]' : ''}`}>General Info</button>
            <button onClick={() => setTab('verification')} className={`px-3 py-2 ${tab === 'verification' ? 'border-b-2 border-[#0A66C2]' : ''}`}>Verification</button>
            <button onClick={() => setTab('branding')} className={`px-3 py-2 ${tab === 'branding' ? 'border-b-2 border-[#0A66C2]' : ''}`}>Branding</button>
            <button onClick={() => setTab('security')} className={`px-3 py-2 ${tab === 'security' ? 'border-b-2 border-[#0A66C2]' : ''}`}>Security</button>
            <button onClick={() => setTab('members')} className={`px-3 py-2 ${tab === 'members' ? 'border-b-2 border-[#0A66C2]' : ''}`}>Members</button>
            <button onClick={() => setTab('subscription')} className={`px-3 py-2 ${tab === 'subscription' ? 'border-b-2 border-[#0A66C2]' : ''}`}>Subscription</button>
            <button onClick={() => setTab('boosts')} className={`px-3 py-2 ${tab === 'boosts' ? 'border-b-2 border-[#0A66C2]' : ''}`}>Boosts</button>
            <button onClick={() => { setTab('assistant_knowledge'); loadFaqs() }} className={`px-3 py-2 ${tab === 'assistant_knowledge' ? 'border-b-2 border-[#0A66C2]' : ''}`}>Assistant Knowledge</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
            {tab === 'general' && (
              <div>
                <div className="mb-3 text-sm text-[#5A5A5A]">
                  Configure automation and trust settings for your organization.
                </div>
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input type="checkbox" checked={chatbotEnabled} onChange={(e) => setChatbotEnabled(e.target.checked)} />
                  Enable AI Chatbot for initial conversations (project.md)
                </label>
                <div className="mt-2 text-xs text-[#5A5A5A]">
                  The bot answers common questions (MOQ, lead time, certifications). If it can't answer, it hands off to your team.
                </div>
                <label className="mt-4 flex items-center gap-3 text-sm font-medium">
                  <input type="checkbox" checked={autoSaveSearchAlerts} onChange={(e) => setAutoSaveSearchAlerts(e.target.checked)} />
                  Auto-save search alerts after every search
                </label>
                <div className="mt-2 text-xs text-[#5A5A5A]">
                  When enabled, every search automatically saves a matching alert. Turn this off if you want manual alerts only.
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Handoff mode</label>
                  <select className="w-full border px-3 py-2 rounded" value={handoffMode} onChange={(e) => setHandoffMode(e.target.value)}>
                    <option value="notify_agent">Notify agent / owner</option>
                    <option value="notify_owner">Notify owner only</option>
                  </select>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">AI Auto-Reply Customization</p>
                    <span className="text-[11px] text-slate-500">{entitlements?.premium ? 'Premium enabled' : 'Premium required'}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Customize the AI assistant greeting, tone, and qualification prompts.</p>
                  {loadingAutoReply ? <p className="mt-2 text-xs text-slate-500">Loading...</p> : null}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Greeting (e.g., Hello, thanks for reaching out...)"
                      value={autoReplyGreeting}
                      onChange={(e) => setAutoReplyGreeting(e.target.value)}
                      disabled={!entitlements?.premium}
                    />
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Signature (e.g., Gartexhub Team)"
                      value={autoReplySignature}
                      onChange={(e) => setAutoReplySignature(e.target.value)}
                      disabled={!entitlements?.premium}
                    />
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Fallback response"
                      value={autoReplyFallback}
                      onChange={(e) => setAutoReplyFallback(e.target.value)}
                      disabled={!entitlements?.premium}
                    />
                    <select
                      className="w-full border px-3 py-2 rounded"
                      value={autoReplyTone}
                      onChange={(e) => setAutoReplyTone(e.target.value)}
                      disabled={!entitlements?.premium}
                    >
                      <option value="professional">Professional</option>
                      <option value="warm">Warm</option>
                      <option value="direct">Direct</option>
                      <option value="friendly">Friendly</option>
                    </select>
                    <textarea
                      className="sm:col-span-2 w-full border px-3 py-2 rounded min-h-24"
                      placeholder="Qualification prompt (e.g., Share target quantities, price range, and lead time.)"
                      value={autoReplyQualification}
                      onChange={(e) => setAutoReplyQualification(e.target.value)}
                      disabled={!entitlements?.premium}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!entitlements?.premium}
                      onClick={async () => {
                        const token = getToken()
                        if (!token) return
                        setAutoReplyFeedback('Saving auto-reply settings...')
                        try {
                          await apiRequest('/chatbot/settings', {
                            method: 'POST',
                            token,
                            body: {
                              auto_reply_greeting: autoReplyGreeting,
                              auto_reply_signature: autoReplySignature,
                              auto_reply_fallback: autoReplyFallback,
                              auto_reply_tone: autoReplyTone,
                              auto_reply_qualification_prompt: autoReplyQualification,
                            },
                          })
                          setAutoReplyFeedback('Auto-reply settings saved.')
                        } catch (err) {
                          setAutoReplyFeedback(err.message || 'Unable to save auto-reply settings')
                        }
                      }}
                      className="px-3 py-2 bg-[#0A66C2] text-white rounded disabled:opacity-60"
                    >
                      Save auto-reply settings
                    </button>
                    {autoReplyFeedback ? <span className="text-xs text-[#5A5A5A]">{autoReplyFeedback}</span> : null}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Supplier profile (factory / buying house)</p>
                  <p className="mt-1 text-xs text-slate-500">These fields power advanced supplier filters (processes, response speed, distance, and team capacity).</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Main processes (comma-separated)"
                      value={mainProcesses}
                      onChange={(e) => setMainProcesses(e.target.value)}
                    />
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Years in business"
                      value={yearsInBusiness}
                      onChange={(e) => setYearsInBusiness(e.target.value)}
                    />
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Team seats"
                      value={teamSeats}
                      onChange={(e) => setTeamSeats(e.target.value)}
                    />
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Export ports (comma-separated)"
                      value={exportPorts}
                      onChange={(e) => setExportPorts(e.target.value)}
                    />
                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={handlesMultipleFactories}
                        onChange={(e) => setHandlesMultipleFactories(e.target.checked)}
                      />
                      Handles multiple factories
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Location lat"
                        value={locationLat}
                        onChange={(e) => setLocationLat(e.target.value)}
                      />
                      <input
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Location lng"
                        value={locationLng}
                        onChange={(e) => setLocationLng(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button onClick={saveGeneralSettings} className="px-3 py-2 bg-[#0A66C2] text-white rounded">Save settings</button>
                </div>
              </div>
            )}

            {tab === 'verification' && (
              <div>
                <p className="text-sm text-[#5A5A5A]">
                  Verification is subscription-based and renewed monthly (project.md). Upload the required documents in Verification Center.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusChipClasses[verificationStatus]}`}>
                    {statusLabel[verificationStatus]}
                  </span>
                  <span className="text-xs text-[#5A5A5A]">{Math.max(0, remainingDays)} day(s) remaining</span>
                </div>
                <p className="mt-2 text-xs text-[#5A5A5A]">Verification is subscription-based, not permanent. Keep premium active to keep the badge visible.</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link to="/verification" className="px-3 py-2 bg-[#0A66C2] text-white rounded">Open Verification Center</Link>
                  <button onClick={renewVerification} className="px-3 py-2 border rounded">Renew verification ($6.99)</button>
                  <span className="text-xs text-[#5A5A5A]">Wallet balance: ${Number(walletBalance || 0).toFixed(2)} | Restricted: ${Number(walletRestricted || 0).toFixed(2)}</span>
                </div>
                {verification?.missing_required?.length ? (
                  <div className="mt-4 rounded-lg border bg-amber-50 p-3 text-sm text-amber-900">
                    Missing required docs: {(verification.missing_required || []).slice(0, 6).join(', ')}
                  </div>
                ) : null}
              </div>
            )}

            {tab !== 'general' && !isOrgManager && (
              <div className="p-4 bg-yellow-50 border rounded mt-4">You do not have permission to view this section.</div>
            )}

            {tab === 'branding' && (
              <div>
                <p className="text-xs text-[#5A5A5A] mb-3">Custom branding is available on Premium plans.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Brand name</label>
                    <input className="w-full border px-3 py-2 rounded" value={brandName} onChange={(e) => setBrandName(e.target.value)} disabled={!entitlements?.premium} />
                  </div>
                  <div>
                    <label className="block text-sm">Brand tagline</label>
                    <input className="w-full border px-3 py-2 rounded" value={brandTagline} onChange={(e) => setBrandTagline(e.target.value)} disabled={!entitlements?.premium} />
                  </div>
                  <div>
                    <label className="block text-sm">Brand website</label>
                    <input className="w-full border px-3 py-2 rounded" value={brandWebsite} onChange={(e) => setBrandWebsite(e.target.value)} disabled={!entitlements?.premium} />
                  </div>
                  <div>
                    <label className="block text-sm">Logo URL</label>
                    <input className="w-full border px-3 py-2 rounded" value={brandLogoUrl} onChange={(e) => setBrandLogoUrl(e.target.value)} disabled={!entitlements?.premium} />
                  </div>
                  <div>
                    <label className="block text-sm">Cover URL</label>
                    <input className="w-full border px-3 py-2 rounded" value={brandCoverUrl} onChange={(e) => setBrandCoverUrl(e.target.value)} disabled={!entitlements?.premium} />
                  </div>
                  <div>
                    <label className="block text-sm">Brand color</label>
                    <input className="w-full border px-3 py-2 rounded" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} disabled={!entitlements?.premium} />
                  </div>
                  <div>
                    <label className="block text-sm">Accent color</label>
                    <input className="w-full border px-3 py-2 rounded" value={brandAccent} onChange={(e) => setBrandAccent(e.target.value)} disabled={!entitlements?.premium} />
                  </div>
                  <div>
                    <label className="block text-sm">Account manager name</label>
                    <input className="w-full border px-3 py-2 rounded" value={accountManagerName} onChange={(e) => setAccountManagerName(e.target.value)} disabled />
                  </div>
                  <div>
                    <label className="block text-sm">Account manager email</label>
                    <input className="w-full border px-3 py-2 rounded" value={accountManagerEmail} onChange={(e) => setAccountManagerEmail(e.target.value)} disabled />
                  </div>
                  <div>
                    <label className="block text-sm">Account manager phone</label>
                    <input className="w-full border px-3 py-2 rounded" value={accountManagerPhone} onChange={(e) => setAccountManagerPhone(e.target.value)} disabled />
                  </div>
                  <p className="text-[11px] text-slate-500">Assigned by admin for Premium accounts.</p>
                </div>
                <div className="mt-3">
                  <button onClick={saveBrandingSettings} disabled={!entitlements?.premium} className="px-3 py-2 bg-[#0A66C2] text-white rounded disabled:opacity-60">Save branding</button>
                </div>
              </div>
            )}

              {tab === 'security' && (
                <div>
                  <label className="flex items-center gap-3"><input type="checkbox"/> Enable 2FA</label>
                  <div className="mt-3 text-sm text-[#5A5A5A]">Active sessions and login activity are shown here.</div>
                  <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-800">Passkeys</p>
                    <p className="mt-1 text-xs text-slate-500">Use passkeys for passwordless login on this device.</p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        type="text"
                        value={passkeyName}
                        onChange={(e) => setPasskeyName(e.target.value)}
                        className="w-full border border-slate-200 px-3 py-2 rounded"
                        placeholder="Optional label (e.g., My Laptop)"
                      />
                      <button
                        type="button"
                        onClick={registerPasskey}
                        disabled={passkeyBusy}
                        className="px-3 py-2 rounded bg-slate-900 text-white disabled:opacity-60"
                      >
                        {passkeyBusy ? 'Creating...' : 'Add passkey'}
                      </button>
                    </div>
                    {passkeys.length ? (
                      <div className="mt-3 space-y-2">
                        {passkeys.map((key) => (
                          <div key={key.id} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-xs">
                            <div>
                              <div className="font-semibold text-slate-800">{key.name || 'Passkey'}</div>
                              <div className="text-[11px] text-slate-500">Created: {key.created_at ? new Date(key.created_at).toLocaleString() : '--'}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePasskey(key.id)}
                              className="text-rose-600 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-slate-500">No passkeys registered yet.</div>
                    )}
                    {passkeyError ? <div className="mt-2 text-xs text-rose-600">{passkeyError}</div> : null}
                    {passkeyNotice ? <div className="mt-2 text-xs text-emerald-700">{passkeyNotice}</div> : null}
                  </div>
                  <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm font-semibold text-rose-700">Delete account</p>
                    <p className="mt-1 text-xs text-rose-600">Enter your password to permanently delete your account.</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full border border-rose-200 px-3 py-2 rounded"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={deleteAccount}
                      disabled={deletingAccount}
                      className="px-3 py-2 rounded bg-rose-600 text-white disabled:opacity-60"
                    >
                      Delete account
                    </button>
                  </div>
                  {deleteFeedback ? <div className="mt-2 text-xs text-rose-700">{deleteFeedback}</div> : null}
                </div>
              </div>
            )}

            {tab === 'members' && (
              <div>
                <Link to="/member-management" className="px-3 py-2 bg-[#0A66C2] text-white rounded">Open Member Management</Link>
              </div>
            )}

            {tab === 'subscription' && (
              <div>
                <div className="text-sm">Current Plan: {String(subscriptionPlan || 'free').toUpperCase()}</div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusChipClasses[verificationStatus]}`}>
                    {statusLabel[verificationStatus]}
                  </span>
                  <span className="text-xs text-[#5A5A5A]">Verification is subscription-based, not permanent.</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={renewVerification} className="px-3 py-2 bg-[#0A66C2] text-white rounded">Renew premium monthly</button>
                  <span className="text-xs text-[#5A5A5A]">Remaining: {Math.max(0, remainingDays)} day(s)</span>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Redeem coupon credit</p>
                  <p className="mt-1 text-xs text-slate-500">Coupon credit can be used for premium subscriptions and verification renewals. Card is optional when using a coupon that does not require a payment method.</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter coupon code"
                    />
                    <button onClick={redeemCoupon} className="px-3 py-2 bg-[#0A66C2] text-white rounded">Redeem</button>
                  </div>
                  <div className="mt-2 text-xs text-[#5A5A5A]">Wallet balance: ${Number(walletBalance || 0).toFixed(2)} | Restricted: ${Number(walletRestricted || 0).toFixed(2)}</div>
                </div>
              </div>
            )}

            {tab === 'boosts' && (
              <div className="space-y-4">
                <div className="text-sm text-[#5A5A5A]">
                  Purchase temporary boosts to increase visibility in feed or profile discovery.
                </div>
                {!entitlements?.premium ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                    Premium required to activate boosts. Upgrade to unlock profile and product boosts.
                  </div>
                ) : null}
                <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Boost scope</label>
                      <select value={boostScope} onChange={(e) => setBoostScope(e.target.value)} className="w-full border px-3 py-2 rounded" disabled={!entitlements?.premium}>
                        <option value="feed">Feed visibility</option>
                        <option value="profile">Profile visibility</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration (days)</label>
                      <input value={boostDuration} onChange={(e) => setBoostDuration(e.target.value)} className="w-full border px-3 py-2 rounded" disabled={!entitlements?.premium} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Multiplier</label>
                      <input value={boostMultiplier} onChange={(e) => setBoostMultiplier(e.target.value)} className="w-full border px-3 py-2 rounded" disabled={!entitlements?.premium} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (USD)</label>
                      <input value={boostPrice} onChange={(e) => setBoostPrice(e.target.value)} className="w-full border px-3 py-2 rounded" disabled={!entitlements?.premium} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={purchaseBoost} disabled={!entitlements?.premium} className="px-3 py-2 bg-[#0A66C2] text-white rounded disabled:opacity-60">Purchase boost</button>
                    <span className="text-xs text-[#5A5A5A]">Wallet balance: ${Number(walletBalance || 0).toFixed(2)} | Restricted: ${Number(walletRestricted || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Active boosts</h3>
                    <button onClick={loadBoosts} className="text-sm text-[#0A66C2] hover:underline">Refresh</button>
                  </div>
                  {loadingBoosts ? <div className="text-sm text-[#5A5A5A]">Loading boosts...</div> : null}
                  {!loadingBoosts && boosts.length === 0 ? <div className="text-sm text-[#5A5A5A]">No boosts yet.</div> : null}
                  <div className="space-y-3">
                    {boosts.map((boost) => (
                      <div key={boost.id} className="rounded-lg border border-slate-200 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{boost.scope} boost</p>
                            <p className="text-xs text-[#5A5A5A]">Multiplier {boost.multiplier} - Status {boost.status}</p>
                          </div>
                          <div className="text-xs text-[#5A5A5A]">Remaining: {remainingLabel(boost.ends_at)}</div>
                        </div>
                        {boost.status === 'active' ? (
                          <button
                            type="button"
                            onClick={() => cancelBoost(boost.id)}
                            className="mt-2 text-xs font-semibold text-rose-600 hover:underline"
                          >
                            Cancel boost
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                {boostFeedback ? <div className="text-sm text-[#5A5A5A]">{boostFeedback}</div> : null}
              </div>
            )}

            {tab === 'assistant_knowledge' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <form onSubmit={saveFaq} className="border rounded p-4">
                  <h3 className="font-semibold mb-2">{editingId ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'}</h3>
                  <label className="block text-sm">Entry Type</label>
                  <select value={knowledgeForm.type} onChange={(e) => setKnowledgeForm({ ...knowledgeForm, type: e.target.value })} className="w-full border px-3 py-2 rounded mb-3">
                    <option value="faq">FAQ</option>
                    <option value="fact">Company Fact</option>
                  </select>
                  <label className="block text-sm">Question</label>
                  <input value={knowledgeForm.question} onChange={(e) => setKnowledgeForm({ ...knowledgeForm, question: e.target.value })} className="w-full border px-3 py-2 rounded mb-3" required />
                  <label className="block text-sm">Answer</label>
                  <textarea value={knowledgeForm.answer} onChange={(e) => setKnowledgeForm({ ...knowledgeForm, answer: e.target.value })} className="w-full border px-3 py-2 rounded mb-3 min-h-28" required />
                  <label className="block text-sm">Keywords (comma separated)</label>
                  <input value={knowledgeForm.keywords} onChange={(e) => setKnowledgeForm({ ...knowledgeForm, keywords: e.target.value })} className="w-full border px-3 py-2 rounded mb-3" />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="px-3 py-2 bg-[#0A66C2] text-white rounded">{editingId ? 'Update' : 'Save'} Entry</button>
                    {editingId && <button type="button" onClick={resetForm} className="px-3 py-2 border rounded">Cancel edit</button>}
                  </div>
                  {faqFeedback && <p className="mt-3 text-sm text-[#5A5A5A]">{faqFeedback}</p>}
                </form>

                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Assistant Knowledge Entries ({entries.length})</h3>
                  <div className="space-y-3 max-h-[420px] overflow-auto">
                    {entries.map((entry) => (
                      <div key={entry.id} className="border rounded p-3">
                        <p className="text-xs uppercase tracking-wide text-[#5A5A5A]">{entry.type || 'faq'}</p>
                        <p className="font-semibold">{entry.question}</p>
                        <p className="text-sm text-[#5A5A5A] mt-1">{entry.answer}</p>
                        <p className="text-xs mt-2">Keywords: {(entry.keywords || []).join(', ') || 'None'}</p>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => selectForEdit(entry)} className="px-2 py-1 text-sm border rounded">Edit</button>
                          <button onClick={() => removeFaq(entry.id)} className="px-2 py-1 text-sm border rounded text-red-600">Delete</button>
                        </div>
                      </div>
                    ))}
                    {!entries.length && <p className="text-sm text-[#5A5A5A]">No org-specific entries yet.</p>}
                  </div>
                </div>
              </div>
            )}

            </div>
            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFF] p-4 text-sm text-slate-700">
                <p className="font-semibold">{HELP_COPY[tab]?.title || 'Settings help'}</p>
                <p className="mt-2 text-xs text-slate-600">{HELP_COPY[tab]?.description || 'Choose a tab to see guidance for that section.'}</p>
              </div>
            </aside>
          </div>
        </div>
        ) : null}
        {billingFeedback ? <div className="mt-4 text-sm text-[#5A5A5A]">{billingFeedback}</div> : null}
      </div>

    </div>
  )
}
