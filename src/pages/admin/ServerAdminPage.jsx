import React from 'react'

const ServerAdminPage = function ServerAdminPage({
  adminDark,
  setAdminDark,
  serverAdminTab,
  setServerAdminTab,
  serverAdminState,
  serverAdminAuditQuery,
  setServerAdminAuditQuery,
  runAction,
  refreshServerAdminState,
}) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border p-4 sm:p-6 border-white/10 bg-white/5">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl bg-sky-500/20" />
        </div>
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-4 rounded-[2rem] border p-5 shadow-2xl shadow-sky-900/10 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between border-white/10 bg-white/5">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl border bg-gradient-to-br p-4 border-sky-400/20 from-sky-400/20 to-blue-500/10 text-sky-200 shadow-sky-500/10">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-white">
                    Server Admin + App Management
                  </h1>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    Full Stack
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    live
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  Professional server and application management with monitoring, logs, deployments, and configuration controls.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdminDark((v) => !v)}
              className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium border-white/10 bg-white/10 text-white"
            >
              Toggle Theme
            </button>
          </header>
          <section className="rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6 border-white/10 bg-white/5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {['overview', 'services', 'deployments', 'logs'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setServerAdminTab(tab)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    serverAdminTab === tab
                      ? 'border-sky-400/30 bg-sky-500/10 text-sky-300'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6 border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">System Status</p>
                <p className="text-xs text-slate-400">Live server and application metrics</p>
              </div>
              <button
                type="button"
                onClick={() => refreshServerAdminState()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300"
              >
                Refresh
              </button>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-400">Services Running</p>
                <p className="text-2xl font-semibold text-white">{serverAdminState?.service_count || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-400">Deployments</p>
                <p className="text-2xl font-semibold text-emerald-400">{serverAdminState?.deployment_count || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-400">Uptime</p>
                <p className="text-2xl font-semibold text-sky-400">{serverAdminState?.uptime || 'N/A'}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ServerAdminPage