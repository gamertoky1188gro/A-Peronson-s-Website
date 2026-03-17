import React from 'react'
import { BadgeCheck, Shield } from 'lucide-react'

function statusChip(verified) {
  return verified
    ? { label: 'Verified', className: 'verified-shimmer bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-700 ring-emerald-500/20 dark:from-emerald-500/12 dark:to-teal-400/10 dark:text-emerald-200 dark:ring-emerald-400/25', icon: BadgeCheck }
    : { label: 'Not verified', className: 'bg-slate-100/70 text-slate-700 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10', icon: Shield }
}

export default function VerificationPanel({ summary }) {
  const verified = Boolean(summary?.verified)
  const chip = statusChip(verified)
  const Icon = chip.icon
  const rawScore = Number(summary?.credibility?.score ?? 0)
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, rawScore)) : 0

  return (
    <section className="rounded-2xl bg-[#ffffff] p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Verification & Credibility</p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">More licensing proof increases credibility and international trust.</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${chip.className}`} title="Verification is subscription-based and renews monthly">
          <Icon size={16} />
          {chip.label}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-semibold">Credibility meter</span>
          <span className="font-semibold tabular-nums">{score}/100</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-slate-100 ring-1 ring-slate-200/70 overflow-hidden dark:bg-white/5 dark:ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Credibility</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {summary?.credibility?.badge || 'Basic credibility'} ({score}/100)
          </p>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">{summary?.credibility?.completeness || ''}</p>
        </div>

        <div className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Buyer region</p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{summary?.buyer_region || '—'}</p>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">Optional licenses: {summary?.optional_licenses_count ?? 0}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Required documents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(summary?.required_checklist || []).map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{row.label}</span>
              <span className={`text-xs font-bold ${row.submitted ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                {row.submitted ? '✓' : 'Missing'}
              </span>
            </div>
          ))}
          {!summary?.required_checklist?.length ? (
            <div className="text-xs text-slate-500 dark:text-slate-400">No verification checklist available.</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
