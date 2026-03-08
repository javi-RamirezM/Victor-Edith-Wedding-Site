import HeroSection from '@/components/HeroSection'
import VenueMap from '@/components/VenueMap'
import GuestList from '@/components/GuestList'
import { config } from '@/lib/config'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      {/* Hero fullscreen */}
      <HeroSection />

      {/* Welcome section */}
      <section className="py-20 md:py-32 bg-cream" aria-labelledby="welcome-heading">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-gold uppercase tracking-[0.3em] text-sm font-sans font-light mb-6">
            Bienvenidos
          </p>
          <h2
            id="welcome-heading"
            className="font-display text-dark text-4xl md:text-5xl font-light leading-tight mb-8"
          >
            {config.texto_bienvenida}
          </h2>
          <div className="gold-divider" aria-hidden="true" />
          <p className="text-dark/70 font-sans mt-8 leading-relaxed">
            Queremos que este día sea tan especial para vosotros como lo es para nosotros. 
            Por favor, confirma tu asistencia para que podamos organizar todo con cariño.
          </p>
          <Link
            href="/confirmar"
            className="inline-block mt-8 text-gold border border-gold px-8 py-3 text-sm uppercase tracking-widest font-sans hover:bg-gold hover:text-dark transition-all duration-300"
            aria-label="Confirmar asistencia a la boda"
          >
            Confirmar Asistencia
          </Link>
        </div>
      </section>

      {/* Venue and Map */}
      <VenueMap />

      {/* Guest List */}
      <GuestList />

      {/* Footer */}
      <footer className="py-12 bg-cream border-t border-dark/10 text-center">
        <p className="font-display text-dark/50 text-lg font-light italic">
          {config.novios.nombre1} & {config.novios.nombre2}
        </p>
        <p className="text-dark/30 text-sm font-sans mt-2">
          {new Date(config.fecha_boda).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </footer>
    </main>
  )
}
