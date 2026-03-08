'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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
          if (entry.isIntersecting) entry.target.classList.add('visible')
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
      className="py-24 md:py-32 bg-dark"
      aria-labelledby="guestlist-heading"
    >
      <div className="max-w-3xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-4">
            Ya han confirmado
          </p>
          <h2
            id="guestlist-heading"
            className="font-display italic text-cream font-light mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            Nuestros Invitados
          </h2>
          <div className="gold-divider" aria-hidden="true">◆</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px mb-16 animate-on-scroll bg-gold/20">
          {[
            { value: attendees.length, label: 'Familias' },
            { value: totalGuests, label: 'Personas' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-dark text-center py-8 px-4">
              <span className="block font-display italic text-gold font-light leading-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
                {value}
              </span>
              <span className="block font-sans text-cream/40 uppercase tracking-[0.3em] text-[10px] mt-3">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Guest list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border border-gold/30 border-t-gold rounded-full animate-spin" aria-label="Cargando invitados" />
          </div>
        ) : attendees.length === 0 ? (
          <div className="text-center py-12 animate-on-scroll">
            <Heart className="w-8 h-8 text-gold/20 mx-auto mb-4" aria-hidden="true" />
            <p className="font-sans text-cream/30 text-sm">
              Sé el primero en confirmar tu asistencia
            </p>
          </div>
        ) : (
          <ul className="space-y-0" aria-label="Lista de invitados confirmados">
            {attendees.map((attendee, index) => (
              <li
                key={`${attendee.nombre}-${index}`}
                className="animate-on-scroll flex items-center justify-between py-4 border-b border-cream/[0.06]"
                style={{ transitionDelay: `${index * 0.04}s` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gold/40 text-xs" aria-hidden="true">◆</span>
                  <span className="font-display italic text-cream text-lg font-light">
                    {attendee.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-sans text-cream/30 text-xs uppercase tracking-widest hidden sm:block">
                    {attendee.dias === 'viernes_sabado' ? 'Vie + Sáb' : 'Solo Sáb'}
                  </span>
                  <span className="flex items-center gap-1 font-sans text-gold/60 text-xs">
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
          <p className="font-sans text-cream/30 text-sm mb-6">
            ¿Todavía no has confirmado? Te esperamos
          </p>
          <Link
            href="/confirmar"
            className="inline-block border border-gold text-gold font-sans text-xs uppercase tracking-[0.3em] px-10 py-4 transition-all duration-300 hover:bg-gold hover:text-white"
            aria-label="Ir al formulario de confirmación"
          >
            Confirmar Asistencia
          </Link>
        </div>
      </div>
    </section>
  )
}

