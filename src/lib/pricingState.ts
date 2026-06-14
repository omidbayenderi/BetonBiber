/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceDetail, TeamMember, Testimonial } from '../types';

export interface ServicePricing {
  name: string;
  basePricePerM2: number;
  materials: string;
}

export interface ContactConfig {
  companyName: string;
  responsiblePerson: string;
  streetAddress: string;
  postalCity: string;
  country: string;
  phone: string;
  phoneRaw: string;
  email: string;
  vatId: string;
  registerInfo: string;
  supervisoryAuthority: string;
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

export interface ServicesContent {
  eyebrow: string;
  title: string;
  description: string;
  items: ServiceDetail[];
  extraEyebrow: string;
  extraTitle: string;
  extraDescription: string;
  extraImageUrl: string;
  extraButtonLabel: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  missionEyebrow: string;
  missionTitle: string;
  missionPoint1: string;
  missionPoint2: string;
  missionPoint3: string;
  teamTitle: string;
  teamSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  recommendationLabel: string;
  testimonials: Testimonial[];
}

export interface FooterContent {
  description: string;
  servicesTitle: string;
  serviceLink1: string;
  serviceLink2: string;
  serviceLink3: string;
  serviceLink4: string;
  legalTitle: string;
  legalLink1: string;
  legalLink2: string;
  legalLink3: string;
  copyrightSuffix: string;
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
  contact?: ContactConfig;
  team?: TeamMember[];
  homepage?: HomepageContent;
  servicesContent?: ServicesContent;
  about?: AboutContent;
  footer?: FooterContent;
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
  contact: {
    companyName: 'Betonbiber Bautenschutz',
    responsiblePerson: 'Bitte Geschäftsführung/Inhaber ergänzen',
    streetAddress: 'Am Biberdamm 12',
    postalCity: '10115 Berlin',
    country: 'Deutschland',
    phone: '+49 (0) 800 555 6677',
    phoneRaw: '+498005556677',
    email: 'anfrage@betonbiber.de',
    vatId: 'Bitte USt-IdNr. ergänzen, falls vorhanden',
    registerInfo: 'Bitte Handelsregister/Registergericht ergänzen, falls vorhanden',
    supervisoryAuthority: 'Bitte zuständige Kammer/Aufsichtsbehörde ergänzen, falls einschlägig'
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
    heroDescription: 'Feuchte Keller, bröckelnder Beton oder rissige Fundamente gefährden den Wert Ihres Gebäudes. Wir bieten professionelle Abdichtungstechnik, Riss-sanierung und Schimmelbeseitigung mit ingenieurmäßiger Bauwerkserhaltung.',
    heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZyDN_jQ1_L_cOF1iSJIWqWMQDOBmsLVIRHCu68fId-vPzUD-VYhE5_IHGTFEYgg9AVcYepq1Qvr4rE2d0AvfYr6YcBTrwQldTsSSR6hAUqU9o9ZVIwJkb4satEH4TlMFVP6F_Bcyb9hRCvI0hngldBXzZQdJniAJouG4r8dovNh-VH90fkijdkVsermjHCQ_q7sLz6bejr7wJftP4hvqq2VzNXn9xtD0xDuSoj7lwK4BsmqYZqkVMOCv_wdnw4fJVUtYWYR4wUsw',
    stat1: { value: 'DIN', label: 'Ausführung nach deutschen Baustandards' },
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
  },
  servicesContent: {
    eyebrow: 'UNSER SERVICE-PORTFOLIO',
    title: 'Wirksame Bauwerkserhaltung',
    description: 'Wir sanieren Schäden im Tief- und Hochbau mit zertifizierter Fachkenntnis. Entdecken Sie unsere Kernarbeitsfelder.',
    items: [
      {
        id: 'kellerabdichtung',
        title: 'Kellerabdichtung',
        iconName: 'foundation',
        shortDesc: 'Wir schützen Ihre Kellerräume und Fundamente dauerhaft vor Feuchtigkeit.',
        longDesc: 'Wir schützen Ihre Kellerräume und Fundamente dauerhaft vor Feuchtigkeit und drückendem Grundwasser. Mit modernster Technik, positiven und negativen Abdichtungssystemen verlängern wir die Lebensdauer Ihres Objekts nachhaltig und schützen Sie vor drückendem Sickerwasser und nassen Wänden.',
        features: ['Außenabdichtung (Schwarze Wanne)', 'Innenraum-Feuchteschutz (Negativabdichtung)', 'Fundamentsanierung & Horizontalsperren', 'Dränagesysteme & Rissverpressung'],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBILNTJD1Ho4PRzi8Iey1Srffd0uh-J127WvzAudeURb1xd44zVWD5CPxme3wxHaj9GJzryWjh8qeArQo0Xgk5wyQbG4hm1ozxMSBUXoYH5qA9rncFKCXUreyV3vMw2j0-YZIUJVOFRh__DxNDWk0RR6hsCwiXayOnUgnt4NfjrO1PD4LVpyCiguKww3C6rKVp0U8u2A9HodeQ-DQIaN50RbxZAzKnXdzhF7aTNaduyYClvVlD8XB_iXRGpc459of15xrSAPQhIuWk',
        bgDark: false,
        tag: 'Empfohlen'
      },
      {
        id: 'riss_sanierung',
        title: 'Riss-sanierung',
        iconName: 'architecture',
        shortDesc: 'Instandsetzung von Rissen in Betonoberflächen mittels Hochdruck-Injektionsverfahren.',
        longDesc: 'Instandsetzung von statischen und dynamischen Rissen in Betonoberflächen mittels modernen Harz- und Polyurethan-Hochdruckinjektionen. Diese ingenieurtechnischen Lösungen stellen die volle statische Belastbarkeit, Dichtigkeit und dauerhafte Tragfähigkeit Ihres Gebäudes zuverlässig wieder her.',
        features: ['Hochdruck-Epoxidharzinjektion', 'Risselastische Polyurethanschließung', 'Kraftschlüssiges Verpressen von Bauteilen', 'Statische Lastabtragungswiederherstellung'],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO28jTC7p39lFLiDe4iUdW_Gf8Sws3qSO1cTF_Rrv07iBBtc8yog0ZMfdmLX7XqZepuw1f0TbWsD_zSj54r6DWykwpBIMaKoxfjw6_tsALWqRHg2VgDbU2BY2nciNyWwnDpuh5OuF-G7k-vl_613cPzUVQXZ8GXmF8dGHtor4hPyYwRvC6id3QRoC7ugZyUNaWV0olwipc_bx9vRmAiZNEtzyRHImxxWz5unPc8C1hcP0CbxUOWXYCLUqxTCChs2K80c8s47yExTM',
        bgDark: true,
        tag: 'Präzision'
      },
      {
        id: 'betonsanierung',
        title: 'Betonsanierung',
        iconName: 'precision_manufacturing',
        shortDesc: 'Anerkannte Erhöhung der mechanischen Belastbarkeit von abgenutzten Flächen.',
        longDesc: 'Wir erhöhen die mechanische und chemische Widerstandsfähigkeit von abgenutzten oder geschädigten Betonflächen. Durch professionellen Korrosionsschutz für die Bewehrung, innovative Feinspachtelungen und widerstandsfähige Epoxid- oder Polyurethanbeschichtungen sanieren wir Ihre Hallenböden und Garagen grundlegend.',
        features: ['Bewehrungsentrostung & Betonersatz', 'Karbonatisierungsbremse-Beschichtung', 'Industriebodenabdichtung', 'Ästhetische Beton-Veredelung'],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOdtqVL98e_vlTMt7VHs59mnnMV2SUTLOMIeryWbsAN02pZnvHzbCgcA1ByTUVye1yP-1c12WuKYN-b3aNa8APqvs0QNb0Y4XOuxiXqt6qFNPnukRn3q8GixocawqWBXLWYDAsSdyo0ZZQRU3PgsUdXNkSI5AhxQ7oAkEBzxpb6taPwOwUTDNMQT3deKWxOhTIrCdqnVegw0Uc4crKthmCdMIfHR3Z3baapdveczb50K4-ojDdioANw2ZPl9ipEbONcTXGMjZkx58',
        bgDark: false,
        tag: 'Industriell'
      },
      {
        id: 'schimmelbeseitigung',
        title: 'Schimmelbeseitigung',
        iconName: 'health_and_safety',
        shortDesc: 'Wissenschaftlich fundierte Analyse und dauerhafte Sanierung von Sporen.',
        longDesc: 'Wir analysieren gesundheitsgefährdende Schimmelpilzbildungen mit neuesten mikrobiologischen Abklatschproben und beseitigen sie an der Wurzel. Durch Aufmauerung von intelligenten Silikatplatten und dampfdiffusionsoffenen Mineralbeschichtungen verhindern wir künftige feuchtigkeitsbedingte Ansiedlungen permanent.',
        features: ['Zertifizierte Schimmelanalyse & Sporenmessung', 'Tiefenwirksame Desinfektion & Reinigung', 'Wohnklimatisierende Kalziumsilikatplatten', '0% Rückfallquote durch physikalische Barrieren'],
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBILNTJD1Ho4PRzi8Iey1Srffd0uh-J127WvzAudeURb1xd44zVWD5CPxme3wxHaj9GJzryWjh8qeArQo0Xgk5wyQbG4hm1ozxMSBUXoYH5qA9rncFKCXUreyV3vMw2j0-YZIUJVOFRh__DxNDWk0RR6hsCwiXayOnUgnt4NfjrO1PD4LVpyCiguKww3C6rKVp0U8u2A9HodeQ-DQIaN50RbxZAzKnXdzhF7aTNaduyYClvVlD8XB_iXRGpc459of15xrSAPQhIuWk',
        bgDark: false,
        tag: 'Gesundheit'
      }
    ],
    extraEyebrow: 'ZUSÄTZLICHER INGENIEUR-SUPPORT',
    extraTitle: 'Schadensanalysen & Sachverständigengutachten',
    extraDescription: 'Feuchtigkeitsursachen im Mauerwerk sind oft komplexer als sie scheinen. Wir belassen es nicht beim bloßen Symptomkurieren: Unsere erfahrenen Sachverständigen führen professionelle Kernbohrungen, CM-Messerfassungen und digitale Thermografien durch.',
    extraImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdizAVtT7cACJtw_eJ9dG_bn7fRS9bbDz3GsMB0-x0l8ktDgPHs-GwUF_nQJBJ805acHrjKpmyg34Qd7ALU1qOnuVjXwVbxmlVyG6blVkpiaJTH0gFdf_wE1IzN_c1dD2lhQSMO2XC7VHx1uMsYEYfdhJL8VXhRUNdw274VoMFGdQyGAbyaqcF63yPrsAZ-OApIwb2xyTHCqrmvDKTraZCIkf4Ke6WumDdd0urSeDJ_WrAqaxeTyFY9uB1il_J4U9-iHadSYaiCVQ',
    extraButtonLabel: 'Spezialgutachten anfordern'
  },
  about: {
    eyebrow: 'WIR STELLEN UNS VOR',
    title: 'Über den Meisterbetrieb Betonbiber',
    paragraph1: 'Seit unserer Gründung verpflichten wir uns erstklassiger Qualität bei der Instandsetzung von geschädigtem Beton, Kellern und Fundamenten. Betonbiber steht für fundiertes theoretisches und praktisches Know-how des Instandsetzungsingenieurwesens.',
    paragraph2: 'Jedes Schadensbild hat eine eigene Geschichte. Uns geht es nicht darum, Symptome Kosmetisch zu übertünchen. Wir erarbeiten solide, mathematisch fundierte Abdichtungen und Riss-Sanierungen zur nachhaltig dichten Integrität Ihres Familienbesitzes oder Ihres Industrieobjekts.',
    stat1Value: '15+',
    stat1Label: 'Jahre Expertise',
    stat2Value: '4.9 / 5',
    stat2Label: 'Kundenbewertung',
    missionEyebrow: 'UNSER LEITBILD',
    missionTitle: 'Zertifizierte Sicherheit durch anerkannte Innovation',
    missionPoint1: 'Systemverträgliche Werkstoffe: Wir mischen niemals Werkstoffe unterschiedlicher Hersteller an einer Schadstelle.',
    missionPoint2: 'Detaillierter Schadensatlas: Vorbehandlungsgutachten zur Ermittlung des Ist-Zustandes der Baustoffe.',
    missionPoint3: 'Transparente Kostenplanung: Klare und nachvollziehbare Preisgestaltung für maximale Planungssicherheit.',
    teamTitle: 'Unsere Bautenschutz-Spezialisten',
    teamSubtitle: 'Kompetente Profis mit Leidenschaft für Baustoffkunde',
    testimonialsTitle: 'Was unsere Kunden über uns sagen',
    testimonialsSubtitle: 'Stimmen zufriedener Hausbesitzer und gewerblicher Bauleiter',
    recommendationLabel: '100% Weiterempfehlung',
    testimonials: [
      {
        name: 'Andreas Müller',
        role: 'Hausverwalter',
        text: 'Das Problem mit dem Wassereintritt in unserem Keller wurde vom Betonbiber-Team durch ein professionelles Injektionssystem dauerhaft gelöst. Vielen Dank!',
        stars: 5
      },
      {
        name: 'Michael Schmidt',
        role: 'Betriebsleiter',
        text: 'Wir haben bei der Instandsetzung unserer Industriehalle zusammengearbeitet. Ihre gründliche, disziplinierte und planvolle Arbeitsweise hat uns sehr beeindruckt.',
        stars: 5
      },
      {
        name: 'Sarah Wagner',
        role: 'Architektin',
        text: 'Nach der Terrassenabdichtung an unserem Altbau haben wir den ersten Winter absolut sorgenfrei verbracht. Preis-Leistung ist top für die gebotene Ingenieurpräzision.',
        stars: 5
      }
    ]
  },
  footer: {
    description: 'Ihr zertifiziertes Expertenteam für zuverlässige, langlebige und absolut dichte Lösungen für moderne Bauwerke und Bestandsbauten. Ingenieursqualität für Ihr Fundament.',
    servicesTitle: 'UNSERE LEISTUNGEN',
    serviceLink1: 'Kellerabdichtung & Horizontalsperre',
    serviceLink2: 'Injektionsverfahren & Riss-sanierung',
    serviceLink3: 'Betonsanierung & Bodenversiegelung',
    serviceLink4: 'Mikrobiologische Schimmelbeseitigung',
    legalTitle: 'RECHTLICHES & HELP',
    legalLink1: 'Datenschutzerklärung / Privacy Policy',
    legalLink2: 'Nutzungsbedingungen / Terms of Use',
    legalLink3: 'AGB / Impressum',
    copyrightSuffix: 'Betonbiber Bautenschutz. Alle Rechte vorbehalten. | Industrial Integrity Engineered.'
  }
};

const STORAGE_KEY = 'betonbiber_pricing_config_v1';

export function getPricingConfig(): PricingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure structure is correct
      if (parsed.services && parsed.factors) {
        if (!parsed.contact) {
          parsed.contact = { ...DEFAULT_PRICING_CONFIG.contact! };
        } else {
          parsed.contact = { ...DEFAULT_PRICING_CONFIG.contact!, ...parsed.contact };
        }
        if (!parsed.team) {
          parsed.team = [ ...DEFAULT_PRICING_CONFIG.team! ];
        }
        if (!parsed.homepage) {
          parsed.homepage = { ...DEFAULT_PRICING_CONFIG.homepage! };
        }
        if (!parsed.servicesContent) {
          parsed.servicesContent = { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [ ...DEFAULT_PRICING_CONFIG.servicesContent!.items ] };
        }
        if (!parsed.about) {
          parsed.about = { ...DEFAULT_PRICING_CONFIG.about!, testimonials: [ ...DEFAULT_PRICING_CONFIG.about!.testimonials ] };
        }
        if (!parsed.footer) {
          parsed.footer = { ...DEFAULT_PRICING_CONFIG.footer! };
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
