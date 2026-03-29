"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { config } from "@/lib/config";
import { getAttendees, Attendee } from "@/lib/sheets";
import { Lock, Download, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const GOLD = "#C9A96E";
const SAGE = "#8B9E77";
const DARK = "#1C1C1C";

export default function AdminPage() {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.admin_password) {
      setIsAuthenticated(true);
      setPasswordError("");
      loadAttendees();
    } else {
      setPasswordError(t("admin.wrongPassword"));
    }
  };

  const loadAttendees = async () => {
    setLoadingAttendees(true);
    const data = await getAttendees();
    setAttendees(data);
    setLoadingAttendees(false);
  };

  const exportCSV = () => {
    const headers = [
      t("admin.colName"),
      t("admin.colAttendees"),
      t("rsvp.companions"),
      t("admin.colDays"),
      t("rsvp.allergies"),
      t("admin.colChildren"),
      t("admin.colChildrenMenu"),
      t("admin.colChildrenMenuCount"),
      t("admin.colHighChair"),
      t("admin.colAccommodation"),
      t("admin.colAccommodationDays"),
      t("admin.colTransport"),
      t("admin.colExtra"),
      t("admin.colDate"),
    ];
    const rows = attendees.map((a) => [
      a.nombre,
      a.total_asistentes,
      a.nombres_acompanantes ?? "",
      a.dias === "viernes_sabado"
        ? t("rsvp.fridaySaturday")
        : t("rsvp.onlySaturday"),
      a.alergias ?? "",
      a.ninos === "si" ? t("rsvp.yes") : t("rsvp.no"),
      a.menu_infantil === "si" ? t("rsvp.yes") : t("rsvp.no"),
      a.ninos === "si" && a.menu_infantil === "si"
        ? (a.num_menus_infantiles ?? 0)
        : 0,
      a.ninos === "si"
        ? a.trona === "si"
          ? t("rsvp.yes")
          : t("rsvp.no")
        : t("rsvp.no"),
      a.alojamiento === "si" ? t("rsvp.yes") : t("rsvp.no"),
      a.alojamiento === "si"
        ? a.alojamiento_dias === "viernes_sabado"
          ? t("rsvp.accommodationFriSat")
          : t("rsvp.accommodationSat")
        : "",
      a.transporte === "si" ? t("rsvp.yes") : t("rsvp.no"),
      a.extra ?? "",
      a.timestamp,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invitados_${config.novios.nombre1}_${config.novios.nombre2}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ── Derived stats ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRespuestas = attendees.length;
    const totalPersonas = attendees.reduce(
      (s, a) => s + (a.total_asistentes || 1),
      0,
    );
    const personasViernes = attendees
      .filter((a) => a.dias === "viernes_sabado")
      .reduce((s, a) => s + (a.total_asistentes || 1), 0);
    const personasSabado = totalPersonas;
    const menuInfantiles = attendees.reduce(
      (s, a) =>
        s +
        (a.ninos === "si" && a.menu_infantil === "si"
          ? a.num_menus_infantiles || 0
          : 0),
      0,
    );
    const tronas = attendees.filter(
      (a) => a.ninos === "si" && a.trona === "si",
    ).length;
    const buscanAlojamiento = attendees.filter(
      (a) => a.alojamiento === "si",
    ).length;
    const sinTransporte = attendees.filter((a) => a.transporte === "no").length;
    return {
      totalRespuestas,
      totalPersonas,
      personasViernes,
      personasSabado,
      menuInfantiles,
      tronas,
      buscanAlojamiento,
      sinTransporte,
    };
  }, [attendees]);

  const slotBarData = useMemo(() => {
    const viernesSabado = attendees
      .filter((a) => a.dias === "viernes_sabado")
      .reduce((s, a) => s + (a.total_asistentes || 1), 0);
    const soloSabado = attendees
      .filter((a) => a.dias === "solo_sabado")
      .reduce((s, a) => s + (a.total_asistentes || 1), 0);
    return [
      { slot: t("rsvp.fridaySaturday"), personas: viernesSabado },
      { slot: t("rsvp.onlySaturday"), personas: soloSabado },
    ];
  }, [attendees, t]);

  const timelineData = useMemo(() => {
    if (attendees.length === 0) return [];
    const sorted = [...attendees].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    let cumulative = 0;
    const byDay: Record<string, number> = {};
    for (const a of sorted) {
      const day = new Date(a.timestamp).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      });
      cumulative += 1;
      byDay[day] = cumulative;
    }
    return Object.entries(byDay).map(([fecha, confirmaciones]) => ({
      fecha,
      confirmaciones,
    }));
  }, [attendees]);

  const logisticsBarData = useMemo(
    () => [
      {
        label: t("rsvp.children"),
        si: attendees.filter((a) => a.ninos === "si").length,
        no: attendees.filter((a) => a.ninos !== "si").length,
      },
      {
        label: t("rsvp.accommodation"),
        si: attendees.filter((a) => a.alojamiento === "si").length,
        no: attendees.filter((a) => a.alojamiento !== "si").length,
      },
      {
        label: t("rsvp.transport"),
        si: attendees.filter((a) => a.transporte === "si").length,
        no: attendees.filter((a) => a.transporte !== "si").length,
      },
    ],
    [attendees, t],
  );

  // ── Login screen ───────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        {/* Back to site link — top left */}
        <Link
          href="/"
          className="fixed top-4 left-4 flex items-center gap-1.5 font-sans text-dark/50 hover:text-dark/80 transition-colors text-xs uppercase tracking-widest"
          aria-label={t("admin.backToSite")}
        >
          <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          {t("admin.backToSite")}
        </Link>

        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <Lock
                className="w-7 h-7 text-gold text-gold-contrast"
                aria-hidden="true"
              />
            </div>
            <h1 className="font-display text-dark text-3xl font-light mb-2">
              {t("admin.backoffice")}
            </h1>
            <p className="text-dark/65 font-sans text-sm">
              {t("admin.privateArea")}
            </p>
          </div>

          <form onSubmit={handleLogin} aria-label={t("admin.login")}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-dark/70 text-xs uppercase tracking-widest font-sans mb-2"
              >
                {t("admin.password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`w-full bg-transparent border-b-2 py-3 font-sans text-dark pr-10 focus:outline-none transition-colors ${
                    passwordError
                      ? "border-red-400"
                      : "border-dark/20 focus:border-gold"
                  }`}
                  required
                  aria-required="true"
                  aria-invalid={!!passwordError}
                  aria-describedby={
                    passwordError ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark transition-colors"
                  aria-label={
                    showPassword
                      ? t("admin.hidePassword")
                      : t("admin.showPassword")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p
                  id="password-error"
                  className="text-red-500 text-sm mt-1 font-sans"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gold text-dark py-3 text-sm uppercase tracking-[0.2em] font-sans font-medium hover:bg-gold/90 transition-all duration-300"
            >
              {t("admin.login")}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Authenticated dashboard ────────────────────────────────────────
  return (
    <main className="min-h-screen bg-cream">
      {/* Admin header */}
      <header className="bg-dark py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Back to site button */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-cream/50 hover:text-cream transition-colors text-xs font-sans uppercase tracking-widest"
              aria-label={t("admin.backToSite")}
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              {t("admin.backToSite")}
            </Link>
            <span className="text-cream/20" aria-hidden="true">
              |
            </span>
            <h1 className="font-display text-cream text-xl font-light">
              {t("admin.backoffice")} — {config.novios.nombre1} &{" "}
              {config.novios.nombre2}
            </h1>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-cream/50 hover:text-cream text-sm font-sans transition-colors"
          >
            {t("admin.logout")}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* ── Chart 2: Stat cards ── */}
        <section aria-labelledby="stats-heading">
          <div className="mb-8">
            <p className="text-gold text-gold-contrast uppercase tracking-[0.3em] text-xs font-sans mb-1">
              {t("admin.stats")}
            </p>
            <h2
              id="stats-heading"
              className="font-display text-dark text-3xl font-light"
            >
              {t("admin.summary")}
            </h2>
          </div>

          {loadingAttendees ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: t("admin.totalResponses"),
                  value: stats.totalRespuestas,
                },
                { label: t("admin.totalPeople"), value: stats.totalPersonas },
                {
                  label: t("admin.peopleFriday"),
                  value: stats.personasViernes,
                },
                {
                  label: t("admin.peopleSaturday"),
                  value: stats.personasSabado,
                },
                {
                  label: t("admin.childrenMenus"),
                  value: stats.menuInfantiles,
                },
                { label: t("admin.highChairs"), value: stats.tronas },
                {
                  label: t("admin.needAccommodation"),
                  value: stats.buscanAlojamiento,
                },
                { label: t("admin.noTransport"), value: stats.sinTransporte },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-warm-white border border-gold/20 rounded-sm px-5 py-6 flex flex-col gap-2"
                >
                  <span className="font-display text-dark text-5xl font-light leading-none">
                    {value}
                  </span>
                  <span className="font-sans text-dark/70 text-xs uppercase tracking-widest leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Chart 1: Bar chart — asistentes por slot ── */}
        <section aria-labelledby="bar-chart-heading">
          <div className="mb-8">
            <p className="text-gold text-gold-contrast uppercase tracking-[0.3em] text-xs font-sans mb-1">
              {t("admin.distribution")}
            </p>
            <h2
              id="bar-chart-heading"
              className="font-display text-dark text-3xl font-light"
            >
              {t("admin.attendeesBySlot")}
            </h2>
          </div>

          {loadingAttendees ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-warm-white border border-gold/20 rounded-sm p-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={slotBarData} barCategoryGap="40%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={`${DARK}10`}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="slot"
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 12,
                      fill: `${DARK}80`,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 12,
                      fill: `${DARK}80`,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: `${GOLD}10` }}
                    contentStyle={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      border: `1px solid ${GOLD}40`,
                      borderRadius: 0,
                      background: "#FFFDF9",
                      color: DARK,
                    }}
                    formatter={(value) => [value, t("admin.persons")]}
                  />
                  <Bar dataKey="personas" radius={[2, 2, 0, 0]} maxBarSize={80}>
                    <Cell fill={GOLD} />
                    <Cell fill={SAGE} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-4 justify-center">
                <span className="flex items-center gap-2 font-sans text-xs text-dark/60">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: GOLD }}
                  />
                  {t("rsvp.fridaySaturday")}
                </span>
                <span className="flex items-center gap-2 font-sans text-xs text-dark/60">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: SAGE }}
                  />
                  {t("rsvp.onlySaturday")}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ── Chart 3: Timeline — confirmaciones acumuladas ── */}
        <section aria-labelledby="timeline-heading">
          <div className="mb-8">
            <p className="text-gold text-gold-contrast uppercase tracking-[0.3em] text-xs font-sans mb-1">
              {t("admin.history")}
            </p>
            <h2
              id="timeline-heading"
              className="font-display text-dark text-3xl font-light"
            >
              {t("admin.timeline")}
            </h2>
          </div>

          {loadingAttendees ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : timelineData.length < 2 ? (
            <p className="text-dark/60 font-sans text-center py-12">
              {t("admin.notEnoughData")}
            </p>
          ) : (
            <div className="bg-warm-white border border-gold/20 rounded-sm p-6">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={timelineData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={`${DARK}10`}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="fecha"
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 11,
                      fill: `${DARK}80`,
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 12,
                      fill: `${DARK}80`,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      border: `1px solid ${GOLD}40`,
                      borderRadius: 0,
                      background: "#FFFDF9",
                      color: DARK,
                    }}
                    formatter={(value) => [
                      value,
                      t("admin.cumulativeConfirmations"),
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="confirmaciones"
                    stroke={SAGE}
                    strokeWidth={2}
                    dot={{ fill: SAGE, r: 3, strokeWidth: 0 }}
                    activeDot={{ fill: GOLD, r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* ── Chart 4: Logistics bar chart ── */}
        <section aria-labelledby="logistics-heading">
          <div className="mb-8">
            <p className="text-gold text-gold-contrast uppercase tracking-[0.3em] text-xs font-sans mb-1">
              {t("admin.logistics")}
            </p>
            <h2
              id="logistics-heading"
              className="font-display text-dark text-3xl font-light"
            >
              {t("admin.logisticsNeeds")}
            </h2>
          </div>

          {loadingAttendees ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : attendees.length === 0 ? (
            <p className="text-dark/40 font-sans text-center py-12">
              {t("admin.noAttendees")}
            </p>
          ) : (
            <div className="bg-warm-white border border-gold/20 rounded-sm p-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={logisticsBarData} barCategoryGap="35%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={`${DARK}10`}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 11,
                      fill: `${DARK}80`,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 12,
                      fill: `${DARK}80`,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: `${GOLD}10` }}
                    contentStyle={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 13,
                      border: `1px solid ${GOLD}40`,
                      borderRadius: 0,
                      background: "#FFFDF9",
                      color: DARK,
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="si"
                    name={t("rsvp.yes")}
                    fill={GOLD}
                    radius={[2, 2, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar
                    dataKey="no"
                    name={t("rsvp.no")}
                    fill={SAGE}
                    radius={[2, 2, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* ── Attendees table ── */}
        <section aria-labelledby="attendees-section">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gold text-gold-contrast uppercase tracking-[0.3em] text-xs font-sans mb-1">
                {t("admin.management")}
              </p>
              <h2
                id="attendees-section"
                className="font-display text-dark text-3xl font-light"
              >
                {t("admin.attendeesList")}
              </h2>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 border border-gold text-gold text-gold-contrast px-4 py-2 text-sm uppercase tracking-widest font-sans hover:bg-gold hover:text-dark transition-all duration-300"
              aria-label={t("admin.exportCSVAria")}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              {t("admin.exportCSV")}
            </button>
          </div>

          {loadingAttendees ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : attendees.length === 0 ? (
            <p className="text-dark/60 font-sans text-center py-12">
              {t("admin.noAttendees")}
            </p>
          ) : (
            <div className="space-y-4">
              {attendees.map((a, i) => {
                const daysLabel =
                  a.dias === "viernes_sabado"
                    ? t("admin.friSat")
                    : t("admin.onlySat");
                const accomLabel =
                  a.alojamiento === "si"
                    ? `${t("rsvp.yes")} — ${a.alojamiento_dias === "viernes_sabado" ? t("rsvp.accommodationFriSat") : t("rsvp.accommodationSat")}`
                    : t("rsvp.no");

                return (
                  <div
                    key={i}
                    className="bg-warm-white border border-gold/20 rounded-sm p-5"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-display italic text-dark text-xl font-light leading-tight truncate">
                          {a.nombre}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 bg-gold/10 text-dark font-sans text-xs px-2.5 py-0.5">
                            {a.total_asistentes}{" "}
                            {t("admin.persons").toLowerCase()}
                          </span>
                          <span className="inline-flex items-center bg-dark/8 text-dark font-sans text-xs px-2.5 py-0.5">
                            {daysLabel}
                          </span>
                        </div>
                      </div>
                      <span className="text-dark/60 text-xs font-sans shrink-0 pt-1">
                        {new Date(a.timestamp).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Detail grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm border-t border-dark/8 pt-4">
                      {a.nombres_acompanantes && (
                        <div className="sm:col-span-2">
                          <span className="font-sans text-dark/55 text-[10px] uppercase tracking-widest block mb-0.5">
                            {t("rsvp.companions")}
                          </span>
                          <span className="font-sans text-dark text-sm">
                            {a.nombres_acompanantes}
                          </span>
                        </div>
                      )}

                      {a.alergias && (
                        <div className="sm:col-span-2">
                          <span className="font-sans text-dark/55 text-[10px] uppercase tracking-widest block mb-0.5">
                            {t("rsvp.allergies")}
                          </span>
                          <span className="font-sans text-dark text-sm">
                            {a.alergias}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="font-sans text-dark/55 text-[10px] uppercase tracking-widest block mb-0.5">
                          {t("admin.colChildren")}
                        </span>
                        <span className="font-sans text-dark text-sm">
                          {a.ninos === "si"
                            ? `${t("rsvp.yes")}${a.menu_infantil === "si" ? ` — ${t("admin.colChildrenMenu")}: ${a.num_menus_infantiles ?? 1}` : ""}`
                            : t("rsvp.no")}
                        </span>
                      </div>

                      {a.ninos === "si" && (
                        <div>
                          <span className="font-sans text-dark/55 text-[10px] uppercase tracking-widest block mb-0.5">
                            {t("admin.colHighChair")}
                          </span>
                          <span className="font-sans text-dark text-sm">
                            {a.trona === "si" ? t("rsvp.yes") : t("rsvp.no")}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="font-sans text-dark/55 text-[10px] uppercase tracking-widest block mb-0.5">
                          {t("admin.colAccommodation")}
                        </span>
                        <span className="font-sans text-dark text-sm">
                          {accomLabel}
                        </span>
                      </div>

                      <div>
                        <span className="font-sans text-dark/55 text-[10px] uppercase tracking-widest block mb-0.5">
                          {t("admin.colTransport")}
                        </span>
                        <span className="font-sans text-dark text-sm">
                          {a.transporte === "si" ? t("rsvp.yes") : t("rsvp.no")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-dark/60 text-sm font-sans">
            {t("admin.total")}:{" "}
            <strong className="text-dark">
              {attendees.reduce((sum, a) => sum + (a.total_asistentes || 1), 0)}
            </strong>{" "}
            {t("admin.people")}
          </div>
        </section>
      </div>
    </main>
  );
}
