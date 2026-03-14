import { useCallback, useEffect, useMemo, useState } from 'react'

function safeParseJson(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export default function useLocalStorageState(key, initialValue) {
  const initial = useMemo(() => {
    if (!key) return initialValue
    return safeParseJson(window.localStorage.getItem(key), initialValue)
  }, [initialValue, key])

  const [value, setValue] = useState(initial)

  useEffect(() => {
    if (!key) return
    setValue(safeParseJson(window.localStorage.getItem(key), initialValue))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setAndPersist = useCallback((nextValue) => {
    setValue((previous) => {
      const resolved = typeof nextValue === 'function' ? nextValue(previous) : nextValue
      if (key) {
        window.localStorage.setItem(key, JSON.stringify(resolved))
      }
      return resolved
    })
  }, [key])

  return [value, setAndPersist]
}

