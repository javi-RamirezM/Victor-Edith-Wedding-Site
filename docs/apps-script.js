/**
 * Google Apps Script para la boda de Victor & Edith
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Ve a https://script.google.com
 * 2. Crea un nuevo proyecto
 * 3. Pega este código
 * 4. Configura los permisos necesarios
 * 5. Despliega como "Web App" (Ejecutar como: Yo, Acceso: Cualquiera)
 * 6. Copia la URL del despliegue y configúrala como variable de entorno GOOGLE_SCRIPT_URL en Netlify
 */

// ID de la hoja de cálculo de Google Sheets
// Cómo encontrarlo: abre tu Google Sheet y mira la URL:
//   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
// Copia el valor de SPREADSHEET_ID (la cadena larga entre /d/ y /edit)
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI'
const SHEET_NAME = 'Respuestas'

function doGet(e) {
  const action = e.parameter.action

  if (action === 'get_attendees') {
    return getAttendees()
  }

  return ContentService.createTextOutput(
    JSON.stringify({ error: 'Acción no reconocida' })
  ).setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const action = data.action

    if (action === 'submit_rsvp') {
      return submitRSVP(data)
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'Acción no reconocida' })
    ).setMimeType(ContentService.MimeType.JSON)

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.message })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

const EXPECTED_HEADERS = [
  'Timestamp',
  'Nombre',
  'Total Asistentes',
  'Nombres Acompañantes',
  'Días',
  'Alergias/Notas',
  'Niños',
  'Menú Infantil',
  'Nº Menús Infantiles',
  'Trona',
  'Alojamiento',
  'Alojamiento Días',
  'Transporte'
]

function ensureHeaders(sheet) {
  const numCols = EXPECTED_HEADERS.length
  const currentHeaders = sheet.getRange(1, 1, 1, numCols).getValues()[0]
  const needsUpdate = EXPECTED_HEADERS.some((h, i) => currentHeaders[i] !== h)
  if (needsUpdate) {
    sheet.getRange(1, 1, 1, numCols).setValues([EXPECTED_HEADERS])
    sheet.getRange(1, 1, 1, numCols).setFontWeight('bold')
  }
}

function submitRSVP(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
  }

  ensureHeaders(sheet)

  const alojamientoDias = data.alojamiento === 'si'
    ? (data.alojamiento_dias === 'viernes_sabado' ? 'Viernes + Sábado' : 'Solo Sábado')
    : ''

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.nombre || '',
    data.total_asistentes || 1,
    data.nombres_acompanantes || '',
    data.dias === 'viernes_sabado' ? 'Viernes + Sábado' : 'Solo Sábado',
    data.alergias || '',
    data.ninos === 'si' ? 'Sí' : 'No',
    data.ninos === 'si' && data.menu_infantil === 'si' ? 'Sí' : 'No',
    data.ninos === 'si' && data.menu_infantil === 'si' ? (data.num_menus_infantiles || 0) : 0,
    data.ninos === 'si' ? (data.trona === 'si' ? 'Sí' : 'No') : 'No',
    data.alojamiento === 'si' ? 'Sí' : 'No',
    alojamientoDias,
    data.transporte === 'si' ? 'Sí' : 'No'
  ])

  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: 'RSVP guardado correctamente' })
  ).setMimeType(ContentService.MimeType.JSON)
}

function getAttendees() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ attendees: [] })
    ).setMimeType(ContentService.MimeType.JSON)
  }

  const data = sheet.getDataRange().getValues()
  
  const attendees = data.slice(1).map(row => ({
    timestamp: row[0],
    nombre: row[1],
    total_asistentes: parseInt(row[2]) || 1,
    nombres_acompanantes: row[3],
    dias: row[4] === 'Viernes + Sábado' ? 'viernes_sabado' : 'solo_sabado',
    alergias: row[5],
    ninos: row[6] === 'Sí' ? 'si' : 'no',
    menu_infantil: row[7] === 'Sí' ? 'si' : 'no',
    num_menus_infantiles: parseInt(row[8]) || 0,
    trona: row[9] === 'Sí' ? 'si' : 'no',
    alojamiento: row[10] === 'Sí' ? 'si' : 'no',
    alojamiento_dias: row[11] === 'Viernes + Sábado' ? 'viernes_sabado' : (row[11] === 'Solo Sábado' ? 'solo_sabado' : ''),
    transporte: row[12] === 'Sí' ? 'si' : 'no'
  }))

  return ContentService.createTextOutput(
    JSON.stringify({ attendees })
  ).setMimeType(ContentService.MimeType.JSON)
}

function test() {
  const testData = {
    action: 'submit_rsvp',
    nombre: 'Test Usuario',
    total_asistentes: 2,
    nombres_acompanantes: 'Test Acompañante',
    dias: 'viernes_sabado',
    alergias: '',
    ninos: 'si',
    menu_infantil: 'si',
    num_menus_infantiles: 1,
    trona: 'si',
    alojamiento: 'si',
    alojamiento_dias: 'viernes_sabado',
    transporte: 'no',
    timestamp: new Date().toISOString()
  }

  const result = submitRSVP(testData)
  Logger.log(result.getContent())
}
