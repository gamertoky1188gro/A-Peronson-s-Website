import React from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  Globe2,
  KeyRound,
  LockKeyhole,
  Moon,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from 'lucide-react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function UltraPill({ dark, active = false, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        active
          ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300'
          : dark
            ? 'border-white/10 bg-white/5 text-slate-300'
            : 'border-slate-200 bg-slate-100 text-slate-600'
      )}
    >
      {children}
    </span>
  )
}

function UltraStatCard({ dark, label, value, sub, icon: Icon, tone = 'default' }) {
  const toneClasses = {
    default: dark ? 'text-white' : 'text-slate-900',
    good: 'text-cyan-300',
    warn: 'text-amber-300',
  }
  return (
    <div className={cn('rounded-2xl border p-4', dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
      <p className={cn('text-xs uppercase tracking-[0.18em]', dark ? 'text-slate-400' : 'text-slate-500')}>{label}</p>
      <p className={cn('mt-1 text-2xl font-semibold', toneClasses[tone])}>
        {value}
        {sub && <span className="ml-1 text-sm font-normal">{sub}</span>}
      </p>
      {Icon && <Icon className={cn('mt-2 h-4 w-4', toneClasses[tone])} />}
    </div>
  )
}

function UltraSectionCard({ dark, title, subtitle, children, right }) {
  return (
    <div className={cn('rounded-2xl border p-5', dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className={cn('text-lg font-semibold', dark ? 'text-white' : 'text-slate-900')}>{title}</h3>
          {subtitle && <p className={cn('mt-1 text-sm', dark ? 'text-slate-400' : 'text-slate-500')}>{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

function UltraToggle({ dark, on, label, hint, onToggle }) {
  return (
    <div className={cn('flex items-center justify-between rounded-xl border p-3', dark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-white')}>
      <div>
        <p className={cn('font-medium', dark ? 'text-white' : 'text-slate-900')}>{label}</p>
        {hint && <p className={cn('text-sm', dark ? 'text-slate-400' : 'text-slate-500')}>{hint}</p>}
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
          on ? 'bg-cyan-500' : dark ? 'bg-slate-700' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            on ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}

function UltraTinyChart({ dark, points = [], kpis = [] }) {
  return (
    <div className={cn('rounded-2xl border p-4', dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
      <div className="flex items-center justify-between">
        <p className={cn('text-xs font-semibold uppercase tracking-wider', dark ? 'text-slate-300' : 'text-slate-600')}>Security pulse</p>
        <Activity className={cn('h-4 w-4', dark ? 'text-cyan-400' : 'text-sky-500')} />
      </div>
      <div className={cn('mt-3 flex items-end justify-between gap-0.5', dark ? 'text-slate-200' : 'text-slate-800')}>
        {(points || []).slice(0, 7).map((pt, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn('w-full rounded-t-sm bg-gradient-to-t from-cyan-500 to-sky-400', dark ? 'opacity-80' : '')}
              style={{ height: `${Math.max(4, (pt.value || 0) / 10)}px` }}
            />
          </div>
        ))}
      </div>
      <div className={cn('mt-3 grid grid-cols-3 gap-2 text-center text-xs', dark ? 'text-slate-400' : 'text-slate-600')}>
        {(kpis || []).slice(0, 3).map((kpi, i) => (
          <div key={i}>
            <p className={cn('font-semibold', dark ? 'text-white' : 'text-slate-900')}>{kpi.value}</p>
            <p className={cn('text-[10px] uppercase', dark ? 'text-slate-500' : 'text-slate-500')}>{kpi.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const UltraSecurityPage = React.forwardRef(function UltraSecurityPage(
  {
    adminDark,
    setAdminDark,
    securityState,
    ultraSecurityCapabilities,
    ultraMiniChartPoints,
    ultraMiniChartKpis,
    ultraAuditQuery,
    setUltraAuditQuery,
    runSecurityAction,
    refreshSecurityState,
    refreshAudit,
    refreshVerificationQueue,
    refreshDisputes,
    verificationQueue,
    disputes,
    filteredUltraAuditRows,
    audit,
    emptyCopy,
  },
  ref
) {
  return (
    <div
      className={cn(
        'rounded-[32px] border p-4 sm:p-5',
        adminDark ? 'border-slate-800/70 bg-slate-950/50' : 'border-slate-200 bg-white/75'
      )}
    >
      <div
        className={cn(
          'rounded-[32px] border p-5 backdrop-blur-xl',
          adminDark
            ? 'border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.24),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#07111f_55%,_#050b16_100%)] text-slate-100'
            : 'border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.10),_transparent_22%),linear-gradient(180deg,_#eff8ff_0%,_#f8fbff_55%,_#eef6ff_100%)] text-slate-900'
        )}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                <ShieldCheck className="h-4 w-4" /> ultra security layer
              </span>
              <UltraPill dark={adminDark} active>
                Advanced
              </UltraPill>
              <UltraPill dark={adminDark}>Live</UltraPill>
            </div>
            <h1 className={cn('mt-4 text-3xl font-semibold tracking-tight sm:text-4xl', adminDark ? 'text-white' : 'text-slate-900')}>
              Zero Trust, incident response, and immutable audit control in one command deck.
            </h1>
            <p className={cn('mt-3 max-w-3xl text-sm leading-6 sm:text-base', adminDark ? 'text-slate-300' : 'text-slate-700')}>
              A premium admin surface for secure operations, session governance, forensic logs, and tamper-evident oversight.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAdminDark((v) => !v)}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:-translate-y-0.5',
                adminDark ? 'border-white/10 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-900'
              )}
            >
              {adminDark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {adminDark ? 'Light mode' : 'Dark mode'}
            </button>
            <button
              type="button"
              onClick={() => {
                refreshSecurityState()
                refreshAudit()
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <UltraStatCard
                dark={adminDark}
                label="Zero-trust"
                value={securityState?.zero_trust?.enabled ? 'On' : 'Off'}
                icon={Shield}
                tone={securityState?.zero_trust?.enabled ? 'good' : 'warn'}
              />
              <UltraStatCard
                dark={adminDark}
                label="MFA required"
                value={securityState?.mfa?.required ? 'Yes' : 'No'}
                icon={BadgeCheck}
                tone={securityState?.mfa?.required ? 'good' : 'warn'}
              />
              <UltraStatCard
                dark={adminDark}
                label="Session timeout"
                value={String(securityState?.session?.timeout_minutes ?? 30)}
                sub="min"
                icon={Clock3}
              />
              <UltraStatCard
                dark={adminDark}
                label="IP allowlist"
                value={String((securityState?.ip_whitelist || []).length)}
                icon={Globe2}
                tone="good"
              />
            </div>

            <UltraSectionCard
              dark={adminDark}
              title="Zero Trust + MFA"
              subtitle="Session control and device fingerprints."
              right={
                <div className="flex items-center gap-2 text-sm text-cyan-300">
                  <LockKeyhole className="h-4 w-4" />
                  hardened access
                </div>
              }
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <UltraToggle
                    dark={adminDark}
                    on={Boolean(securityState?.zero_trust?.enabled)}
                    label="Toggle zero-trust"
                    hint="Strict session validation and conditional access."
                    onToggle={() =>
                      runSecurityAction('security.zero_trust.toggle', { enabled: !securityState?.zero_trust?.enabled })
                    }
                  />

                  <div className={cn('grid gap-4 rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Rotate keys</p>
                        <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>Encryption keys and session secrets.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => runSecurityAction('security.encryption.rotate')}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <KeyRound className="h-4 w-4" /> Rotate
                      </button>
                    </div>

                    <div className={cn('grid gap-3 sm:grid-cols-2', adminDark ? 'text-slate-200' : 'text-slate-800')}>
                      <div className={cn('rounded-xl border p-3', adminDark ? 'border-white/10 bg-black/10' : 'border-slate-200 bg-white')}>
                        <p className={cn('text-xs uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Session fingerprint</p>
                        <p className="mt-1 font-medium">{securityState?.device_fingerprinting?.enabled ? 'Enabled' : 'Off'}</p>
                      </div>
                      <div className={cn('rounded-xl border p-3', adminDark ? 'border-white/10 bg-black/10' : 'border-slate-200 bg-white')}>
                        <p className={cn('text-xs uppercase tracking-[0.18em]', adminDark ? 'text-slate-400' : 'text-slate-500')}>Geo-fence</p>
                        <p className="mt-1 font-medium">{securityState?.geo_fence?.enabled ? 'On' : 'Off'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                    <div className="mb-3 flex items-center justify-between">
                      <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Current security state</p>
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
                        <ShieldCheck className="h-3.5 w-3.5" /> active
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        ['Zero-trust', securityState?.zero_trust?.enabled ? 'On' : 'Off'],
                        ['MFA required', securityState?.mfa?.required ? 'Yes' : 'No'],
                        ['Session timeout', `${securityState?.session?.timeout_minutes ?? 30} min`],
                        ['IP allowlist', String((securityState?.ip_whitelist || []).length)],
                        ['Geo-fence', securityState?.geo_fence?.enabled ? 'On' : 'Off'],
                      ].map(([key, value]) => (
                        <div
                          key={key}
                          className={cn('flex items-center justify-between border-b border-dashed pb-2 last:border-0 last:pb-0', adminDark ? 'border-white/10' : 'border-slate-200')}
                        >
                          <span className={adminDark ? 'text-slate-400' : 'text-slate-600'}>{key}</span>
                          <span className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Incident Response</p>
                        <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>Incident dashboard and approvals.</p>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => runSecurityAction('security.export.request', { dataset: 'full' })}
                        className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200"
                      >
                        Approvals queue
                      </button>
                      <button
                        type="button"
                        onClick={() => runSecurityAction('security.incident.create', { title: 'Lockdown', severity: 'high' })}
                        className={cn('rounded-xl border px-4 py-2 text-sm font-medium', adminDark ? 'border-white/10 text-slate-200' : 'border-slate-200 text-slate-800')}
                      >
                        Lockdown playbook
                      </button>
                    </div>
                    <div className={cn('mt-4 space-y-2 text-[11px]', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                      {(securityState?.incidents || []).slice(0, 3).map((incident) => (
                        <div key={incident.id} className={cn('rounded-xl border px-3 py-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                          {incident.title} · {incident.status}
                        </div>
                      ))}
                      {(securityState?.data_exports?.pending || []).slice(0, 2).map((req) => (
                        <div key={req.id} className={cn('text-[11px]', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                          Export {req.dataset} · {req.status}
                        </div>
                      ))}
                      {!securityState?.incidents?.length && !(securityState?.data_exports?.pending || []).length ? (
                        <div className={adminDark ? 'text-slate-400' : 'text-slate-600'}>No active incidents.</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </UltraSectionCard>

            <UltraSectionCard
              dark={adminDark}
              title="Forensic + Immutable Backups"
              subtitle="Tamper-proof logs and snapshots."
              right={<UltraPill dark={adminDark} active>Immutable</UltraPill>}
            >
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <UltraStatCard dark={adminDark} label="Forensic logs" value={String((securityState?.forensic_logs || []).length)} icon={BookOpen} />
                <UltraStatCard dark={adminDark} label="Immutable snapshots" value={securityState?.immutable_backups?.last_snapshot_at || 'none'} icon={Database} tone="warn" />
                <UltraStatCard dark={adminDark} label="Last key rotation" value={securityState?.encryption?.last_rotated_at || 'never'} icon={KeyRound} tone="warn" />
                <UltraStatCard dark={adminDark} label="Tamper-proof logs" value={securityState?.tamper_proof_logs?.enabled ? 'On' : 'Off'} icon={ShieldAlert} tone={securityState?.tamper_proof_logs?.enabled ? 'good' : 'warn'} />
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div className={cn('rounded-2xl border p-4 lg:col-span-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Zero-Trust &amp; Incident Response</p>
                      <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-500')}>{ultraSecurityCapabilities.length} capabilities</p>
                    </div>
                    <Sparkles className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ultraSecurityCapabilities.map((cap) => (
                      <div key={cap} className={cn('flex items-start gap-2 rounded-xl border p-3 text-sm', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
                        <span className={cn(adminDark ? 'text-slate-200' : 'text-slate-800')}>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                  <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>Risk posture</p>
                  <div className="mt-4 space-y-4">
                    {[
                      ['Access risk', 'Low', 'w-2/5', 'from-sky-500 to-cyan-400', 'text-cyan-300'],
                      ['Backup integrity', 'High', 'w-4/5', 'from-cyan-400 to-sky-500', 'text-cyan-300'],
                      ['Response readiness', 'Review', 'w-3/5', 'from-amber-400 to-orange-400', 'text-amber-300'],
                    ].map(([label, value, widthClass, gradient, valueClass]) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className={adminDark ? 'text-slate-300' : 'text-slate-700'}>{label}</span>
                          <span className={valueClass}>{value}</span>
                        </div>
                        <div className={cn('h-2 rounded-full', adminDark ? 'bg-white/10' : 'bg-slate-200')}>
                          <div className={cn('h-2 rounded-full bg-gradient-to-r', widthClass, gradient)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </UltraSectionCard>
          </div>

          <div className="space-y-5 xl:col-span-4">
            <UltraTinyChart dark={adminDark} points={ultraMiniChartPoints} kpis={ultraMiniChartKpis} />

            <UltraSectionCard
              dark={adminDark}
              title="Verification Queue"
              subtitle="EU/USA docs pending review."
              right={
                <button
                  type="button"
                  onClick={() => refreshVerificationQueue()}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                    adminDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-900'
                  )}
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              }
            >
              <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                <div className="space-y-2 text-xs">
                  {verificationQueue.slice(0, 3).map((row) => (
                    <div key={row.id || row.user_id} className={cn('rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                      <p className={cn('text-[11px] font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{row.user_name || row.user_email || row.user_id}</p>
                      <p className={cn('text-[10px]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Doc: {row.doc_type || row.type || 'business'} · Status: {row.status || 'pending'}</p>
                    </div>
                  ))}
                  {!verificationQueue.length ? (
                    <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                      {emptyCopy('verification.pending', 'No pending verifications in queue.')}
                    </p>
                  ) : null}
                </div>
              </div>
            </UltraSectionCard>

            <UltraSectionCard
              dark={adminDark}
              title="Dispute Radar"
              subtitle="Contracts with open issues."
              right={
                <button
                  type="button"
                  onClick={() => refreshDisputes()}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                    adminDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-900'
                  )}
                >
                  <RefreshCw className="h-4 w-4" /> Sync
                </button>
              }
            >
              <div className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                <div className="space-y-2 text-xs">
                  {disputes.slice(0, 3).map((dispute) => (
                    <div key={dispute.id} className={cn('rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-white')}>
                      <p className={cn('text-[11px] font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{dispute.title || dispute.contract_id || 'Dispute'}</p>
                      <p className={cn('text-[10px]', adminDark ? 'text-slate-400' : 'text-slate-600')}>Status: {dispute.status || 'open'} · Priority: {dispute.priority || 'normal'}</p>
                    </div>
                  ))}
                  {!disputes.length ? (
                    <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{emptyCopy('disputes.none', 'No active disputes.')}</p>
                  ) : null}
                </div>
              </div>
            </UltraSectionCard>

            <UltraSectionCard
              dark={adminDark}
              title="Audit Pulse"
              subtitle="Most recent admin actions."
              right={
                <button
                  type="button"
                  onClick={() => refreshAudit()}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm',
                    adminDark ? 'border-white/10 bg-white/5 text-slate-200' : 'border-slate-200 bg-white text-slate-900'
                  )}
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              }
            >
              <div className="space-y-3">
                {audit.slice(0, 5).map((entry) => (
                  <div key={entry.id || entry.at} className={cn('rounded-2xl border p-3', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.path || entry.action || 'Admin action'}</p>
                        <p className={cn('mt-1 text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>{entry.at ? new Date(entry.at).toLocaleString() : '--'} · system</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div className={cn('mt-3 text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                      Actor: {entry.actor_id || entry.actor || 'system'} / Status: {entry.status ?? 200}
                      <br />
                      IP: {entry.ip || '--'} / Device: {entry.device_id || '--'}
                    </div>
                  </div>
                ))}
                {!audit.length ? <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>No recent activity.</p> : null}
              </div>
            </UltraSectionCard>
          </div>
        </div>

        <section className={cn('mt-5 rounded-[32px] border p-6 backdrop-blur-xl', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/80')}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className={cn('text-xl font-semibold tracking-tight', adminDark ? 'text-white' : 'text-slate-900')}>Admin Audit Log</h2>
              <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                Immutable, tamper-evident audit trail for every admin action.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
                <Search className={cn('h-4 w-4', adminDark ? 'text-slate-400' : 'text-slate-500')} />
                <input
                  value={ultraAuditQuery}
                  onChange={(e) => setUltraAuditQuery(e.target.value)}
                  placeholder="Search audit..."
                  className={cn('w-44 bg-transparent text-sm outline-none', adminDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400')}
                />
              </div>
              <button
                type="button"
                onClick={() => refreshAudit()}
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium',
                  adminDark ? 'border-white/10 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-900'
                )}
              >
                <RefreshCw className="h-4 w-4" /> Refresh log
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {filteredUltraAuditRows.slice(0, 10).map((entry) => (
              <div
                key={`${entry.id || entry.at}-${entry.path || entry.action}`}
                className={cn(
                  'grid gap-2 rounded-2xl border p-4 md:grid-cols-[1.4fr_0.8fr_1fr] md:items-center',
                  adminDark ? 'border-white/10 bg-slate-950/25' : 'border-slate-200 bg-slate-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/10 p-2 text-cyan-300">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{entry.path || entry.action || '--'}</p>
                    <p className={cn('text-xs', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                      Actor: {entry.actor_id || entry.actor || 'system'} / Status: {entry.status ?? 200}
                    </p>
                  </div>
                </div>
                <div className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                  {entry.at ? new Date(entry.at).toLocaleString() : '--'}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                    IP: {entry.ip || '--'} / Device: {entry.device_id || '--'}
                  </div>
                  <ChevronRight className={cn('h-4 w-4', adminDark ? 'text-slate-500' : 'text-slate-400')} />
                </div>
              </div>
            ))}
            {filteredUltraAuditRows.length === 0 ? (
              <div className={cn('rounded-2xl border border-dashed p-5 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                No audit entries found.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
})

export default UltraSecurityPage