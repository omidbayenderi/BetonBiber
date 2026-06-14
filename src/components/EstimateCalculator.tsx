/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Clock, HelpCircle } from 'lucide-react';
import { getPricingConfig, PricingConfig } from '../lib/pricingState';

interface EstimateCalculatorProps {
  onExportToContact: (params: {
    serviceType: string;
    areaSize: number;
    estimatedCost: number;
    message: string;
  }) => void;
}

export default function EstimateCalculator({ onExportToContact }: EstimateCalculatorProps) {
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(getPricingConfig());
  const [selectedService, setSelectedService] = useState('Kellerabdichtung');
  const [areaSize, setAreaSize] = useState(40);
  const [dampnessLevel, setDampnessLevel] = useState('Mittel (feuchte Flecken)');
  const [accessibility, setAccessibility] = useState('Einfach erreichbar');
  
  const [estimate, setEstimate] = useState({
    minPrice: 1200,
    maxPrice: 1800,
    averagePrice: 1500,
    durationDays: '2-3 Tage',
    requiredMaterials: 'Bitumen-Spachtelmasse, Dichtungsbänder, Vliesgitter'
  });

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

  const servicesMap = pricingConfig.services;

  useEffect(() => {
    const serviceObj = servicesMap.find(s => s.name === selectedService) || servicesMap[0];
    let baseRate = serviceObj ? serviceObj.basePricePerM2 : 75;

    // Adjust based on dampness
    let dampFactor = pricingConfig.factors.dampness.mittel;
    if (dampnessLevel === 'Stark (laufendes Wasser/Schimmel)') {
      dampFactor = pricingConfig.factors.dampness.stark;
    } else if (dampnessLevel === 'Leicht (nur klammer Geruch)') {
      dampFactor = pricingConfig.factors.dampness.leicht;
    }

    // Adjust based on accessibility
    let accessFactor = pricingConfig.factors.accessibility.einfach;
    if (accessibility === 'Schwer zugänglich (z.B. enger Kriechkeller)') {
      accessFactor = pricingConfig.factors.accessibility.schwer;
    } else if (accessibility === 'Mittel (teilweise bebaut)') {
      accessFactor = pricingConfig.factors.accessibility.mittel;
    }

    const calculatedAvg = Math.round(areaSize * baseRate * dampFactor * accessFactor);
    const minCalculated = Math.round(calculatedAvg * 0.85);
    const maxCalculated = Math.round(calculatedAvg * 1.15);

    // Days calculation
    let days = '1-2 Tage';
    if (areaSize > 120) {
      days = '5-7 Tage';
    } else if (areaSize > 60) {
      days = '3-5 Tage';
    } else if (areaSize > 30) {
      days = '2-3 Tage';
    }

    setEstimate({
      minPrice: minCalculated,
      maxPrice: maxCalculated,
      averagePrice: calculatedAvg,
      durationDays: days,
      requiredMaterials: serviceObj ? serviceObj.materials : ''
    });
  }, [selectedService, areaSize, dampnessLevel, accessibility, pricingConfig, servicesMap]);

  const handleApplyToForm = () => {
    const formattedMsg = `Automatische Schätzung:\n- Gewählte Leistung: ${selectedService}\n- Gewählte Fläche: ${areaSize} m²\n- Feuchtigkeitsgrad: ${dampnessLevel}\n- Zugänglichkeit: ${accessibility}\n- Ungefähre Richtkosten: €${estimate.averagePrice}`;
    onExportToContact({
      serviceType: selectedService,
      areaSize,
      estimatedCost: estimate.averagePrice,
      message: formattedMsg
    });
  };

  return (
    <div className="bg-white border-4 border-primary-navy p-6 md:p-8 rounded-xl shadow-lg" id="estimation-calculator-main">
      <div className="flex items-center gap-3 border-b-2 border-primary-navy pb-4 mb-6">
        <div className="bg-brand-orange text-white p-2 rounded-lg">
          <Calculator size={22} />
        </div>
        <div>
          <h3 className="font-display font-black text-lg text-primary-navy uppercase tracking-tight">
            Interaktiver Kostenschätzer
          </h3>
          <p className="font-sans text-xs text-brand-orange-dark font-extrabold uppercase tracking-wider">
            Schnell ermitteln • Kostenfrei • Unverbindlich
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Interactive Configuration Panels */}
        <div className="flex flex-col gap-5">
          {/* Service chooser */}
          <div className="flex flex-col gap-2">
            <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
              1. Leistungsauswahl
            </label>
            <div className="grid grid-cols-2 gap-2" id="calculator-service-select">
              {servicesMap.map(s => (
                <button
                  key={s.name}
                  onClick={() => setSelectedService(s.name)}
                  className={`text-left p-3 border-2 rounded transition-all font-sans font-bold text-xs ${
                    selectedService === s.name
                      ? 'bg-primary-navy text-white border-primary-navy shadow-sm'
                      : 'border-gray-200 text-primary-navy bg-brand-bg/30 hover:bg-brand-bg hover:border-primary-navy/40'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Area slider or number */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-display font-extrabold text-primary-navy uppercase tracking-wider">
                2. Zu sanierende Fläche
              </label>
              <span className="font-sans font-black text-brand-orange-dark bg-brand-orange/10 px-2 py-0.5 rounded text-sm">
                {areaSize} m²
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              value={areaSize}
              onChange={(e) => setAreaSize(Number(e.target.value))}
              className="w-full accent-brand-orange h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer py-3"
              id="calculator-area-slider"
              style={{ touchAction: 'none' }}
            />
            <div className="flex justify-between text-xs text-gray-400 font-bold font-mono">
              <span>10 m²</span>
              <span>150 m²</span>
              <span>300 m²</span>
            </div>
          </div>

          {/* Dampness severity */}
          <div className="flex flex-col gap-2">
            <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
              3. Feuchtigkeitszustand / Grad
            </label>
            <select
              value={dampnessLevel}
              onChange={(e) => setDampnessLevel(e.target.value)}
              className="bg-brand-bg/50 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy p-2.5 rounded text-xs font-sans font-bold text-primary-navy outline-none"
              id="calculator-dampness-select"
            >
              <option value="Leicht (nur klammer Geruch)">Leicht (nur klammer Geruch / leichte Risse)</option>
              <option value="Mittel (feuchte Flecken)">Mittel (feuchte Flecken / Abplatzungen)</option>
              <option value="Stark (laufendes Wasser/Schimmel)">Stark (stetig laufendes Wasser / dichter Schimmelbefall)</option>
            </select>
          </div>

          {/* Accessibility */}
          <div className="flex flex-col gap-2">
            <label className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider">
              4. Erreichbarkeit vor Ort
            </label>
            <select
              value={accessibility}
              onChange={(e) => setAccessibility(e.target.value)}
              className="bg-brand-bg/50 border-2 border-gray-200 hover:border-primary-navy/40 focus:border-primary-navy p-2.5 rounded text-xs font-sans font-bold text-primary-navy outline-none"
              id="calculator-accessibility-select"
            >
              <option value="Einfach erreichbar">Einfach erreichbar (z.B. freie Kellerwand, Garage)</option>
              <option value="Mittel (teilweise bebaut)">Mittel (z.B. Heizungsraum, Einbauten im Weg)</option>
              <option value="Schwer zugänglich (z.B. enger Kriechkeller)">Schwer zugänglich (z.B. Kriechkeller, Schächte)</option>
            </select>
          </div>
        </div>

        {/* Right Computed Outcome Cards */}
        <div className="flex flex-col justify-between bg-primary-navy text-white p-6 md:p-8 rounded-lg relative overflow-hidden flex-1">
          {/* Subtle logo bg mark */}
          <div className="absolute top-0 right-0 opacity-[0.03] scale-150 select-none pointer-events-none">
            <Calculator size={350} />
          </div>

          <div className="flex flex-col gap-6 relative z-10">
            <div>
              <span className="text-xs font-sans text-brand-orange uppercase tracking-widest font-bold">
                PROV. SCHÄTZUNGSSUMME (NETTO)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display font-black text-3xl md:text-4xl text-white">
                  ca. €{estimate.minPrice.toLocaleString()} - €{estimate.maxPrice.toLocaleString()}
                </span>
                <span className="font-sans text-xs text-gray-400 font-bold">*</span>
              </div>
              <p className="font-sans text-xs text-gray-400 mt-1 leading-normal italic">
                *Diese Kostenschätzung stellt eine unverbindliche Orientierungshilfe basierend auf typischen Erfahrungswerten dar. Genaue Preise erhalten Sie nach einer professionellen Schadensanalyse vor Ort.
              </p>
            </div>

            {/* Quick Metrics Line Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-white/10 py-4">
              <div className="flex items-start gap-2">
                <div className="bg-brand-orange text-white p-1 rounded mt-0.5">
                  <Clock size={12} />
                </div>
                <div>
                  <h5 className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider">
                    Dauer (ca.)
                  </h5>
                  <p className="font-sans font-extrabold text-xs text-white">
                    {estimate.durationDays}
                  </p>
                </div>
              </div>

            </div>

            {/* Required materials bullet container */}
            <div className="flex flex-col gap-1.5">
              <h5 className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider">
                Systemkomponenten zur Instandsetzung:
              </h5>
              <p className="font-sans text-xs text-gray-200 italic leading-relaxed">
                {estimate.requiredMaterials}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleApplyToForm}
            className="mt-6 w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-black text-xs uppercase py-3.5 px-4 rounded transition-all text-center flex items-center justify-center gap-2 relative z-10"
            id="calculator-submit-btn"
          >
            <span>Daten in das Anfrageformular übernehmen</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
