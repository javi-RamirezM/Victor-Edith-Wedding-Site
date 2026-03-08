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
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
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
      className="py-20 md:py-32 bg-cream"
      aria-labelledby="venue-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-gold uppercase tracking-[0.3em] text-sm font-sans font-light mb-4">
            Lugar de Celebración
          </p>
          <h2
            id="venue-heading"
            className="font-display text-dark text-4xl md:text-5xl font-light mb-6"
          >
            {config.venue.nombre}
          </h2>
          <div className="gold-divider" aria-hidden="true" />
          <p className="text-dark/70 font-sans mt-6 max-w-lg mx-auto">
            {config.venue.descripcion}
          </p>
        </div>

        {/* Map + Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Map embed */}
          <div className="animate-on-scroll order-2 md:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
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

          {/* Venue Info */}
          <div className="animate-on-scroll order-1 md:order-2">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-dark font-medium mb-1">
                    Dirección
                  </h3>
                  <p className="text-dark/70 font-sans">
                    {config.venue.direccion}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mt-1">
                  <Navigation className="w-5 h-5 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-dark font-medium mb-1">
                    Cómo llegar
                  </h3>
                  <p className="text-dark/70 font-sans mb-3">
                    Te recomendamos usar Google Maps para las mejores indicaciones de ruta.
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(config.venue.direccion)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold border border-gold px-4 py-2 text-sm font-sans uppercase tracking-widest hover:bg-gold hover:text-dark transition-all duration-300"
                    aria-label={`Abrir ${config.venue.nombre} en Google Maps`}
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" />
                    Ver en Maps
                  </a>
                </div>
              </div>

              {/* Decorative quote */}
              <blockquote className="border-l-2 border-gold pl-6 mt-8">
                <p className="font-display text-lg text-dark/80 italic font-light leading-relaxed">
                  &ldquo;{config.venue.descripcion}&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
