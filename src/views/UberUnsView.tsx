/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TEAM, TESTIMONIALS } from '../constants';
import { ShieldCheck, Star, Users, HardHat, Building, ThumbsUp } from 'lucide-react';
import { getPricingConfig } from '../lib/pricingState';

export default function UberUnsView() {
  const [pricingConfig, setPricingConfig] = useState(() => getPricingConfig());

  useEffect(() => {
    const handleUpdated = () => {
      setPricingConfig(getPricingConfig());
    };
    window.addEventListener('pricing_config_updated', handleUpdated);
    return () => {
      window.removeEventListener('pricing_config_updated', handleUpdated);
    };
  }, []);

  const teamList = pricingConfig.team || TEAM;

  return (
    <div className="bg-white py-16 md:py-24 px-6 flex flex-col items-center" id="uberuns-view-wrapper">
      <div className="max-w-[1240px] w-full flex flex-col gap-16">
        
        {/* Core Description Introduction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="self-start text-xs font-sans font-extrabold text-brand-orange bg-brand-orange/15 px-3 py-1 rounded">
              WIR STELLEN UNS VOR
            </span>
            <h1 className="font-display font-black text-3xl md:text-4xl text-primary-navy uppercase tracking-tight">
              Über den Meisterbetrieb Betonbiber
            </h1>
            <p className="font-sans text-sm md:text-base text-brand-text-muted leading-relaxed">
              Seit unserer Gründung verpflichten wir uns erstklassiger Qualität bei der Instandsetzung von geschädigtem Beton, Kellern und Fundamenten. Betonbiber steht für fundiertes theoretisches und praktisches Know-how des Instandsetzungsingenieurwesens.
            </p>
            <p className="font-sans text-sm text-brand-text-muted leading-relaxed">
              Jedes Schadensbild hat eine eigene Geschichte. Uns geht es nicht darum, Symptome Kosmetisch zu übertünchen. Wir erarbeiten solide, mathematisch fundierte Abdichtungen und Riss-Sanierungen zur nachhaltig dichten Integrität Ihres Familienbesitzes oder Ihres Industrieobjekts.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="border border-gray-200 p-4 rounded bg-brand-bg/30">
                <span className="font-display font-black text-xl text-brand-orange-dark">15+</span>
                <p className="font-sans text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-1">Jahre Expertise</p>
              </div>
              <div className="border border-gray-200 p-4 rounded bg-brand-bg/30">
                <span className="font-display font-black text-xl text-brand-orange-dark">4.9 / 5</span>
                <p className="font-sans text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-1">Kundenbewertung</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-navy text-white p-8 md:p-10 rounded-xl border-4 border-primary-navy flex flex-col gap-6 relative overflow-hidden">
            <span className="text-xs font-sans text-brand-orange font-bold uppercase tracking-widest">
              UNSER LEITBILD
            </span>
            <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight leading-snug">
              Zertifizierte Sicherheit durch anerkannte Innovation
            </h3>
            
            <div className="flex flex-col gap-4 font-sans text-xs text-gray-300">
              <div className="flex gap-3 items-start">
                <span className="text-brand-orange font-bold text-base">●</span>
                <p><strong>Systemverträgliche Werkstoffe:</strong> Wir mischen niemals Werkstoffe unterschiedlicher Hersteller an einer Schadstelle.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-brand-orange font-bold text-base">●</span>
                <p><strong>Detaillierter Schadensatlas:</strong> Vorbehandlungsgutachten zur Ermittlung des Ist-Zustandes der Baustoffe.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-brand-orange font-bold text-base">●</span>
                <p><strong>Festpreis-Verrsprechen:</strong> Verbindliche Preiszusagen für maximale Investitionssicherheit.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members List (4 members matching constants) */}
        <div className="flex flex-col gap-8">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            <h2 className="font-display font-black text-2xl uppercase text-primary-navy tracking-tight">
              Unsere Bautenschutz-Spezialisten
            </h2>
            <p className="font-sans text-xs text-brand-orange-dark font-extrabold uppercase tracking-widest">
              Kompetente Profis mit Leidenschaft für Baustoffkunde
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="team-members-list">
            {teamList.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-brand-bg/50 border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all group"
              >
                <img 
                  src={member.avatarUrl} 
                  alt={member.photoAlt} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-navy shadow group-hover:scale-105 transition-transform duration-200 mb-4"
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-display font-black text-sm text-primary-navy leading-none">
                  {member.name}
                </h4>
                <span className="font-sans font-extrabold text-xs text-brand-orange-dark uppercase tracking-wider mt-1.5 bg-brand-orange/10 px-2 py-0.5 rounded">
                  {member.role}
                </span>
                <p className="font-sans text-xs text-brand-text-muted leading-relaxed mt-3">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Panel / Client feedbacks with Stars */}
        <div className="flex flex-col gap-8 bg-brand-bg rounded-xl border border-gray-200 p-8 md:p-12">
          <div className="flex justify-between items-end flex-wrap gap-4 border-b border-gray-200 pb-4">
            <div>
              <h2 className="font-display font-black text-xl uppercase text-primary-navy tracking-tight">
                Was unsere Kunden über uns sagen
              </h2>
              <p className="font-sans text-xs text-brand-orange-dark font-bold uppercase tracking-widest mt-0.5">
                Stimmen zufriedener Hausbesitzer und gewerblicher Bauleiter
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded text-xs select-none shadow-sm">
              <ThumbsUp size={14} className="text-brand-orange-dark" />
              <span className="font-sans font-bold text-primary-navy">100% Weiterempfehlung</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="testimonials-grid-panel">
            {TESTIMONIALS.map((test, i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 rounded-lg flex flex-col justify-between shadow-sm relative">
                <div>
                  {/* Stars Rating */}
                  <div className="flex gap-1 text-amber-500 mb-3">
                    {Array.from({ length: test.stars }).map((_, sIdx) => (
                      <Star key={sIdx} size={14} className="fill-current" />
                    ))}
                  </div>
                  <p className="font-sans text-xs italic text-brand-text-muted leading-relaxed mb-4">
                    "{test.text}"
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex flex-col">
                  <span className="font-display font-bold text-xs text-primary-navy">
                    {test.name}
                  </span>
                  <span className="font-sans text-xs text-gray-400 font-semibold mt-0.5">
                    {test.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
