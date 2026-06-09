/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SERVICES, CONCRETE_ARCH_URL } from '../constants';
import { PageId, ServiceDetail } from '../types';
import { Info, HelpCircle, ArrowRight, ShieldCheck, HeartPulse, Hammer, Droplets, ZoomIn, X } from 'lucide-react';

interface LeistungenViewProps {
  navigateTo: (page: PageId) => void;
  onSelectServiceForContact: (serviceName: string) => void;
}

export default function LeistungenView({ navigateTo, onSelectServiceForContact }: LeistungenViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'keller' | 'beton' | 'schimmel'>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceDetail | null>(null);

  const getFilteredServices = () => {
    switch (selectedFilter) {
      case 'keller':
        return SERVICES.filter(s => s.id === 'kellerabdichtung');
      case 'beton':
        return SERVICES.filter(s => s.id === 'betonsanierung' || s.id === 'riss_sanierung');
      case 'schimmel':
        return SERVICES.filter(s => s.id === 'schimmelbeseitigung');
      default:
        return SERVICES;
    }
  };

  const serviceIconMap = (icon: string) => {
    switch (icon) {
      case 'foundation':
        return <Droplets className="text-brand-orange-dark" size={24} />;
      case 'architecture':
        return <Hammer className="text-brand-orange-dark" size={24} />;
      case 'precision_manufacturing':
        return <ShieldCheck className="text-brand-orange-dark" size={24} />;
      default:
        return <HeartPulse className="text-brand-orange-dark" size={24} />;
    }
  };

  const handleInquiryAction = (service: ServiceDetail) => {
    onSelectServiceForContact(service.title);
    setActiveModalService(null);
    navigateTo('kontakt');
  };

  return (
    <div className="bg-brand-bg py-16 md:py-24 px-6 flex flex-col items-center" id="leistungen-view-wrapper">
      <div className="max-w-[1240px] w-full flex flex-col gap-12">
        
        {/* Header Metadata */}
        <div className="flex flex-col gap-3">
          <span className="self-start text-xs font-sans font-extrabold text-brand-orange bg-brand-orange/15 px-3 py-1 rounded">
            UNSER SERVICE-PORTFOLIO
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl text-primary-navy uppercase tracking-tight max-w-xl">
            Wirksame Bauwerkserhaltung
          </h1>
          <p className="font-sans text-sm text-brand-text-muted leading-relaxed max-w-lg">
            Wir sanieren Schäden im Tief- und Hochbau mit zertifizierter Fachkenntnis. Entdecken Sie unsere Kernarbeitsfelder.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-gray-200 pb-6" id="services-filter-bar">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`font-sans font-bold text-xs uppercase px-5 py-2.5 rounded transition-all ${
              selectedFilter === 'all'
                ? 'bg-primary-navy text-white shadow'
                : 'bg-white text-primary-navy border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Alle Leistungen
          </button>
          <button
            onClick={() => setSelectedFilter('keller')}
            className={`font-sans font-bold text-xs uppercase px-5 py-2.5 rounded transition-all ${
              selectedFilter === 'keller'
                ? 'bg-primary-navy text-white shadow'
                : 'bg-white text-primary-navy border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Kellerabdichtung
          </button>
          <button
            onClick={() => setSelectedFilter('beton')}
            className={`font-sans font-bold text-xs uppercase px-5 py-2.5 rounded transition-all ${
              selectedFilter === 'beton'
                ? 'bg-primary-navy text-white shadow'
                : 'bg-white text-primary-navy border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Betonsanierung & Injektion
          </button>
          <button
            onClick={() => setSelectedFilter('schimmel')}
            className={`font-sans font-bold text-xs uppercase px-5 py-2.5 rounded transition-all ${
              selectedFilter === 'schimmel'
                ? 'bg-primary-navy text-white shadow'
                : 'bg-white text-primary-navy border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Schimmelbeseitigung
          </button>
        </div>

        {/* Services Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="services-grid-list">
          {getFilteredServices().map((service) => (
            <div 
              key={service.id} 
              className="bg-white border-2 border-primary-navy rounded-xl overflow-hidden hover:scale-[1.01] transition-all flex flex-col justify-between shadow-sm"
              id={`service-card-${service.id}`}
            >
              
              <div>
                {/* Hero preview image inside card */}
                <div className="h-52 w-full relative overflow-hidden bg-primary-navy border-b border-primary-navy">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  {service.tag && (
                    <span className="absolute top-4 left-4 bg-brand-orange text-white font-display font-black text-xs uppercase px-2.5 py-1 rounded">
                      {service.tag}
                    </span>
                  )}
                  <button 
                    onClick={() => setActiveModalService(service)}
                    className="absolute bottom-4 right-4 bg-primary-navy/80 hover:bg-brand-orange text-white p-2 rounded-full transition-colors"
                    title="Details vergrößern"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                {/* Card Info Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-brand-orange/10 p-2 rounded">
                      {serviceIconMap(service.iconName)}
                    </div>
                    <h3 className="font-display font-black text-xl text-primary-navy uppercase tracking-tight">
                      {service.title}
                    </h3>
                  </div>
                  <p className="font-sans text-brand-text-muted text-sm leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex gap-4">
                <button
                  onClick={() => setActiveModalService(service)}
                  className="flex-1 border border-primary-navy text-primary-navy font-sans font-bold text-xs px-4 py-3 rounded hover:bg-brand-bg transition-all text-center flex items-center justify-center gap-1"
                >
                  <Info size={14} />
                  <span>Details ansehen</span>
                </button>
                <button
                  onClick={() => handleInquiryAction(service)}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-sans font-bold text-xs px-4 py-3 rounded transition-all text-center"
                >
                  Angebot anfordern
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* EXTRA SERVICE DETAILS: REAL INDUSTRIAL ARCH FOCUS */}
        <div className="bg-primary-navy text-white rounded-xl overflow-hidden border-2 border-primary-navy grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-12 shadow-md">
          <div className="h-64 lg:h-full min-h-[250px] relative">
            <img 
              src={CONCRETE_ARCH_URL} 
              alt="Architektonische Betonsanierung" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-navy to-transparent opacity-40" />
          </div>
          <div className="p-8 md:p-12 flex flex-col gap-4">
            <span className="text-xs font-sans text-brand-orange font-bold uppercase tracking-wider">
              ZUSÄTZLICHER INGENIEUR-SUPPORT
            </span>
            <h3 className="font-display font-black text-2xl uppercase text-white tracking-tight">
              Schadensanalysen & Sachverständigengutachten
            </h3>
            <p className="font-sans text-xs text-gray-300 leading-relaxed">
              Feuchtigkeitsursachen im Mauerwerk sind oft komplexer als sie scheinen. Wir belassen es nicht beim bloßen Symptomkurieren: Unsere erfahrenen Sachverständigen führen professionelle Kernbohrungen, CM-Messerfassungen und digitale Thermografien durch.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <button 
                onClick={() => navigateTo('kontakt')}
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-black text-xs uppercase px-5 py-3 rounded flex items-center gap-1.5 transition-colors"
              >
                <span>Spezialgutachten anfordern</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* DETAIL MODAL FOR EXTRA FUNCTIONALITY */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="service-detail-modal-backdrop">
          <div className="absolute inset-0 bg-primary-navy/70" onClick={() => setActiveModalService(null)} />
          
          <div className="relative bg-white border-4 border-primary-navy w-full max-w-[650px] p-6 md:p-8 rounded-lg shadow-2xl z-10 animate-scaleUp overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary-navy p-1"
              id="close-modal-btn"
            >
              <X size={24} />
            </button>

            {/* Header info in modal */}
            <div className="flex gap-4 items-start mb-6 border-b border-gray-100 pb-4">
              <div className="bg-brand-orange/10 p-2.5 rounded text-brand-orange-dark">
                {serviceIconMap(activeModalService.iconName)}
              </div>
              <div>
                <span className="text-xs font-sans text-brand-orange-dark font-extrabold uppercase tracking-widest">
                  DEUTSCHE INGENIEURSMETHODIK
                </span>
                <h3 className="font-display font-black text-2xl text-primary-navy uppercase tracking-tight">
                  {activeModalService.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col gap-6 font-sans text-sm text-brand-text-muted leading-relaxed">
              <p className="text-primary-navy font-semibold italic text-base bg-brand-bg px-4 py-3 rounded-lg">
                "{activeModalService.shortDesc}"
              </p>
              
              <p>{activeModalService.longDesc}</p>

              <div className="bg-brand-bg p-4 rounded-lg border border-gray-200">
                <h4 className="font-display font-bold text-xs text-primary-navy uppercase tracking-wider mb-3">
                  Ihre technischen Systemvorteile:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalService.features.map((feat, index) => (
                    <li key={index} className="flex gap-2 items-start text-xs font-medium">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 text-xs text-gray-400 border-t border-gray-100 pt-4 items-center">
                <Info size={14} className="text-brand-orange" />
                <span>Ausführung konform mit der Richtlinie für Planung und Abdichtung von erdberührten Bauteilen.</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setActiveModalService(null)}
                className="flex-1 border border-gray-300 font-sans font-bold text-xs py-3.5 rounded hover:bg-gray-50 transition-all text-center"
              >
                Schließen
              </button>
              <button
                onClick={() => handleInquiryAction(activeModalService)}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-black text-xs uppercase py-3.5 rounded transition-all text-center"
              >
                Beratungsgespräch anfordern
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
