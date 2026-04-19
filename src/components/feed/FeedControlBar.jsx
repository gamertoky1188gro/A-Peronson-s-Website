import React from 'react'
import { Briefcase, Building2, LayoutGrid, NotebookText, Sparkles } from 'lucide-react'

const TYPE_OPTIONS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'requests', label: 'Buyer Requests', icon: Briefcase },
  { id: 'products', label: 'Company Products', icon: Building2 },
  { id: 'posts', label: 'Posts', icon: NotebookText },
]

export default function FeedControlBar({
  activeType,
  onTypeChange,
  unique,
  onUniqueChange,
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="sticky top-[64px] z-10 bg-slate-50/90 backdrop-blur supports-[backdrop-filter]:bg-slate-50/70 shadow-dividerB dark:shadow-dividerBDark dark:bg-[#020617]/80 dark:supports-[backdrop-filter]:bg-[#020617]/70 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon
              const active = activeType === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onTypeChange(opt.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95${
                    active
                      ? 'bg-white text-gtBlue ring-[rgba(10,102,194,0.35)] shadow-sm dark:bg-white/5 dark:text-gtBlue dark:ring-[rgba(10,102,194,0.35)]'
                      : 'bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
                  }`}
                  aria-pressed={active}
                  title={opt.label}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => onUniqueChange(!unique)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ring-1 active:scale-95${
              unique
                ? 'bg-violet-50 text-violet-700 ring-violet-200 shadow-sm dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/25'
                : 'bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
            }`}
            aria-pressed={unique}
            title="Diversify feed"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">{unique ? 'Unique ON' : 'Unique OFF'}</span>
          </button>
        </div>

        {Array.isArray(categories) && categories.length ? (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => onCategoryChange('')}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ring-1 active:scale-95${
                !activeCategory
                  ? 'bg-white text-gtBlue ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-gtBlue dark:ring-[rgba(10,102,194,0.35)]'
                  : 'bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
              }`}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCategoryChange(String(c))}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ring-1 active:scale-95${
                  activeCategory === c
                    ? 'bg-white text-gtBlue ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-gtBlue dark:ring-[rgba(10,102,194,0.35)]'
                    : 'bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/8'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
