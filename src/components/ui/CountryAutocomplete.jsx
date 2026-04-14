import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function CountryAutocomplete({
  value,
  onChange,
  options = [],
  placeholder = '',
  required = false,
  id = 'country-autocomplete',
  maxResults = 8,
  exclude = [],
}) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(-1)
  const rootRef = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => setQuery(value || ''), [value])

  const normalized = (q) => String(q || '').trim().toLowerCase()

  const filtered = useMemo(() => {
    const q = normalized(query)
    const filtered = options
      .filter((o) => !exclude.includes(o))
      .filter((o) => (q ? o.toLowerCase().includes(q) : true))
      .slice(0, maxResults)
    return filtered
  }, [options, query, maxResults, exclude])

  // Close when clicking outside
  useEffect(() => {
    function handleDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
        setFocused(-1)
      }
    }
    document.addEventListener('mousedown', handleDoc)
    return () => document.removeEventListener('mousedown', handleDoc)
  }, [])

  useEffect(() => {
    if (open && focused >= 0 && optionRefs.current[focused]) {
      optionRefs.current[focused].scrollIntoView({ block: 'nearest' })
    }
  }, [focused, open])

  function selectOption(opt) {
    onChange(opt)
    setQuery(opt)
    setOpen(false)
    setFocused(-1)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setFocused((i) => Math.min((filtered.length || 1) - 1, Math.max(0, i + 1)))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocused((i) => Math.max(0, (i || 0) - 1))
      return
    }
    if (e.key === 'Enter') {
      if (open && focused >= 0) {
        e.preventDefault()
        selectOption(filtered[focused])
      }
      return
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setFocused(-1)
      return
    }
  }

  function renderHighlighted(text) {
    const q = normalized(query)
    if (!q) return text
    const idx = text.toLowerCase().indexOf(q)
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-semibold text-[var(--gt-blue)]">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        name="country"
        id={id}
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          setFocused(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100"
      />

      {open && filtered.length > 0 ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Country suggestions"
          className="absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-lg bg-white p-1 shadow-lg dark:bg-[#071228]"
        >
          {filtered.map((opt, idx) => {
            const isSelected = opt === value
            return (
              <li key={opt} role="option" aria-selected={isSelected} className="p-1">
                <button
                  ref={(el) => (optionRefs.current[idx] = el)}
                  type="button"
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setFocused(idx)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                    isSelected
                      ? 'bg-blue-50 text-[var(--gt-blue)] dark:bg-[rgba(10,102,194,0.08)]'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {renderHighlighted(opt)}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
