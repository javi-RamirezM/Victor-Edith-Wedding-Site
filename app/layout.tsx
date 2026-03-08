import type { Metadata } from 'next'
import './globals.css'
import { config } from '@/lib/config'

export const metadata: Metadata = {
  title: `Boda de ${config.novios.nombre1} & ${config.novios.nombre2}`,
  description: config.texto_bienvenida,
  openGraph: {
    title: `Boda de ${config.novios.nombre1} & ${config.novios.nombre2}`,
    description: config.texto_bienvenida,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cream text-dark antialiased">
        {children}
      </body>
    </html>
  )
}
