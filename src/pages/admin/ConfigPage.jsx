import React from 'react'

const ConfigPage = function ConfigPage({
  adminDark,
  configEditorTab,
  setConfigEditorTab,
  configEditorData,
  configEditorLoading,
  configEditorSaving,
  configEditorNotice,
  configEditorError,
  apiRequest,
  setConfigEditorSaving,
  setConfigEditorNotice,
  setConfigEditorError,
  setConfigEditorData,
}) {
  return (
    <div className="admin-card admin-sweep rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Dynamic Configuration Editor</h2>
        <p className="text-sm text-slate-500">Edit admin panel configuration from the database.</p>
      </div>

      <div className="mb-4 flex gap-2">
        {['inventory', 'actions', 'ui'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setConfigEditorTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              configEditorTab === tab
                ? 'bg-sky-500 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {tab === 'inventory' ? 'Inventory' : tab === 'actions' ? 'Actions' : 'UI Settings'}
          </button>
        ))}
      </div>

      {configEditorLoading ? (
        <div className="py-8 text-center text-slate-500">Loading...</div>
      ) : configEditorError ? (
        <div className="py-8 text-center text-rose-500">{configEditorError}</div>
      ) : configEditorTab === 'inventory' ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={async () => {
                setConfigEditorSaving(true)
                setConfigEditorNotice('')
                try {
                  await apiRequest('/admin/config/inventory', {
                    method: 'PUT',
                    body: { data: { modules: configEditorData.inventory } },
                  })
                  setConfigEditorNotice('Inventory saved!')
                } catch (err) {
                  setConfigEditorError(err.message)
                } finally {
                  setConfigEditorSaving(false)
                }
              }}
              disabled={configEditorSaving}
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {configEditorSaving ? 'Saving...' : 'Save Inventory'}
            </button>
          </div>
          <div className="grid gap-3">
            {configEditorData.inventory.map((mod, idx) => (
              <div key={mod.id || idx} className="rounded-xl border p-4 border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mod.label}</span>
                  <span className="text-xs text-slate-500">({mod.id})</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {mod.sections?.length || 0} sections
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : configEditorTab === 'actions' ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="font-semibold">Action Groups</p>
            <p className="mt-1 text-xs text-slate-500">
              {configEditorData.actions?.length || 0} action groups configured
            </p>
          </div>
        </div>
      ) : configEditorTab === 'ui' ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="font-semibold">UI Configuration</p>
            <p className="mt-1 text-xs text-slate-500">
              Admin panel UI settings and preferences
            </p>
          </div>
        </div>
      ) : null}

      {configEditorNotice ? (
        <div className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          {configEditorNotice}
        </div>
      ) : null}
      {configEditorError ? (
        <div className="mt-4 rounded-lg bg-rose-500/10 px-4 py-2 text-sm text-rose-400">
          {configEditorError}
        </div>
      ) : null}
    </div>
  )
}

export default ConfigPage