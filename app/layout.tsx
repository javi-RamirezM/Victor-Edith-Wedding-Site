import type { Metadata } from 'next'
import './globals.css'
import { config } from '@/lib/config'
import { LanguageProvider } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'

const siteName = `Boda de ${config.novios.nombre1} & ${config.novios.nombre2}`

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'
  ),
  title: siteName,
  description: config.texto_bienvenida,
  openGraph: {
    title: siteName,
    description: config.texto_bienvenida,
    type: 'website',
    siteName,
    images: [
      {
        url: '/images/pareja.jpeg',
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: config.texto_bienvenida,
    images: ['/images/pareja.jpeg'],
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
        <LanguageProvider>
          <LanguageSelector />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

