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
      {/* Header */}
      <header className="py-6 px-6 border-b border-dark/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-dark/50 hover:text-dark transition-colors font-sans text-sm"
            aria-label="Volver al inicio"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Inicio
          </Link>
          <span className="font-display text-dark text-lg font-light">
            {config.novios.nombre1} & {config.novios.nombre2}
          </span>
        </div>
      </header>

      {/* Form header */}
      <div className="max-w-xl mx-auto px-6 pt-12 pb-4 text-center">
        <p className="text-gold uppercase tracking-[0.3em] text-sm font-sans font-light mb-4">
          RSVP
        </p>
        <h1 className="font-display text-dark text-4xl md:text-5xl font-light mb-4">
          Confirma tu Asistencia
        </h1>
        <div className="gold-divider" aria-hidden="true" />
        <p className="text-dark/60 font-sans mt-6">
          Nos haría muy felices contar contigo en este día tan especial
        </p>
      </div>

      {/* RSVP Form */}
      <RSVPForm />

      {/* Footer */}
      <footer className="py-8 text-center border-t border-dark/10 mt-8">
        <p className="font-display text-dark/30 text-sm font-light italic">
          {config.novios.nombre1} & {config.novios.nombre2}
        </p>
      </footer>
    </main>
  )
}
