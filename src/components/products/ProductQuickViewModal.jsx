import React, { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, getCurrentUser, getToken } from '../../lib/auth'
import { recordLeadSource } from '../../lib/leadSource'

function roleToProfileRoute(role, id) {
  if (!id) return '/feed'
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'buyer') return `/buyer/${encodeURIComponent(id)}`
  if (normalized === 'buying_house') return `/buying-house/${encodeURIComponent(id)}`
  return `/factory/${encodeURIComponent(id)}`
}

export default function ProductQuickViewModal({ open, onClose, item, onViewed }) {
  const navigate = useNavigate()
  const token = useMemo(() => getToken(), [])
  const user = useMemo(() => getCurrentUser(), [])
  const viewRecordedRef = useRef({ productId: '', recorded: false })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const productId = item?.product?.id || item?.id || ''
  const companyId = item?.company_id || item?.product?.company_id || item?.author?.id || ''
  const author = item?.author || item?.product?.author || null
  const contentReviewStatus = String(item?.content_review_status || item?.product?.content_review_status || '').toLowerCase()
  const contentReviewReason = item?.content_review_reason || item?.product?.content_review_reason || ''
  const viewerRole = String(user?.role || '').toLowerCase()
  const isOwner = Boolean(user?.id) && String(user.id) === String(companyId)
  const isAgentOwner = viewerRole === 'agent' && String(user?.org_owner_id || '') === String(companyId)
  const canAppeal = contentReviewStatus === 'rejected' && (isOwner || isAgentOwner)
  const gallery = Array.isArray(item?.image_gallery)
    ? item.image_gallery
    : Array.isArray(item?.product?.image_gallery)
      ? item.product.image_gallery
      : []
  const galleryUrls = gallery.map((entry) => entry?.url).filter(Boolean)
  const coverUrl = item?.cover_image_public_url
    || item?.cover_image_url
    || item?.product?.cover_image_public_url
    || item?.product?.cover_image_url
    || galleryUrls[0]
    || ''

  useEffect(() => {
    if (!open || !productId) return
    const state = viewRecordedRef.current
    if (state.productId !== productId) {
      viewRecordedRef.current = { productId, recorded: false }
    }
    if (viewRecordedRef.current.recorded) return

    let alive = true
    apiRequest(`/products/${encodeURIComponent(productId)}/view`, { method: 'POST', token })
      .then(() => {
        if (!alive) return
        viewRecordedRef.current = { productId, recorded: true }
        if (onViewed) onViewed()
      })
      .catch((err) => {
        if (!alive) return
        setError(err.message || 'Could not record view')
      })
    return () => {
      alive = false
    }
  }, [open, onViewed, productId, token])

  if (!open) return null

  function handleClose() {
    viewRecordedRef.current = { productId: '', recorded: false }
    setError('')
    setNotice('')
    onClose?.()
  }

  function contact() {
    const name = author?.name || 'company'
    if (productId) {
      recordLeadSource({
        type: 'product',
        id: productId,
        label: item?.title || item?.product?.title || 'Product',
      })
    }
    navigate('/chat', { state: { notice: `Contacting ${name}. If you are unverified, your first message may appear as a request.` } })
    handleClose()
  }

  async function reportMistake() {
    if (!token || !productId) return
    const reason = window.prompt('Explain why this product should be approved:') || ''
    if (!reason.trim()) return
    setError('')
    setNotice('')
    try {
      await apiRequest('/reports/product-appeal', {
        method: 'POST',
        token,
        body: { product_id: productId, reason },
      })
      setNotice('Appeal submitted. Our team will review it shortly.')
    } catch (err) {
      setError(err.message || 'Unable to submit appeal.')
    }
  }

  const profileLink = author?.id ? roleToProfileRoute(author.role, author.id) : ''

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close quick view" onClick={handleClose} className="absolute inset-0 bg-black/40" />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl shadow-borderless dark:shadow-borderlessDark overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-5 py-4 shadow-dividerB dark:shadow-dividerBDark">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{item?.title || item?.product?.title || 'Product'}</p>
            {author ? (
              <p className="text-[11px] text-slate-500 truncate">
                {author.name} {author.verified ? <span className="ml-1 font-bold text-[#0A66C2]">Verified</span> : null} {author.country ? `- ${author.country}` : ''}
              </p>
            ) : null}
          </div>
          <button type="button" onClick={handleClose} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-slate-50 p-4">
            {coverUrl ? (
              <img src={coverUrl} alt="Product cover" className="h-40 w-full rounded-xl object-cover mb-4" />
            ) : (
              <div className="h-40 w-full rounded-xl bg-slate-200 mb-4" />
            )}
            {galleryUrls.length > 1 ? (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {galleryUrls.slice(0, 4).map((url) => (
                  <img key={url} src={url} alt="Product thumbnail" className="h-12 w-full rounded-lg object-cover" />
                ))}
              </div>
            ) : null}
            <p className="text-xs font-bold text-slate-700">Details</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex items-start justify-between gap-3"><span className="text-slate-500 text-xs">Category</span><span className="font-semibold text-right">{item?.category || item?.product?.category || '--'}</span></div>
              <div className="flex items-start justify-between gap-3"><span className="text-slate-500 text-xs">Material</span><span className="font-semibold text-right">{item?.material || item?.product?.material || '--'}</span></div>
              <div className="flex items-start justify-between gap-3"><span className="text-slate-500 text-xs">MOQ</span><span className="font-semibold text-right">{item?.moq || item?.product?.moq || '--'}</span></div>
              <div className="flex items-start justify-between gap-3"><span className="text-slate-500 text-xs">Lead time</span><span className="font-semibold text-right">{item?.lead_time_days || item?.product?.lead_time_days || '--'}</span></div>
            </div>
            {(item?.hasVideo || item?.product?.hasVideo) && (item?.video_url || item?.product?.video_url) ? (
              <a
                href={item?.video_url || item?.product?.video_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-xs font-semibold text-[#0A66C2] hover:underline"
              >
                Open video link
              </a>
            ) : null}
          </div>

          <div className="rounded-2xl shadow-borderless dark:shadow-borderlessDark bg-white p-4">
            <p className="text-xs font-bold text-slate-700">Description</p>
            <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {item?.description || item?.product?.description || 'No description provided.'}
            </p>
            {canAppeal ? (
              <div className="mt-4 rounded-xl shadow-borderless dark:shadow-borderlessDark bg-rose-50 px-3 py-3">
                <p className="text-xs font-semibold text-rose-900">This product was rejected.</p>
                <p className="mt-1 text-xs text-rose-700">{contentReviewReason || 'This product needs changes to meet content standards.'}</p>
                <button
                  type="button"
                  onClick={reportMistake}
                  className="mt-3 w-full rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                >
                  If you think this is a mistake, report it for review
                </button>
              </div>
            ) : null}
            {error ? <p className="mt-3 text-xs text-rose-700">{error}</p> : null}
            {notice ? <p className="mt-3 text-xs text-emerald-700">{notice}</p> : null}
          </div>
        </div>

        <footer className="px-5 py-4 shadow-dividerT dark:shadow-dividerTDark bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Views are private and help you revisit items quickly.
          </div>
          <div className="flex gap-2">
            {profileLink ? (
              <Link
                to={profileLink}
                onClick={handleClose}
                className="rounded-full shadow-borderless dark:shadow-borderlessDark px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View company profile
              </Link>
            ) : null}
            <button
              type="button"
              onClick={contact}
              className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182]"
            >
              Contact
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}


