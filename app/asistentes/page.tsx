import AttendanceCalendar from '@/components/AttendanceCalendar'
import { config } from '@/lib/config'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata = {
  title: `Asistentes | Boda ${config.novios.nombre1} & ${config.novios.nombre2}`,
  description: 'Lista de asistentes confirmados',
}

export default function AsistentesPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <header className="py-6 px-6 border-b border-dark/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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

      {/* Page header */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-4 text-center">
        <p className="text-gold uppercase tracking-[0.3em] text-sm font-sans font-light mb-4">
          Confirmados
        </p>
        <h1 className="font-display text-dark text-4xl md:text-5xl font-light mb-4">
          Quién viene a la Boda
        </h1>
        <div className="gold-divider" aria-hidden="true" />
        <p className="text-dark/60 font-sans mt-6">
          Lista actualizada en tiempo real
        </p>
      </div>

      {/* Calendar */}
      <AttendanceCalendar />

      {/* Footer */}
      <footer className="py-8 text-center border-t border-dark/10 mt-4">
        <p className="font-display text-dark/30 text-sm font-light italic">
          {config.novios.nombre1} & {config.novios.nombre2}
        </p>
      </footer>
    </main>
  )
}
