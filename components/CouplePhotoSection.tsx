'use client'

import Image from 'next/image'
import { config } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CouplePhotoSection() {
  const { t, locale } = useLanguage()

  const dateLocale =
    locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : locale === 'ca' ? 'ca-ES' : 'es-ES'

  const formattedDate = new Date(config.fecha_boda).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      aria-label={t('couple.aria')}
    >
      {/* Full-bleed photo */}
      <Image
        src={config.hero_image_url}
        alt={`${config.novios.nombre1} & ${config.novios.nombre2}`}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-dark/50" aria-hidden="true" />

      {/* Overlay text */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-6">
          {t('couple.label')}
        </p>

        <div className="gold-line mb-8" aria-hidden="true" />

        <p
          className="font-display italic text-cream font-light leading-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
        >
          {config.novios.nombre1}
          <span className="font-sans not-italic text-gold mx-4 align-middle tracking-[0.5em]"
            style={{ fontSize: 'clamp(0.7rem, 2vw, 1rem)' }}>
            &amp;
          </span>
          {config.novios.nombre2}
        </p>

        <div className="gold-line mt-8" aria-hidden="true" />

        <p className="font-sans text-cream/60 uppercase tracking-[0.35em] text-[11px] mt-6">
          {formattedDate}
        </p>
      </div>
    </section>
  )
}
