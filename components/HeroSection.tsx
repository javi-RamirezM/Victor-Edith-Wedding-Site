'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { config, getWeddingDate } from '@/lib/config'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export default function HeroSection() {
  const weddingDate = getWeddingDate()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(weddingDate))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(weddingDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [weddingDate])

  const formattedDate = weddingDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const units = [
    { value: timeLeft.days, label: 'Días' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Seg' },
  ]

  return (
    <section
      className="relative min-h-screen bg-cream flex flex-col items-center justify-center px-6 overflow-hidden"
      aria-label="Sección principal de la boda"
    >
      {/* Very subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">

        {/* Eyebrow label */}
        <p
          className="font-sans text-gold uppercase tracking-[0.4em] text-xs font-light mb-10 animate-fade-in opacity-0"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          Os invitamos a nuestra boda
        </p>

        {/* Top decorative line */}
        <div
          className="gold-line mb-8 animate-fade-in opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          aria-hidden="true"
        />

        {/* Names */}
        <h1
          className="font-display italic text-dark font-light leading-none animate-fade-in-up opacity-0"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            animationDelay: '0.45s',
            animationFillMode: 'forwards',
          }}
        >
          {config.novios.nombre1}
        </h1>
        <p
          className="font-sans text-gold uppercase tracking-[0.5em] text-xs my-5 animate-fade-in opacity-0"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          aria-hidden="true"
        >
          &amp;
        </p>
        <h1
          className="font-display italic text-dark font-light leading-none animate-fade-in-up opacity-0"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 7rem)',
            animationDelay: '0.75s',
            animationFillMode: 'forwards',
          }}
        >
          {config.novios.nombre2}
        </h1>

        {/* Bottom decorative line */}
        <div
          className="gold-line mt-8 animate-fade-in opacity-0"
          style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
          aria-hidden="true"
        />

        {/* Date */}
        <p
          className="font-sans text-dark-soft uppercase tracking-[0.35em] text-xs mt-8 mb-12 animate-fade-in opacity-0"
          style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
        >
          {formattedDate}
        </p>

        {/* Countdown */}
        {mounted && (
          <div
            className="flex items-center justify-center gap-0 mb-14 animate-fade-in opacity-0"
            style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}
            aria-label="Cuenta atrás hasta la boda"
          >
            {units.map(({ value, label }, i) => (
              <div key={label} className="flex items-center">
                <div className="text-center px-5 md:px-8">
                  <span className="block font-display italic text-dark font-light leading-none"
                    style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)' }}>
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="block font-sans text-gold uppercase tracking-[0.25em] text-[10px] mt-2">
                    {label}
                  </span>
                </div>
                {i < units.length - 1 && (
                  <span className="text-gold-light font-light text-2xl select-none" aria-hidden="true">
                    ·
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          className="animate-fade-in opacity-0"
          style={{ animationDelay: '1.25s', animationFillMode: 'forwards' }}
        >
          <Link
            href="/confirmar"
            className="inline-block border border-gold text-dark font-sans text-xs uppercase tracking-[0.3em] px-12 py-4 transition-all duration-300 hover:bg-gold hover:text-white focus-visible:outline-gold"
            aria-label="Confirmar asistencia a la boda"
          >
            Confirmar Asistencia
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" aria-hidden="true">
        <span className="font-sans text-gold-light uppercase tracking-[0.3em] text-[9px]">scroll</span>
        <div className="w-px h-8 bg-gold-light" />
      </div>
    </section>
  )
}

