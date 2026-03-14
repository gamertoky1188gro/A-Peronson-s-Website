import React from 'react'
import { Briefcase, Building2, LayoutGrid, Sparkles } from 'lucide-react'

const TYPE_OPTIONS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'requests', label: 'Buyer Requests', icon: Briefcase },
  { id: 'products', label: 'Company Products', icon: Building2 },
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
    <div className="sticky top-[64px] z-10 bg-slate-50/90 backdrop-blur supports-[backdrop-filter]:bg-slate-50/70 border-b border-slate-200">
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
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    active ? 'border-[#0A66C2] bg-white text-[#0A66C2] shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-pressed={active}
                  title={opt.label}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{opt.id === 'all' ? 'All' : null}</span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => onUniqueChange(!unique)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
              unique ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
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
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                !activeCategory ? 'border-[#0A66C2] bg-white text-[#0A66C2]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCategoryChange(String(c))}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                  activeCategory === c ? 'border-[#0A66C2] bg-white text-[#0A66C2]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
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

