'use client'

import RSVPForm from '@/components/RSVPForm'
import { config } from '@/lib/config'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ConfirmarPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen bg-cream">
      {/* Top nav */}
      <header className="py-5 px-6 border-b border-dark/[0.07]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-sans text-dark/40 hover:text-dark transition-colors text-xs uppercase tracking-widest"
            aria-label={t('confirmar.back')}
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            {t('confirmar.back')}
          </Link>
          <span className="font-display italic text-dark text-lg font-light">
            {config.novios.nombre1} &amp; {config.novios.nombre2}
          </span>
        </div>
      </header>

      {/* Page header */}
      <div className="max-w-lg mx-auto px-6 pt-14 pb-6 text-center">
        <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-4">
          {t('rsvp.label')}
        </p>
        <h1
          className="font-display italic text-dark font-light mb-5"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
        >
          {t('rsvp.title')}
        </h1>
        <div className="gold-divider" aria-hidden="true">◆</div>
        <p className="font-sans text-dark-soft text-sm mt-5">
          {t('rsvp.subtitle')}
        </p>
      </div>

      {/* RSVP Card Form */}
      <RSVPForm />

      {/* Footer */}
      <footer className="py-8 text-center border-t border-dark/[0.06]">
        <p className="font-display italic text-dark/25 text-sm font-light">
          {config.novios.nombre1} &amp; {config.novios.nombre2}
        </p>
      </footer>
    </main>
  )
}
