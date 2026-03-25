"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DayCard {
  dayKey: string;
  dateKey: string;
  titleKey: string;
  descKey: string;
  highlight?: boolean;
  icon: string;
}

const DAYS: DayCard[] = [
  {
    dayKey: "weekend.friday",
    dateKey: "weekend.fridayDate",
    titleKey: "weekend.fridayTitle",
    descKey: "weekend.fridayDesc",
    icon: "1",
  },
  {
    dayKey: "weekend.saturday",
    dateKey: "weekend.saturdayDate",
    titleKey: "weekend.saturdayTitle",
    descKey: "weekend.saturdayDesc",
    highlight: true,
    icon: "2",
  },
  {
    dayKey: "weekend.sunday",
    dateKey: "weekend.sundayDate",
    titleKey: "weekend.sundayTitle",
    descKey: "weekend.sundayDesc",
    icon: "3",
  },
];

export default function WeekendTimeline() {
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
    <div ref={sectionRef} aria-labelledby="weekend-heading" role="region">
      {/* Divider */}
      <div
        className="w-full h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent mb-16 animate-on-scroll"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="text-center mb-12 animate-on-scroll">
        <p className="font-sans text-gold text-gold-contrast uppercase tracking-[0.4em] text-xs mb-4">
          {t("weekend.label")}
        </p>
        <h2
          id="weekend-heading"
          className="font-display italic text-dark font-light mb-5"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
        >
          {t("weekend.title")}
        </h2>
        <div className="gold-divider" aria-hidden="true">
          ◆
        </div>
      </div>

      {/* Day cards */}
      <div className="relative">
        {/* Horizontal connector line — desktop only */}
        <div
          className="hidden md:block absolute top-[52px] left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-gold/20 via-gold/50 to-gold/20"
          aria-hidden="true"
        />

        <ol
          className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8"
          aria-label={t("weekend.title")}
        >
          {DAYS.map(({ dayKey, dateKey, titleKey, highlight, icon }, i) => (
            <li
              key={dayKey}
              className="animate-on-scroll flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* Connector dot + vertical line (mobile) */}
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-[52px] h-[52px] rounded-full border-2 transition-all ${
                    highlight
                      ? "border-gold bg-gold/10"
                      : "border-gold/40 bg-cream"
                  }`}
                  aria-hidden="true"
                >
                  <span
                    className={`font-display italic font-light select-none text-lg leading-none ${highlight ? "text-gold" : "text-dark/50"}`}
                  >
                    {icon}
                  </span>
                </div>

                {/* Vertical line between days (mobile only) */}
                {i < DAYS.length - 1 && (
                  <div
                    className="md:hidden w-px h-8 bg-gold/25 my-2"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Card body */}
              <div
                className={`mt-5 w-full px-6 py-7 ${
                  highlight
                    ? "bg-dark text-cream"
                    : "bg-warm-white border border-dark/[0.07]"
                }`}
              >
                <span
                  className={`block font-sans text-[10px] uppercase tracking-[0.3em] mb-1 ${
                    highlight ? "text-gold-light" : "text-dark/45"
                  }`}
                >
                  {t(dateKey)}
                </span>
                <span
                  className={`block font-display italic font-light mb-1 ${
                    highlight ? "text-cream" : "text-dark"
                  }`}
                  style={{ fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)" }}
                >
                  {t(dayKey)}
                </span>
                <div
                  className={`w-8 h-px mx-auto my-3 ${
                    highlight ? "bg-gold/60" : "bg-gold/30"
                  }`}
                  aria-hidden="true"
                />
                <strong
                  className={`block font-sans text-xs uppercase tracking-[0.18em] font-semibold ${
                    highlight ? "text-gold-light" : "text-dark"
                  }`}
                >
                  {t(titleKey)}
                </strong>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
