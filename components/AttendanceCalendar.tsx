'use client'

import { useEffect, useRef, useState } from 'react'
import { getAttendees, Attendee } from '@/lib/sheets'
import { getWeddingDate, getFridayDate } from '@/lib/config'
import { Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AttendanceCalendar() {
  const { t, locale } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)

  const weddingDate = getWeddingDate()
  const fridayDate = getFridayDate()

  const dateLocale =
    locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : locale === 'ca' ? 'ca-ES' : 'es-ES'

  const fridayAttendees = attendees.filter((a) => a.dias === 'viernes_sabado')
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
          if (entry.isIntersecting) entry.target.classList.add('visible')
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
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-7 h-7 border border-gold/30 border-t-gold rounded-full animate-spin" aria-label={t('attendance.loadingAria')} />
      </div>
    )
  }

  const days = [
    {
      label: t('attendance.friday'),
      date: fridayDate,
      accentClass: 'border-sage/40 bg-sage/5',
      dotClass: 'bg-sage',
      totalPersons: fridayTotal,
      list: fridayAttendees,
      ariaLabel: t('attendance.friday'),
    },
    {
      label: t('attendance.saturday'),
      date: weddingDate,
      accentClass: 'border-gold/40 bg-gold/5',
      dotClass: 'bg-gold',
      totalPersons: saturdayTotal,
      list: saturdayAttendees,
      ariaLabel: t('attendance.saturday'),
    },
  ]

  return (
    <div ref={sectionRef} className="max-w-4xl mx-auto px-6 py-12">

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-px mb-12 animate-on-scroll bg-dark/10">
        {[
          { value: fridayTotal, label: t('attendance.peopleFriday') },
          { value: saturdayTotal, label: t('attendance.peopleSaturday') },
        ].map(({ value, label }) => (
          <div key={label} className="bg-cream text-center py-8">
            <span className="block font-display italic text-dark font-light leading-none"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)' }}>
              {value}
            </span>
            <span className="block font-sans text-dark/40 uppercase tracking-[0.25em] text-[10px] mt-2">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Day cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {days.map(({ label, date, accentClass, dotClass, totalPersons, list, ariaLabel }) => (
          <div
            key={label}
            className={`animate-on-scroll border ${accentClass} p-7`}
          >
            {/* Day header */}
            <div className="flex items-center gap-2.5 mb-1">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} aria-hidden="true" />
              <h2 className="font-display italic text-dark font-light text-xl capitalize">
                {date.toLocaleDateString(dateLocale, { weekday: 'long' })}
              </h2>
            </div>
            <p className="font-sans text-dark/40 text-xs mb-5 pl-[18px]">
              {date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            {/* Divider */}
            <div className="border-t border-dark/10 pt-5">
              <p className="font-sans text-dark/35 uppercase tracking-[0.25em] text-[10px] mb-4">
                {totalPersons} {totalPersons === 1 ? t('attendance.confirmedSingular') : t('attendance.confirmedPlural')}
              </p>

              {list.length === 0 ? (
                <p className="font-sans text-dark/25 text-sm italic">
                  {t('attendance.noone')}
                </p>
              ) : (
                <ul className="space-y-2.5" aria-label={ariaLabel}>
                  {list.map((attendee, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span className="font-display italic text-dark text-base font-light">
                        {attendee.nombre}
                      </span>
                      <span className="font-sans text-dark/30 text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" aria-hidden="true" />
                        {attendee.total_asistentes}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
