'use client'

import { useLanguage, type Locale } from '@/contexts/LanguageContext'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'ca', label: 'CA' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
]

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage()

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-0.5 bg-cream/80 backdrop-blur-sm border border-dark/[0.07] px-1.5 py-1"
      role="navigation"
      aria-label="Language selector"
    >
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          <button
            onClick={() => setLocale(code)}
            className={`font-sans text-[10px] uppercase tracking-[0.15em] px-1.5 py-0.5 transition-colors duration-200 ${
              locale === code
                ? 'text-gold text-gold-contrast font-medium'
                : 'text-dark/35 hover:text-dark/70'
            }`}
            aria-label={`Switch language to ${label}`}
            aria-current={locale === code ? 'true' : undefined}
          >
            {label}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="text-dark/15 text-[10px] select-none" aria-hidden="true">
              |
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
