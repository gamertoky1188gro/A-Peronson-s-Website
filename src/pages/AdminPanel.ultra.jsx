/**
 * Helper for ultra metric shell styles.
 * @param {boolean} _dark
 * @returns {string}
 */
function ultraMetricShell(_dark) {
	return "rounded-xl border border-slate-800/50 bg-slate-900/50 p-4";
}

/**
 * Renders an ultra pill.
 * @param {Object} props
 * @param {boolean} [props.dark]
 * @param {boolean} [props.active]
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function UltraPill({ dark: _dark, active = false, children }) {
	const base =
		"inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all";
	const activeClass = active
		? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
		: "bg-slate-800 text-slate-300 hover:bg-slate-700";
	return <span class={`${base} ${activeClass}`}>{children}</span>;
}

/**
 * Renders an ultra stat card.
 * @param {Object} props
 * @param {boolean} [props.dark]
 * @param {React.ElementType} [props.icon]
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.hint]
 * @param {number} [props.trend]
 * @param {string} [props.trendLabel]
 * @returns {JSX.Element}
 */
export function UltraStatCard({ dark, icon: Icon, label, value, hint, trend, trendLabel }) {
	return (
		<div class={`${ultraMetricShell(dark)} flex items-start justify-between`}>
			<div>
				<p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
				<p class="mt-2 text-2xl font-bold text-white">{value}</p>
				{hint && <p class="mt-1 text-xs text-slate-400">{hint}</p>}
				{trend !== undefined && trendLabel && (
					<p
						class={`mt-2 text-xs font-semibold ${
							trend >= 0 ? "text-emerald-400" : "text-rose-400"
						}`}
					>
						{trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% {trendLabel}
					</p>
				)}
			</div>
			{Icon && (
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
					<Icon class="h-5 w-5" />
				</div>
			)}
		</div>
	);
}

/**
 * Renders an ultra section card.
 * @param {Object} props
 * @param {boolean} [props.dark]
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.right]
 * @returns {JSX.Element}
 */
export function UltraSectionCard({ dark: _dark, title, subtitle, children, right }) {
	return (
		<div class="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6">
			{(title || right) && (
				<div class="mb-4 flex items-center justify-between">
					<div>
						{title && <h3 class="font-bold text-white">{title}</h3>}
						{subtitle && <p class="text-sm text-slate-400">{subtitle}</p>}
					</div>
					{right}
				</div>
			)}
			{children}
		</div>
	);
}

/**
 * Renders an ultra toggle switch.
 * @param {Object} props
 * @param {boolean} [props.dark]
 * @param {boolean} props.on
 * @param {string} props.label
 * @param {string} [props.hint]
 * @param {Function} props.onToggle
 * @returns {JSX.Element}
 */
export function UltraToggle({ dark: _dark, on, label, hint, onToggle }) {
	return (
		<div class="flex items-center justify-between">
			<div>
				<p class="font-semibold text-white">{label}</p>
				{hint && <p class="text-xs text-slate-400">{hint}</p>}
			</div>
			<button
				type="button"
				onClick={onToggle}
				class={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
					on ? "bg-cyan-500" : "bg-slate-700"
				}`}
				role="switch"
				aria-checked={on}
			>
				<span
					class={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
						on ? "translate-x-5" : "translate-x-0"
					}`}
				/>
			</button>
		</div>
	);
}

/**
 * Renders an ultra tiny chart.
 * @param {Object} props
 * @param {boolean} [props.dark]
 * @param {number[]} [props.data]
 * @param {string} [props.color]
 * @returns {JSX.Element}
 */
export function UltraTinyChart({ dark: _dark, data = [], color = "#06B6D4" }) {
	const chartData = data.map((v, i) => ({ i, v }));
	const max = Math.max(...data, 1);
	return (
		<div class="flex h-12 items-end gap-0.5">
			{chartData.map((d, i) => (
				<div
					key={i}
					class="flex-1 rounded-sm transition-all hover:opacity-80"
					style={{
						height: `${(d.v / max) * 100}%`,
						backgroundColor: color,
						opacity: 0.6 + 0.4 * (i / chartData.length),
					}}
				/>
			))}
		</div>
	);
}
