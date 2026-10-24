'use client'

import { useCallback, useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * A per-device string preference. Falls back to `fallback` on the server and
 * whenever storage is unavailable (private windows, blocked site data).
 */
export function useLocalStorage(key: string, fallback: string) {
  const value = useSyncExternalStore(subscribe, () => read(key) ?? fallback, () => fallback)

  const setValue = useCallback((next: string) => {
    try {
      localStorage.setItem(key, next)
    } catch {}
    listeners.forEach((l) => l())
  }, [key])

  return [value, setValue] as const
}
