/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, LockKeyhole, Sparkles, AlertCircle } from 'lucide-react';
import { ComingSoonConfig } from '../types';
import { ContactConfig } from '../lib/pricingState';
import { BRAND_LOGO_URL } from '../constants';

interface ComingSoonViewProps {
  config?: ComingSoonConfig;
  contact?: ContactConfig;
  onNavigateToAdmin?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(targetDateStr: string): TimeRemaining {
  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const difference = target - now;

  if (isNaN(target) || difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function ComingSoonView({
  config,
  contact,
  onNavigateToAdmin
}: ComingSoonViewProps) {
  const targetDate = config?.targetDate || '2026-11-01T09:00:00';
  const showCountdown = config?.showCountdown ?? true;
  const title = config?.title || 'Hier entsteht die neue Internetpräsenz von BetonBiber';
  const subtitle = config?.subtitle || 'Wir überarbeiten unseren Webauftritt grundlegend, um Ihnen bald noch präzisere Schadensanalysen, direkte Online-Kalkulationen und modernste Bautenschutz-Lösungen bieten zu können.';

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    if (!showCountdown) return;

    setTimeLeft(calculateTimeRemaining(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, showCountdown]);

  const phoneDisplay = contact?.phone || '+49 (0) 800 555 6677';
  const phoneHref = `tel:${(contact?.phoneRaw || phoneDisplay).replace(/\s+/g, '')}`;
  const emailDisplay = contact?.email || 'anfrage@betonbiber.de';
  const emailHref = `mailto:${emailDisplay}`;
  const addressLine = [contact?.streetAddress, contact?.postalCity].filter(Boolean).join(', ') || 'Am Biberdamm 12, 10115 Berlin';

  const countdownUnits = useMemo(() => [
    { label: 'Tage', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'Stunden', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Minuten', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Sekunden', value: String(timeLeft.seconds).padStart(2, '0') }
  ], [timeLeft]);

  return (
    <section className="relative isolate min-h-screen flex flex-col justify-between overflow-hidden bg-[#07111f] text-white selection:bg-brand-orange selection:text-white" id="coming-soon-layout">
      {/* Background Gradients & Accents */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(252,143,52,0.22),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.18),transparent_30%),linear-gradient(135deg,#07111f_0%,#0c1829_50%,#09121f_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Top Header / Logo Bar */}
      <header className="w-full px-6 py-8 max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <img 
            src={BRAND_LOGO_URL} 
            alt="BetonBiber Logo" 
            className="h-12 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-slate-300 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
          </span>
          Wartungsmodus
        </div>
      </header>

      {/* Main Center Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto z-10">
        
        {/* Eyebrow Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-orange-200 backdrop-blur-md shadow-lg shadow-black/20">
          <Sparkles size={14} className="text-brand-orange" />
          <span>Wir bauen für Sie um</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[1.1] max-w-3xl drop-shadow-md">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-slate-300">
          {subtitle}
        </p>

        {/* Live Countdown Display */}
        {showCountdown && (
          <div className="mt-12 w-full max-w-2xl">
            {timeLeft.isExpired ? (
              <div className="rounded-2xl border border-brand-orange/30 bg-white/5 p-6 backdrop-blur-lg">
                <p className="font-display text-xl font-bold uppercase tracking-wider text-brand-orange">
                  Die Arbeiten stehen kurz vor dem Abschluss
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Unser Portal wird in Kürze wieder freigeschaltet. Bitte haben Sie noch einen kleinen Moment Geduld.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {countdownUnits.map((unit) => (
                  <div 
                    key={unit.label} 
                    className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-brand-orange/40 hover:bg-white/[0.10]"
                  >
                    <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-brand-orange/10 blur-xl pointer-events-none" />
                    <div className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-sm">
                      {unit.value}
                    </div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Contact Card */}
        <div className="mt-14 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/[0.05] p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Dringende Anfragen & Notfälle
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-black text-white">
                Wir sind weiterhin persönlich für Sie erreichbar
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Unser Team steht Ihnen für Schadensfälle und Bautenschutz-Beratungen zur Verfügung.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a 
                href={phoneHref} 
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-orange px-5 font-display text-xs font-black uppercase text-white shadow-lg shadow-brand-orange/20 transition hover:bg-brand-orange-dark active:scale-[0.98]"
              >
                <Phone size={15} />
                <span>Jetzt anrufen</span>
              </a>
              <a 
                href={emailHref} 
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 font-display text-xs font-black uppercase text-white transition hover:bg-white/15 active:scale-[0.98]"
              >
                <Mail size={15} />
                <span>E-Mail senden</span>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Telefon</p>
                <a href={phoneHref} className="font-semibold text-white hover:text-brand-orange transition">
                  {phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">E-Mail</p>
                <a href={emailHref} className="font-semibold text-white hover:text-brand-orange transition break-all">
                  {emailDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-orange">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Standort</p>
                <p className="font-semibold text-white">
                  {addressLine}
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Footer / Admin Access */}
      <footer className="w-full px-6 py-6 max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-500 z-10 border-t border-white/5">
        <div>
          &copy; {new Date().getFullYear()} {contact?.companyName || 'Betonbiber Bautenschutz'}. Alle Rechte vorbehalten.
        </div>
        {onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition py-1 px-2 rounded hover:bg-white/5"
            title="Admin-Bereich öffnen"
            aria-label="Admin-Bereich"
          >
            <LockKeyhole size={13} />
            <span className="hidden sm:inline">Admin-Login</span>
          </button>
        )}
      </footer>
    </section>
  );
}
