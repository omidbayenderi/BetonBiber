/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Check, Cookie, Settings2, X } from 'lucide-react';

const STORAGE_KEY = 'betonbiber_cookie_consent_v1';

interface CookiePrefs {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

const defaultPrefs: CookiePrefs = {
  necessary: true,
  analytics: false,
  marketing: false
};

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(defaultPrefs);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsOpen(true);
      } else {
        setPrefs({ ...defaultPrefs, ...JSON.parse(stored), necessary: true });
      }
    } catch {
      setIsOpen(true);
    }

    const openSettings = () => {
      setShowSettings(true);
      setIsOpen(true);
    };
    window.addEventListener('betonbiber_cookie_settings_open', openSettings);
    return () => window.removeEventListener('betonbiber_cookie_settings_open', openSettings);
  }, []);

  const save = (nextPrefs: CookiePrefs) => {
    const normalized = { ...nextPrefs, necessary: true };
    setPrefs(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    setIsOpen(false);
    setShowSettings(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-4 md:p-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-[0_24px_90px_rgba(8,22,37,0.22)]">
        <div className="grid gap-0 md:grid-cols-[1fr_320px]">
          <div className="p-5 md:p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-navy text-brand-orange">
                <Cookie size={21} />
              </div>
              <div>
                <h2 className="font-display text-lg font-black uppercase tracking-tight text-primary-navy">
                  Cookie-Einstellungen
                </h2>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">DSGVO / TDDDG transparent</p>
              </div>
            </div>
            <p className="font-sans text-sm leading-7 text-slate-600">
              Wir nutzen notwendige Speicherungen für den Betrieb der Website, z.B. Admin-Sitzung, Formularverlauf und Ihre Cookie-Auswahl.
              Optionale Analyse- oder Marketing-Cookies werden nur nach Ihrer Einwilligung aktiviert.
            </p>

            {showSettings && (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <CookieToggle
                  title="Notwendig"
                  description="Für Grundfunktionen erforderlich."
                  checked
                  disabled
                  onChange={() => undefined}
                />
                <CookieToggle
                  title="Analyse"
                  description="Statistik und Nutzungsmessung."
                  checked={prefs.analytics}
                  onChange={(checked) => setPrefs(prev => ({ ...prev, analytics: checked }))}
                />
                <CookieToggle
                  title="Marketing"
                  description="Personalisierte Inhalte und Kampagnen."
                  checked={prefs.marketing}
                  onChange={(checked) => setPrefs(prev => ({ ...prev, marketing: checked }))}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-2 border-t border-slate-200 bg-slate-50 p-5 md:border-l md:border-t-0">
            <button
              onClick={() => save({ necessary: true, analytics: true, marketing: true })}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-orange px-4 font-display text-xs font-black uppercase text-white transition hover:bg-brand-orange-dark"
            >
              <Check size={15} />
              Alle akzeptieren
            </button>
            <button
              onClick={() => save(defaultPrefs)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary-navy px-4 font-display text-xs font-black uppercase text-white transition hover:bg-slate-950"
            >
              <X size={15} />
              Nur notwendige
            </button>
            <button
              onClick={() => showSettings ? save(prefs) : setShowSettings(true)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 font-display text-xs font-black uppercase text-slate-700 transition hover:bg-slate-100"
            >
              <Settings2 size={15} />
              {showSettings ? 'Auswahl speichern' : 'Einstellungen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieToggle({
  title,
  description,
  checked,
  disabled,
  onChange
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={`rounded-2xl border p-4 ${disabled ? 'bg-slate-50 border-slate-200' : 'cursor-pointer bg-white border-slate-200 hover:border-brand-orange/40'}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-xs font-black uppercase tracking-wider text-primary-navy">{title}</span>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 accent-brand-orange"
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </label>
  );
}
