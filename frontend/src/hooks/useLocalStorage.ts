import { useState, useCallback, useEffect, useRef } from 'react'
import { localStorageEvents } from './localStorageEvents'

/**
 * Custom hook for managing localStorage with TypeScript support
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Track the latest value in a ref so the setters can read it without being
  // re-created on every change. This both keeps their identity stable and
  // avoids stale-closure clobbering when two writes happen in the same tick.
  const valueRef = useRef(storedValue)
  valueRef.current = storedValue

  // Capture the initial value once so removeValue has a stable identity even
  // when callers pass a fresh literal (e.g. {} / []) on every render.
  const initialValueRef = useRef(initialValue)

  // Unique id for this hook instance, used to ignore our own broadcasts.
  const instanceIdRef = useRef<symbol | null>(null)
  if (instanceIdRef.current === null) {
    instanceIdRef.current = Symbol('useLocalStorage')
  }

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState,
        // resolving against the latest value via the ref.
        const valueToStore =
          value instanceof Function ? value(valueRef.current) : value
        valueRef.current = valueToStore
        // Save state
        setStoredValue(valueToStore)
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        // Notify other hook instances (subscribers ignore our own id)
        localStorageEvents.emit(key, valueToStore, instanceIdRef.current!)
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  // Function to remove the value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      valueRef.current = initialValueRef.current
      setStoredValue(initialValueRef.current)
      // Notify other hook instances (subscribers ignore our own id)
      localStorageEvents.emit(key, initialValueRef.current, instanceIdRef.current!)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key])

  // Listen for changes to the localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue)
          valueRef.current = parsed
          setStoredValue(parsed)
        } catch (error) {
          console.error(
            `Error parsing localStorage change for key "${key}":`,
            error
          )
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  // Listen for internal localStorage changes from other hook instances
  useEffect(() => {
    const handleInternalChange = (
      _key: string,
      newValue: unknown,
      source?: symbol
    ) => {
      // Skip our own broadcasts — we already applied the change locally.
      if (_key === key && source !== instanceIdRef.current) {
        valueRef.current = newValue as T
        setStoredValue(newValue as T)
      }
    }

    const unsubscribe = localStorageEvents.subscribe(key, handleInternalChange)
    return unsubscribe
  }, [key])

  return [storedValue, setValue, removeValue]
}
