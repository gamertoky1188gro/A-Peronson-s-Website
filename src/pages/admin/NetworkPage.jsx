import React from 'react'

const NetworkPage = function NetworkPage({
  adminDark,
  setAdminDark,
  networkQuery,
  setNetworkQuery,
  networkAuditQuery,
  setNetworkAuditQuery,
  networkNav,
  setNetworkNav,
  networkInventory,
  network,
  refreshNetworkInventory,
  runNetworkAction,
}) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] border p-4 sm:p-5 border-white/10 bg-white/5">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl bg-sky-500/20" />
        </div>
        <div className="mx-auto max-w-[1600px] space-y-6">
          <section className="rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6 border-white/10 bg-white/5">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M5 15H3m18 0h-2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">Network Control</h1>
                  <p className="text-sm text-slate-400">Enterprise monitoring, configuration, security, and audit</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminDark(adminDark ? false : true)}
                className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm border-white/10 bg-white/5"
              >
                Toggle Theme
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'inventory', label: 'Inventory' },
                { id: 'security', label: 'Security' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'audit', label: 'Audit' },
                { id: 'users', label: 'Users' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setNetworkNav(id)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    networkNav === id
                      ? 'border-sky-400/30 bg-sky-500/10 text-sky-300'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-[32px] border p-5 shadow-2xl backdrop-blur-xl sm:p-6 border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Device Overview</p>
                <p className="text-xs text-slate-400">Real-time network topology and status</p>
              </div>
              <button
                type="button"
                onClick={() => refreshNetworkInventory()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300"
              >
                Refresh
              </button>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-400">Devices Total</p>
                <p className="text-2xl font-semibold text-white">{network?.device_total || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-400">Devices Online</p>
                <p className="text-2xl font-semibold text-emerald-400">{network?.device_up || 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-400">Devices Offline</p>
                <p className="text-2xl font-semibold text-rose-400">{network?.device_down || 0}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default NetworkPage