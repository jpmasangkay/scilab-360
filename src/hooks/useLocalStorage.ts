import { useState, useCallback } from "react"

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parser?: (raw: unknown) => T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return initialValue
      const parsed = JSON.parse(item) as unknown
      return parser ? parser(parsed) : (parsed as T)
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const next = typeof value === "function"
        ? (value as (prev: T) => T)(prev)
        : value
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        console.error(`Failed to save ${key} to localStorage`)
      }
      return next
    })
  }, [key])

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    localStorage.removeItem(key)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
