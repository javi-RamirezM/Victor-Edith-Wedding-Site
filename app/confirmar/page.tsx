import RSVPForm from '@/components/RSVPForm'
import { config } from '@/lib/config'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata = {
  title: `Confirmar Asistencia | Boda ${config.novios.nombre1} & ${config.novios.nombre2}`,
  description: 'Confirma tu asistencia a nuestra boda',
}

export default function ConfirmarPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Top nav */}
      <header className="py-5 px-6 border-b border-dark/[0.07]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-sans text-dark/40 hover:text-dark transition-colors text-xs uppercase tracking-widest"
            aria-label="Volver al inicio"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Inicio
          </Link>
          <span className="font-display italic text-dark text-lg font-light">
            {config.novios.nombre1} &amp; {config.novios.nombre2}
          </span>
        </div>
      </header>

      {/* Page header */}
      <div className="max-w-lg mx-auto px-6 pt-14 pb-6 text-center">
        <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-4">
          RSVP
        </p>
        <h1
          className="font-display italic text-dark font-light mb-5"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
        >
          Confirma tu Asistencia
        </h1>
        <div className="gold-divider" aria-hidden="true">◆</div>
        <p className="font-sans text-dark-soft text-sm mt-5">
          Nos haría muy felices contar contigo en este día tan especial
        </p>
      </div>

      {/* RSVP Card Form */}
      <RSVPForm />

      {/* Footer */}
      <footer className="py-8 text-center border-t border-dark/[0.06]">
        <p className="font-display italic text-dark/25 text-sm font-light">
          {config.novios.nombre1} &amp; {config.novios.nombre2}
        </p>
      </footer>
    </main>
  )
}

