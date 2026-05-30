/* eslint-disable react-refresh/only-export-components */

import NeonAtom from "../components/ui/NeonAtom";

export function SkeletonLine({ className = "" }) {
  return <NeonAtom size={24} className={`inline-block ${className}`} />;
}

export function Badge({ children, tone = "default" }) {
  const tones = {
    default: `bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`,
    sky: `bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300`,
    emerald: `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`,
    amber: `bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`,
    rose: `bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`,
    violet: `bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300`,
    blue: `bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`,
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        tones[tone] || tones.default
      }`}
    >
      {children}
    </span>
  );
}

export function StatCard({ icon: Icon, title, value, meta, tone = "sky" }) {
  const toneClasses = {
    sky: "from-sky-500/10 to-blue-500/10 text-sky-600 dark:text-sky-300",
    emerald:
      "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
    amber:
      "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-300",
    rose: "from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-300",
    violet:
      "from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-300",
  };
  const toneClass = toneClasses[tone] || toneClasses.sky;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${toneClass} opacity-0 transition-opacity group-hover:opacity-100`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {meta ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {meta}
            </p>
          ) : null}
        </div>
        {Icon && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${toneClass}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  icon,
  children,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800 ${className}`}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
              <icon className="h-5 w-5" />
            </div>
          )}
          <div>
            {title && (
              <h3 className="font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function cmsChipClass(dark, active = false) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all";
  if (active)
    return `${base} bg-sky-500 text-white shadow-md shadow-sky-500/25`;
  return `${base} bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700`;
}

export function CmsMiniBadge({ dark: _dark, children }) {
  return (
    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}

export function CmsStatCard({
  dark: _dark,
  icon: Icon,
  label,
  value,
  meta: _meta,
  trend,
}) {
  return (
    <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        {Icon && <Icon className="h-5 w-5 text-slate-400" />}
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend > 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function CmsSectionCard({
  title,
  subtitle,
  icon,
  children,
  dark: _dark = true,
  right,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
              <icon className="h-5 w-5" />
            </div>
          )}
          <div>
            {title && (
              <h3 className="font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
