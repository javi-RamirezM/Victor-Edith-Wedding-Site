'use client'

import { useEffect, useRef, useState } from 'react'
import { getAttendees, Attendee } from '@/lib/sheets'
import { getWeddingDate, getFridayDate } from '@/lib/config'
import { Users, Calendar } from 'lucide-react'

export default function AttendanceCalendar() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)

  const weddingDate = getWeddingDate()
  const fridayDate = getFridayDate()

  const fridayAttendees = attendees.filter(
    (a) => a.dias === 'viernes_sabado'
  )
  const saturdayAttendees = attendees

  const fridayTotal = fridayAttendees.reduce((sum, a) => sum + (a.total_asistentes || 1), 0)
  const saturdayTotal = saturdayAttendees.reduce((sum, a) => sum + (a.total_asistentes || 1), 0)

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
      { threshold: 0.05 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [attendees])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" aria-label="Cargando asistentes" />
      </div>
    )
  }

  return (
    <div ref={sectionRef} className="max-w-4xl mx-auto px-6 py-12">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-12 animate-on-scroll">
        <div className="p-6 bg-cream border border-dark/10 text-center">
          <Calendar className="w-6 h-6 text-gold mx-auto mb-3" aria-hidden="true" />
          <span className="block font-display text-3xl text-dark font-light">
            {fridayTotal}
          </span>
          <span className="text-dark/50 text-sm uppercase tracking-widest block font-sans">
            Viernes
          </span>
        </div>
        <div className="p-6 bg-cream border border-dark/10 text-center">
          <Users className="w-6 h-6 text-gold mx-auto mb-3" aria-hidden="true" />
          <span className="block font-display text-3xl text-dark font-light">
            {saturdayTotal}
          </span>
          <span className="text-dark/50 text-sm uppercase tracking-widest block font-sans">
            Sábado
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Friday */}
        <div className="animate-on-scroll">
          <div className="bg-sage/10 border border-sage/30 p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-sage" aria-hidden="true" />
              <h2 className="font-display text-xl text-dark font-medium capitalize">
                {fridayDate.toLocaleDateString('es-ES', { weekday: 'long' })}
              </h2>
            </div>
            <p className="text-dark/50 text-sm font-sans mb-4 pl-5">
              {fridayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="border-t border-sage/30 pt-4">
              <p className="text-dark/50 text-xs uppercase tracking-widest font-sans mb-3">
                {fridayTotal} personas confirmadas
              </p>
              {fridayAttendees.length === 0 ? (
                <p className="text-dark/30 font-sans text-sm italic">
                  Todavía nadie ha confirmado para este día
                </p>
              ) : (
                <ul className="space-y-2" aria-label="Invitados del viernes">
                  {fridayAttendees.map((attendee, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="font-display text-dark text-lg font-light">
                        {attendee.nombre}
                      </span>
                      <span className="text-dark/40 text-sm font-sans flex items-center gap-1">
                        <Users className="w-3 h-3" aria-hidden="true" />
                        {attendee.total_asistentes}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Saturday */}
        <div className="animate-on-scroll">
          <div className="bg-gold/10 border border-gold/30 p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
              <h2 className="font-display text-xl text-dark font-medium capitalize">
                {weddingDate.toLocaleDateString('es-ES', { weekday: 'long' })}
              </h2>
            </div>
            <p className="text-dark/50 text-sm font-sans mb-4 pl-5">
              {weddingDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="border-t border-gold/30 pt-4">
              <p className="text-dark/50 text-xs uppercase tracking-widest font-sans mb-3">
                {saturdayTotal} personas confirmadas
              </p>
              {saturdayAttendees.length === 0 ? (
                <p className="text-dark/30 font-sans text-sm italic">
                  Todavía nadie ha confirmado para este día
                </p>
              ) : (
                <ul className="space-y-2" aria-label="Invitados del sábado">
                  {saturdayAttendees.map((attendee, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="font-display text-dark text-lg font-light">
                        {attendee.nombre}
                      </span>
                      <span className="text-dark/40 text-sm font-sans flex items-center gap-1">
                        <Users className="w-3 h-3" aria-hidden="true" />
                        {attendee.total_asistentes}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
