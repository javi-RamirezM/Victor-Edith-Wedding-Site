import HeroSection from '@/components/HeroSection'
import VenueMap from '@/components/VenueMap'
import GuestList from '@/components/GuestList'
import { config } from '@/lib/config'
import Link from 'next/link'

function SectionDivider() {
  return (
    <div className="section-divider py-2" aria-hidden="true">
      <span className="text-gold-light text-[10px]">◆</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <main>
      {/* Hero fullscreen */}
      <HeroSection />

      {/* Welcome section */}
      <section className="py-24 md:py-32 bg-cream" aria-labelledby="welcome-heading">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-5">
            Bienvenidos
          </p>
          <h2
            id="welcome-heading"
            className="font-display italic text-dark font-light leading-tight mb-7"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            {config.texto_bienvenida}
          </h2>
          <div className="gold-divider" aria-hidden="true">◆</div>
          <p className="font-sans text-dark-soft text-sm mt-7 leading-relaxed">
            Queremos que este día sea tan especial para vosotros como lo es para nosotros.
            Por favor, confirma tu asistencia para que podamos organizar todo con cariño.
          </p>
          <Link
            href="/confirmar"
            className="inline-block mt-8 border border-gold text-dark font-sans text-xs uppercase tracking-[0.3em] px-10 py-3.5 transition-all duration-300 hover:bg-gold hover:text-white"
            aria-label="Confirmar asistencia a la boda"
          >
            Confirmar Asistencia
          </Link>
        </div>
      </section>

      <SectionDivider />

      {/* Venue and Map */}
      <VenueMap />

      <SectionDivider />

      {/* Guest List */}
      <GuestList />

      {/* Footer */}
      <footer className="py-14 bg-cream border-t border-dark/[0.06] text-center">
        <p className="font-display italic text-dark/40 text-xl font-light">
          {config.novios.nombre1} &amp; {config.novios.nombre2}
        </p>
        <p className="font-sans text-dark/25 text-xs uppercase tracking-[0.3em] mt-3">
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

