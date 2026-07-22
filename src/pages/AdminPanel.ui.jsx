import { ThreeDot, Mosaic } from "react-loading-indicators";

/**
 * Renders a skeleton chart.
 * @param {Object} props
 * @param {number} [props.height]
 * @returns {JSX.Element}
 */
export function SkeletonChart({ height = 320 }) {
  return (
    <div className={`flex items-center justify-center`} style={{ height }}>
      <Mosaic
        color="#3b00ff"
        size="large"
        style={{ fontSize: "48px" }}
        text=""
        textColor=""
      />
    </div>
  );
}

/**
 * Renders a section title.
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ElementType} [props.icon]
 * @returns {JSX.Element}
 */
export function SectionTitle({ title, subtitle, icon: TitleIcon }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {TitleIcon ? (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
          <TitleIcon className="h-5 w-5" />
        </div>
      ) : null}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Renders a metric card.
 * @param {Object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.hint]
 * @param {React.ElementType} [props.icon]
 * @param {boolean} [props.loading]
 * @returns {JSX.Element}
 */
export function MetricCard({
  label,
  value,
  hint,
  icon: CardIcon,
  loading = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          {loading ? (
            <ThreeDot
              variant="bounce"
              color="#6100ff"
              size="medium"
              style={{ fontSize: "24px" }}
              text=""
              textColor=""
            />
          ) : (
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
          )}
          {hint ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hint}
            </p>
          ) : null}
        </div>
        {CardIcon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
            <CardIcon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Renders a pill.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
      {children}
    </span>
  );
}

/**
 * Renders a benefit card.
 * @param {Object} props
 * @param {string} props.title
 * @param {string[]} props.items
 * @param {string} [props.accent]
 * @returns {JSX.Element}
 */
export function BenefitCard({ title, items, accent = "sky" }) {
  const colorMap = {
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  };
  const colorClass = colorMap[accent] || colorMap.sky;
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:ring-slate-800">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${colorClass}`}
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span className="font-bold text-slate-900 dark:text-white">
          {title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders an admin security gate.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.role
 * @param {React.ReactNode} [props.fallback]
 * @returns {JSX.Element}
 */
export function AdminSecurityGate({ children, role, fallback }) {
  const allowed = ["owner", "admin"];
  if (!allowed.includes(String(role || "").toLowerCase())) {
    return fallback || null;
  }
  return children;
}
