/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShieldAlert, Award, FileSpreadsheet, HardHat, Phone, ArrowUpRight, Sparkles } from 'lucide-react';
import { PageId } from '../types';
import { TEAM } from '../constants';
import EstimateCalculator from '../components/EstimateCalculator';
import { getPricingConfig, HomepageContent, DEFAULT_PRICING_CONFIG } from '../lib/pricingState';

interface HomeViewProps {
  navigateTo: (page: PageId) => void;
  openEstimator: () => void;
  onExportToContact: (params: {
    serviceType: string;
    areaSize: number;
    estimatedCost: number;
    message: string;
  }) => void;
}

export default function HomeView({ navigateTo, openEstimator, onExportToContact }: HomeViewProps) {
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
  const hp: HomepageContent = pricingConfig.homepage || DEFAULT_PRICING_CONFIG.homepage!;
  return (
    <div className="flex flex-col w-full" id="home-view-wrapper">
      
      {/* 1. HERO SECTION WITH IMAGE ASSET */}
      <section 
        className="relative bg-primary-navy text-white py-24 md:py-32 px-6 overflow-hidden flex items-center" 
        id="home-hero-section"
      >
        {/* Real asset background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={hp.heroImageUrl}
            alt="Betonbiber Bautenschutz Baustelle"
            className="w-full h-full object-cover opacity-25 filter grayscale-[10%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-navy via-primary-navy/90 to-transparent" />
        </div>

        <div className="max-w-[1240px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <span className="self-start bg-brand-orange/10 text-brand-orange font-sans font-bold text-xs uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-brand-orange/20 backdrop-blur-sm">
              <Sparkles size={12} />
              <span>{hp.heroBadge}</span>
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[64px] text-white tracking-tight leading-[1.08]">
              {hp.heroTitle.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
              <span className="text-brand-orange">{hp.heroHighlight}</span>
            </h1>
            <p className="font-sans text-base md:text-lg text-gray-300 max-w-xl leading-relaxed">
              {hp.heroDescription}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <button
                onClick={() => navigateTo('kontakt')}
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-black text-xs uppercase px-8 py-4 rounded shadow-md hover:-translate-y-[1px] transition-all flex items-center gap-2"
                id="hero-primary-cta"
              >
                <span>Anfrage Senden</span>
                <Phone size={14} />
              </button>
              <button
                onClick={() => navigateTo('leistungen')}
                className="border-2 border-white hover:border-brand-orange hover:text-brand-orange text-white font-display font-bold text-xs uppercase px-8 py-4 rounded transition-all"
                id="hero-secondary-cta"
              >
                Unsere Leistungen entdecken
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded text-left">
              <p className="font-display font-black text-3xl text-brand-orange leading-none">{hp.stat1.value}</p>
              <p className="font-sans text-xs text-gray-400 mt-2 uppercase font-semibold">{hp.stat1.label}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded text-left">
              <p className="font-display font-black text-3xl text-brand-orange leading-none">{hp.stat2.value}</p>
              <p className="font-sans text-xs text-gray-400 mt-2 uppercase font-semibold">{hp.stat2.label}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded text-left col-span-2">
              <p className="font-display font-black text-2xl text-emerald-400 leading-none">{hp.stat3.value}</p>
              <p className="font-sans text-xs text-gray-300 mt-2">{hp.stat3.label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE DYNAMIC CALCULATOR COMPONENT */}
      <section className="bg-brand-bg py-16 md:py-20 px-6" id="home-estimator-section">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 flex flex-col items-center gap-3">
            <h2 className="font-display font-black text-2xl md:text-3xl text-primary-navy uppercase tracking-tight">
              Preistransparenz Vorab
            </h2>
            <p className="font-sans text-xs text-brand-orange-dark font-extrabold uppercase tracking-wide">
              Schätzen Sie Ihre Instandsetzungs-Kosten mit wenigen Klicks
            </p>
            <p className="font-sans text-sm text-brand-text-muted">
              Wir hassen versteckte Gebühren. Wählen Sie unten Ihre Problemzone und ermitteln Sie sofort einen fairen Richtpreis zur Instandsetzung.
            </p>
          </div>

          <EstimateCalculator onExportToContact={onExportToContact} />
        </div>
      </section>

      {/* 3. CORE CORE COMPETENCES/VALUE PROPOSITIONS */}
      <section className="bg-white py-16 md:py-24 px-6 border-b border-gray-100" id="home-competences-section">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-6">
            <span className="self-start text-xs font-sans font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded">
              WARUM BETONBIBER?
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-primary-navy uppercase tracking-tight leading-tight">
              {hp.featureTitle}
            </h2>
            <p className="font-sans text-sm md:text-base text-brand-text-muted leading-relaxed">
              {hp.featureDescription}
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex gap-4 items-start">
                <div className="text-brand-orange mt-0.5 shrink-0">
                  <Award size={22} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-primary-navy">{hp.feature1.title}</h4>
                  <p className="font-sans text-sm text-brand-text-muted mt-1">{hp.feature1.description}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-brand-orange mt-0.5 shrink-0">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-primary-navy">{hp.feature2.title}</h4>
                  <p className="font-sans text-sm text-brand-text-muted mt-1">{hp.feature2.description}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="text-brand-orange mt-0.5 shrink-0">
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-primary-navy">{hp.feature3.title}</h4>
                  <p className="font-sans text-sm text-brand-text-muted mt-1">{hp.feature3.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expert team teaser grid */}
          <div className="bg-brand-bg rounded-xl border-4 border-primary-navy p-8 relative flex flex-col justify-between">
            <div>
              <h3 className="font-display font-black text-xl text-primary-navy uppercase mb-2">Unser Expertenteam steht bereit</h3>
              <p className="font-sans text-xs text-brand-text-muted mb-8 italic">
                Erstklassige Ingenieurleistungen auf Augenhöhe mit unseren Kunden.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {teamList.slice(0, 2).map((member, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-gray-250">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.photoAlt} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-navy mb-3"
                      referrerPolicy="no-referrer"
                    />
                    <h5 className="font-display font-bold text-xs text-primary-navy truncate">{member.name}</h5>
                    <p className="font-sans text-xs text-brand-orange-dark font-bold uppercase tracking-wider">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-sans text-xs text-brand-text-muted font-bold flex items-center gap-1">
                <HardHat size={14} className="text-brand-orange" />
                <span>Wohnbau & Industrie</span>
              </span>
              <button
                onClick={() => navigateTo('uber_uns')}
                className="font-display font-bold text-xs text-brand-orange-dark hover:text-brand-orange flex items-center gap-1.5 transition-colors uppercase tracking-wider"
              >
                <span>Über Uns</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
