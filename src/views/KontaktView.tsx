/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Phone, Mail, MapPin, Send, ShieldAlert, Award, RefreshCw } from 'lucide-react';
import { QuoteRequest } from '../types';
import { MINIMAP_URL } from '../constants';
import QuoteRequestList from '../components/QuoteRequestList';
import { getPricingConfig } from '../lib/pricingState';
import { hasAnyText, hasText } from '../lib/contentVisibility';

interface KontaktProps {
  requests: QuoteRequest[];
  onAddRequest: (req: QuoteRequest) => void;
  onDeleteRequest: (id: string) => void;
  onClearAll: () => void;
  exportParams: {
    serviceType: string;
    areaSize: number;
    estimatedCost: number;
    message: string;
  } | null;
  clearExportParams: () => void;
  triggerSuccess: (title: string, msg: string) => void;
}

export default function KontaktView({
  requests,
  onAddRequest,
  onDeleteRequest,
  onClearAll,
  exportParams,
  clearExportParams,
  triggerSuccess
}: KontaktProps) {
  const [pricingConfig, setPricingConfig] = useState(() => getPricingConfig());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Kellerabdichtung',
    areaSize: '',
    message: ''
  });
  const formRef = useRef<HTMLFormElement>(null);

  const [mapType, setMapType] = useState<'standard' | 'sat'>('standard');
  const [mapZoom, setMapZoom] = useState<number>(14);
  const contact = pricingConfig.contact;
  const hasContactIntro = !contact?.hideContactIntro;
  const hasPhone = hasAnyText(contact?.phone, contact?.phoneRaw);
  const hasEmail = hasText(contact?.email);
  const hasAddress = hasAnyText(contact?.streetAddress, contact?.postalCity);
  const hasContactDetails = !contact?.hideContactDetails && (hasPhone || hasEmail || hasAddress);
  const hasContactMap = !contact?.hideContactMap;
  const hasContactAside = hasContactDetails || hasContactMap;
  const serviceOptions = useMemo(
    () => pricingConfig.services.map(service => service.name).filter(hasText),
    [pricingConfig.services]
  );

  // Listen to config updates from admin panel page
  useEffect(() => {
    const handleUpdated = () => {
      setPricingConfig(getPricingConfig());
    };
    window.addEventListener('pricing_config_updated', handleUpdated);
    return () => {
      window.removeEventListener('pricing_config_updated', handleUpdated);
    };
  }, []);

  useEffect(() => {
    if (serviceOptions.length > 0 && !serviceOptions.includes(formData.serviceType)) {
      setFormData(prev => ({ ...prev, serviceType: serviceOptions[0] }));
    }
  }, [formData.serviceType, serviceOptions]);

  // Apply parameters from estimator calculation if they exist
  useEffect(() => {
    if (exportParams) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: exportParams.serviceType,
        areaSize: exportParams.areaSize.toString(),
        message: exportParams.message
      });
      // Clear after populating so user can modify freely
      clearExportParams();
      
      // Auto scroll to contact form slightly
      const contactForm = document.getElementById('contact-form-anchor');
      if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [exportParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert('Bitte füllen Sie alle Pflichtfelder (* Name, Email, Telefon) aus.');
      return;
    }

    const adminEmail = pricingConfig.contact?.email || 'anfrage@betonbiber.de';
    const subject = encodeURIComponent(`Neue Anfrage: ${formData.serviceType} – ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `E-Mail: ${formData.email}\n` +
      `Telefon: ${formData.phone}\n` +
      `Leistung: ${formData.serviceType}\n` +
      (formData.areaSize ? `Fläche: ${formData.areaSize} m²\n` : '') +
      `\nNachricht:\n${formData.message}`
    );
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;

    const newRequest: QuoteRequest = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      serviceType: formData.serviceType,
      areaSize: formData.areaSize ? Number(formData.areaSize) : undefined,
      estimatedCost: (exportParams && formData.serviceType === exportParams.serviceType) ? exportParams.estimatedCost : undefined,
      message: formData.message,
      date: new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: 'Received'
    };

    onAddRequest(newRequest);

    triggerSuccess(
      'Vielen Dank für Ihr Vertrauen',
      `Hallo ${formData.name},\nwir haben Ihre Anfrage für "${formData.serviceType}" erhalten. Einer unserer Betonbiber-Techniker wird sich in Kürze unter ${formData.phone} mit Ihnen in Verbindung setzen.`
    );

    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: serviceOptions[0] || 'Kellerabdichtung',
      areaSize: '',
      message: ''
    });
  };

  return (
    <div className="bg-brand-bg py-16 md:py-24 px-6 flex flex-col items-center" id="kontakt-view-wrapper">
      <div className="max-w-[1240px] w-full flex flex-col gap-12">
        
        {/* Header Intro Title */}
        {hasContactIntro && <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
          <span className="self-center text-xs font-sans font-extrabold text-brand-orange bg-brand-orange/15 px-3 py-1 rounded">
            KOSTENLOSE BERATUNG
          </span>
          <h1 className="font-display font-black text-3xl md:text-4xl text-primary-navy uppercase tracking-tight">
            Schreiben Sie uns an
          </h1>
          <p className="font-sans text-sm text-brand-text-muted leading-relaxed">
            Ermitteln Sie jetzt ein Festpreisangebot für Ihr Sanierungsobjekt vor Ort oder stellen Sie eine allgemeine Frage.
          </p>
        </div>}

        {/* Info Blocks and Form Box Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-form-anchor">
          
          {/* Left Column Contact Details + Simulated Map */}
          {hasContactAside && <div className="lg:col-span-5 flex flex-col gap-8">
            {hasContactDetails && <div className="bg-white border-2 border-primary-navy p-6 rounded-lg flex flex-col gap-5">
              <h3 className="font-display font-black text-lg text-primary-navy uppercase tracking-tight">
                Direkter Draht
              </h3>

              <div className="flex flex-col gap-4 font-sans text-sm">
                {hasPhone && <div className="flex gap-3.5 items-center">
                  <div className="bg-brand-orange/10 text-brand-orange-dark p-2.5 rounded-full">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest leading-none">Notdienst-Hotline</p>
                    <a 
                      href={`tel:${pricingConfig.contact?.phoneRaw || '+498005556677'}`} 
                      className="text-primary-navy font-bold hover:text-brand-orange-dark transition-colors"
                    >
                      {pricingConfig.contact?.phone || pricingConfig.contact?.phoneRaw}
                    </a>
                  </div>
                </div>}

                {hasEmail && <div className="flex gap-3.5 items-center">
                  <div className="bg-brand-orange/10 text-brand-orange-dark p-2.5 rounded-full">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest leading-none">Sanierungsanfrage</p>
                    <a 
                      href={`mailto:${pricingConfig.contact?.email || 'anfrage@betonbiber.de'}`} 
                      className="text-primary-navy font-bold hover:text-brand-orange-dark transition-colors"
                    >
                      {pricingConfig.contact?.email}
                    </a>
                  </div>
                </div>}

                {hasAddress && <div className="flex gap-3.5 items-center">
                  <div className="bg-brand-orange/10 text-brand-orange-dark p-2.5 rounded-full">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest leading-none">Zentrale</p>
                    <p className="text-primary-navy font-bold">
                      {[pricingConfig.contact?.streetAddress, pricingConfig.contact?.postalCity].filter(hasText).join(', ')}
                    </p>
                  </div>
                </div>}
              </div>
            </div>}

            {/* Simulated Interactive Map */}
            {hasContactMap && <div className="bg-white border-2 border-primary-navy p-4 rounded-lg flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-bold text-primary-navy flex items-center gap-1 uppercase tracking-wide">
                  <MapPin size={14} className="text-brand-orange-dark" />
                  <span>Einsatzgebiet Berlin & Brandenburg</span>
                </span>
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-xs uppercase font-sans">
                  Vor Ort Service
                </span>
              </div>

              {/* Map Canvas Frame */}
              <div className="h-48 w-full bg-gray-100 rounded border border-gray-200 relative overflow-hidden group">
                <img 
                  src={MINIMAP_URL} 
                  alt="Betonbiber Map Location" 
                  style={{
                    filter: mapType === 'sat' ? 'contrast(1.15) brightness(0.9)' : 'grayscale(15%)',
                    transform: `scale(${1 + (mapZoom - 14) * 0.15})`
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Simulated Overlay Map Badge Pin */}
                <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
                  <span className="bg-primary-navy text-white font-sans text-xs px-2.5 py-1 rounded inline-block shadow-md">
                    Biber-Zentrale Berlin
                  </span>
                </div>
              </div>

              {/* Map Layer Controllers & Zoom widget */}
              <div className="flex justify-between items-center gap-2 mt-1">
                <div className="flex gap-1">
                  <button 
                    onClick={() => setMapType('standard')}
                    className={`font-sans font-bold text-xs px-2.5 py-1 rounded transition-colors ${
                      mapType === 'standard' ? 'bg-primary-navy text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Karte
                  </button>
                  <button 
                    onClick={() => setMapType('sat')}
                    className={`font-sans font-bold text-xs px-2.5 py-1 rounded transition-colors ${
                      mapType === 'sat' ? 'bg-primary-navy text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Satellit
                  </button>
                </div>

                <div className="flex gap-1.5 items-center text-xs">
                  <button 
                    onClick={() => setMapZoom(prev => Math.max(12, prev - 1))}
                    className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-primary-navy font-bold rounded flex items-center justify-center border border-gray-200"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs text-gray-500 w-8 text-center">{mapZoom}x</span>
                  <button 
                    onClick={() => setMapZoom(prev => Math.min(18, prev + 1))}
                    className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-primary-navy font-bold rounded flex items-center justify-center border border-gray-200"
                    title="Zoom In"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>}
          </div>}

          {/* Right Column The Contact Form */}
          <div className={hasContactAside ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white border-4 border-primary-navy p-6 md:p-8 rounded-xl shadow-md flex flex-col gap-5"
            >
              <div className="flex flex-col">
                <h3 className="font-display font-black text-xl text-primary-navy uppercase tracking-tight">
                  Angebot anfordern
                </h3>
                <p className="font-sans text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  In weniger als 1 Minute ausgefüllt
                </p>
              </div>

              {/* Full Name & email grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
                    Name / Ansprechpartner *
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    required
                    placeholder="z.B. Klaus Schuster"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy rounded outline-none text-xs font-sans font-medium text-primary-navy bg-brand-bg/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
                    E-Mail Adresse *
                  </label>
                  <input
                    type="email"
                    name="reply_to"
                    required
                    placeholder="schuster@beispiel.de"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-3 py-2 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy rounded outline-none text-xs font-sans font-medium text-primary-navy bg-brand-bg/20"
                  />
                </div>
              </div>

              {/* Phone number and estimate area size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
                    Telefonnummer *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="z.B. +49 176 123456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-3 py-2 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy rounded outline-none text-xs font-sans font-medium text-primary-navy bg-brand-bg/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
                    Ungefähre Fläche (m²)
                  </label>
                  <input
                    type="number"
                    name="area_size"
                    placeholder="optional, z.B. 45"
                    value={formData.areaSize}
                    onChange={(e) => setFormData({ ...formData, areaSize: e.target.value })}
                    className="px-3 py-2 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy rounded outline-none text-xs font-sans font-medium text-primary-navy bg-brand-bg/20"
                  />
                </div>
              </div>

              {/* Service Category */}
              <div className="flex flex-col gap-2">
                <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
                  Gewünschte Leistung
                </label>
                <select
                  name="service_type"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="bg-brand-bg/50 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy p-2.5 rounded text-xs font-sans font-bold text-primary-navy outline-none"
                >
                  {serviceOptions.map(serviceName => (
                    <option key={serviceName} value={serviceName}>{serviceName}</option>
                  ))}
                </select>
              </div>

              {/* Descriptive Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
                  Ihr Anliegen / Schadensbeschreibung
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Beschreiben Sie kurz Ihr feuchtes Problem: Wandnahe Feuchtigkeit, Schimmelbildung am Sockel, feuchter Riss..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="px-3 py-2.5 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy rounded outline-none text-xs font-sans font-medium text-primary-navy bg-brand-bg/20 resize-none"
                />
              </div>

              <div className="flex gap-2 items-center text-xs text-gray-400 font-medium">
                <Award size={12} className="text-brand-orange-dark" />
                <span>Wir behandeln Ihre persönlichen Kontaktdaten streng vertraulich gem. DSGVO.</span>
              </div>

              <button
                type="submit"
                className="mt-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-black text-xs uppercase py-3.5 px-6 rounded transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Nachricht absenden</span>
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>

        {/* Real-time reactive client list render at page footer */}
        <div className="mt-8">
          <QuoteRequestList
            requests={requests}
            onDeleteRequest={onDeleteRequest}
            onClearAll={onClearAll}
          />
        </div>

      </div>
    </div>
  );
}
