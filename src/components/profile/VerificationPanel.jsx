import React from 'react'
import { BadgeCheck, Shield } from 'lucide-react'

function statusChip(verified) {
  return verified
    ? { label: 'Verified', className: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20', icon: BadgeCheck }
    : { label: 'Not verified', className: 'bg-slate-50 text-slate-700 border-slate-200', icon: Shield }
}

export default function VerificationPanel({ summary }) {
  const verified = Boolean(summary?.verified)
  const chip = statusChip(verified)
  const Icon = chip.icon

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Verification & Credibility</p>
          <p className="mt-1 text-[11px] text-slate-500">More licensing proof increases credibility and international trust.</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${chip.className}`} title="Verification is subscription-based and renews monthly">
          <Icon size={16} />
          {chip.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] text-slate-500">Credibility</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {summary?.credibility?.badge || 'Basic credibility'} ({summary?.credibility?.score ?? 0}/100)
          </p>
          <p className="mt-1 text-[11px] text-slate-600">{summary?.credibility?.completeness || ''}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] text-slate-500">Buyer region</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{summary?.buyer_region || '—'}</p>
          <p className="mt-1 text-[11px] text-slate-600">Optional licenses: {summary?.optional_licenses_count ?? 0}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-slate-700 mb-2">Required documents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(summary?.required_checklist || []).map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-xs font-semibold text-slate-800">{row.label}</span>
              <span className={`text-xs font-bold ${row.submitted ? 'text-emerald-700' : 'text-rose-700'}`}>
                {row.submitted ? '✓' : 'Missing'}
              </span>
            </div>
          ))}
          {!summary?.required_checklist?.length ? (
            <div className="text-xs text-slate-500">No verification checklist available.</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

