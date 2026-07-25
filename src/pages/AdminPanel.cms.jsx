/* eslint-disable react-refresh/only-export-components */

import { ThreeDot } from "react-loading-indicators";

export function SkeletonLine({ className = "", size = 24 }) {
	return (
		<span class={`inline-block ${className}`}>
			<ThreeDot
				variant="bounce"
				color="#6100ff"
				size="medium"
				style={{ fontSize: `${size}px` }}
				text=""
				textColor=""
			/>
		</span>
	);
}

export function Badge({ children, tone = "default" }) {
	const tones = {
		default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
		sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
		emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
		amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
		rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
		violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
		blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	};
	return (
		<span
			class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
		emerald: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
		amber: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-300",
		rose: "from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-300",
		violet: "from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-300",
	};
	const toneClass = toneClasses[tone] || toneClasses.sky;
	return (
		<div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800">
			<div
				class={`absolute inset-0 bg-gradient-to-br ${toneClass} opacity-0 transition-opacity group-hover:opacity-100`}
			/>
			<div class="relative flex items-start justify-between">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
						{title}
					</p>
					<p class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
					{meta ? <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{meta}</p> : null}
				</div>
				{Icon && (
					<div
						class={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${toneClass}`}
					>
						<Icon class="h-5 w-5" />
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Renders a section card.
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ElementType} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export function SectionCard({ title, subtitle, icon, children, className = "" }) {
	const Icon = icon;
	return (
		<div
			class={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800 ${className}`}
		>
			{(title || Icon) && (
				<div class="mb-4 flex items-center gap-3">
					{Icon && (
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
							<Icon class="h-5 w-5" />
						</div>
					)}
					<div>
						{title && <h3 class="font-bold text-slate-900 dark:text-white">{title}</h3>}
						{subtitle && <p class="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
					</div>
				</div>
			)}
			{children}
		</div>
	);
}

/**
 * Returns CSS classes for a CMS chip.
 * @param {boolean} dark
 * @param {boolean} [active]
 * @returns {string}
 */
export function cmsChipClass(_dark, active = false) {
	const base =
		"inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all";
	if (active) {
		return `${base} bg-sky-500 text-white shadow-md shadow-sky-500/25`;
	}
	return `${base} bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700`;
}

/**
 * Renders a CMS mini badge.
 * @param {Object} props
 * @param {boolean} [props.dark]
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function CmsMiniBadge({ dark: _dark, children }) {
	return (
		<span class="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
			{children}
		</span>
	);
}

/**
 * Renders a CMS stat card.
 * @param {Object} props
 * @param {boolean} [props.dark]
 * @param {React.ElementType} [props.icon]
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {any} [props.meta]
 * @param {number} [props.trend]
 * @returns {JSX.Element}
 */
export function CmsStatCard({ dark: _dark, icon: Icon, label, value, meta: _meta, trend }) {
	return (
		<div class="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
			<div class="flex items-center justify-between">
				{Icon && <Icon class="h-5 w-5 text-slate-400" />}
				{trend && (
					<span class={`text-xs font-semibold ${trend > 0 ? "text-emerald-600" : "text-rose-600"}`}>
						{trend > 0 ? "+" : ""}
						{trend}%
					</span>
				)}
			</div>
			<p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
			<p class="text-xs text-slate-500 dark:text-slate-400">{label}</p>
		</div>
	);
}

/**
 * Renders a CMS section card.
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ElementType} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.dark]
 * @param {React.ReactNode} [props.right]
 * @returns {JSX.Element}
 */
export function CmsSectionCard({
	title,
	subtitle,
	icon: Icon,
	children,
	dark: _dark = true,
	right,
}) {
	return (
		<div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					{Icon && (
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
							<Icon class="h-5 w-5" />
						</div>
					)}
					<div>
						{title && <h3 class="font-bold text-slate-900 dark:text-white">{title}</h3>}
						{subtitle && <p class="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
					</div>
				</div>
				{right}
			</div>
			{children}
		</div>
	);
}
