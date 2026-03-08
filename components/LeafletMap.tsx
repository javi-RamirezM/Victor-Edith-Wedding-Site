'use client'

import { useEffect, useRef } from 'react'
import type { Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { config } from '@/lib/config'

const GOLD = '#C9A96E'

const MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 42" width="28" height="42">
  <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 28 14 28S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="${GOLD}"/>
  <circle cx="14" cy="14" r="6" fill="white"/>
  <circle cx="14" cy="14" r="3.5" fill="${GOLD}"/>
</svg>`

export default function LeafletMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then(({ default: L }) => {
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [config.venue.lat, config.venue.lng],
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      })

      // CartoDB light tiles — warm, neutral tones, no token required
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      // Minimal zoom control in bottom-right corner
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Custom gold marker
      const goldIcon = L.divIcon({
        html: MARKER_SVG,
        className: '',
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -44],
      })

      L.marker([config.venue.lat, config.venue.lng], { icon: goldIcon })
        .addTo(map)
        .bindPopup(
          `<span style="font-family:var(--font-cormorant),Georgia,serif;font-style:italic;font-size:1rem;color:#1C1C1C">${config.venue.nombre}</span>`,
          { closeButton: false },
        )

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return <div ref={mapRef} className="w-full h-full" />
}
