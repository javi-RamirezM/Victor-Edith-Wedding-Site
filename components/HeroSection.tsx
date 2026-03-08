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

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${config.hero_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      aria-label="Sección principal de la boda"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/50" aria-hidden="true" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Small label */}
        <p
          className="text-gold uppercase tracking-[0.3em] text-sm font-sans font-light mb-6 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Os invitamos a nuestra boda
        </p>

        {/* Names */}
        <h1
          className="font-display text-cream text-6xl md:text-8xl lg:text-9xl font-light leading-none mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {config.novios.nombre1}
          <span className="block text-gold font-light italic text-4xl md:text-5xl my-3">&</span>
          {config.novios.nombre2}
        </h1>

        {/* Gold divider */}
        <div className="gold-divider my-8" aria-hidden="true" />

        {/* Date */}
        <p
          className="text-cream/90 font-display text-xl md:text-2xl font-light capitalize mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          {formattedDate}
        </p>

        {/* Countdown */}
        {mounted && (
          <div
            className="flex justify-center gap-6 md:gap-10 mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
            aria-label="Cuenta atrás hasta la boda"
          >
            {[
              { value: timeLeft.days, label: 'Días' },
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Min' },
              { value: timeLeft.seconds, label: 'Seg' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <span className="block font-display text-3xl md:text-5xl text-cream font-light leading-none">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="text-gold/80 text-xs uppercase tracking-widest mt-1 block font-sans">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '1s' }}
        >
          <Link
            href="/confirmar"
            className="inline-block bg-gold text-dark px-10 py-4 text-sm uppercase tracking-[0.2em] font-sans font-medium hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 focus-visible:outline-gold"
            aria-label="Confirmar asistencia a la boda"
          >
            Confirmar Asistencia
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="w-px h-12 bg-gold/60 mx-auto" />
        </div>
      </div>
    </section>
  )
}
