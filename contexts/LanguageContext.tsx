'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import es from '@/messages/es.json'
import ca from '@/messages/ca.json'
import en from '@/messages/en.json'
import de from '@/messages/de.json'

export type Locale = 'es' | 'ca' | 'en' | 'de'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Messages = Record<string, any>

const MESSAGES: Record<Locale, Messages> = { es, ca, en, de }

const STORAGE_KEY = 'wedding-locale'
const DEFAULT_LOCALE: Locale = 'es'

function getNestedValue(obj: Messages, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object') {
      return (acc as Messages)[key]
    }
    return undefined
  }, obj)
  return typeof value === 'string' ? value : path
}

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored && stored in MESSAGES) {
        setLocaleState(stored)
      }
    } catch {
      // localStorage not available (SSR or private mode)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // localStorage not available
    }
  }, [])

  const t = useCallback(
    (key: string): string => getNestedValue(MESSAGES[locale], key),
    [locale],
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext)
}
