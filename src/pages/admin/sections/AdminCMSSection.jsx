/**
 * Admin CMS Section - Content Management
 * Location in main file: ~line 14080-15067
 */

import React from "react";
import { Settings, FileText, Image, Layout } from "lucide-react";
import { cn } from "../../../lib/utils";

export function AdminCMSSection({ 
  activeCategory, 
  adminDark,
  cmsNav = "pages",
  setCmsNav = () => {},
  cmsData = {}
}) {
  if (activeCategory !== "cms") return null;

  const cmsTabs = [
    { id: "pages", label: "Pages", icon: Layout },
    { id: "posts", label: "Posts", icon: FileText },
    { id: "media", label: "Media", icon: Image },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* CMS Header */}
      <div className={cn(
        "rounded-3xl border p-6",
        adminDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
      )}>
        <h2 className={cn(
          "text-2xl font-semibold",
          adminDark ? "text-white" : "text-slate-900"
        )}>
          CMS + Content Management
        </h2>
        <p className={cn("mt-1", adminDark ? "text-slate-400" : "text-slate-600")}>
          Manage your website content and media
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-4 dark:border-slate-700">
        {cmsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCmsNav(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap",
              cmsNav === tab.id
                ? "bg-sky-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {cmsNav === "pages" && (
        <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10" : "border-slate-200")}>
          <h3 className={cn("mb-4 text-lg font-semibold", adminDark ? "text-white" : "text-slate-900")}>Pages</h3>
          <p className="text-slate-500">{cmsData?.pages || 0} pages</p>
        </div>
      )}

      {cmsNav === "posts" && (
        <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10" : "border-slate-200")}>
          <h3 className={cn("mb-4 text-lg font-semibold", adminDark ? "text-white" : "text-slate-900")}>Posts</h3>
          <p className="text-slate-500">{cmsData?.posts || 0} posts</p>
        </div>
      )}

      {cmsNav === "media" && (
        <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10" : "border-slate-200")}>
          <h3 className={cn("mb-4 text-lg font-semibold", adminDark ? "text-white" : "text-slate-900")}>Media Library</h3>
          <p className="text-slate-500">{cmsData?.media || 0} files</p>
        </div>
      )}

      {cmsNav === "settings" && (
        <div className={cn("rounded-2xl border p-6", adminDark ? "border-white/10" : "border-slate-200")}>
          <h3 className={cn("mb-4 text-lg font-semibold", adminDark ? "text-white" : "text-slate-900")}>CMS Settings</h3>
          <p className="text-slate-500">Configure content management settings</p>
        </div>
      )}
    </div>
  );
}

export default AdminCMSSection;