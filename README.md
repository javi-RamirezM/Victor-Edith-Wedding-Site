# Boda de Victor & Edith — Sitio Web

Sitio web de boda construido con Next.js 14, TypeScript y Tailwind CSS. Diseño romántico y elegante con paleta crema, dorado y salvia.

## Características

- **Hero** con cuenta atrás en tiempo real hasta la boda
- **Formulario RSVP** integrado con Google Sheets vía Apps Script
- **Mapa del venue** con embed de Google Maps
- **Lista de invitados** con datos en tiempo real
- **Calendario de asistencia** por días (viernes/sábado)
- **Backoffice** protegido por contraseña con exportación CSV
- Diseño mobile-first, animaciones suaves, accesibilidad (ARIA)
- Tipografías: Cormorant Garamond + DM Sans (Google Fonts)
- Despliegue estático optimizado para Netlify

## Configuración

Edita `config.json` para personalizar:

```json
{
  "novios": { "nombre1": "Victor", "nombre2": "Edith" },
  "fecha_boda": "2025-09-20",
  "venue": { ... },
  "google_script_url": "TU_URL_AQUI",
  "admin_password": "tu_contraseña"
}
```

## Integración con Google Sheets

1. Crea un proyecto en [script.google.com](https://script.google.com)
2. Copia el contenido de `docs/apps-script.js`
3. Reemplaza `TU_SPREADSHEET_ID_AQUI` con el ID de tu hoja de cálculo
4. Despliega como Web App (acceso: Cualquiera)
5. Pega la URL en `config.json` → `google_script_url`

## Desarrollo

```bash
npm install
npm run dev
```

## Despliegue en Netlify

El sitio exporta HTML estático. Conecta el repositorio en Netlify — el archivo `netlify.toml` configura automáticamente el build.

## Estructura

```
app/           # Páginas (/, /confirmar, /asistentes, /admin)
components/    # Componentes React
lib/           # Config y cliente de Google Sheets
docs/          # Código del Google Apps Script
config.json    # Configuración del sitio
```
