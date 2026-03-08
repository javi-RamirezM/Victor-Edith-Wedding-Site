import configData from '@/config.json'

export interface VenueConfig {
  nombre: string
  direccion: string
  google_maps_embed_url: string
  lat: number
  lng: number
  descripcion: string
}

export interface NoviosConfig {
  nombre1: string
  nombre2: string
}

export interface SiteConfig {
  novios: NoviosConfig
  fecha_boda: string
  venue: VenueConfig
  hero_image_url: string
  texto_bienvenida: string
  google_script_url: string
  admin_password: string
}

export const config: SiteConfig = configData as SiteConfig

// Note: Time is set to 12:00:00 local time. If timezone precision matters,
// store the full datetime in config.json (e.g., "2025-09-20T12:00:00+02:00").
export function getWeddingDate(): Date {
  return new Date(config.fecha_boda + 'T12:00:00')
}

export function getFridayDate(): Date {
  const saturday = getWeddingDate()
  const friday = new Date(saturday)
  friday.setDate(saturday.getDate() - 1)
  return friday
}

export function formatDate(date: Date, locale = 'es-ES'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
