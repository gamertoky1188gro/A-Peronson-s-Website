import React from 'react'
import { BadgeCheck, MessageCircle, MoreHorizontal, Share2, Flag, MessageSquareText, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function compactText(value) {
  return String(value || '').trim()
}

function fieldRow(label, value) {
  const text = compactText(value)
  if (!text) return null
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium text-right whitespace-pre-wrap">{text}</span>
    </div>
  )
}

export default function FeedItemCard({
  item,
  canExpressInterest,
  expressInterestDisabled,
  onExpressInterest,
  onOpenComments,
  onShare,
  onReport,
  onMessage,
  highlight,
}) {
  const isBuyerRequest = item.entityType === 'buyer_request'
  const profileLink = item.author?.id
    ? (isBuyerRequest ? `/buyer/${encodeURIComponent(item.author.id)}` : `/${item.author.rolePath || 'factory'}/${encodeURIComponent(item.author.id)}`)
    : ''

  return (
    <article
      className={`bg-white rounded-2xl border overflow-hidden transition shadow-sm hover:shadow-md ${
        highlight ? 'border-[#0A66C2] ring-2 ring-[#0A66C2]/20' : 'border-slate-200'
      }`}
      id={`feed-item-${item.entityType}-${item.id}`}
    >
      <header className="p-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {profileLink ? (
                  <Link to={profileLink} className="font-semibold text-slate-900 truncate hover:underline">
                    {item.author?.name || 'Unknown'}
                  </Link>
                ) : (
                  <p className="font-semibold text-slate-900 truncate">{item.author?.name || 'Unknown'}</p>
                )}
                {item.verified ? (
                  <span className="inline-flex items-center gap-1 text-[#0A66C2] text-xs font-semibold" title="Verified (subscription)">
                    <BadgeCheck size={16} />
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500">
                {item.author?.accountType || (isBuyerRequest ? 'Buyer' : 'Company')}
              </p>
            </div>
          </div>
          <button type="button" className="rounded-full p-2 hover:bg-slate-50" aria-label="More actions">
            <MoreHorizontal size={18} className="text-slate-500" />
          </button>
        </div>
      </header>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className={`text-xs font-semibold ${isBuyerRequest ? 'text-emerald-700' : 'text-indigo-700'}`}>
            {isBuyerRequest ? 'Buyer Request' : 'Company Product'}
          </p>
          {item.createdAt ? <p className="text-[11px] text-slate-400">{item.createdAt}</p> : null}
        </div>

        <h3 className="mt-2 text-base font-semibold text-slate-900">
          {isBuyerRequest ? (item.category || 'Request') : (item.title || item.category || 'Product')}
        </h3>

        {item.content ? (
          <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{item.content}</p>
        ) : null}

        {isBuyerRequest ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
            {fieldRow('Category', item.category)}
            {fieldRow('Quantity', item.quantity)}
            {fieldRow('Timeline', item.timelineDays ? `${item.timelineDays} days` : '')}
            {fieldRow('Material', item.material)}
            {fieldRow('Certifications', Array.isArray(item.certifications) ? item.certifications.join(', ') : '')}
            {fieldRow('Shipping', item.shippingTerms)}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
            {fieldRow('Category', item.category)}
            {fieldRow('MOQ', item.moq)}
            {fieldRow('Lead time', item.leadTimeDays ? `${item.leadTimeDays} days` : '')}
            {fieldRow('Material', item.material)}
          </div>
        )}

        {item.hasVideo ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center">
            <p className="text-sm font-semibold text-slate-800">Video available</p>
            <p className="text-[11px] text-slate-500">Open the profile to view the gallery.</p>
          </div>
        ) : null}

        {Array.isArray(item.tags) && item.tags.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag, i) => (
              <span key={`${item.id}-${tag}-${i}`} className="rounded-full bg-[#0A66C2]/10 text-[#0A66C2] px-3 py-1 text-[11px] font-semibold">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <footer className="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <button type="button" onClick={onOpenComments} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0A66C2]">
            <MessageSquareText size={16} /> Comment
          </button>
          <button type="button" onClick={onShare} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0A66C2]">
            <Share2 size={16} /> Share
          </button>
          <button type="button" onClick={onReport} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-rose-600">
            <Flag size={16} /> Report
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isBuyerRequest && canExpressInterest ? (
            <button
              type="button"
              onClick={onExpressInterest}
              disabled={Boolean(expressInterestDisabled)}
              className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {expressInterestDisabled ? 'Claiming…' : 'Express Interest'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onMessage}
              className="rounded-full bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#004182] inline-flex items-center gap-2"
            >
              <MessageCircle size={16} /> Message
            </button>
          )}

          {profileLink ? (
            <Link
              to={profileLink}
              className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
            >
              View profile <ArrowUpRight size={14} />
            </Link>
          ) : null}
        </div>
      </footer>
    </article>
  )
}
