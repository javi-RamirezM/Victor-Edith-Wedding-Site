'use client'

import { useEffect, useRef, useState } from 'react'
import { getAttendees, Attendee } from '@/lib/sheets'
import { Users, Heart } from 'lucide-react'

export default function GuestList() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttendees().then((data) => {
      setAttendees(data)
      setLoading(false)
    })
  }, [])

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
  }, [attendees])

  const totalGuests = attendees.reduce((sum, a) => sum + (a.total_asistentes || 1), 0)

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-dark"
      aria-labelledby="guestlist-heading"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-gold uppercase tracking-[0.3em] text-sm font-sans font-light mb-4">
            Ya han confirmado
          </p>
          <h2
            id="guestlist-heading"
            className="font-display text-cream text-4xl md:text-5xl font-light mb-6"
          >
            Nuestros Invitados
          </h2>
          <div className="gold-divider" aria-hidden="true" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-16 animate-on-scroll">
          <div className="text-center p-6 border border-gold/20">
            <span className="block font-display text-5xl text-gold font-light">
              {attendees.length}
            </span>
            <span className="text-cream/60 text-sm uppercase tracking-widest mt-2 block font-sans">
              Familias
            </span>
          </div>
          <div className="text-center p-6 border border-gold/20">
            <span className="block font-display text-5xl text-gold font-light">
              {totalGuests}
            </span>
            <span className="text-cream/60 text-sm uppercase tracking-widest mt-2 block font-sans">
              Personas
            </span>
          </div>
        </div>

        {/* Guest list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" aria-label="Cargando invitados" />
          </div>
        ) : attendees.length === 0 ? (
          <div className="text-center py-12 animate-on-scroll">
            <Heart className="w-12 h-12 text-gold/30 mx-auto mb-4" aria-hidden="true" />
            <p className="text-cream/50 font-sans">
              Sé el primero en confirmar tu asistencia
            </p>
          </div>
        ) : (
          <ul className="space-y-3" aria-label="Lista de invitados confirmados">
            {attendees.map((attendee, index) => (
              <li
                key={`${attendee.nombre}-${index}`}
                className="animate-on-scroll flex items-center justify-between py-3 border-b border-cream/10"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-3 h-3 text-gold flex-shrink-0" aria-hidden="true" />
                  <span className="font-display text-cream text-lg font-light">
                    {attendee.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cream/50 text-sm font-sans">
                    {attendee.dias === 'viernes_sabado' ? 'Vie + Sáb' : 'Solo Sáb'}
                  </span>
                  <span className="flex items-center gap-1 text-gold text-sm font-sans">
                    <Users className="w-3 h-3" aria-hidden="true" />
                    {attendee.total_asistentes}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="text-center mt-16 animate-on-scroll">
          <p className="text-cream/50 font-sans mb-6">
            ¿Todavía no has confirmado? Te esperamos
          </p>
          <a
            href="/confirmar"
            className="inline-block border border-gold text-gold px-10 py-4 text-sm uppercase tracking-[0.2em] font-sans hover:bg-gold hover:text-dark transition-all duration-300"
            aria-label="Ir al formulario de confirmación"
          >
            Confirmar Asistencia
          </a>
        </div>
      </div>
    </section>
  )
}
