/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Phone, Mail, Share2 } from 'lucide-react';
import { PageId } from '../types';
// @ts-ignore
import footerLogo from '../assets/images/regenerated_image_1780950671312.png';
import { getPricingConfig } from '../lib/pricingState';
import LegalModal, { LegalSection } from './LegalModal';

interface FooterProps {
  navigateTo: (page: PageId) => void;
}

export default function Footer({ navigateTo }: FooterProps) {
  const [pricingConfig, setPricingConfig] = useState(() => getPricingConfig());
  const [legalSection, setLegalSection] = useState<LegalSection | null>(null);
  const footer = pricingConfig.footer;

  useEffect(() => {
    const handleUpdated = () => {
      setPricingConfig(getPricingConfig());
    };
    window.addEventListener('pricing_config_updated', handleUpdated);
    return () => {
      window.removeEventListener('pricing_config_updated', handleUpdated);
    };
  }, []);

  return (
    <footer className="bg-primary-navy text-white border-t-4 border-brand-orange-dark" id="application-footer">
      <div className="max-w-[1240px] mx-auto px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Left Column */}
        <div className="flex flex-col gap-5">
          <div className="cursor-pointer self-start animate-fadeIn" onClick={() => navigateTo('home')}>
            <img 
              alt="BETONBIBER Logo" 
              className="h-16 md:h-20 w-auto object-contain hover:opacity-90 transition-opacity" 
              src={footerLogo} 
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="font-sans text-sm leading-relaxed text-gray-400">
            {footer?.description || 'Ihr zertifiziertes Expertenteam für zuverlässige, langlebige und absolut dichte Lösungen für moderne Bauwerke und Bestandsbauten. Ingenieursqualität für Ihr Fundament.'}
          </p>
        </div>

        {/* Services / Leistungen Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-bold text-sm text-brand-orange uppercase tracking-wider border-b border-white/10 pb-2">
            {footer?.servicesTitle || 'UNSERE LEISTUNGEN'}
          </h4>
          <ul className="flex flex-col gap-3 font-sans text-sm">
            <li>
              <button 
                onClick={() => navigateTo('leistungen')} 
                className="text-gray-400 hover:text-white transition-colors text-left hover:underline"
              >
                {footer?.serviceLink1 || 'Kellerabdichtung & Horizontalsperre'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('leistungen')} 
                className="text-gray-400 hover:text-white transition-colors text-left hover:underline"
              >
                {footer?.serviceLink2 || 'Injektionsverfahren & Riss-sanierung'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('leistungen')} 
                className="text-gray-400 hover:text-white transition-colors text-left hover:underline"
              >
                {footer?.serviceLink3 || 'Betonsanierung & Bodenversiegelung'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('leistungen')} 
                className="text-gray-400 hover:text-white transition-colors text-left hover:underline"
              >
                {footer?.serviceLink4 || 'Mikrobiologische Schimmelbeseitigung'}
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Info Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-bold text-sm text-brand-orange uppercase tracking-wider border-b border-white/10 pb-2">
            {footer?.legalTitle || 'RECHTLICHES & HELP'}
          </h4>
          <ul className="flex flex-col gap-3 font-sans text-sm mb-4">
            <li>
              <button type="button" onClick={() => setLegalSection('privacy')} className="text-left text-gray-400 hover:text-white transition-colors hover:underline">
                {footer?.legalLink1 || 'Datenschutzerklärung / Privacy Policy'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setLegalSection('terms')} className="text-left text-gray-400 hover:text-white transition-colors hover:underline">
                {footer?.legalLink2 || 'Nutzungsbedingungen / Terms of Use'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setLegalSection('imprint')} className="text-left text-gray-400 hover:text-white transition-colors hover:underline">
                {footer?.legalLink3 || 'AGB / Impressum'}
              </button>
            </li>
          </ul>
          
          <div className="flex gap-3">
            <a 
              href={`mailto:${pricingConfig.contact?.email || 'anfrage@betonbiber.de'}`} 
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-orange text-white transition-all hover:scale-105"
              title="Mail Senden"
            >
              <Mail size={16} />
            </a>
            <a 
              href={`tel:${pricingConfig.contact?.phoneRaw || '+498005556677'}`} 
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-orange text-white transition-all hover:scale-105"
              title="Anrufen"
            >
              <Phone size={16} />
            </a>
            <button 
              onClick={() => alert('Teilen Sie uns über Facebook, LinkedIn oder WhatsApp!')}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-orange text-white transition-all hover:scale-105"
              title="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

      </div>

      <div className="w-full bg-primary-navy-light py-6 border-t border-white/5 text-center px-4">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-2">
          <p className="font-sans text-xs text-gray-500">
            © {new Date().getFullYear()} {footer?.copyrightSuffix || 'Betonbiber Bautenschutz. Alle Rechte vorbehalten. | Industrial Integrity Engineered.'}
          </p>
          <a
            href="https://bayenderi.com"
            target="_blank"
            rel="noreferrer"
            className="font-sans text-xs font-semibold text-gray-500 transition-colors hover:text-brand-orange"
          >
            Webmeister Bayenderi.com
          </a>
        </div>
      </div>

      {legalSection && (
        <LegalModal initialSection={legalSection} onClose={() => setLegalSection(null)} />
      )}
    </footer>
  );
}
