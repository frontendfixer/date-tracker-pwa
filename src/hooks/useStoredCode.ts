import { useCallback, useState } from 'react'
import { parseDateCode } from '../lib/dateCode'

const STORAGE_KEY = 'date-code'

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStored(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Safari private mode: keep the in-memory value only.
  }
}

function removeStored(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore privacy-mode and quota failures.
  }
}

function readInitialCode(): string | null {
  const raw = readStored()
  if (raw == null) return null
  if (!parseDateCode(raw, new Date())) {
    removeStored()
    return null
  }
  return raw
}

export function useStoredCode(): {
  code: string | null
  save: (code: string) => void
  clear: () => void
} {
  const [code, setCode] = useState<string | null>(readInitialCode)

  const save = useCallback((next: string) => {
    setCode(next)
    writeStored(next)
  }, [])

  const clear = useCallback(() => {
    setCode(null)
    removeStored()
  }, [])

  return { code, save, clear }
}
