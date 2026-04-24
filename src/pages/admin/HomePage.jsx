import React from 'react'
import {
  ShieldCheck,
  Users,
  Bell,
  Ticket,
  Download,
  SunMedium,
  MoonStar,
  Activity,
  LayoutDashboard,
  Globe,
  Cpu,
  Layers3,
  Network,
  AlertTriangle,
  ChevronRight,
  Wrench,
  ArrowUpRight,
  Settings,
  Sparkles,
  LockKeyhole,
  ClipboardList,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  BarChart,
  Bar,
} from 'recharts'

const HomePage = function HomePage({
  loading,
  error,
  adminDark,
  setAdminDark,
  summary,
  infra,
  network,
  securityContext,
  downloadCsv,
  setError,
  formatNumber,
  formatCurrency,
  premiumUsers,
  activeUsersTrend,
  contractStatusData,
  buyerRequestTrend,
  buyerBenefits,
  factoryBenefits,
  buyingHouseBenefits,
  selectedActionId,
  setSelectedActionId,
  actionForm,
  setActionForm,
  actionGroups,
  runAction,
  actionBusy,
  piePalette,
}) {
  const selectedAction = actionGroups
    .flatMap((g) => g.actions)
    .find((a) => a.id === selectedActionId)

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 shadow-[0_24px_80px_-35px_rgba(14,165,233,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-[1.4rem] border border-sky-400/20 bg-gradient-to-br from-sky-400 to-blue-500 p-3 text-white shadow-lg shadow-sky-500/25">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Owner Admin
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {loading ? (
                    <>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.15)]" />
                      Checking...
                    </>
                  ) : error ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_0_4px_rgba(251,113,113,0.15)]" />
                      Degraded
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)]" />
                      Live
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  MFA {securityContext?.mfa_required ? 'Required' : 'Optional'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Exec {securityContext?.exec_enabled ? 'Enabled' : 'Simulated'}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <LayoutDashboard className="h-4 w-4 text-sky-500" />
                <span className="font-medium text-slate-700 dark:text-slate-200">Command Deck</span>
                <span>• Real-time control for platform, infra, and network operations. Everything is tracked and auditable.</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Owner Access
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Audit logs enabled
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <Activity className="h-3.5 w-3.5" />
                  System Pulse
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAdminDark((v) => !v)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            >
              {adminDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {adminDark ? "Light mode" : "Dark mode"}
            </button>
            <button 
              onClick={() => downloadCsv('/admin/exports/run?dataset=full_system&format=pdf', 'system_audit.pdf').catch(e => setError(e.message))}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_-16px_rgba(14,165,233,0.85)] transition hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" />
              Export report
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total accounts</p>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {loading ? '--' : formatNumber(summary?.users?.total)}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Owner access enabled</p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending verifications</p>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {loading ? '--' : formatNumber(summary?.verification?.pending)}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Audit gate clear</p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Infra alerts</p>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {loading ? '--' : formatNumber(network?.alert_count)}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">System pulse live</p>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Open tickets</p>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {loading ? '--' : formatNumber(summary?.support?.open)}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Support queue empty</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="mb-4 flex items-center gap-3">
            <Globe className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Platform Snapshot</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Core platform health, account state, and audience flow at a glance.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total accounts</p>
              <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {loading ? '--' : formatNumber(summary?.users?.total)}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Verification pending</p>
              <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {loading ? '--' : formatNumber(summary?.verification?.pending)}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Reports open</p>
              <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {loading ? '--' : formatNumber(summary?.support?.open)}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
              <p className="text-sm text-slate-500 dark:text-slate-400">Domain clicks / visits</p>
              <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {loading ? '--' : `${formatNumber(summary?.traffic?.clicks)} / ${formatNumber(summary?.traffic?.visits)}`}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {loading ? '--' : `Spend: ${formatCurrency(summary?.traffic?.spend || 0)} · CPC: ${summary?.traffic?.cpc ? formatCurrency(summary.traffic.cpc) : '--'}`}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Infra + Network Health</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live system stats from infra and network controllers.</p>
                </div>
                <div className="rounded-2xl bg-sky-500/10 p-2 text-sky-500 dark:text-sky-300">
                  <Network className="h-4 w-4" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">CPU usage (%)</p>
                      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        {loading ? '--' : `${infra?.cpu?.usage_percent?.toFixed?.(0) || '0'}%`}
                      </div>
                    </div>
                    <Cpu className="h-4 w-4 text-sky-500" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Memory used</p>
                      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        {loading ? '--' : `${infra?.memory?.used_bytes ? formatNumber(Math.round(infra.memory.used_bytes / (1024 * 1024))) : '0'} MB`}
                      </div>
                    </div>
                    <Layers3 className="h-4 w-4 text-sky-500" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Devices up/down</p>
                      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        {loading ? '--' : `${formatNumber(network?.device_up)} / ${formatNumber(network?.device_down)}`}
                      </div>
                    </div>
                    <Network className="h-4 w-4 text-sky-500" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 dark:border-white/5 dark:bg-slate-950/50">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Network alerts</p>
                      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                        {loading ? '--' : formatNumber(network?.alert_count)}
                      </div>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-sky-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">System Pulse</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Operational readiness and administrative controls.</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-500 dark:text-emerald-300">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Live status</span>
                  {loading ? (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 dark:text-amber-300">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" /> Checking...
                    </span>
                  ) : !error ? (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-500 dark:text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-rose-500 dark:text-rose-300">
                      <span className="h-2 w-2 rounded-full bg-rose-400" /> Degraded
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Premium users</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {loading ? '--' : formatNumber(premiumUsers.length)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/5 dark:bg-slate-950/50">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Suspended</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {loading ? '--' : formatNumber(summary?.users?.suspended)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="mb-4 flex items-center gap-3">
            <Wrench className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Action Console</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Run platform, infra, and network actions with full audit logging.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-800 dark:text-amber-200">
            Step-up required for destructive actions
          </div>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Action</span>
              <div className="relative">
                <select
                  value={selectedActionId}
                  onChange={(e) => setSelectedActionId(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  {actionGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.actions.map((action) => (
                        <option key={action.id} value={action.id}>{action.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
              </div>
            </label>

            {selectedAction?.fields?.length ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {selectedAction.fields.map((field) => (
                  <label key={field.key} className="flex flex-col gap-1 text-xs">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">{field.label}</span>
                    <input
                      value={actionForm[field.key] || ''}
                      onChange={(event) => setActionForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      className="rounded-xl shadow-borderless dark:shadow-borderlessDark px-3 py-2 text-xs dark:bg-slate-950"
                      placeholder={field.label}
                    />
                  </label>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-500/10 p-2 text-sky-500 dark:text-sky-300">
                    {selectedAction?.icon ? <selectedAction.icon className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAction?.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">No parameters required.</p>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={() => runAction(selectedAction)}
              disabled={actionBusy === selectedAction?.id}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 px-4 py-3 font-semibold text-white shadow-[0_20px_60px_-18px_rgba(14,165,233,0.9)] transition hover:-translate-y-0.5"
            >
              {actionBusy === selectedAction?.id ? 'Running...' : 'Run action'}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 xl:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Active Users</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last 14 days unique logins</p>
            </div>
          </div>
          <div className="h-[320px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeUsersTrend}>
                  <defs>
                    <linearGradient id="activeUsersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.14} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#activeUsersFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Contract Status</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Signed vs pending vs disputes</p>
            </div>
          </div>
          <div className="h-[320px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contractStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {contractStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={piePalette[index % piePalette.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: adminDark ? '#020617' : '#ffffff',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 20px_40px_-10px rgba(0,0,0,0.2)'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="mb-4 flex items-center gap-3">
            <Activity className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Buyer Requests</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Demand flow over time</p>
            </div>
          </div>
          <div className="h-[280px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={buyerRequestTrend}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.14} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
          <div className="mb-4 flex items-center gap-3">
            <Cpu className="h-5 w-5 text-sky-500" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Infra Overview</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">CPU, memory, and network stability in one view</p>
            </div>
          </div>
          <div className="h-[280px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { label: "CPU", value: infra?.cpu?.usage_percent ?? (infra?.cpu?.load_1m || 0) },
                  { label: "Memory", value: infra?.memory?.used_bytes ? Math.round((infra.memory.used_bytes / infra.memory.total_bytes) * 100) : 0 },
                  { label: "Devices", value: network?.device_total || 0 },
                  { label: "Alerts", value: network?.alert_count || 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.14} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {[
                      "#38bdf8",
                      "#60a5fa",
                      "#0ea5e9",
                      "#93c5fd",
                    ].map((fill) => (
                      <Cell key={fill} fill={fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mb-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-sky-500" />
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Premium Capability Matrix</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Buyer, Factory, and Buying House premium feature sets</p>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Buyer (Premium)</p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {buyerBenefits?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Factory (Premium)</p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {factoryBenefits?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/5 dark:bg-white/5">
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Buying House (Premium)</p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {buyingHouseBenefits?.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage