import React from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  Gauge,
  Globe2,
  HardDrive,
  LayoutDashboard,
  Layers3,
  Loader2,
  LockKeyhole,
  Moon,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  SunMedium,
  TerminalSquare,
  Workflow,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function cmsChipClass(dark, active = false) {
  return [
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
    dark
      ? active
        ? 'border-sky-400/30 bg-sky-400/15 text-sky-100 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]'
        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
      : active
        ? 'border-sky-500/20 bg-sky-50 text-sky-700 shadow-sm'
        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
  ].join(' ')
}

function CmsMiniBadge({ dark, children }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium',
        dark ? 'border-sky-400/20 bg-sky-400/10 text-sky-200' : 'border-sky-200 bg-sky-50 text-sky-700',
      ].join(' ')}
    >
      {children}
    </span>
  )
}

function CmsStatCard({ dark, icon: Icon, label, value, meta, trend }) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-3xl border p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5',
        dark
          ? 'border-white/10 bg-slate-950/70 text-white shadow-[0_12px_40px_rgba(2,8,23,0.35)]'
          : 'border-slate-200/80 bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)]',
      ].join(' ')}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-blue-500/5 opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className={dark ? 'text-xs uppercase tracking-[0.28em] text-slate-400' : 'text-xs uppercase tracking-[0.28em] text-slate-500'}>
            {label}
          </p>
          <div className="mt-2 flex items-end gap-3">
            <h3 className="text-3xl font-semibold tracking-tight">{value}</h3>
            {trend ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-500">
                <ArrowRight className="h-3 w-3" /> {trend}
              </span>
            ) : null}
          </div>
          <p className={dark ? 'mt-2 text-sm text-slate-400' : 'mt-2 text-sm text-slate-600'}>{meta}</p>
        </div>
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-3 text-sky-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function CmsSectionCard({ dark, title, subtitle, icon: Icon, action, children, accent = 'sky' }) {
  return (
    <section
      className={[
        'overflow-hidden rounded-3xl border backdrop-blur-xl',
        dark
          ? 'border-white/10 bg-slate-950/70 shadow-[0_18px_55px_rgba(2,8,23,0.4)]'
          : 'border-slate-200/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3 border-b border-dashed p-4 last:border-0">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-2 text-sky-400">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <div>
            <h3 className={cn('font-semibold', dark ? 'text-white' : 'text-slate-900')}>{title}</h3>
            <p className={cn('text-sm', dark ? 'text-slate-400' : 'text-slate-600')}>{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  )
}

const CmsPage = React.forwardRef(function CmsPage({
  adminDark,
  setAdminDark,
  cmsTab,
  setCmsTab,
  cmsState,
  cmsAuditQuery,
  setCmsAuditQuery,
  refreshCmsState,
  cmsTrendData,
  filteredCmsAuditRows,
  verificationQueue,
  refreshVerificationQueue,
  disputes,
  refreshDisputes,
  audit,
  refreshAudit,
  emptyCopy,
}, ref) {
  return (
    <div
      className={cn(
        'rounded-[32px] border p-4 sm:p-5',
        adminDark ? 'border-slate-800/70 bg-slate-950/50' : 'border-slate-200 bg-white/75'
      )}
    >
      <div
        className={cn(
          'rounded-[28px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6',
          adminDark
            ? 'border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(180deg,#020617_0%,#07111f_50%,#030712_100%)] text-white'
            : 'border-slate-200/80 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_48%,#f8fafc_100%)] text-slate-900'
        )}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <CmsMiniBadge dark={adminDark}>CMS + Content Management</CmsMiniBadge>
              <span className={cmsChipClass(adminDark, true)}>
                <span className="h-2 w-2 rounded-full bg-sky-400" /> live
              </span>
              <span className={cmsChipClass(adminDark)}>
                <ShieldCheck className="h-3.5 w-3.5" /> secured
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'rounded-2xl border p-3',
                  adminDark ? 'border-sky-400/20 bg-sky-400/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-600'
                )}
              >
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Admin Command Center</h1>
                <p className={cn('mt-2 max-w-2xl text-sm sm:text-base', adminDark ? 'text-slate-300' : 'text-slate-700')}>
                  A premium control surface for headless CMS, frontend configuration, automation, deployment, verification, and audit telemetry.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200/80 bg-white/80')}>
              <Search className="h-4 w-4 text-sky-400" />
              <input
                value={cmsAuditQuery}
                onChange={(e) => setCmsAuditQuery(e.target.value)}
                placeholder="Search logs..."
                className={cn(
                  'w-44 bg-transparent text-sm outline-none',
                  adminDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                )}
              />
            </div>
            <button
              type="button"
              onClick={() => setAdminDark((v) => !v)}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5',
                adminDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200/80 bg-white hover:bg-slate-50'
              )}
            >
              {adminDark ? <SunMedium className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-slate-700" />}
              {adminDark ? 'Light mode' : 'Dark mode'}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" /> Premium Action
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CmsStatCard
            dark={adminDark}
            icon={BookOpen}
            label="Content items"
            value={String((cmsState?.articles || []).length + (cmsState?.pages || []).length)}
            meta={`Articles: ${(cmsState?.articles || []).length} · Pages: ${(cmsState?.pages || []).length}`}
            trend={cmsState?.articles?.length ? `+${Math.min(2, cmsState.articles.length)} this week` : ''}
          />
          <CmsStatCard
            dark={adminDark}
            icon={HardDrive}
            label="Media items"
            value={String((cmsState?.media || []).length)}
            meta="Assets and uploads tracked"
          />
          <CmsStatCard
            dark={adminDark}
            icon={Workflow}
            label="Deployments"
            value={String((cmsState?.deployments || []).length)}
            meta={`Cron scripts: ${(cmsState?.cron_scripts || []).length}`}
          />
          <CmsStatCard
            dark={adminDark}
            icon={FileText}
            label="Versions"
            value={String((cmsState?.versions || []).length)}
            meta={`Theme: ${cmsState?.theme?.active || '--'}`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setCmsTab('cms')} className={cmsChipClass(adminDark, cmsTab === 'cms')}>
          <BookOpen className="h-3.5 w-3.5" /> CMS
        </button>
        <button type="button" onClick={() => setCmsTab('frontend')} className={cmsChipClass(adminDark, cmsTab === 'frontend')}>
          <Globe2 className="h-3.5 w-3.5" /> Frontend
        </button>
        <button type="button" onClick={() => setCmsTab('deploy')} className={cmsChipClass(adminDark, cmsTab === 'deploy')}>
          <Workflow className="h-3.5 w-3.5" /> Deployment
        </button>
        <button type="button" onClick={() => setCmsTab('audit')} className={cmsChipClass(adminDark, cmsTab === 'audit')}>
          <ShieldCheck className="h-3.5 w-3.5" /> Audit
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {cmsTab === 'cms' || cmsTab === 'frontend' || cmsTab === 'deploy' ? (
            <CmsSectionCard
              dark={adminDark}
              icon={Layers3}
              title="CMS + Content Management"
              subtitle="3 sections · live"
              action={
                <button
                  type="button"
                  onClick={() => refreshCmsState()}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                    adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'Articles + Pages',
                    desc: 'Headless CMS editor output.',
                    meta: `Media items: ${(cmsState?.media || []).length}`,
                  },
                  {
                    title: 'Theme + SEO + Cache',
                    desc: 'Frontend configuration.',
                    meta: `Cache cleared: ${cmsState?.cache?.last_cleared_at || 'never'}`,
                  },
                  {
                    title: 'Deployments + Backups',
                    desc: 'Automation and cron scripts.',
                    meta: `Versions: ${(cmsState?.versions || []).length}`,
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className={cn(
                      'rounded-2xl border p-4',
                      adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{card.title}</h3>
                      <ChevronRight className={cn('h-4 w-4', adminDark ? 'text-slate-400' : 'text-slate-500')} />
                    </div>
                    <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{card.desc}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className={cn('text-xs', adminDark ? 'text-slate-400' : 'text-slate-500')}>{card.meta}</span>
                      <span className={cmsChipClass(adminDark)}>
                        <Clock3 className="h-3.5 w-3.5" /> synced
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CmsSectionCard>
          ) : null}

          {(cmsTab === 'cms' || cmsTab === 'frontend') ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <CmsSectionCard
                dark={adminDark}
                icon={LockKeyhole}
                title="Headless CMS Integration"
                subtitle="3 capabilities · live"
                action={<CmsMiniBadge dark={adminDark}>Ready</CmsMiniBadge>}
              >
                <div className="space-y-3">
                  {[
                    ['Content API', 'Deliver structured data to every surface.'],
                    ['Media pipeline', 'Image transforms, upload tracking, and delivery.'],
                    ['Role-safe publishing', 'Approval gates and audit attribution.'],
                  ].map(([title, desc]) => (
                    <div
                      key={title}
                      className={cn(
                        'flex items-start gap-3 rounded-2xl border p-4',
                        adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                      )}
                    >
                      <div className="mt-1 rounded-xl bg-sky-400/10 p-2 text-sky-400">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{title}</p>
                        <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CmsSectionCard>

              <CmsSectionCard
                dark={adminDark}
                icon={Globe2}
                title="Frontend Configuration"
                subtitle="4 capabilities · live"
                action={
                  <button
                    type="button"
                    onClick={() => refreshCmsState()}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                      adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <RefreshCw className="h-4 w-4" /> Refresh
                  </button>
                }
              >
                <div className="space-y-3">
                  {[
                    ['Theme', cmsState?.theme?.active ? `Active: ${cmsState.theme.active}` : 'Not configured'],
                    ['SEO title', cmsState?.seo?.default_title || 'Not set'],
                    ['Cache', cmsState?.cache?.last_cleared_at ? `Cleared: ${cmsState.cache.last_cleared_at}` : 'Clearable from the dashboard'],
                    ['Env vars', `${Object.keys(cmsState?.env?.vars || {}).length} active values exposed`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border px-4 py-3',
                        adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
                      )}
                    >
                      <div>
                        <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{label}</p>
                        <p className={cn('mt-0.5 font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{value}</p>
                      </div>
                      <CmsMiniBadge dark={adminDark}>{label === 'Cache' ? 'mutable' : 'set'}</CmsMiniBadge>
                    </div>
                  ))}
                </div>
              </CmsSectionCard>
            </div>
          ) : null}

          {(cmsTab === 'deploy' || cmsTab === 'cms') ? (
            <CmsSectionCard
              dark={adminDark}
              icon={Workflow}
              title="Deployment & Automation"
              subtitle="3 capabilities · live"
              action={<CmsMiniBadge dark={adminDark}>Cron-enabled</CmsMiniBadge>}
            >
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['Build orchestration', 'Versioned deploys with clear audit roots.'],
                  ['Backup jobs', 'Automated snapshots and restore paths.'],
                  ['Schedulers', 'Cron scripts for recurring admin tasks.'],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className={cn(
                      'rounded-2xl border p-4',
                      adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={cn('font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>{title}</h3>
                      <TerminalSquare className="h-4 w-4 text-sky-400" />
                    </div>
                    <p className={cn('mt-2 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>{desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-sky-400">
                      <ArrowRight className="h-3.5 w-3.5" /> operational
                    </div>
                  </div>
                ))}
              </div>
            </CmsSectionCard>
          ) : null}

          {cmsTab === 'audit' ? (
            <CmsSectionCard
              dark={adminDark}
              icon={ShieldCheck}
              title="Audit Pulse"
              subtitle="Most recent admin actions"
              action={
                <button
                  type="button"
                  onClick={() => refreshAudit()}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                    adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              }
            >
              <div className="space-y-3">
                {filteredCmsAuditRows.slice(0, 5).map((item) => (
                  <div
                    key={`${item.id || item.at || item.path}`}
                    className={cn(
                      'flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between',
                      adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70'
                    )}
                  >
                    <div>
                      <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{item.path || item.action || '--'}</p>
                      <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                        {item.at ? new Date(item.at).toLocaleString() : '--'} · system
                      </p>
                    </div>
                    <span className={cmsChipClass(adminDark)}>
                      <Activity className="h-3.5 w-3.5" /> {item.status ?? 200}
                    </span>
                  </div>
                ))}
                {filteredCmsAuditRows.length === 0 ? (
                  <div className={cn('rounded-2xl border border-dashed p-5 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                    No audit entries found.
                  </div>
                ) : null}
              </div>
            </CmsSectionCard>
          ) : null}
        </div>

        <div className="space-y-6 lg:col-span-4">
          <CmsSectionCard
            dark={adminDark}
            icon={Gauge}
            title="Platform Snapshot"
            subtitle="Live signal and trend"
            action={<CmsMiniBadge dark={adminDark}>Realtime</CmsMiniBadge>}
          >
            <div className={cn('rounded-3xl border p-4', adminDark ? 'border-white/10 bg-slate-950/80' : 'border-slate-200 bg-white')}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className={cn('text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>Command health</p>
                  <p className={cn('mt-1 text-2xl font-semibold', adminDark ? 'text-white' : 'text-slate-900')}>98.7%</p>
                </div>
                <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-400">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cmsTrendData}>
                    <defs>
                      <linearGradient id="cmsFillSky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={adminDark ? 0.35 : 0.25} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={adminDark ? 'rgba(148,163,184,0.18)' : 'rgba(148,163,184,0.25)'}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: adminDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: adminDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip
                      contentStyle={{
                        background: adminDark ? 'rgba(2,6,23,0.95)' : 'rgba(255,255,255,0.98)',
                        border: adminDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(226,232,240,1)',
                        borderRadius: 16,
                        color: adminDark ? '#fff' : '#0f172a',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={adminDark ? 'rgba(186,230,253,0.95)' : 'rgba(2,132,199,0.92)'}
                      strokeWidth={3}
                      fill="url(#cmsFillSky)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CmsSectionCard>

          <CmsSectionCard
            dark={adminDark}
            icon={BadgeCheck}
            title="Verification Queue"
            subtitle="EU/USA docs pending review"
            action={
              <button
                type="button"
                onClick={() => refreshVerificationQueue()}
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                  adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            }
          >
            <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70')}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                    {verificationQueue.length
                      ? `${verificationQueue.length} items pending review.`
                      : emptyCopy('verification.pending', 'No pending verifications in queue.')}
                  </p>
                  <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                    All onboarding documents are currently in a clean state.
                  </p>
                </div>
                <span className={cmsChipClass(adminDark)}>
                  <BadgeCheck className="h-3.5 w-3.5" /> {verificationQueue.length ? 'pending' : 'clear'}
                </span>
              </div>
            </div>
          </CmsSectionCard>

          <CmsSectionCard
            dark={adminDark}
            icon={FileText}
            title="Dispute Radar"
            subtitle="Contracts with open issues"
            action={
              <button
                type="button"
                onClick={() => refreshDisputes()}
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                  adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                <RefreshCw className="h-4 w-4" /> Sync
              </button>
            }
          >
            <div className={cn('rounded-3xl border p-5', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/70')}>
              <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>
                {disputes.length ? `${disputes.length} open disputes.` : emptyCopy('disputes.none', 'No active disputes.')}
              </p>
              <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                Contract review and escalation feeds are currently idle.
              </p>
            </div>
          </CmsSectionCard>

          <CmsSectionCard
            dark={adminDark}
            icon={Clock3}
            title="Admin Audit Log"
            subtitle="Immutable, tamper-evident audit trail for every admin action."
            action={
              <button
                type="button"
                onClick={() => refreshAudit()}
                className={cn(
                  'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium',
                  adminDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                <RefreshCw className="h-4 w-4" /> Refresh log
              </button>
            }
          >
            <div className="max-h-[540px] space-y-3 overflow-auto pr-1">
              {filteredCmsAuditRows.map((log) => (
                <div
                  key={`${log.id || log.at}-${log.path || log.action}`}
                  className={cn('rounded-2xl border p-4', adminDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={cn('font-medium', adminDark ? 'text-white' : 'text-slate-900')}>{log.path || log.action || '--'}</p>
                      <p className={cn('mt-1 text-sm', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                        {log.at ? new Date(log.at).toLocaleString() : '--'}
                      </p>
                    </div>
                    <span className={cmsChipClass(adminDark)}>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> {log.status ?? 200}
                    </span>
                  </div>
                  <div className={cn('mt-3 grid gap-2 text-xs sm:grid-cols-2', adminDark ? 'text-slate-400' : 'text-slate-600')}>
                    <div>Actor: {log.actor_id || log.actor || 'system'}</div>
                    <div>IP: {log.ip || '--'} / Device: {log.device_id || '--'}</div>
                  </div>
                </div>
              ))}
              {filteredCmsAuditRows.length === 0 ? (
                <div className={cn('rounded-2xl border border-dashed p-5 text-sm', adminDark ? 'border-white/10 bg-white/[0.03] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                  No audit entries found.
                </div>
              ) : null}
            </div>
          </CmsSectionCard>
        </div>
      </div>
    </div>
  )
})

export default CmsPage