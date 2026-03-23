'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { config } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CouplePhotoSection() {
  const { t, locale } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 },
    )
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const dateLocale =
    locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : locale === 'ca' ? 'ca-ES' : 'es-ES'

  const formattedDate = new Date(config.fecha_boda).toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-36 bg-dark overflow-hidden"
      aria-label={t('couple.aria')}
    >
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">

        {/* Section header */}
        <div className="text-center mb-14 animate-on-scroll">
          <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-5">
            {t('couple.label')}
          </p>
          <h2
            className="font-display italic text-cream font-light leading-tight"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            {t('couple.title')}
          </h2>
          <div className="gold-line mt-6" aria-hidden="true" />
        </div>

        {/* Framed photo */}
        <div className="animate-on-scroll">
          {/* Outer decorative wrapper — ornamental corners */}
          <div className="relative p-5 md:p-6">

            {/* Corner accents */}
            <span
              className="absolute top-0 left-0 w-7 h-7 border-t border-l border-gold/60"
              aria-hidden="true"
            />
            <span
              className="absolute top-0 right-0 w-7 h-7 border-t border-r border-gold/60"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-0 left-0 w-7 h-7 border-b border-l border-gold/60"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-gold/60"
              aria-hidden="true"
            />

            {/* Mat border inside the corners */}
            <div className="border border-gold/20 p-[3px]">
              {/* Photo */}
              <div
                className="relative overflow-hidden"
                style={{ width: 'clamp(280px, 42vw, 420px)', aspectRatio: '3 / 4' }}
              >
                <Image
                  src={config.hero_image_url}
                  alt={`${config.novios.nombre1} y ${config.novios.nombre2}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 280px, 420px"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="text-center mt-10 animate-on-scroll">
          <p
            className="font-display italic text-cream font-light leading-none"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)' }}
          >
            {config.novios.nombre1}
            <span className="font-sans not-italic text-gold mx-3 text-base tracking-[0.4em] align-middle">
              &amp;
            </span>
            {config.novios.nombre2}
          </p>
          <div className="gold-line mt-5" aria-hidden="true" />
          <p className="font-sans text-gold-light uppercase tracking-[0.35em] text-[10px] mt-4">
            {formattedDate}
          </p>
        </div>

      </div>
    </section>
  )
}
