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

Edita `config.json` para personalizar el sitio:

```json
{
  "novios": { "nombre1": "Victor", "nombre2": "Edith" },
  "fecha_boda": "2025-09-20",
  "venue": { ... },
  "admin_password": "tu_contraseña"
}
```

El campo `google_script_url` de `config.json` no es utilizado por las funciones de Netlify. La URL del Apps Script se configura como variable de entorno en Netlify (ver sección de integración más abajo).

## Integración con Google Sheets

### Primera instalación

1. Crea un proyecto en [script.google.com](https://script.google.com)
2. Copia el contenido de `docs/apps-script.js`
3. Reemplaza `TU_SPREADSHEET_ID_AQUI` con el ID de tu hoja de cálculo
4. Despliega como Web App (acceso: Cualquiera)
5. Configura la variable de entorno `GOOGLE_SCRIPT_URL` en el panel de Netlify con la URL del despliegue

### Actualización del script (cuando `docs/apps-script.js` cambie)

> ⚠️ Cada vez que se modifique `docs/apps-script.js` (por ejemplo, al añadir nuevos campos al formulario), **debes redesplegar** el Google Apps Script manualmente o los nuevos campos no aparecerán en la hoja de cálculo.

1. Abre tu proyecto en [script.google.com](https://script.google.com)
2. Reemplaza todo el código con el contenido actualizado de `docs/apps-script.js`
3. Asegúrate de mantener el valor correcto de `SPREADSHEET_ID`
4. Ve a **Implementar → Administrar implementaciones → ✏️ Editar** y crea una nueva versión
5. Si la URL cambió, actualiza la variable `GOOGLE_SCRIPT_URL` en Netlify

El script actualizará automáticamente las cabeceras de la hoja existente cuando reciba el siguiente RSVP.

## Desarrollo

```bash
npm install
npm run dev
```

## Despliegue en Netlify

El sitio exporta HTML estático. Conecta el repositorio en Netlify — el archivo `netlify.toml` configura automáticamente el build.

### Pasos para desplegar:

1. Sube el repositorio a GitHub
2. En [Netlify](https://netlify.com), crea un nuevo sitio desde ese repositorio
3. Build command: `npm run build` / Publish directory: `out`
4. Netlify usará automáticamente la configuración de `netlify.toml`

### Configuración requerida antes del despliegue:

- **`config.json`** → Rellena todos los campos (`novios`, `fecha_boda`, `venue`, `admin_password`, etc.)
- **`public/images/pareja.jpg`** → Añade la foto de la pareja para el hero
- **Google Apps Script** → Configura el webhook siguiendo los pasos de arriba
- **Variable de entorno en Netlify** → Añade `GOOGLE_SCRIPT_URL` con la URL del despliegue de Apps Script

> ⚠️ La URL del Google Apps Script debe configurarse como variable de entorno `GOOGLE_SCRIPT_URL` en el panel de Netlify (Site settings → Environment variables), no en `config.json`.

## Estructura

```
app/           # Páginas (/, /confirmar, /asistentes, /admin)
components/    # Componentes React
lib/           # Config y cliente de Google Sheets
docs/          # Código del Google Apps Script
config.json    # Configuración del sitio
```
