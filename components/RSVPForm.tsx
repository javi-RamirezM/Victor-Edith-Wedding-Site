'use client'

import { useState } from 'react'
import Link from 'next/link'
import { submitRSVP, RSVPData } from '@/lib/sheets'
import { Heart, CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type FormStep = 'form' | 'submitting' | 'success' | 'error'

type AttendanceOption =
  | 'sabado_sin_alojamiento'
  | 'sabado_con_alojamiento'
  | 'viernes_sabado_sin_alojamiento'
  | 'viernes_sabado_con_alojamiento'

function deriveFromOption(option: AttendanceOption): Pick<RSVPData, 'dias' | 'alojamiento' | 'alojamiento_dias'> {
  switch (option) {
    case 'sabado_sin_alojamiento':
      return { dias: 'solo_sabado', alojamiento: 'no', alojamiento_dias: '' }
    case 'sabado_con_alojamiento':
      return { dias: 'solo_sabado', alojamiento: 'si', alojamiento_dias: 'solo_sabado' }
    case 'viernes_sabado_sin_alojamiento':
      return { dias: 'viernes_sabado', alojamiento: 'no', alojamiento_dias: '' }
    case 'viernes_sabado_con_alojamiento':
      return { dias: 'viernes_sabado', alojamiento: 'si', alojamiento_dias: 'viernes_sabado' }
  }
}

export default function RSVPForm() {
  const { t } = useLanguage()
  const [step, setStep] = useState<FormStep>('form')
  const [errors, setErrors] = useState<Partial<Record<keyof RSVPData, string>>>({})
  const [attendanceOption, setAttendanceOption] = useState<AttendanceOption>('viernes_sabado_sin_alojamiento')
  const [formData, setFormData] = useState<RSVPData>({
    nombre: '',
    total_asistentes: 1,
    nombres_acompanantes: '',
    dias: 'viernes_sabado',
    alergias: '',
    ninos: 'no',
    menu_infantil: 'no',
    num_menus_infantiles: 1,
    trona: 'no',
    alojamiento: 'no',
    alojamiento_dias: '',
    transporte: 'si',
  })

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RSVPData, string>> = {}
    if (!formData.nombre.trim()) {
      newErrors.nombre = t('rsvp.validationName')
    }
    if (formData.total_asistentes < 1 || formData.total_asistentes > 20) {
      newErrors.total_asistentes = t('rsvp.validationCount')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStep('submitting')
    const success = await submitRSVP(formData)
    setStep(success ? 'success' : 'error')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: name === 'total_asistentes'
          ? parseInt(value, 10) || 1
          : name === 'num_menus_infantiles'
            ? parseInt(value, 10) || 1
            : value,
      }
      // Reset conditional fields when parent switches to 'no'
      if (name === 'ninos' && value === 'no') {
        updated.menu_infantil = 'no'
        updated.num_menus_infantiles = 1
        updated.trona = 'no'
      }
      if (name === 'menu_infantil' && value === 'no') {
        updated.num_menus_infantiles = 1
      }
      return updated
    })
    if (errors[name as keyof RSVPData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleAttendanceOption = (option: AttendanceOption) => {
    setAttendanceOption(option)
    const derived = deriveFromOption(option)
    setFormData((prev) => ({ ...prev, ...derived }))
  }

  const attendanceOptions: { value: AttendanceOption; title: string; subtitle: string }[] = [
    {
      value: 'sabado_sin_alojamiento',
      title: t('rsvp.optionSatNoAccom'),
      subtitle: t('rsvp.optionSatNoAccomSub'),
    },
    {
      value: 'sabado_con_alojamiento',
      title: t('rsvp.optionSatWithAccom'),
      subtitle: t('rsvp.optionSatWithAccomSub'),
    },
    {
      value: 'viernes_sabado_sin_alojamiento',
      title: t('rsvp.optionFriSatNoAccom'),
      subtitle: t('rsvp.optionFriSatNoAccomSub'),
    },
    {
      value: 'viernes_sabado_con_alojamiento',
      title: t('rsvp.optionFriSatWithAccom'),
      subtitle: t('rsvp.optionFriSatWithAccomSub'),
    },
  ]

  if (step === 'success') {
    return (
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg bg-white shadow-xl px-10 py-14 text-center animate-fade-in-up">
          <CheckCircle className="w-10 h-10 text-gold text-gold-contrast mx-auto mb-6" aria-hidden="true" />
          <h2 className="font-display italic text-dark font-light mb-3" style={{ fontSize: '2.2rem' }}>
            {t('rsvp.successTitle')}
          </h2>
          <div className="gold-divider my-5" aria-hidden="true">◆</div>
          <p className="font-sans text-dark-soft text-sm mb-1">
            {t('rsvp.successThanks')} <strong className="font-medium text-dark">{formData.nombre}</strong>.
          </p>
          <p className="font-sans text-dark-soft text-sm mb-10">
            {t('rsvp.successMessage')}
          </p>
          <Heart className="w-5 h-5 text-gold text-gold-contrast mx-auto mb-8" aria-hidden="true" />
          <Link
            href="/"
            className="inline-block border border-gold text-dark font-sans text-xs uppercase tracking-[0.3em] px-8 py-3 transition-all duration-300 hover:bg-gold hover:text-white"
          >
            {t('rsvp.backToHome')}
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg bg-white shadow-xl px-10 py-14 text-center animate-fade-in-up">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-6" aria-hidden="true" />
          <h2 className="font-display italic text-dark font-light mb-3" style={{ fontSize: '2.2rem' }}>
            {t('rsvp.errorTitle')}
          </h2>
          <p className="font-sans text-dark-soft text-sm mb-10">
            {t('rsvp.errorMessage')}
          </p>
          <button
            onClick={() => setStep('form')}
            className="inline-block border border-gold text-dark font-sans text-xs uppercase tracking-[0.3em] px-8 py-3 transition-all duration-300 hover:bg-gold hover:text-white"
          >
            {t('rsvp.retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center px-6 py-10 pb-20">
      <div className="w-full max-w-lg bg-white shadow-xl px-8 md:px-12 py-12">
        <form
          onSubmit={handleSubmit}
          aria-label={t('rsvp.submitAria')}
          noValidate
          className="space-y-9"
        >
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-3">
              {t('rsvp.fullName')} <span className="text-gold text-gold-contrast" aria-hidden="true">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder={t('rsvp.fullNamePlaceholder')}
              required
              aria-required="true"
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? 'nombre-error' : undefined}
              className={`w-full bg-transparent border-b py-3 font-sans text-dark text-sm placeholder-dark/40 focus:outline-none transition-colors ${
                errors.nombre ? 'border-red-300' : 'border-dark/20 focus:border-gold'
              }`}
            />
            {errors.nombre && (
              <p id="nombre-error" className="font-sans text-red-400 text-xs mt-2" role="alert">
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Total asistentes */}
          <div>
            <label htmlFor="total_asistentes" className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-3">
              {t('rsvp.howMany')} <span className="text-gold text-gold-contrast" aria-hidden="true">*</span>
            </label>
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
              className={`w-full bg-transparent border-b py-3 font-sans text-dark text-sm focus:outline-none transition-colors ${
                errors.total_asistentes ? 'border-red-300' : 'border-dark/20 focus:border-gold'
              }`}
            />
            {errors.total_asistentes && (
              <p id="total-error" className="font-sans text-red-400 text-xs mt-2" role="alert">
                {errors.total_asistentes}
              </p>
            )}
          </div>

          {/* Acompañantes */}
          <div>
            <label htmlFor="nombres_acompanantes" className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-3">
              {t('rsvp.companions')}
            </label>
            <textarea
              id="nombres_acompanantes"
              name="nombres_acompanantes"
              value={formData.nombres_acompanantes}
              onChange={handleChange}
              placeholder={t('rsvp.companionsPlaceholder')}
              rows={3}
              className="w-full bg-transparent border-b border-dark/20 focus:border-gold py-3 font-sans text-dark text-sm placeholder-dark/40 focus:outline-none transition-colors resize-none"
            />
            <p className="font-sans text-dark/50 text-[10px] mt-1.5">
              {t('rsvp.companionsHint')}
            </p>
          </div>

          {/* Niños */}
          <fieldset>
            <legend className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-4">
              {t('rsvp.children')}
            </legend>
            <div className="flex gap-3">
              {(['si', 'no'] as const).map((val) => {
                const selected = formData.ninos === val
                return (
                  <label
                    key={val}
                    className={`flex-1 flex items-center justify-center gap-3 cursor-pointer p-3 border transition-colors ${
                      selected ? 'border-gold bg-gold/5' : 'border-dark/15 hover:border-gold/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ninos"
                      value={val}
                      checked={selected}
                      onChange={handleChange}
                      className="sr-only"
                      aria-checked={selected}
                    />
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected ? 'border-gold' : 'border-dark/30'
                      }`}
                      aria-hidden="true"
                    >
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                    </div>
                    <span className="font-sans text-dark text-sm">{val === 'si' ? t('rsvp.yes') : t('rsvp.no')}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* Menú infantil — conditional */}
          {formData.ninos === 'si' && (
            <fieldset>
              <legend className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-4">
                {t('rsvp.childrenMenu')}
              </legend>
              <div className="flex gap-3">
                {(['si', 'no'] as const).map((val) => {
                  const selected = formData.menu_infantil === val
                  return (
                    <label
                      key={val}
                      className={`flex-1 flex items-center justify-center gap-3 cursor-pointer p-3 border transition-colors ${
                        selected ? 'border-gold bg-gold/5' : 'border-dark/15 hover:border-gold/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="menu_infantil"
                        value={val}
                        checked={selected}
                        onChange={handleChange}
                        className="sr-only"
                        aria-checked={selected}
                      />
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected ? 'border-gold' : 'border-dark/30'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                      </div>
                      <span className="font-sans text-dark text-sm">{val === 'si' ? t('rsvp.yes') : t('rsvp.no')}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Nº menús infantiles — conditional */}
          {formData.ninos === 'si' && formData.menu_infantil === 'si' && (
            <div>
              <label htmlFor="num_menus_infantiles" className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-3">
                {t('rsvp.childrenMenuCount')}
              </label>
              <select
                id="num_menus_infantiles"
                name="num_menus_infantiles"
                value={formData.num_menus_infantiles}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-dark/20 focus:border-gold py-3 font-sans text-dark text-sm focus:outline-none transition-colors"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          {/* Trona — conditional */}
          {formData.ninos === 'si' && (
            <fieldset>
              <legend className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-4">
                {t('rsvp.highChair')}
              </legend>
              <div className="flex gap-3">
                {(['si', 'no'] as const).map((val) => {
                  const selected = formData.trona === val
                  return (
                    <label
                      key={val}
                      className={`flex-1 flex items-center justify-center gap-3 cursor-pointer p-3 border transition-colors ${
                        selected ? 'border-gold bg-gold/5' : 'border-dark/15 hover:border-gold/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="trona"
                        value={val}
                        checked={selected}
                        onChange={handleChange}
                        className="sr-only"
                        aria-checked={selected}
                      />
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected ? 'border-gold' : 'border-dark/30'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                      </div>
                      <span className="font-sans text-dark text-sm">{val === 'si' ? t('rsvp.yes') : t('rsvp.no')}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Alergias */}
          <div>
            <label htmlFor="alergias" className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-3">
              {t('rsvp.allergies')}
            </label>
            <textarea
              id="alergias"
              name="alergias"
              value={formData.alergias}
              onChange={handleChange}
              placeholder={t('rsvp.allergiesPlaceholder')}
              rows={3}
              className="w-full bg-transparent border-b border-dark/20 focus:border-gold py-3 font-sans text-dark text-sm placeholder-dark/40 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Opción de asistencia — 4 combined options */}
          <fieldset>
            <legend className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-4">
              {t('rsvp.attendingOption')} <span className="text-gold text-gold-contrast" aria-hidden="true">*</span>
            </legend>
            <div className="space-y-3">
              {attendanceOptions.map(({ value, title, subtitle }) => {
                const selected = attendanceOption === value
                return (
                  <label
                    key={value}
                    className={`flex items-start gap-4 cursor-pointer p-4 border transition-colors ${
                      selected ? 'border-gold bg-gold/5' : 'border-dark/15 hover:border-gold/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendanceOption"
                      value={value}
                      checked={selected}
                      onChange={() => handleAttendanceOption(value)}
                      className="sr-only"
                      aria-checked={selected}
                    />
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center transition-all ${
                        selected ? 'border-gold' : 'border-dark/30'
                      }`}
                      aria-hidden="true"
                    >
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                    </div>
                    <div>
                      <span className="block font-sans text-dark text-sm font-medium">{title}</span>
                      <span className="block font-sans text-dark/55 text-xs mt-0.5">{subtitle}</span>
                    </div>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* Transporte */}
          <fieldset>
            <legend className="block font-sans text-dark uppercase tracking-[0.25em] text-[10px] mb-4">
              {t('rsvp.transport')}
            </legend>
            <div className="flex gap-3">
              {(['si', 'no'] as const).map((val) => {
                const selected = formData.transporte === val
                return (
                  <label
                    key={val}
                    className={`flex-1 flex items-center justify-center gap-3 cursor-pointer p-3 border transition-colors ${
                      selected ? 'border-gold bg-gold/5' : 'border-dark/15 hover:border-gold/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="transporte"
                      value={val}
                      checked={selected}
                      onChange={handleChange}
                      className="sr-only"
                      aria-checked={selected}
                    />
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        selected ? 'border-gold' : 'border-dark/30'
                      }`}
                      aria-hidden="true"
                    >
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                    </div>
                    <span className="font-sans text-dark text-sm">{val === 'si' ? t('rsvp.yes') : t('rsvp.no')}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={step === 'submitting'}
              className="w-full bg-dark text-cream font-sans text-xs uppercase tracking-[0.3em] py-4 transition-all duration-300 hover:bg-gold disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-gold"
              aria-label={t('rsvp.submitAria')}
            >
              {step === 'submitting' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border border-cream/30 border-t-cream rounded-full animate-spin" aria-hidden="true" />
                  {t('rsvp.submitting')}
                </span>
              ) : (
                t('rsvp.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
