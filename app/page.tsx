'use client'

import HeroSection from '@/components/HeroSection'
import VenueMap from '@/components/VenueMap'
import { config } from '@/lib/config'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

function SectionDivider() {
  return (
    <div className="section-divider py-2" aria-hidden="true">
      <span className="text-gold-light text-[10px]">◆</span>
    </div>
  )
}

export default function HomePage() {
  const { t, locale } = useLanguage()

  const dateLocale =
    locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : locale === 'ca' ? 'ca-ES' : 'es-ES'

  return (
    <main>
      {/* Hero fullscreen */}
      <HeroSection />

      {/* Welcome section with couple photo background */}
      <section className="relative overflow-hidden py-32 md:py-44" aria-labelledby="welcome-heading">
        {/* Background photo */}
        <Image
          src={config.hero_image_url}
          alt={`${config.novios.nombre1} & ${config.novios.nombre2}`}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-dark/60" aria-hidden="true" />

        <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
          <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-5">
            {t('welcome.label')}
          </p>
          <h2
            id="welcome-heading"
            className="font-display italic text-cream font-light leading-tight mb-7"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            {t('welcome.mainTitle')}
          </h2>
          <div className="gold-divider" aria-hidden="true">◆</div>
          <Link
            href="/confirmar"
            className="inline-block mt-8 border border-gold/80 text-cream font-sans text-xs uppercase tracking-[0.3em] px-10 py-3.5 transition-all duration-300 hover:bg-gold hover:border-gold hover:text-white"
            aria-label={t('welcome.confirmAriaLabel')}
          >
            {t('welcome.confirmCta')}
          </Link>
        </div>
      </section>

      <SectionDivider />

      {/* Venue and Map */}
      <VenueMap />

      {/* Footer */}
      <footer className="py-14 bg-cream border-t border-dark/[0.06] text-center">
        <p className="font-display italic text-dark/65 text-xl font-light">
          {config.novios.nombre1} &amp; {config.novios.nombre2}
        </p>
        <p className="font-sans text-dark/50 text-xs uppercase tracking-[0.3em] mt-3">
          {new Date(config.fecha_boda).toLocaleDateString(dateLocale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </footer>
    </main>
  )
}
