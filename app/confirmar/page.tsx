"use client";

import RSVPForm from "@/components/RSVPForm";
import { config } from "@/lib/config";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ConfirmarPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-cream">
      {/* Top nav */}
      <header className="py-5 px-6 border-b border-dark/[0.07]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-sans text-dark/40 hover:text-dark transition-colors text-xs uppercase tracking-widest"
            aria-label={t("confirmar.back")}
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            {t("confirmar.back")}
          </Link>
          <span className="font-display italic text-dark text-lg font-light">
            {config.novios.nombre1} &amp; {config.novios.nombre2}
          </span>
        </div>
      </header>

      {/* Page header */}
      <div className="max-w-lg mx-auto px-6 pt-14 pb-6 text-center">
        <p className="font-sans text-gold text-gold-contrast uppercase tracking-[0.4em] text-xs mb-4">
          {t("rsvp.label")}
        </p>
        <h1
          className="font-display italic text-dark font-light mb-5"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          {t("rsvp.title")}
        </h1>
        <div className="gold-divider" aria-hidden="true">
          ◆
        </div>
      </div>

      {/* Weekend timeline */}
      <div className="max-w-lg mx-auto px-6 pb-2">
        <div className="bg-white border border-dark/[0.07] px-6 py-5">
          <p className="font-sans text-dark uppercase tracking-[0.3em] text-[10px] mb-4 text-center">
            {t("rsvp.timelineTitle")}
          </p>
          <ol className="space-y-0" aria-label={t("rsvp.timelineTitle")}>
            {[
              {
                day: t("rsvp.timelineFriday"),
                desc: t("rsvp.timelineFridayDesc"),
              },
              {
                day: t("rsvp.timelineSaturday"),
                desc: t("rsvp.timelineSaturdayDesc"),
              },
              {
                day: t("rsvp.timelineSunday"),
                desc: t("rsvp.timelineSundayDesc"),
              },
            ].map(({ day, desc }, i, arr) => (
              <li key={day} className="flex items-start gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-2 h-2 rounded-full bg-gold mt-1"
                    aria-hidden="true"
                  />
                  {i < arr.length - 1 && (
                    <div
                      className="w-px flex-1 bg-gold/25 mt-1 min-h-[28px]"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="pb-4">
                  <span className="block font-sans text-dark text-xs font-semibold uppercase tracking-[0.15em]">
                    {day}
                  </span>
                  <span className="block font-sans text-dark/65 text-xs mt-0.5">
                    {desc}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {/* Friday note */}
        <div className="mt-4 bg-gold/[0.06] px-5 py-4">
          <p className="font-sans text-dark/70 text-xs leading-relaxed">
            {t("venue.fridayNote")}
          </p>
        </div>
      </div>

      {/* RSVP Card Form */}
      <RSVPForm />

      {/* Footer */}
      <footer className="py-8 text-center border-t border-dark/[0.06]">
        <p className="font-display italic text-dark/50 text-sm font-light">
          {config.novios.nombre1} &amp; {config.novios.nombre2}
        </p>
      </footer>
    </main>
  );
}
