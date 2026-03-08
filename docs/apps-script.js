/**
 * Google Apps Script para la boda de Victor & Edith
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Ve a https://script.google.com
 * 2. Crea un nuevo proyecto
 * 3. Pega este código
 * 4. Configura los permisos necesarios
 * 5. Despliega como "Web App" (Ejecutar como: Yo, Acceso: Cualquiera)
 * 6. Copia la URL del despliegue y pégala en config.json como "google_script_url"
 */

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

function submitRSVP(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow([
      'Timestamp',
      'Nombre',
      'Total Asistentes',
      'Nombres Acompañantes',
      'Días',
      'Alergias/Notas'
    ])
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold')
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.nombre || '',
    data.total_asistentes || 1,
    data.nombres_acompanantes || '',
    data.dias === 'viernes_sabado' ? 'Viernes + Sábado' : 'Solo Sábado',
    data.alergias || ''
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
    alergias: row[5]
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
    timestamp: new Date().toISOString()
  }

  const result = submitRSVP(testData)
  Logger.log(result.getContent())
}
