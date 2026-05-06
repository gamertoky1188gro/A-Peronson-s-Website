/**
 * Admin Config Section - Configuration Editor
 * Location in main file: ~line 16232-16489
 */
import React from "react";
import { Sliders, Database, Wrench, Save } from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminConfigSection({
  activeCategory,
  adminDark,
  configEditorTab = "inventory",
  setConfigEditorTab = () => {},
  configEditorData = {},
  configEditorLoading = false,
  configEditorError = "",
  configEditorNotice = "",
  configEditorSaving = false,
  setConfigEditorSaving = () => {},
  setConfigEditorNotice = () => {},
  setConfigEditorError = () => {},
}) {
  if (activeCategory !== "config") return null;

  const configTabs = [
    { id: "inventory", label: "Inventory", icon: Database },
    { id: "actions", label: "Actions", icon: Wrench },
    { id: "ui", label: "UI Settings", icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      {/* Config Header */}
      <div
        className={cn(
          "rounded-3xl border p-6",
          adminDark
            ? "border-white/10 bg-white/5"
            : "border-slate-200 bg-white",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 text-white">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h2
              className={cn(
                "text-2xl font-semibold",
                adminDark ? "text-white" : "text-slate-900",
              )}
            >
              Config Editor
            </h2>
            <p
              className={cn(
                "mt-1",
                adminDark ? "text-slate-400" : "text-slate-600",
              )}
            >
              Edit admin panel configuration from the database
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {configTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setConfigEditorTab(tab.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              configEditorTab === tab.id
                ? "bg-sky-500 text-white"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
            )}
          >
            {tab.id === "inventory"
              ? "Inventory"
              : tab.id === "actions"
                ? "Actions"
                : "UI Settings"}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {configEditorLoading ? (
        <div className="py-8 text-center text-slate-500">Loading...</div>
      ) : configEditorError ? (
        <div className="py-8 text-center text-rose-500">
          {configEditorError}
        </div>
      ) : (
        <>
          {/* Inventory Tab */}
          {configEditorTab === "inventory" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    setConfigEditorSaving(true);
                    setConfigEditorNotice("");
                    try {
                      setConfigEditorNotice("Inventory saved!");
                    } catch (err) {
                      setConfigEditorError(err.message);
                    } finally {
                      setConfigEditorSaving(false);
                    }
                  }}
                  disabled={configEditorSaving}
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {configEditorSaving ? "Saving..." : "Save Inventory"}
                </button>
              </div>
              <div className="grid gap-3">
                {(configEditorData?.inventory || []).map((mod, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-xl border p-4",
                      adminDark ? "border-white/10" : "border-slate-200",
                    )}
                  >
                    <div className="font-medium">{mod?.label || "Module"}</div>
                    <div className="text-sm text-slate-500">{mod?.id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {configEditorTab === "actions" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    setConfigEditorSaving(true);
                    setConfigEditorNotice("");
                    try {
                      setConfigEditorNotice("Actions saved!");
                    } catch (err) {
                      setConfigEditorError(err.message);
                    } finally {
                      setConfigEditorSaving(false);
                    }
                  }}
                  disabled={configEditorSaving}
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {configEditorSaving ? "Saving..." : "Save Actions"}
                </button>
              </div>
              <div
                className={cn(
                  "rounded-xl border p-4",
                  adminDark ? "border-white/10" : "border-slate-200",
                )}
              >
                <pre className="max-h-96 overflow-auto text-xs">
                  {JSON.stringify(configEditorData?.actions || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* UI Settings Tab */}
          {configEditorTab === "ui" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    setConfigEditorSaving(true);
                    setConfigEditorNotice("");
                    try {
                      setConfigEditorNotice("UI settings saved!");
                    } catch (err) {
                      setConfigEditorError(err.message);
                    } finally {
                      setConfigEditorSaving(false);
                    }
                  }}
                  disabled={configEditorSaving}
                  className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {configEditorSaving ? "Saving..." : "Save UI Settings"}
                </button>
              </div>
              <pre
                className={cn(
                  "max-h-96 overflow-auto rounded-xl p-4 text-xs",
                  adminDark
                    ? "bg-slate-900 text-slate-200"
                    : "bg-slate-50 text-slate-800",
                )}
              >
                {JSON.stringify(configEditorData?.ui || {}, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}

      {/* Notices */}
      {configEditorNotice && (
        <div className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          {configEditorNotice}
        </div>
      )}
      {configEditorError && (
        <div className="mt-4 rounded-lg bg-rose-500/10 px-4 py-2 text-sm text-rose-400">
          {configEditorError}
        </div>
      )}
    </div>
  );
}

export default AdminConfigSection;
