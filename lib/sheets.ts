const PROXY_URL = "/.netlify/functions/rsvp";

export interface RSVPData {
  nombre: string;
  total_asistentes: number;
  nombres_acompanantes: string;
  dias: "viernes_sabado" | "solo_sabado";
  alergias: string;
  ninos: "si" | "no";
  menu_infantil: "si" | "no";
  num_menus_infantiles: number;
  alojamiento: "si" | "no";
  alojamiento_dias: "viernes_sabado" | "solo_sabado" | "";
  transporte: "si" | "no";
  timestamp?: string;
}

export interface Attendee {
  nombre: string;
  total_asistentes: number;
  nombres_acompanantes?: string;
  dias: "viernes_sabado" | "solo_sabado";
  alergias?: string;
  ninos?: "si" | "no";
  menu_infantil?: "si" | "no";
  num_menus_infantiles?: number;
  alojamiento?: "si" | "no";
  alojamiento_dias?: "viernes_sabado" | "solo_sabado" | "";
  transporte?: "si" | "no";
  timestamp: string;
}

export async function submitRSVP(data: RSVPData): Promise<boolean> {
  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submit_rsvp",
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return false;
  }
}

export async function getAttendees(): Promise<Attendee[]> {
  if (process.env.NODE_ENV === "development") {
    return [
      {
        nombre: "María García",
        total_asistentes: 2,
        dias: "viernes_sabado",
        timestamp: new Date().toISOString(),
      },
      {
        nombre: "Juan Pérez",
        total_asistentes: 1,
        dias: "solo_sabado",
        timestamp: new Date().toISOString(),
      },
    ];
  }

  try {
    const response = await fetch(PROXY_URL, {
      method: "GET",
    });

    const data = await response.json();
    return data.attendees || [];
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return [];
  }
}
