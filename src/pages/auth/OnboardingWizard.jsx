/*
  Route: /onboarding
  Access: Protected (login required)
  Allowed roles: buyer, buying_house, factory, owner, admin, agent

  Purpose (project.md):
    - Reduce complexity: guide new users through a short 3-step setup immediately after signup.
    - Save profile image, organization name, and industry/category tags.

  Key API:
    - POST /api/onboarding (submit onboarding fields)

  Notes:
    - This is intentionally lightweight and non-blocking: users can skip, but the app will
      re-prompt until onboarding_completed is true.
*/
import React, { useMemo, useState } from 'react'
import BackButton from '../../components/ui/BackButton'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getCurrentUser, getRoleHome, getToken, saveSession } from '../../lib/auth'

const DEFAULT_CATEGORIES = [
  'T-Shirt',
  'Polo',
  'Denim',
  'Hoodie',
  'Sportswear',
  'Knitwear',
  'Woven',
  'Outerwear',
]

function StepHeader({ step, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(10,102,194,0.10)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[var(--gt-blue)]">
        Step {step} / 3
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{subtitle}</p>
    </div>
  )
}

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])
  const user = getCurrentUser()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [profileImage, setProfileImage] = useState(() => user?.profile?.profile_image || '')
  const [organizationName, setOrganizationName] = useState(() => user?.profile?.organization_name || user?.company_name || '')
  const [categories, setCategories] = useState(() => {
    const current = user?.profile?.categories
    return Array.isArray(current) && current.length ? current : []
  })

  function toggleCategory(cat) {
    setCategories((prev) => {
      const set = new Set(prev)
      if (set.has(cat)) set.delete(cat)
      else set.add(cat)
      return [...set]
    })
  }

  async function submit({ skipped = false } = {}) {
    if (!token) return
    setSaving(true)
    setError('')
    try {
      // Basic validation before submitting (unless skipping)
      if (!skipped) {
        const name = String(organizationName || '').trim()
        if (!name || name.length < 3) {
          setError('Organization name must be at least 3 characters.')
          setSaving(false)
          return
        }
        // Require at least one category to be selected (unless user explicitly skips)
        if (!Array.isArray(categories) || categories.length === 0) {
          setError('Please select at least one category or click "Skip for now".')
          setSaving(false)
          return
        }
      }
      const payload = {
        profile_image: skipped ? (profileImage || '') : (profileImage || ''),
        organization_name: skipped ? (organizationName || '') : (organizationName || ''),
        categories: skipped ? (categories || []) : (categories || []),
      }

      const updatedUser = await apiRequest('/onboarding', { method: 'POST', token, body: payload })
      // Keep session user updated (so route guards / UI show the correct state immediately).
      saveSession(updatedUser, token)
      navigate(getRoleHome(updatedUser.role), { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to save onboarding')
    } finally {
      setSaving(false)
    }
  }

  function next() {
    setError('')
    // Validate current step before advancing
    const validate = (s) => {
      if (s === 1) {
        if (profileImage) {
          try {
            // simple URL validation
            new URL(profileImage)
          } catch {
            setError('Please enter a valid image URL or leave it blank.')
            return false
          }
        }
      }
      if (s === 2) {
        const name = String(organizationName || '').trim()
        if (!name || name.length < 3) {
          setError('Organization name must be at least 3 characters.')
          return false
        }
      }
      return true
    }

    if (!validate(step)) return
    setStep((s) => Math.min(3, s + 1))
  }

  function back() {
    setStep((s) => Math.max(1, s - 1))
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-500 ease-in-out dark:bg-[#020617] dark:text-slate-100">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl bg-[#ffffff] p-8 shadow-[0_12px_40px_rgba(2,6,23,0.08)] ring-1 ring-slate-200/60 transition-colors duration-500 ease-in-out dark:bg-slate-900/50 dark:shadow-none dark:ring-slate-800">
          {step === 1 ? (
            <>
              <StepHeader
                step={1}
                title="Add your profile image"
                subtitle="Optional. You can paste a URL for now."
              />
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Profile image URL</label>
              <input
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-xl borderless-shadow bg-white px-4 py-3 text-sm outline-none transition dark:bg-[#0b1224]"
              />
              {profileImage ? (
                <div className="mt-4 flex items-center gap-3">
                  <img src={profileImage} alt="Preview" className="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200/60 dark:ring-slate-800" />
                  <div className="text-xs text-slate-600 dark:text-slate-300">Preview</div>
                </div>
              ) : null}
            </>
          ) : null}

          {step === 2 ? (
            <>
              <StepHeader
                step={2}
                title="Confirm your organization"
                subtitle="Use the official name used in documents."
              />
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Organization name</label>
              <input
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Your company / buying house name"
                className="mt-2 w-full rounded-xl borderless-shadow bg-white px-4 py-3 text-sm outline-none transition dark:bg-[#0b1224]"
              />
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Account role: <span className="font-semibold text-slate-700 dark:text-slate-200">{String(user?.role || '').replace('_', ' ')}</span>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <StepHeader
                step={3}
                title="Select categories"
                subtitle="Pick a few categories you work with."
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const active = categories.includes(cat)
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={[
                        'rounded-xl px-3 py-2 text-xs font-semibold transition',
                        active
                          ? 'bg-[var(--gt-blue)] text-white shadow-[0_10px_24px_rgba(10,102,194,0.20)]'
                          : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200/60 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/10',
                      ].join(' ')}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">You can change these later in Organization Settings.</p>
            </>
          ) : null}

          {error ? <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{error}</div> : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <BackButton
                onClick={back}
                disabled={step === 1 || saving}
                className="rounded-xl borderless-shadow bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:bg-[#0b1224] dark:text-slate-200"
              >
                Back
              </BackButton>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={saving}
                  className="rounded-xl bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--gt-blue-hover)] disabled:opacity-60"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submit()}
                  disabled={saving}
                  className="rounded-xl bg-[var(--gt-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--gt-blue-hover)] disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Finish setup'}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => submit({ skipped: true })}
              disabled={saving}
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-700 disabled:opacity-60 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


