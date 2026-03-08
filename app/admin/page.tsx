'use client'

import { useState } from 'react'
import { config } from '@/lib/config'
import { getAttendees, Attendee } from '@/lib/sheets'
import { Lock, Download, Save, Eye, EyeOff } from 'lucide-react'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loadingAttendees, setLoadingAttendees] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Config form state
  const [formConfig, setFormConfig] = useState({
    nombre1: config.novios.nombre1,
    nombre2: config.novios.nombre2,
    fecha_boda: config.fecha_boda,
    hero_image_url: config.hero_image_url,
    venue_nombre: config.venue.nombre,
    venue_direccion: config.venue.direccion,
    texto_bienvenida: config.texto_bienvenida,
    google_script_url: config.google_script_url,
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === config.admin_password) {
      setIsAuthenticated(true)
      setPasswordError('')
      loadAttendees()
    } else {
      setPasswordError('Contraseña incorrecta')
    }
  }

  const loadAttendees = async () => {
    setLoadingAttendees(true)
    const data = await getAttendees()
    setAttendees(data)
    setLoadingAttendees(false)
  }

  const exportCSV = () => {
    const headers = ['Nombre', 'Total Asistentes', 'Acompañantes', 'Días', 'Alergias', 'Fecha']
    const rows = attendees.map((a) => [
      a.nombre,
      a.total_asistentes,
      a.nombres_acompanantes ?? '',
      a.dias === 'viernes_sabado' ? 'Viernes + Sábado' : 'Solo Sábado',
      a.alergias ?? '',
      a.timestamp,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invitados_${config.novios.nombre1}_${config.novios.nombre2}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveMessage('Para aplicar estos cambios, actualiza manualmente el archivo config.json y redespliega el sitio en Netlify.')
    setTimeout(() => setSaveMessage(''), 5000)
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-gold" aria-hidden="true" />
            </div>
            <h1 className="font-display text-dark text-3xl font-light mb-2">
              Backoffice
            </h1>
            <p className="text-dark/50 font-sans text-sm">
              Área privada de la boda
            </p>
          </div>

          <form onSubmit={handleLogin} aria-label="Formulario de inicio de sesión">
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError('')
                  }}
                  className={`w-full bg-transparent border-b-2 py-3 font-sans text-dark pr-10 focus:outline-none transition-colors ${
                    passwordError ? 'border-red-400' : 'border-dark/20 focus:border-gold'
                  }`}
                  required
                  aria-required="true"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" className="text-red-500 text-sm mt-1 font-sans" role="alert">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gold text-dark py-3 text-sm uppercase tracking-[0.2em] font-sans font-medium hover:bg-gold/90 transition-all duration-300"
            >
              Acceder
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Admin header */}
      <header className="bg-dark py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-cream text-xl font-light">
            Backoffice — {config.novios.nombre1} & {config.novios.nombre2}
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-cream/50 hover:text-cream text-sm font-sans transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Attendees section */}
        <section aria-labelledby="attendees-section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gold uppercase tracking-[0.3em] text-xs font-sans mb-1">
                Gestión
              </p>
              <h2 id="attendees-section" className="font-display text-dark text-3xl font-light">
                Lista de Asistentes
              </h2>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 border border-gold text-gold px-4 py-2 text-sm uppercase tracking-widest font-sans hover:bg-gold hover:text-dark transition-all duration-300"
              aria-label="Exportar lista de asistentes a CSV"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Exportar CSV
            </button>
          </div>

          {loadingAttendees ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : attendees.length === 0 ? (
            <p className="text-dark/40 font-sans text-center py-12">
              No hay asistentes confirmados todavía
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-sans text-sm" aria-label="Tabla de asistentes">
                <thead>
                  <tr className="border-b border-dark/10">
                    <th className="text-left py-3 text-dark/50 uppercase tracking-widest text-xs font-medium">Nombre</th>
                    <th className="text-left py-3 text-dark/50 uppercase tracking-widest text-xs font-medium">Asistentes</th>
                    <th className="text-left py-3 text-dark/50 uppercase tracking-widest text-xs font-medium">Días</th>
                    <th className="text-left py-3 text-dark/50 uppercase tracking-widest text-xs font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee, i) => (
                    <tr key={i} className="border-b border-dark/5 hover:bg-gold/5 transition-colors">
                      <td className="py-3 font-display text-dark text-base font-light">{attendee.nombre}</td>
                      <td className="py-3 text-dark/70">{attendee.total_asistentes}</td>
                      <td className="py-3 text-dark/70">
                        {attendee.dias === 'viernes_sabado' ? 'Vie + Sáb' : 'Solo Sáb'}
                      </td>
                      <td className="py-3 text-dark/40">
                        {new Date(attendee.timestamp).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 text-dark/40 text-sm font-sans">
            Total: {attendees.reduce((sum, a) => sum + (a.total_asistentes || 1), 0)} personas
          </div>
        </section>

        {/* Config editor */}
        <section aria-labelledby="config-section">
          <div className="mb-8">
            <p className="text-gold uppercase tracking-[0.3em] text-xs font-sans mb-1">
              Configuración
            </p>
            <h2 id="config-section" className="font-display text-dark text-3xl font-light">
              Editar Contenido
            </h2>
            <p className="text-dark/40 text-sm font-sans mt-2">
              Nota: Para aplicar los cambios, actualiza manualmente el archivo config.json y redespliega el sitio.
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { id: 'nombre1', label: 'Nombre del novio/a 1', key: 'nombre1' },
                { id: 'nombre2', label: 'Nombre del novio/a 2', key: 'nombre2' },
              ].map(({ id, label, key }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    value={formConfig[key as keyof typeof formConfig]}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-2 font-sans text-dark focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="fecha_boda" className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2">
                Fecha de la boda
              </label>
              <input
                id="fecha_boda"
                type="date"
                value={formConfig.fecha_boda}
                onChange={(e) => setFormConfig((prev) => ({ ...prev, fecha_boda: e.target.value }))}
                className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-2 font-sans text-dark focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="hero_image_url" className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2">
                URL de la foto hero
              </label>
              <input
                id="hero_image_url"
                type="text"
                value={formConfig.hero_image_url}
                onChange={(e) => setFormConfig((prev) => ({ ...prev, hero_image_url: e.target.value }))}
                className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-2 font-sans text-dark focus:outline-none transition-colors"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="venue_nombre" className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2">
                  Nombre del venue
                </label>
                <input
                  id="venue_nombre"
                  type="text"
                  value={formConfig.venue_nombre}
                  onChange={(e) => setFormConfig((prev) => ({ ...prev, venue_nombre: e.target.value }))}
                  className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-2 font-sans text-dark focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="venue_direccion" className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2">
                  Dirección
                </label>
                <input
                  id="venue_direccion"
                  type="text"
                  value={formConfig.venue_direccion}
                  onChange={(e) => setFormConfig((prev) => ({ ...prev, venue_direccion: e.target.value }))}
                  className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-2 font-sans text-dark focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="texto_bienvenida" className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2">
                Texto de bienvenida
              </label>
              <textarea
                id="texto_bienvenida"
                rows={2}
                value={formConfig.texto_bienvenida}
                onChange={(e) => setFormConfig((prev) => ({ ...prev, texto_bienvenida: e.target.value }))}
                className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-2 font-sans text-dark focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label htmlFor="google_script_url" className="block text-dark/60 text-xs uppercase tracking-widest font-sans mb-2">
                URL del Google Apps Script
              </label>
              <input
                id="google_script_url"
                type="text"
                value={formConfig.google_script_url}
                onChange={(e) => setFormConfig((prev) => ({ ...prev, google_script_url: e.target.value }))}
                className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-2 font-sans text-dark focus:outline-none transition-colors"
              />
            </div>

            {saveMessage && (
              <div className="bg-sage/10 border border-sage/30 p-4 text-sage font-sans text-sm" role="status">
                {saveMessage}
              </div>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 bg-gold text-dark px-8 py-3 text-sm uppercase tracking-[0.2em] font-sans font-medium hover:bg-gold/90 transition-all duration-300"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              Guardar configuración
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
