import React, { useEffect, useRef, useState } from 'react'

export default function RoleSelect({ value, onChange, options = [], className = '' }) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(-1)
  const rootRef = useRef(null)
  const optionRefs = useRef([])

  // Close on outside click
  useEffect(() => {
    function handleDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleDoc)
    return () => document.removeEventListener('mousedown', handleDoc)
  }, [])

  useEffect(() => {
    if (open && focused >= 0 && optionRefs.current[focused]) {
      optionRefs.current[focused].focus()
    }
  }, [open, focused])

  function toggle() {
    setOpen((v) => !v)
    if (!open) setFocused(0)
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
        setFocused(0)
      }
      return
    }

    if (e.key === 'Escape') {
      setOpen(false)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocused((i) => Math.min((options.length || 1) - 1, Math.max(0, i + 1)))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocused((i) => Math.max(0, (i || 0) - 1))
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = options[focused]
      if (opt) onChange(opt.value)
      setOpen(false)
    }
  }

  const currentLabel = (options.find((o) => o.value === value) || options[0] || {}).label || ''

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between rounded-lg shadow-borderless dark:shadow-borderlessDark px-3 py-3 text-sm font-semibold bg-white dark:bg-[#0b1224]"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#2E8BFF] text-white font-semibold text-xs shrink-0">
            {currentLabel ? String(currentLabel).charAt(0).toUpperCase() : ''}
          </span>
          <span className="truncate text-slate-900 dark:text-slate-100">{currentLabel}</span>
        </div>
        <svg className={`h-4 w-4 ml-2 text-slate-600 dark:text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Account type"
          className="absolute z-50 mt-2 w-full rounded-lg bg-white dark:bg-[#071228] shadow-borderless dark:shadow-borderlessDark p-1"
          onKeyDown={handleKeyDown}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value
            return (
              <li key={opt.value} role="option" aria-selected={isSelected} className="p-1">
                <button
                  ref={(el) => (optionRefs.current[idx] = el)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  onMouseEnter={() => setFocused(idx)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                    isSelected
                      ? 'text-gtBlue bg-blue-50 dark:bg-[rgba(10,102,194,0.08)]'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-semibold ${isSelected ? 'bg-gtBlue text-white' : 'bg-slate-100 dark:bg-[#071228] dark:text-slate-200'}`}>
                    {String(opt.label || '').charAt(0) || ''}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
