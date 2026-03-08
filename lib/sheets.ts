import { config } from './config'

export interface RSVPData {
  nombre: string
  total_asistentes: number
  nombres_acompanantes: string
  dias: 'viernes_sabado' | 'solo_sabado'
  alergias: string
  timestamp?: string
}

export interface Attendee {
  nombre: string
  total_asistentes: number
  nombres_acompanantes?: string
  dias: 'viernes_sabado' | 'solo_sabado'
  alergias?: string
  timestamp: string
}

export async function submitRSVP(data: RSVPData): Promise<boolean> {
  const scriptUrl = config.google_script_url

  if (!scriptUrl || scriptUrl === 'TU_APPS_SCRIPT_URL_AQUI') {
    console.warn('Google Apps Script URL not configured. RSVP not saved.')
    return true // Pretend success in development
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submit_rsvp',
        ...data,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Error submitting RSVP:', error)
    return false
  }
}

export async function getAttendees(): Promise<Attendee[]> {
  const scriptUrl = config.google_script_url

  if (!scriptUrl || scriptUrl === 'TU_APPS_SCRIPT_URL_AQUI') {
    // Return mock data for development
    return [
      { nombre: 'María García', total_asistentes: 2, dias: 'viernes_sabado', timestamp: new Date().toISOString() },
      { nombre: 'Juan Pérez', total_asistentes: 1, dias: 'solo_sabado', timestamp: new Date().toISOString() },
      { nombre: 'Laura Martínez', total_asistentes: 3, dias: 'viernes_sabado', timestamp: new Date().toISOString() },
    ]
  }

  try {
    const response = await fetch(`${scriptUrl}?action=get_attendees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.attendees || []
  } catch (error) {
    console.error('Error fetching attendees:', error)
    return []
  }
}
