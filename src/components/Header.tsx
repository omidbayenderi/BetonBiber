/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageId } from '../types';
import { BRAND_LOGO_URL } from '../constants';

interface HeaderProps {
  activePage: PageId;
  navigateTo: (page: PageId) => void;
  openEstimator: () => void;
}

export default function Header({ activePage, navigateTo, openEstimator }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Startseite' },
    { id: 'leistungen', label: 'Leistungen' },
    { id: 'uber_uns', label: 'Über uns' },
    { id: 'kontakt', label: 'Kontakt' },
  ] as const;

  const handleNavClick = (id: PageId) => {
    navigateTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-[1240px] mx-auto">
        
        {/* Logo / Brand */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="header-brand-logo"
        >
          <img 
            alt="BETONBIBER Logo" 
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200" 
            src={BRAND_LOGO_URL} 
          />
          {/* Logotype text removed by user instruction */}
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center" id="desktop-navbar-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`font-sans font-bold text-sm tracking-wide transition-colors relative py-3 px-1 hover:text-brand-orange ${
                activePage === link.id
                  ? 'text-brand-orange border-b-2 border-brand-orange'
                  : 'text-primary-navy'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <button
            onClick={openEstimator}
            className="ml-4 bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-bold text-xs uppercase px-5 py-3 rounded shadow-sm hover:translate-y-[1px] transition-all flex items-center gap-1.5"
            id="header-cta-estimator"
          >
            <ShieldCheck size={14} />
            <span>ANGEBOT BERECHNEN</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-primary-navy hover:text-brand-orange transition-colors p-1"
          id="mobile-menu-toggle-btn"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 py-6 px-6 z-40 flex flex-col gap-4 animate-fadeIn"
          id="mobile-nav-drawer"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-left font-sans font-bold text-base py-3 transition-colors ${
                activePage === link.id
                  ? 'text-brand-orange border-l-4 border-brand-orange pl-3'
                  : 'text-primary-navy pl-1 hover:text-brand-orange'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              openEstimator();
              setMobileMenuOpen(false);
            }}
            className="mt-4 w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-bold text-sm uppercase py-3 rounded text-center transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Angebot Berechnen</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
