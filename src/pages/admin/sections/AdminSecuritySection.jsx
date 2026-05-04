/**
 * Admin Ultra Security Section
 * Location in main file: ~line 15068-16231
 */
import React from "react";
import { Lock, Shield, ShieldCheck, ShieldAlert, KeyRound } from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminSecuritySection({ 
  activeCategory, 
  adminDark,
  securityNav = "overview",
  setSecurityNav = () => {},
  securityData = {}
}) {
  if (activeCategory !== "ultra-security") return null;

  const securityTabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "threats", label: "Threats", icon: ShieldAlert },
    { id: "access", label: "Access Control", icon: KeyRound },
    { id: "audit", label: "Audit Logs", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Security Header */}
      <div className={cn(
        "rounded-3xl border p-6",
        adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
      )}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h2 className={cn(
              "text-2xl font-semibold",
              adminDark ? "text-white" : "text-slate-900"
            )}>
              Ultra Security Layer
            </h2>
            <p className={cn("mt-1", adminDark ? "text-slate-400" : "text-slate-600")}>
              Advanced threat detection and access management
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-4 dark:border-slate-700">
        {securityTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSecurityNav(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap",
              securityNav === tab.id
                ? "bg-rose-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {securityNav === "overview" && (
        <div className="grid gap-6 md:grid-cols-4">
          <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white")}>
            <div className="text-3xl font-bold text-emerald-500">{securityData?.secure || 0}</div>
            <div className="text-sm text-slate-500">Secure</div>
          </div>
          <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white")}>
            <div className="text-3xl font-bold text-amber-500">{securityData?.warnings || 0}</div>
            <div className="text-sm text-slate-500">Warnings</div>
          </div>
          <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white")}>
            <div className="text-3xl font-bold text-rose-500">{securityData?.threats || 0}</div>
            <div className="text-sm text-slate-500">Threats</div>
          </div>
          <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white")}>
            <div className="text-3xl font-bold">{securityData?.blocked || 0}</div>
            <div className="text-sm text-slate-500">Blocked</div>
          </div>
        </div>
      )}

      {securityNav === "threats" && (
        <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10" : "border-slate-200")}>
          <h3 className={cn("mb-4 text-lg font-semibold", adminDark ? "text-white" : "text-slate-900")}>Threat Detection</h3>
          <p className="text-slate-500">Active threat monitoring and alerts</p>
        </div>
      )}

      {securityNav === "access" && (
        <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10" : "border-slate-200")}>
          <h3 className={cn("mb-4 text-lg font-semibold", adminDark ? "text-white" : "text-slate-900")}>Access Control</h3>
          <p className="text-slate-500">User permissions and security policies</p>
        </div>
      )}

      {securityNav === "audit" && (
        <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10" : "border-slate-200")}>
          <h3 className={cn("mb-4 text-lg font-semibold", adminDark ? "text-white" : "text-slate-900")}>Audit Logs</h3>
          <p className="text-slate-500">Security audit trail and logs</p>
        </div>
      )}
    </div>
  );
}

export default AdminSecuritySection;