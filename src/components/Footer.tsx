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
import { hasAnyText, hasText } from '../lib/contentVisibility';
import LegalModal, { LegalSection } from './LegalModal';

interface FooterProps {
  navigateTo: (page: PageId) => void;
}

export default function Footer({ navigateTo }: FooterProps) {
  const [pricingConfig, setPricingConfig] = useState(() => getPricingConfig());
  const [legalSection, setLegalSection] = useState<LegalSection | null>(null);
  const footer = pricingConfig.footer;
  const serviceLinks = footer?.hideServices ? [] : [footer?.serviceLink1, footer?.serviceLink2, footer?.serviceLink3, footer?.serviceLink4].filter(hasText);
  const legalLinks = [
    { label: footer?.legalLink1, section: 'privacy' as const },
    { label: footer?.legalLink2, section: 'terms' as const },
    { label: footer?.legalLink3, section: 'imprint' as const }
  ].filter(item => !footer?.hideLegal && hasText(item.label));
  const hasBrandColumn = !footer?.hideBrand && hasText(footer?.description);
  const hasServicesColumn = !footer?.hideServices && (hasText(footer?.servicesTitle) || serviceLinks.length > 0);
  const hasLegalColumn = !footer?.hideLegal && (hasText(footer?.legalTitle) || legalLinks.length > 0);
  const hasCopyright = !footer?.hideCopyright && hasText(footer?.copyrightSuffix);
  const hasFooterContent = hasBrandColumn || hasCopyright || hasServicesColumn || hasLegalColumn;

  useEffect(() => {
    const handleUpdated = () => {
      setPricingConfig(getPricingConfig());
    };
    window.addEventListener('pricing_config_updated', handleUpdated);
    return () => {
      window.removeEventListener('pricing_config_updated', handleUpdated);
    };
  }, []);

  if (!hasFooterContent) {
    return null;
  }

  return (
    <footer className="bg-primary-navy text-white border-t-4 border-brand-orange-dark" id="application-footer">
      <>
      <div className="max-w-[1240px] mx-auto px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Left Column */}
        {hasBrandColumn && <div className="flex flex-col gap-5">
          <div className="cursor-pointer self-start animate-fadeIn" onClick={() => navigateTo('home')}>
            <img 
              alt="BETONBIBER Logo" 
              className="h-16 md:h-20 w-auto object-contain hover:opacity-90 transition-opacity" 
              src={footerLogo} 
              referrerPolicy="no-referrer"
            />
          </div>
          {hasText(footer?.description) && <p className="font-sans text-sm leading-relaxed text-gray-400">
            {footer?.description}
          </p>}
        </div>}

        {/* Services / Leistungen Column */}
        {hasServicesColumn && <div className="flex flex-col gap-4">
          {hasText(footer?.servicesTitle) && <h4 className="font-display font-bold text-sm text-brand-orange uppercase tracking-wider border-b border-white/10 pb-2">
            {footer?.servicesTitle}
          </h4>}
          {serviceLinks.length > 0 && <ul className="flex flex-col gap-3 font-sans text-sm">
            {serviceLinks.map((label, index) => (
              <li key={index}>
                <button 
                  onClick={() => navigateTo('leistungen')} 
                  className="text-gray-400 hover:text-white transition-colors text-left hover:underline"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>}
        </div>}

        {/* Legal & Info Column */}
        {hasLegalColumn && <div className="flex flex-col gap-4">
          {hasText(footer?.legalTitle) && <h4 className="font-display font-bold text-sm text-brand-orange uppercase tracking-wider border-b border-white/10 pb-2">
            {footer?.legalTitle}
          </h4>}
          {legalLinks.length > 0 && <ul className="flex flex-col gap-3 font-sans text-sm mb-4">
            {legalLinks.map(item => (
              <li key={item.section}>
                <button type="button" onClick={() => setLegalSection(item.section)} className="text-left text-gray-400 hover:text-white transition-colors hover:underline">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>}
          
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
        </div>}

      </div>

      {hasCopyright && <div className="w-full bg-primary-navy-light py-6 border-t border-white/5 text-center px-4">
        <div className="max-w-[1240px] mx-auto flex flex-col items-center justify-center gap-2">
          <p className="font-sans text-xs text-gray-500">
            © {new Date().getFullYear()} {footer?.copyrightSuffix}
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
      </div>}
      </>

      {legalSection && (
        <LegalModal initialSection={legalSection} onClose={() => setLegalSection(null)} />
      )}
    </footer>
  );
}
