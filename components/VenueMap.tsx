"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { config } from "@/lib/config";
import { MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import WeekendTimeline from "./WeekendTimeline";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function VenueMap() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-warm-white"
      aria-labelledby="venue-heading"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Weekend timeline */}
        <div className="mb-16">
          <WeekendTimeline />
        </div>

        {/* Section header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="font-sans text-gold uppercase tracking-[0.4em] text-xs mb-4">
            {t("venue.label")}
          </p>
          <h2
            id="venue-heading"
            className="font-display italic text-dark font-light mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {config.venue.nombre}
          </h2>
          <div className="gold-divider" aria-hidden="true">
            ◆
          </div>
          <p className="font-sans text-dark-soft text-sm mt-6 max-w-md mx-auto leading-relaxed">
            {t("venue.descripcion")}
          </p>
        </div>

        {/* Map + Info */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Map */}
          <div className="animate-on-scroll order-2 md:order-1">
            <div
              className="relative overflow-hidden shadow-xl"
              style={{
                height: "clamp(280px, 40vw, 400px)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(28,28,28,0.12)",
              }}
            >
              <LeafletMap />
            </div>
          </div>

          {/* Info */}
          <div className="animate-on-scroll order-1 md:order-2 space-y-10 pt-2">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-9 h-9 border border-gold/30 flex items-center justify-center mt-0.5">
                <MapPin className="w-4 h-4 text-gold" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-sans text-dark uppercase tracking-[0.2em] text-xs mb-2">
                  {t("venue.address")}
                </h3>
                <p className="font-display italic text-dark text-lg font-light leading-snug">
                  {config.venue.direccion}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-9 h-9 border border-gold/30 flex items-center justify-center mt-0.5">
                <Navigation className="w-4 h-4 text-gold" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-sans text-dark uppercase tracking-[0.2em] text-xs mb-2">
                  {t("venue.howToGet")}
                </h3>
                <p className="font-sans text-dark-soft text-sm leading-relaxed mb-4">
                  {t("venue.googleMapsRec")}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(config.venue.direccion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gold text-dark font-sans text-xs uppercase tracking-[0.25em] px-5 py-2.5 transition-all duration-300 hover:bg-gold hover:text-white"
                  aria-label={`${t("venue.viewOnMapsAria")} — ${config.venue.nombre}`}
                >
                  <Navigation className="w-3 h-3" aria-hidden="true" />
                  {t("venue.viewOnMaps")}
                </a>
              </div>
            </div>

            <div className="border-l border-gold pl-5">
              <p className="font-sans text-dark-soft text-sm leading-relaxed">
                {t("venue.accommodationInfo")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
