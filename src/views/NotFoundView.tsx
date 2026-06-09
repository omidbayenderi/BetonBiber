/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Compass, Home, Mail } from 'lucide-react';
import { PageId } from '../types';

interface NotFoundViewProps {
  navigateTo: (page: PageId) => void;
}

export default function NotFoundView({ navigateTo }: NotFoundViewProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#07111f] px-6 py-20 text-white md:py-28" id="not-found-view">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(252,143,52,0.26),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.16),transparent_30%),linear-gradient(135deg,#07111f_0%,#0f172a_52%,#111827_100%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-orange-100 backdrop-blur">
            <Compass size={14} className="text-brand-orange" />
            Fehler 404
          </div>
          <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
            Diese Seite wurde nicht gefunden.
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-8 text-slate-300">
            Der Link ist möglicherweise veraltet oder die Adresse wurde falsch eingegeben. Unsere wichtigsten Bereiche sind weiterhin direkt erreichbar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="flex min-h-12 items-center gap-2 rounded-2xl bg-brand-orange px-5 font-display text-xs font-black uppercase text-white transition hover:bg-brand-orange-dark"
            >
              <Home size={15} />
              Startseite
            </button>
            <button
              onClick={() => navigateTo('leistungen')}
              className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 font-display text-xs font-black uppercase text-white transition hover:bg-white/15"
            >
              Leistungen
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigateTo('kontakt')}
              className="flex min-h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 font-display text-xs font-black uppercase text-white transition hover:bg-white/15"
            >
              <Mail size={15} />
              Kontakt
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <p className="font-display text-8xl font-black tracking-tight text-brand-orange">404</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            BetonBiber findet normalerweise jede Risslinie. Diese URL war leider keine davon.
          </p>
        </div>
      </div>
    </section>
  );
}
