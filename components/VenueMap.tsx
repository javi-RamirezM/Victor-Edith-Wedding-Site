'use client'

import { useEffect, useRef } from 'react'
import { config } from '@/lib/config'
import { MapPin, Navigation } from 'lucide-react'

export default function VenueMap() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-warm-white"
      aria-labelledby="venue-heading"
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-4">
            Lugar de Celebración
          </p>
          <h2
            id="venue-heading"
            className="font-display italic text-dark font-light mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {config.venue.nombre}
          </h2>
          <div className="gold-divider" aria-hidden="true">◆</div>
          <p className="font-sans text-dark-soft text-sm mt-6 max-w-md mx-auto leading-relaxed">
            {config.venue.descripcion}
          </p>
        </div>

        {/* Map + Info */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Map */}
          <div className="animate-on-scroll order-2 md:order-1">
            <div className="relative overflow-hidden shadow-xl" style={{ aspectRatio: '4/3' }}>
              <iframe
                src={config.venue.google_maps_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${config.venue.nombre}`}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Info */}
          <div className="animate-on-scroll order-1 md:order-2 space-y-10 pt-2">

            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-9 h-9 border border-gold/30 flex items-center justify-center mt-0.5">
                <MapPin className="w-4 h-4 text-gold" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-sans text-dark uppercase tracking-[0.2em] text-xs mb-2">
                  Dirección
                </h3>
                <p className="font-display italic text-dark text-lg font-light leading-snug">
                  {config.venue.direccion}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-9 h-9 border border-gold/30 flex items-center justify-center mt-0.5">
                <Navigation className="w-4 h-4 text-gold" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-sans text-dark uppercase tracking-[0.2em] text-xs mb-2">
                  Cómo llegar
                </h3>
                <p className="font-sans text-dark-soft text-sm leading-relaxed mb-4">
                  Te recomendamos usar Google Maps para las mejores indicaciones.
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(config.venue.direccion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gold text-dark font-sans text-xs uppercase tracking-[0.25em] px-5 py-2.5 transition-all duration-300 hover:bg-gold hover:text-white"
                  aria-label={`Abrir ${config.venue.nombre} en Google Maps`}
                >
                  <Navigation className="w-3 h-3" aria-hidden="true" />
                  Ver en Maps
                </a>
              </div>
            </div>

            <blockquote className="border-l border-gold pl-5">
              <p className="font-display italic text-dark/60 text-base font-light leading-relaxed">
                &ldquo;{config.venue.descripcion}&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

