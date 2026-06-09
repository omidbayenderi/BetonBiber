/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TeamMember } from '../types';

export interface ServicePricing {
  name: string;
  basePricePerM2: number;
  materials: string;
}

export interface ContactConfig {
  phone: string;
  phoneRaw: string;
  email: string;
}

export interface HomepageStat {
  value: string;
  label: string;
  color?: string;
}

export interface HomepageFeature {
  title: string;
  description: string;
}

export interface HomepageContent {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImageUrl: string;
  stat1: HomepageStat;
  stat2: HomepageStat;
  stat3: HomepageStat;
  featureTitle: string;
  featureDescription: string;
  feature1: HomepageFeature;
  feature2: HomepageFeature;
  feature3: HomepageFeature;
}

export interface PricingConfig {
  services: ServicePricing[];
  factors: {
    dampness: {
      leicht: number;
      mittel: number;
      stark: number;
    };
    accessibility: {
      einfach: number;
      mittel: number;
      schwer: number;
    };
  };
  guaranteeYears: number;
  contact?: ContactConfig;
  team?: TeamMember[];
  homepage?: HomepageContent;
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  services: [
    { name: 'Kellerabdichtung', basePricePerM2: 75, materials: 'Bitumenbahnen, KMB-Massen, Drainagevlies, Horizontalsperre-Gel' },
    { name: 'Riss-sanierung', basePricePerM2: 120, materials: 'Epoxidharz-Injektat, Injektionspacker, Quellschaum, PUR-Harze' },
    { name: 'Betonsanierung', basePricePerM2: 95, materials: 'Korrosionsschutz, Schwindarmer PCC-Mörtel, Tiefenimprägnierung' },
    { name: 'Schimmelbeseitigung', basePricePerM2: 45, materials: 'Mikrobielle Reiniger, Kalziumsilikatplatten, Silikatfarbe' }
  ],
  factors: {
    dampness: {
      leicht: 0.8,
      mittel: 1.0,
      stark: 1.4
    },
    accessibility: {
      einfach: 1.0,
      mittel: 1.1,
      schwer: 1.25
    }
  },
  guaranteeYears: 10,
  contact: {
    phone: '+49 (0) 800 555 6677',
    phoneRaw: '+498005556677',
    email: 'anfrage@betonbiber.de'
  },
  team: [
    {
      name: 'Klaus Weber',
      role: 'Chefingenieur',
      description: 'Über 15 Jahre Erfahrung im Bautenschutz und in der statischen Sanierung komplexer Hoch- und Tiefbauwerke.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3nR83pI_u8qbFz5mZWNnuXg4CgQwIohd4tyz4CgLQy2-1_pXRRZVa1n7Ju5mpWCe9tqAwYxJeX9a1S9qZ340XSQyfrdt9aJvWZNpPSSwq7Uw5gi9iEymdSrE1aWO_YH2Lh8iN7jXFkrPVERv30i-HYADXyKvo0phHMa_xtWGnICDVCsKdJXlSi_wQP7t5-ExVFNgmJ77THkEIR0oFU4Pk-ibqNCwE4KAt7FeQuQnMvJoeNx3VFrvDRsZEBC64sCD-BxyxXUWW14w',
      photoAlt: 'Klaus Weber Chefingenieur'
    },
    {
      name: 'Helga Richter',
      role: 'Abdichtungsexpertin',
      description: 'Spezialisiert auf thermografische Leckortung, Injektionstechniken und moderne Verbundmembranen.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVbSmW08AninJUBEr07FqAkZUASZIW1NXAS51idIHX5pyMwAKo5P8VptSGWcwuDYuHjBt4usuJBoOX_c5hy-hYYrfYRVVChY579P5Sm7SaLNs760rd4zEqpMDA3BivJVesEc0PctYlham-aeqdKOO68t4I_YRduxBQfd-P_KWUwLRzQRf8cQuk_l3puEDPUwYwS6PvoPMPauKuV53L-p1R76jnRyG0jdypkUdq_tIApX_yEjT6SVVrnWNDNwylVyHrlQtnZlDI2us',
      photoAlt: 'Helga Richter Abdichtungsexpertin'
    },
    {
      name: 'Hans Schmidt',
      role: 'Technischer Berater',
      description: 'Experte für Schadensgutachterberichte, bauphysikalische Berechnungen und Materialzulassungen nach DIN-Norm.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjzZFNRcOqjnJ-csEXRVCx7BdLwIYwAC13GmbEmm2_CMGHW1qTGrHXzwdPCV8m9BD0oLWlZWgxwJNlAi1KWH60Dvl4eDxSq7QRiEQVafgX-bORRRXlxbT1Egv17eiN6_PQo11H1_KPVAq-wCB-SJ77THeJ-9Z74nbpHhLLXs3UnTL0NvKD9aVOooohcPoz64IUIjdRK6jwXBZFFlsAcLKbzmCIIFYsjXtu82BB_Lr7z4sHIkmIIoqcO2Hu26UW_oSTxcZ1Qw16AGk',
      photoAlt: 'Hans Schmidt Technischer Berater'
    },
    {
      name: 'Lukas Müller',
      role: 'Bauleiter',
      description: 'Unser Mann für die reibungslose Koordination auf der Baustelle, Qualitätskontrolle und Arbeitssicherheit vor Ort.',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB_Dh3dRE-ojYl4Z-IhUEAw08LPMZ-iUgn50CPzQKeE5nv0yOICy2MtY2gtGlKVgo_27pYfStVzN8XNBKA-5mWQov-VgATWL4_wP4Hl5SHNLzErNPxexqbP40xdcnSIUGk_WYlF-unuyqqP6w3sK0LLBzR-BXCqcjVRi5gxtfMndcVgdDpxAFlZBFQd3c7_UaObBvnZ7b2GSPqngN4nPZy2s6OkDMmJwSvLTz-1VYr9gfz0j04fg0s6aTENBrwbhDW2OOphra0pvY',
      photoAlt: 'Lukas Müller Bauleiter'
    }
  ],
  homepage: {
    heroBadge: 'Zertifizierter Meisterbetrieb',
    heroTitle: 'Zuverlässiger\nBautenschutz',
    heroHighlight: 'Auf Ewigkeit.',
    heroDescription: 'Feuchte Keller, bröckelnder Beton oder rissige Fundamente gefährden den Wert Ihres Gebäudes. Wir bieten professionelle Abdichtungstechnik, Riss-sanierung und Schimmelbeseitigung mit 10 Jahren Systemgewährleistung.',
    heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZyDN_jQ1_L_cOF1iSJIWqWMQDOBmsLVIRHCu68fId-vPzUD-VYhE5_IHGTFEYgg9AVcYepq1Qvr4rE2d0AvfYr6YcBTrwQldTsSSR6hAUqU9o9ZVIwJkb4satEH4TlMFVP6F_Bcyb9hRCvI0hngldBXzZQdJniAJouG4r8dovNh-VH90fkijdkVsermjHCQ_q7sLz6bejr7wJftP4hvqq2VzNXn9xtD0xDuSoj7lwK4BsmqYZqkVMOCv_wdnw4fJVUtYWYR4wUsw',
    stat1: { value: '10', label: 'Jahre Garantie auf alle Abdichtungs-systeme' },
    stat2: { value: '100%', label: 'TÜV-geprüfte Materialien der DBZ' },
    stat3: { value: 'DIN 18533', label: 'Ausführung streng nach deutschen Baustandards und Sanierungsrichtlinien.' },
    featureTitle: 'Ingenieurmäßige Bauwerkserhaltung und Bautenschutz',
    featureDescription: 'Als ausgewiesener Fachbetrieb für Abdichtungstechnik und Bauwerkssanierung setzen wir dort an, wo herkömmliche Lösungen versagen. Mit profundem Fachwissen und deutscher Gründlichkeit führen wir Schadensanalysen durch und entwickeln wirkungsvolle Sanierungskonzepte.',
    feature1: {
      title: 'Bewehrte Qualitätssysteme',
      description: 'Wir verbauen ausschließlich zertifizierte Systemkomponenten mit lückenlosem Eignungsnachweis.'
    },
    feature2: {
      title: 'Schutz vor Bauteil-Schäden',
      description: 'Injektionen und Abdichtungen bewahren den Stahlbeton vor fortschreitender Bewehrungskorrosion.'
    },
    feature3: {
      title: 'Ausführliche Dokumentation',
      description: 'Jeder Arbeitsschritt wird lückenlos fotografiert, protokolliert und Ihnen zur Gebäudeakte übergeben.'
    }
  }
};

const STORAGE_KEY = 'betonbiber_pricing_config_v1';

export function getPricingConfig(): PricingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure structure is correct
      if (parsed.services && parsed.factors && parsed.guaranteeYears) {
        if (!parsed.contact) {
          parsed.contact = { ...DEFAULT_PRICING_CONFIG.contact! };
        }
        if (!parsed.team) {
          parsed.team = [ ...DEFAULT_PRICING_CONFIG.team! ];
        }
        if (!parsed.homepage) {
          parsed.homepage = { ...DEFAULT_PRICING_CONFIG.homepage! };
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading pricing config', e);
  }
  return DEFAULT_PRICING_CONFIG;
}

export function savePricingConfig(config: PricingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Trigger custom event to notify components that are listening
    window.dispatchEvent(new Event('pricing_config_updated'));
  } catch (e) {
    console.error('Error saving pricing config', e);
  }
}
