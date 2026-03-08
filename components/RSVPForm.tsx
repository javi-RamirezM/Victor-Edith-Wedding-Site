'use client'

import { useState } from 'react'
import { submitRSVP, RSVPData } from '@/lib/sheets'
import { Heart, CheckCircle, AlertCircle } from 'lucide-react'

type FormStep = 'form' | 'submitting' | 'success' | 'error'

export default function RSVPForm() {
  const [step, setStep] = useState<FormStep>('form')
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPData, string>>>({})
  const [formData, setFormData] = useState<RSVPData>({
    nombre: '',
    total_asistentes: 1,
    nombres_acompanantes: '',
    dias: 'viernes_sabado',
    alergias: '',
  })

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RSVPData, string>> = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Por favor, introduce tu nombre completo'
    }
    
    if (formData.total_asistentes < 1 || formData.total_asistentes > 20) {
      newErrors.total_asistentes = 'El número de asistentes debe ser entre 1 y 20'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setStep('submitting')
    
    const success = await submitRSVP(formData)
    
    if (success) {
      setStep('success')
    } else {
      setStep('error')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'total_asistentes' ? parseInt(value, 10) || 1 : value,
    }))
    // Clear error when user types
    if (errors[name as keyof RSVPData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-gold" aria-hidden="true" />
          </div>
          <h2 className="font-display text-4xl text-dark font-light mb-4">
            ¡Confirmado!
          </h2>
          <div className="gold-divider my-6" aria-hidden="true" />
          <p className="text-dark/70 font-sans mb-2">
            Gracias, <strong className="text-dark">{formData.nombre}</strong>.
          </p>
          <p className="text-dark/70 font-sans mb-8">
            Hemos recibido tu confirmación. ¡Nos vemos en la boda!
          </p>
          <Heart className="w-6 h-6 text-gold mx-auto mb-8" aria-hidden="true" />
          <a
            href="/"
            className="inline-block text-gold border border-gold px-8 py-3 text-sm uppercase tracking-widest font-sans hover:bg-gold hover:text-dark transition-all duration-300"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md mx-auto animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" aria-hidden="true" />
          </div>
          <h2 className="font-display text-4xl text-dark font-light mb-4">
            Algo salió mal
          </h2>
          <p className="text-dark/70 font-sans mb-8">
            No pudimos guardar tu respuesta. Por favor, inténtalo de nuevo o contacta con nosotros directamente.
          </p>
          <button
            onClick={() => setStep('form')}
            className="inline-block text-gold border border-gold px-8 py-3 text-sm uppercase tracking-widest font-sans hover:bg-gold hover:text-dark transition-all duration-300"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto px-6 py-12"
      aria-label="Formulario de confirmación de asistencia"
      noValidate
    >
      <div className="space-y-8">
        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-dark font-sans text-sm uppercase tracking-widest mb-2"
          >
            Tu nombre completo <span className="text-gold" aria-hidden="true">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: María García López"
            required
            aria-required="true"
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? 'nombre-error' : undefined}
            className={`w-full bg-transparent border-b-2 py-3 font-sans text-dark placeholder-dark/30 focus:outline-none transition-colors ${
              errors.nombre ? 'border-red-400' : 'border-dark/20 focus:border-gold'
            }`}
          />
          {errors.nombre && (
            <p id="nombre-error" className="text-red-500 text-sm mt-1 font-sans" role="alert">
              {errors.nombre}
            </p>
          )}
        </div>

        {/* Total asistentes */}
        <div>
          <label
            htmlFor="total_asistentes"
            className="block text-dark font-sans text-sm uppercase tracking-widest mb-2"
          >
            ¿Cuántos venís en total? <span className="text-gold" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="total_asistentes"
              name="total_asistentes"
              type="number"
              min="1"
              max="20"
              value={formData.total_asistentes}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={!!errors.total_asistentes}
              aria-describedby={errors.total_asistentes ? 'total-error' : undefined}
              className={`w-full bg-transparent border-b-2 py-3 font-sans text-dark focus:outline-none transition-colors ${
                errors.total_asistentes ? 'border-red-400' : 'border-dark/20 focus:border-gold'
              }`}
            />
          </div>
          {errors.total_asistentes && (
            <p id="total-error" className="text-red-500 text-sm mt-1 font-sans" role="alert">
              {errors.total_asistentes}
            </p>
          )}
        </div>

        {/* Nombres acompañantes */}
        <div>
          <label
            htmlFor="nombres_acompanantes"
            className="block text-dark font-sans text-sm uppercase tracking-widest mb-2"
          >
            Nombres de los acompañantes
          </label>
          <textarea
            id="nombres_acompanantes"
            name="nombres_acompanantes"
            value={formData.nombres_acompanantes}
            onChange={handleChange}
            placeholder="Uno por línea"
            rows={3}
            className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-3 font-sans text-dark placeholder-dark/30 focus:outline-none transition-colors resize-none"
          />
          <p className="text-dark/40 text-xs mt-1 font-sans">
            Si vienes solo/a, puedes dejarlo vacío
          </p>
        </div>

        {/* Días */}
        <fieldset>
          <legend className="block text-dark font-sans text-sm uppercase tracking-widest mb-4">
            ¿Qué días asistiréis? <span className="text-gold" aria-hidden="true">*</span>
          </legend>
          <div className="space-y-3">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="radio"
                name="dias"
                value="viernes_sabado"
                checked={formData.dias === 'viernes_sabado'}
                onChange={handleChange}
                className="sr-only"
                aria-checked={formData.dias === 'viernes_sabado'}
              />
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-all ${
                  formData.dias === 'viernes_sabado'
                    ? 'border-gold bg-gold'
                    : 'border-dark/30 group-hover:border-gold'
                }`}
                aria-hidden="true"
              >
                {formData.dias === 'viernes_sabado' && (
                  <div className="w-2 h-2 rounded-full bg-dark" />
                )}
              </div>
              <div>
                <span className="font-sans text-dark font-medium block">
                  Viernes + Sábado
                </span>
                <span className="font-sans text-dark/50 text-sm">
                  Boda completa (recomendado)
                </span>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="radio"
                name="dias"
                value="solo_sabado"
                checked={formData.dias === 'solo_sabado'}
                onChange={handleChange}
                className="sr-only"
                aria-checked={formData.dias === 'solo_sabado'}
              />
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-all ${
                  formData.dias === 'solo_sabado'
                    ? 'border-gold bg-gold'
                    : 'border-dark/30 group-hover:border-gold'
                }`}
                aria-hidden="true"
              >
                {formData.dias === 'solo_sabado' && (
                  <div className="w-2 h-2 rounded-full bg-dark" />
                )}
              </div>
              <div>
                <span className="font-sans text-dark font-medium block">
                  Solo Sábado
                </span>
                <span className="font-sans text-dark/50 text-sm">
                  Solo ceremonia y banquete
                </span>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Alergias */}
        <div>
          <label
            htmlFor="alergias"
            className="block text-dark font-sans text-sm uppercase tracking-widest mb-2"
          >
            Alergias o notas especiales
          </label>
          <textarea
            id="alergias"
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            placeholder="Opcional: alergias alimentarias, movilidad reducida, etc."
            rows={3}
            className="w-full bg-transparent border-b-2 border-dark/20 focus:border-gold py-3 font-sans text-dark placeholder-dark/30 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={step === 'submitting'}
            className="w-full bg-gold text-dark py-4 text-sm uppercase tracking-[0.2em] font-sans font-medium hover:bg-gold/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-gold"
            aria-label="Enviar confirmación de asistencia"
          >
            {step === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" aria-hidden="true" />
                Enviando...
              </span>
            ) : (
              'Confirmar Asistencia'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
