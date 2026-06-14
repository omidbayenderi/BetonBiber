/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent, useCallback } from 'react';
import {
  KeyRound, Save, RotateCcw, Trash2,
  Layers, Coins, Wrench, ShieldCheck, Mail, Phone,
  CheckCircle, FileSpreadsheet, LogOut, ArrowRight,
  Users, Home, Image, Type, Star, Activity, Sparkles,
  TrendingUp, Clock3, Gauge, LockKeyhole, CircleDollarSign,
  UploadCloud, Link2, SlidersHorizontal, LayoutDashboard, ClipboardList,
  BriefcaseBusiness, Building2, MessageSquareQuote, EyeOff, Images
} from 'lucide-react';
import { GalleryItem, QuoteRequest, ServiceDetail, TeamMember, Testimonial } from '../types';
import {
  getPricingConfig,
  savePricingConfig,
  PricingConfig,
  DEFAULT_PRICING_CONFIG,
  HomepageContent,
  ServicesContent,
  AboutContent,
  FooterContent,
  ContactConfig,
  GalleryContent,
  PageVisibilityContent
} from '../lib/pricingState';

const ADMIN_PASS_HASH = import.meta.env.VITE_ADMIN_PASS_HASH as string | undefined;

async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

interface AdminViewProps {
  requests: QuoteRequest[];
  onDeleteRequest: (id: string) => void;
  onUpdateRequestStatus?: (id: string, newStatus: QuoteRequest['status']) => void;
  onClearAllRequests: () => void;
}

export default function AdminView({ 
  requests, 
  onDeleteRequest, 
  onUpdateRequestStatus,
  onClearAllRequests 
}: AdminViewProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Keep authenticated on refresh in session state
    return sessionStorage.getItem('betonbiber_authorized') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // Config State
  const [config, setConfig] = useState<PricingConfig>(getPricingConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'homepage' | 'services' | 'gallery' | 'about' | 'requests'>('calculator');

  const handleLogin = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const hash = await sha256hex(password);
    const match = ADMIN_PASS_HASH
      ? hash === ADMIN_PASS_HASH
      : hash === '2996ebb3252e03a2db673029d253dcc1aaaeaa5920361985aac3c9a1bf208921';
    if (match) {
      setIsAuthenticated(true);
      sessionStorage.setItem('betonbiber_authorized', 'true');
      setLoginError('');
    } else {
      setLoginError('Ungültiges Passwort. Bitte versuchen Sie es erneut.');
    }
  }, [password]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('betonbiber_authorized');
  };

  const handleSaveConfig = () => {
    savePricingConfig(config);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleResetDefaults = () => {
    if (confirm('Möchten Sie alle Preisparameter auf die ursprünglichen Standardwerte zurücksetzen?')) {
      setConfig(JSON.parse(JSON.stringify(DEFAULT_PRICING_CONFIG)));
      savePricingConfig(DEFAULT_PRICING_CONFIG);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  const handleServicePriceChange = (index: number, val: number) => {
    const updatedServices = [...config.services];
    updatedServices[index] = { ...updatedServices[index], basePricePerM2: val };
    setConfig({ ...config, services: updatedServices });
  };

  const handleServiceNameChange = (index: number, val: string) => {
    const updatedServices = [...config.services];
    updatedServices[index] = { ...updatedServices[index], name: val };
    setConfig({ ...config, services: updatedServices });
  };

  const handleServiceMaterialsChange = (index: number, val: string) => {
    const updatedServices = [...config.services];
    updatedServices[index] = { ...updatedServices[index], materials: val };
    setConfig({ ...config, services: updatedServices });
  };

  const handleAddPricingService = () => {
    setConfig({
      ...config,
      services: [
        ...config.services,
        {
          name: 'Neue Dienstleistung',
          basePricePerM2: 75,
          materials: 'Bitte Systemkomponenten ergänzen'
        }
      ]
    });
  };

  const handleDeletePricingService = (index: number) => {
    if (!confirm('Diese Dienstleistung wirklich aus dem Kostenschätzer entfernen?')) return;
    setConfig({
      ...config,
      services: config.services.filter((_, i) => i !== index)
    });
  };

  const handleDampnessFactorChange = (key: 'leicht' | 'mittel' | 'stark', val: number) => {
    setConfig({
      ...config,
      factors: {
        ...config.factors,
        dampness: {
          ...config.factors.dampness,
          [key]: val
        }
      }
    });
  };

  const handleAccessibilityFactorChange = (key: 'einfach' | 'mittel' | 'schwer', val: number) => {
    setConfig({
      ...config,
      factors: {
        ...config.factors,
        accessibility: {
          ...config.factors.accessibility,
          [key]: val
        }
      }
    });
  };

  const handleHomepageChange = (field: keyof HomepageContent, val: string) => {
    const current: HomepageContent = config.homepage || { ...DEFAULT_PRICING_CONFIG.homepage! };
    setConfig({ ...config, homepage: { ...current, [field]: val } });
  };

  const handleHomepageStatChange = (stat: 'stat1' | 'stat2' | 'stat3', subField: 'value' | 'label', val: string) => {
    const current: HomepageContent = config.homepage || { ...DEFAULT_PRICING_CONFIG.homepage! };
    setConfig({ ...config, homepage: { ...current, [stat]: { ...current[stat], [subField]: val } } });
  };

  const handleHomepageFeatureChange = (feat: 'feature1' | 'feature2' | 'feature3', subField: 'title' | 'description', val: string) => {
    const current: HomepageContent = config.homepage || { ...DEFAULT_PRICING_CONFIG.homepage! };
    setConfig({ ...config, homepage: { ...current, [feat]: { ...current[feat], [subField]: val } } });
  };

  const handleFooterChange = (field: keyof FooterContent, val: string | boolean) => {
    const current: FooterContent = config.footer || { ...DEFAULT_PRICING_CONFIG.footer! };
    setConfig({ ...config, footer: { ...current, [field]: val } });
  };

  const handleHomepageVisibilityChange = (
    field: 'hideHero' | 'hideEstimator' | 'hideStats' | 'hideCompetences' | 'hideTeamTeaser',
    hidden: boolean
  ) => {
    const current: HomepageContent = config.homepage || { ...DEFAULT_PRICING_CONFIG.homepage! };
    setConfig({ ...config, homepage: { ...current, [field]: hidden } });
  };

  const handleServicesVisibilityChange = (
    field: 'hideHeader' | 'hideServices' | 'hideExtra',
    hidden: boolean
  ) => {
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    setConfig({ ...config, servicesContent: { ...current, [field]: hidden } });
  };

  const handleAboutVisibilityChange = (
    field: 'hideIntro' | 'hideMission' | 'hideTeam' | 'hideTestimonials',
    hidden: boolean
  ) => {
    const current: AboutContent = config.about || { ...DEFAULT_PRICING_CONFIG.about!, testimonials: [...DEFAULT_PRICING_CONFIG.about!.testimonials] };
    setConfig({ ...config, about: { ...current, [field]: hidden } });
  };

  const handleGalleryChange = (field: keyof Omit<GalleryContent, 'items'>, val: string | boolean) => {
    const current: GalleryContent = config.gallery || { ...DEFAULT_PRICING_CONFIG.gallery!, items: [...DEFAULT_PRICING_CONFIG.gallery!.items] };
    setConfig({ ...config, gallery: { ...current, [field]: val } });
  };

  const handlePageVisibilityChange = (field: keyof PageVisibilityContent, hidden: boolean) => {
    const current: PageVisibilityContent = config.pageVisibility || { ...DEFAULT_PRICING_CONFIG.pageVisibility! };
    setConfig({ ...config, pageVisibility: { ...current, [field]: hidden } });
  };

  const handleGalleryItemChange = (index: number, field: keyof GalleryItem, val: string | boolean) => {
    const current: GalleryContent = config.gallery || { ...DEFAULT_PRICING_CONFIG.gallery!, items: [...DEFAULT_PRICING_CONFIG.gallery!.items] };
    const items = [...current.items];
    if (items[index]) {
      items[index] = { ...items[index], [field]: val };
      setConfig({ ...config, gallery: { ...current, items } });
    }
  };

  const handleAddGalleryItem = (serviceName?: string) => {
    const current: GalleryContent = config.gallery || { ...DEFAULT_PRICING_CONFIG.gallery!, items: [...DEFAULT_PRICING_CONFIG.gallery!.items] };
    const fallbackService = serviceName || config.services[0]?.name || 'Allgemein';
    const newItem: GalleryItem = {
      id: `galerie_${Date.now()}`,
      serviceName: fallbackService,
      title: '',
      description: '',
      imageUrl: ''
    };
    setConfig({ ...config, gallery: { ...current, items: [...current.items, newItem] } });
  };

  const handleDeleteGalleryItem = (index: number) => {
    if (!confirm('Diesen Galerieeintrag wirklich entfernen?')) return;
    const current: GalleryContent = config.gallery || { ...DEFAULT_PRICING_CONFIG.gallery!, items: [...DEFAULT_PRICING_CONFIG.gallery!.items] };
    setConfig({
      ...config,
      gallery: {
        ...current,
        items: current.items.filter((_, i) => i !== index)
      }
    });
  };

  const handleGalleryImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine gültige Bilddatei aus.');
      e.target.value = '';
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      alert('Das Bild ist zu groß. Bitte verwenden Sie ein Bild unter 2,5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleGalleryItemChange(index, 'imageUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleServicesContentChange = (field: keyof Omit<ServicesContent, 'items'>, val: string) => {
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    setConfig({ ...config, servicesContent: { ...current, [field]: val } });
  };

  const handleServiceDetailChange = (index: number, field: keyof ServiceDetail, val: string | boolean | string[]) => {
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    const items = [...current.items];
    if (items[index]) {
      items[index] = { ...items[index], [field]: val };
      setConfig({ ...config, servicesContent: { ...current, items } });
    }
  };

  const handleAddServiceDetail = () => {
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    const nextIndex = current.items.length + 1;
    const newService: ServiceDetail = {
      id: `manuelle_leistung_${Date.now()}`,
      title: `Neue Leistung ${nextIndex}`,
      iconName: 'construction',
      shortDesc: '',
      longDesc: '',
      features: [''],
      imageUrl: '',
      bgDark: false,
      tag: ''
    };
    setConfig({ ...config, servicesContent: { ...current, items: [...current.items, newService] } });
  };

  const handleDeleteServiceDetail = (index: number) => {
    if (!confirm('Diese Leistungskarte wirklich entfernen?')) return;
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    setConfig({
      ...config,
      servicesContent: {
        ...current,
        items: current.items.filter((_, i) => i !== index)
      }
    });
  };

  const handleServiceFeatureChange = (serviceIndex: number, featureIndex: number, val: string) => {
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    const items = [...current.items];
    const service = items[serviceIndex];
    if (service) {
      const features = [...service.features];
      features[featureIndex] = val;
      items[serviceIndex] = { ...service, features };
      setConfig({ ...config, servicesContent: { ...current, items } });
    }
  };

  const handleAddServiceFeature = (serviceIndex: number) => {
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    const items = [...current.items];
    const service = items[serviceIndex];
    if (service) {
      items[serviceIndex] = { ...service, features: [...service.features, ''] };
      setConfig({ ...config, servicesContent: { ...current, items } });
    }
  };

  const handleDeleteServiceFeature = (serviceIndex: number, featureIndex: number) => {
    const current: ServicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
    const items = [...current.items];
    const service = items[serviceIndex];
    if (service) {
      items[serviceIndex] = { ...service, features: service.features.filter((_, i) => i !== featureIndex) };
      setConfig({ ...config, servicesContent: { ...current, items } });
    }
  };

  const handleAboutChange = (field: keyof Omit<AboutContent, 'testimonials'>, val: string) => {
    const current: AboutContent = config.about || { ...DEFAULT_PRICING_CONFIG.about!, testimonials: [...DEFAULT_PRICING_CONFIG.about!.testimonials] };
    setConfig({ ...config, about: { ...current, [field]: val } });
  };

  const handleTestimonialChange = (index: number, field: keyof Testimonial, val: string | number | boolean) => {
    const current: AboutContent = config.about || { ...DEFAULT_PRICING_CONFIG.about!, testimonials: [...DEFAULT_PRICING_CONFIG.about!.testimonials] };
    const testimonials = [...current.testimonials];
    if (testimonials[index]) {
      testimonials[index] = { ...testimonials[index], [field]: val };
      setConfig({ ...config, about: { ...current, testimonials } });
    }
  };

  const handleContactChange = (field: keyof ContactConfig, val: string | boolean) => {
    const contact = config.contact || { ...DEFAULT_PRICING_CONFIG.contact! };
    setConfig({
      ...config,
      contact: {
        ...contact,
        [field]: val
      }
    });
  };

  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      name: '',
      role: '',
      description: '',
      avatarUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12',
      photoAlt: ''
    };
    setConfig({ ...config, team: [...(config.team || []), newMember] });
  };

  const handleDeleteTeamMember = (index: number) => {
    if (!confirm('Diesen Experten wirklich entfernen?')) return;
    const updated = (config.team || []).filter((_, i) => i !== index);
    setConfig({ ...config, team: updated });
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, val: string | boolean) => {
    const updatedTeam = [...(config.team || [])];
    if (updatedTeam[index]) {
      updatedTeam[index] = { 
        ...updatedTeam[index], 
        [field]: val,
        // Sync photoAlt to name when name changes
        ...(field === 'name' && typeof val === 'string' ? { photoAlt: `${val} ${updatedTeam[index].role || ''}`.trim() } : {}),
        // Sync photoAlt to role when role changes
        ...(field === 'role' && typeof val === 'string' ? { photoAlt: `${updatedTeam[index].name || ''} ${val}`.trim() } : {})
      };
      setConfig({
        ...config,
        team: updatedTeam
      });
    }
  };

  const handleTeamPhotoUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine gültige Bilddatei aus.');
      e.target.value = '';
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Das Bild ist zu groß. Bitte verwenden Sie ein Bild unter 1,5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleTeamMemberChange(index, 'avatarUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const receivedCount = requests.filter(req => req.status === 'Received').length;
  const activeCount = requests.filter(req => req.status === 'In Analysis').length;
  const scheduledCount = requests.filter(req => req.status === 'Scheduled').length;
  const estimatedTotal = requests.reduce((sum, req) => sum + (req.estimatedCost || 0), 0);
  const avgEstimate = requests.length ? Math.round(estimatedTotal / requests.length) : 0;
  const inputClass = "w-full min-h-11 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-inner shadow-slate-900/[0.03] outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
  const compactInputClass = "min-h-10 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm font-extrabold text-slate-900 outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
  const labelClass = "font-display text-[11px] font-extrabold uppercase text-slate-500 tracking-wider";
  const panelClass = "rounded-[1.5rem] border border-white/70 bg-white/88 p-5 shadow-[0_24px_80px_rgba(8,22,37,0.10)] backdrop-blur-xl md:p-6";
  const sectionTitleClass = "font-display text-sm font-black uppercase tracking-wide text-slate-950 flex items-center gap-2";
  const workbenchClass = "rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6";
  const BlockHideToggle = ({
    checked,
    onChange,
    label = 'Block ausblenden'
  }: {
    checked?: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
  }) => (
    <label
      title={checked ? 'Dieser Bereich ist auf der öffentlichen Website ausgeblendet.' : 'Diesen Bereich auf der öffentlichen Website ausblenden.'}
      className={`inline-flex min-h-10 cursor-pointer select-none items-center justify-between gap-3 rounded-2xl border px-3 py-2 font-display text-[10px] font-black uppercase tracking-wider transition ${
        checked
          ? 'border-red-200 bg-red-50 text-red-600 shadow-sm'
          : 'border-slate-200 bg-white/85 text-slate-500 shadow-sm hover:border-brand-orange/40 hover:text-primary-navy'
      }`}
    >
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <EyeOff size={12} />
        <span>{label}</span>
      </span>
      <span className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-red-500' : 'bg-slate-300'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'left-4' : 'left-0.5'}`} />
      </span>
    </label>
  );

  if (!isAuthenticated) {
    return (
      <section className="relative isolate min-h-[760px] overflow-hidden bg-[#07111f] px-6 py-20 text-white" id="admin-login-layout">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,143,52,0.28),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.22),transparent_30%),linear-gradient(135deg,#07111f_0%,#0f172a_48%,#111827_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-orange/10 to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[620px] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-orange-100 shadow-2xl shadow-black/20 backdrop-blur">
              <Sparkles size={14} className="text-brand-orange" />
              BetonBiber Command Center
            </div>
            <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
              Admin Panel<br />
              <span className="text-brand-orange">neu gedacht.</span>
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base leading-8 text-slate-300">
              Preise, Inhalte, Team und Kundenanfragen in einem schnellen, klaren und hochwertigen Kontrollraum.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {[
                { label: 'Anfragen', value: requests.length, icon: FileSpreadsheet },
                { label: 'Pipeline', value: activeCount, icon: Activity },
                { label: 'Termine', value: scheduledCount, icon: Clock3 }
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                  <item.icon size={18} className="mb-3 text-brand-orange" />
                  <div className="font-display text-2xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.92] p-7 text-slate-900 shadow-inner shadow-white/70">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-navy text-white shadow-lg shadow-primary-navy/25">
                    <LockKeyhole size={24} />
                  </div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-primary-navy">
                    Sicher einloggen
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Authentifizierung für Preisparameter und Kundendaten.
                  </p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  Live
                </div>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Admin-Passwort
                  </label>
                  <div className="relative">
                    <KeyRound size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="password"
                      placeholder="Passwort eingeben"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full min-h-12 rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-brand-orange focus:bg-white focus:ring-4 focus:ring-brand-orange/15"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-sans text-xs font-semibold text-red-600">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary-navy px-4 py-3.5 font-display text-xs font-black uppercase text-white shadow-xl shadow-primary-navy/20 transition-all hover:-translate-y-0.5 hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-brand-orange/30"
                >
                  <span>Einloggen</span>
                  <ArrowRight size={15} />
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                <p className="font-sans text-[11px] font-bold leading-normal text-slate-500">
                  Dev-Hinweis: <span className="font-mono font-extrabold text-brand-orange-dark select-all">admin123</span> oder <span className="font-mono font-extrabold text-brand-orange-dark select-all">biber2026</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate min-h-[850px] overflow-hidden bg-[#eef2f7] px-4 py-8 md:px-8 lg:px-12" id="admin-panel-layout">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(252,143,52,0.20),transparent_27%),radial-gradient(circle_at_90%_8%,rgba(14,165,233,0.16),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_42%,#e5e7eb_100%)]" />
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6">
        
        {/* Header Ribbon / Navigation */}
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-primary-navy text-white shadow-[0_26px_90px_rgba(8,22,37,0.24)]">
          <div className="relative p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(252,143,52,0.32),transparent_26%),radial-gradient(circle_at_95%_0%,rgba(56,189,248,0.22),transparent_30%)]" />
            <div className="relative flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 text-brand-orange ring-1 ring-white/15 backdrop-blur">
                    <Gauge size={26} />
                  </div>
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-orange-100">
                      <Activity size={13} className="text-brand-orange" />
                      Live Admin Workspace
                    </div>
                    <h1 className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">
                      BETON<span className="text-brand-orange">BIBER</span> Admin Panel
                    </h1>
                    <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-slate-300">
                      Dynamische Steuerung für Preise, Startseite, Teamdaten und Kundenpipeline.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSaveConfig}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-orange px-4 py-2.5 font-display text-xs font-black uppercase text-white shadow-xl shadow-brand-orange/25 transition hover:-translate-y-0.5 hover:bg-brand-orange-dark focus:outline-none focus:ring-4 focus:ring-brand-orange/30"
                  >
                    <Save size={15} />
                    <span>Speichern</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex min-h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-red-500/20 hover:text-red-100 focus:outline-none focus:ring-4 focus:ring-white/20"
                    title="Sitzung beenden"
                    aria-label="Sitzung beenden"
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Neue Anfragen', value: receivedCount, icon: FileSpreadsheet, detail: `${requests.length} gesamt` },
                  { label: 'In Analyse', value: activeCount, icon: Activity, detail: 'Pipeline aktiv' },
                  { label: 'Terminiert', value: scheduledCount, icon: CheckCircle, detail: 'Abgeschlossen' },
                  { label: 'Ø Richtwert', value: avgEstimate ? `€${avgEstimate.toLocaleString()}` : '€0', icon: CircleDollarSign, detail: 'Kalkulationen' }
                ].map(item => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</p>
                        <p className="mt-2 font-display text-2xl font-black text-white">{item.value}</p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-brand-orange">
                        <item.icon size={20} />
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-bold text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-3 z-20 rounded-3xl border border-white/70 bg-white/80 p-2 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold uppercase transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-primary-navy text-white shadow-lg shadow-primary-navy/15'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-navy'
                }`}
              >
                <Coins size={15} />
                <span>Preise & Parameter</span>
              </button>
              <button
                onClick={() => setActiveTab('homepage')}
                className={`flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold uppercase transition-all ${
                  activeTab === 'homepage'
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-navy'
                }`}
              >
                <Home size={15} />
                <span>Startseite</span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold uppercase transition-all ${
                  activeTab === 'services'
                    ? 'bg-primary-navy text-white shadow-lg shadow-primary-navy/15'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-navy'
                }`}
              >
                <BriefcaseBusiness size={15} />
                <span>Leistungen</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold uppercase transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-navy'
                }`}
              >
                <Images size={15} />
                <span>Galerie</span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold uppercase transition-all ${
                  activeTab === 'about'
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-navy'
                }`}
              >
                <Building2 size={15} />
                <span>Über Uns</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold uppercase transition-all ${
                  activeTab === 'requests'
                    ? 'bg-primary-navy text-white shadow-lg shadow-primary-navy/15'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-primary-navy'
                }`}
              >
                <FileSpreadsheet size={15} />
                <span>Kundenanfragen ({requests.length})</span>
              </button>
            </div>
            {saveSuccess && (
              <div className="flex min-h-11 items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                <CheckCircle size={15} />
                Live geschaltet
              </div>
            )}
          </div>
        </div>

        {/* Tab 1: Calculator Pricing Controls */}
        {activeTab === 'calculator' && (
          <div className="flex flex-col gap-6">
            <div className={workbenchClass}>
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-navy text-brand-orange shadow-xl shadow-primary-navy/15">
                    <SlidersHorizontal size={23} />
                  </div>
                  <div>
                    <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand-orange-dark">Preise & Parameter</p>
                    <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-primary-navy">Kalkulator-Steuerung</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      Tarife, Materialtexte, Risikofaktoren, Kontakt und Teamprofile zentral pflegen.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Services</div>
                    <div className="mt-1 font-display text-xl font-black">{config.services.length}</div>
                  </div>
                  <div className="rounded-2xl bg-orange-50 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700">Team</div>
                    <div className="mt-1 font-display text-xl font-black text-brand-orange-dark">{config.team?.length || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List of services & materials */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className={panelClass}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className={sectionTitleClass}>
                      <Layers size={17} className="text-brand-orange-dark" />
                      <span>1. Basistarife je Dienstleistung (€ / m²)</span>
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Diese Werte steuern den interaktiven Kostenschätzer: Fläche × Basispreis × Faktoren.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPricingService}
                    className="flex min-h-10 items-center gap-1.5 rounded-2xl bg-brand-orange px-4 py-2 font-display text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-brand-orange/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-dark"
                  >
                    <span>+ Dienstleistung hinzufügen</span>
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {config.services.map((srv, idx) => (
                    <div key={`${srv.name}-${idx}`} className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:shadow-xl hover:shadow-slate-900/5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span className="font-display font-black text-xs text-primary-navy uppercase tracking-wide">
                          Dienstleistung {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeletePricingService(idx)}
                          className="flex min-h-8 items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 font-display text-[10px] font-black uppercase tracking-wider text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={11} />
                          <span>Entfernen</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_120px]">
                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>
                            Name
                          </label>
                          <input
                            type="text"
                            value={srv.name}
                            onChange={(e) => handleServiceNameChange(idx, e.target.value)}
                            className={inputClass}
                            placeholder="z.B. Balkon arbeiten"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>
                            Preis pro m²
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={srv.basePricePerM2}
                              onChange={(e) => handleServicePriceChange(idx, Number(e.target.value))}
                              className={`${compactInputClass} w-full pr-7`}
                              required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">€</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 lg:col-span-2">
                          <label className={labelClass}>
                            Systemkomponenten / Material
                          </label>
                        <input
                          type="text"
                          value={srv.materials}
                          onChange={(e) => handleServiceMaterialsChange(idx, e.target.value)}
                          className={`${inputClass} text-xs italic`}
                          placeholder="Verwendete Materialien / Systemkomponenten"
                          title="Materialien für die Kostenschätzung"
                        />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factors for dampness and accessibility */}
              <div className={panelClass}>
                <h3 className={`${sectionTitleClass} border-b border-slate-200 pb-4 mb-6`}>
                  <Wrench size={17} className="text-brand-orange-dark" />
                  <span>2. Multiplikationsfaktoren zur Schadenseinstufung</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Dampness Levels factor */}
                  <div className="flex flex-col gap-4">
                    <span className="font-display font-black text-xs text-primary-navy uppercase tracking-wide border-l-4 border-brand-orange pl-3">
                      Feuchtigkeitsgrad (Faktor)
                    </span>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-600 font-medium">Leicht (nur Geruch):</span>
                        <input 
                          type="number" 
                          step="0.05"
                          value={config.factors.dampness.leicht}
                          onChange={(e) => handleDampnessFactorChange('leicht', Number(e.target.value))}
                          className={`${compactInputClass} w-24 text-center`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-600 font-medium">Mittel (feuchte Flecken):</span>
                        <input 
                          type="number" 
                          step="0.05"
                          value={config.factors.dampness.mittel}
                          onChange={(e) => handleDampnessFactorChange('mittel', Number(e.target.value))}
                          className={`${compactInputClass} w-24 text-center`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-600 font-medium">Stark (laufendes Wasser):</span>
                        <input 
                          type="number" 
                          step="0.05"
                          value={config.factors.dampness.stark}
                          onChange={(e) => handleDampnessFactorChange('stark', Number(e.target.value))}
                          className={`${compactInputClass} w-24 text-center`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accessibility Level Factor */}
                  <div className="flex flex-col gap-4">
                    <span className="font-display font-black text-xs text-primary-navy uppercase tracking-wide border-l-4 border-brand-orange pl-3">
                      Zugänglichkeit vor Ort (Faktor)
                    </span>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-600 font-medium">Einfach erreichbar:</span>
                        <input 
                          type="number" 
                          step="0.05"
                          value={config.factors.accessibility.einfach}
                          onChange={(e) => handleAccessibilityFactorChange('einfach', Number(e.target.value))}
                          className={`${compactInputClass} w-24 text-center`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-600 font-medium">Mittel (teilweise bebaut):</span>
                        <input 
                          type="number" 
                          step="0.05"
                          value={config.factors.accessibility.mittel}
                          onChange={(e) => handleAccessibilityFactorChange('mittel', Number(e.target.value))}
                          className={`${compactInputClass} w-24 text-center`}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-600 font-medium">Schwer zugänglich:</span>
                        <input 
                          type="number" 
                          step="0.05"
                          value={config.factors.accessibility.schwer}
                          onChange={(e) => handleAccessibilityFactorChange('schwer', Number(e.target.value))}
                          className={`${compactInputClass} w-24 text-center`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Our Expert Team */}
              <div className={panelClass}>
                <h3 className={`${sectionTitleClass} border-b border-slate-200 pb-4 mb-4`}>
                  <Users size={17} className="text-brand-orange-dark" />
                  <span>3. Unser Expertenteam bearbeiten</span>
                </h3>
                <div className="flex items-center justify-between mb-6">
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    Namen, Rollen, Beschreibungen und Fotos der Experten anpassen.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-orange px-3 py-2 font-display text-[11px] font-black uppercase tracking-wider text-white hover:bg-brand-orange-dark transition shrink-0"
                  >
                    <span>+ Experte hinzufügen</span>
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {(config.team || []).map((member, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-start relative">
                      <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2">
                        <BlockHideToggle
                          checked={member.hidden}
                          onChange={(hidden) => handleTeamMemberChange(idx, 'hidden', hidden)}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteTeamMember(idx)}
                          title="Experten entfernen"
                          className="flex min-h-9 items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-display text-[10px] font-black uppercase tracking-wider text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={11} />
                          <span>Entfernen</span>
                        </button>
                      </div>

                      {/* Avatar preview */}
                      <div className="flex w-full flex-row items-center gap-3 lg:w-48 lg:flex-col lg:items-stretch">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200 shadow-xl shadow-slate-900/15 lg:h-32 lg:w-full">
                          <img 
                            src={member.avatarUrl} 
                            alt={member.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12';
                            }}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6">
                            <span className="block truncate text-[10px] font-extrabold uppercase tracking-wider text-white">{member.name || `Experte ${idx + 1}`}</span>
                          </div>
                        </div>
                        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-center font-display text-[11px] font-black uppercase tracking-wider text-brand-orange-dark transition hover:-translate-y-0.5 hover:bg-orange-100">
                          <UploadCloud size={15} />
                          <span>Foto hochladen</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleTeamPhotoUpload(idx, e)}
                          />
                        </label>
                      </div>

                      {/* Inputs info */}
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>
                            Name des Experten
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>
                            Rolle / Position
                          </label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(idx, 'role', e.target.value)}
                            className={inputClass}
                            required
                          />
                        </div>

                        <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white/70 p-3">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <label className={labelClass}>
                              Foto-URL (Avatar)
                            </label>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                              <Link2 size={11} />
                              Alternative
                            </span>
                          </div>
                          <input
                            type="text"
                            value={member.avatarUrl}
                            onChange={(e) => handleTeamMemberChange(idx, 'avatarUrl', e.target.value)}
                            className={inputClass}
                            placeholder="Bild-Link (z.B. https://...) oder automatisch nach Upload"
                          />
                          <p className="mt-2 text-[11px] leading-5 text-slate-500">
                            Empfehlung: Für schnelle Pflege Foto direkt hochladen. Für dauerhafte Produktion später Cloudinary/Firebase Storage anbinden.
                          </p>
                        </div>

                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className={labelClass}>
                            Expertise-Beschreibung
                          </label>
                          <textarea
                            value={member.description}
                            onChange={(e) => handleTeamMemberChange(idx, 'description', e.target.value)}
                            rows={2}
                            className={`${inputClass} resize-none leading-relaxed`}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* General parameters and Saving */}
            <div className="flex flex-col gap-6">
              <div className={panelClass}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <h3 className={sectionTitleClass}>
                    <ShieldCheck size={17} className="text-brand-orange-dark" />
                    <span>4. Generelle Parameter</span>
                  </h3>
                  <BlockHideToggle
                    checked={config.homepage?.hideEstimator}
                    onChange={(hidden) => handleHomepageVisibilityChange('hideEstimator', hidden)}
                    label="Kalkulator ausblenden"
                  />
                </div>

                {/* Save actions panel */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleSaveConfig}
                    className="w-full min-h-12 bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-black text-xs uppercase py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-orange/20 hover:-translate-y-0.5"
                  >
                    <Save size={14} />
                    <span>Konfiguration speichern</span>
                  </button>

                  <button
                    onClick={handleResetDefaults}
                    className="w-full min-h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-xs uppercase py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <RotateCcw size={14} />
                    <span>Auf Standard zurücksetzen</span>
                  </button>

                  {saveSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-sans font-semibold flex items-center gap-2 mt-2">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span>Parameter erfolgreich live geschaltet!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Contact Information ("Direkter Draht") */}
              <div className={panelClass}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <h3 className={sectionTitleClass}>
                    <Phone size={17} className="text-brand-orange-dark" />
                    <span>5. Direkter Draht (Kontakt)</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <BlockHideToggle
                      checked={config.contact?.hideContactIntro}
                      onChange={(hidden) => handleContactChange('hideContactIntro', hidden)}
                      label="Kontakt-Intro ausblenden"
                    />
                    <BlockHideToggle
                      checked={config.contact?.hideContactDetails}
                      onChange={(hidden) => handleContactChange('hideContactDetails', hidden)}
                      label="Direkten Draht ausblenden"
                    />
                    <BlockHideToggle
                      checked={config.contact?.hideContactMap}
                      onChange={(hidden) => handleContactChange('hideContactMap', hidden)}
                      label="Karte ausblenden"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        Firmenname
                      </label>
                      <input
                        type="text"
                        value={config.contact?.companyName || ''}
                        onChange={(e) => handleContactChange('companyName', e.target.value)}
                        placeholder="Betonbiber Bautenschutz"
                        className={inputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        Vertretungsberechtigte Person
                      </label>
                      <input
                        type="text"
                        value={config.contact?.responsiblePerson || ''}
                        onChange={(e) => handleContactChange('responsiblePerson', e.target.value)}
                        placeholder="Geschäftsführung / Inhaber"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        Straße & Hausnummer
                      </label>
                      <input
                        type="text"
                        value={config.contact?.streetAddress || ''}
                        onChange={(e) => handleContactChange('streetAddress', e.target.value)}
                        placeholder="Am Biberdamm 12"
                        className={inputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        PLZ & Ort
                      </label>
                      <input
                        type="text"
                        value={config.contact?.postalCity || ''}
                        onChange={(e) => handleContactChange('postalCity', e.target.value)}
                        placeholder="10115 Berlin"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className={labelClass}>
                      Land
                    </label>
                    <input
                      type="text"
                      value={config.contact?.country || ''}
                      onChange={(e) => handleContactChange('country', e.target.value)}
                      placeholder="Deutschland"
                      className={inputClass}
                    />
                  </div>

                  {/* Phone Display Name */}
                  <div className="flex flex-col gap-1 w-full">
                    <label className={labelClass}>
                      Hotline Anzeigename
                    </label>
                    <input
                      type="text"
                      value={config.contact?.phone || ''}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="+49 (0) 800 555 6677"
                      className={inputClass}
                    />
                    <span className="font-sans text-[10px] text-slate-400 leading-none mt-0.5">
                      Sichtbarer Text der Servicehotline im Kontaktbereich.
                    </span>
                  </div>

                  {/* Phone Raw Target */}
                  <div className="flex flex-col gap-1 w-full">
                    <label className={labelClass}>
                      Hotline Link-Ziel (Raw)
                    </label>
                    <input
                      type="text"
                      value={config.contact?.phoneRaw || ''}
                      onChange={(e) => handleContactChange('phoneRaw', e.target.value)}
                      placeholder="+498005556677"
                      className={inputClass}
                    />
                    <span className="font-sans text-[10px] text-slate-400 leading-none mt-0.5">
                      Link-Wert für Handys (z.B. tel:+498005556677 ohne Leerzeichen).
                    </span>
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1 w-full">
                    <label className={labelClass}>
                      E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      value={config.contact?.email || ''}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="anfrage@betonbiber.de"
                      className={inputClass}
                    />
                    <span className="font-sans text-[10px] text-slate-400 leading-none mt-0.5">
                      E-Mail-Adresse für direkte Kundenanfragen und Verlinkungen.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-200">
                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        USt-IdNr. / Steuerhinweis
                      </label>
                      <input
                        type="text"
                        value={config.contact?.vatId || ''}
                        onChange={(e) => handleContactChange('vatId', e.target.value)}
                        placeholder="DE..."
                        className={inputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        Handelsregister / Registergericht
                      </label>
                      <input
                        type="text"
                        value={config.contact?.registerInfo || ''}
                        onChange={(e) => handleContactChange('registerInfo', e.target.value)}
                        placeholder="HRB ..., Amtsgericht ..."
                        className={inputClass}
                      />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className={labelClass}>
                        Kammer / Aufsichtsbehörde
                      </label>
                      <input
                        type="text"
                        value={config.contact?.supervisoryAuthority || ''}
                        onChange={(e) => handleContactChange('supervisoryAuthority', e.target.value)}
                        placeholder="falls einschlägig"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Box Info */}
              <div className="rounded-[1.5rem] border border-dashed border-primary-navy/20 bg-white/55 p-5 shadow-sm backdrop-blur">
                <h4 className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={15} className="text-brand-orange-dark" />
                  Verbindung & Echtzeit-Status
                </h4>
                <p className="font-sans text-xs text-slate-500 mt-2 leading-relaxed">
                  Sämtliche hier getätigten Preis- und Formelanpassungen werden per Custom Events live an den Kalkulator weitergegeben. Der Kunde erhält direkt bei der nächsten Berechnung die neu anvisierten Preise.
                </p>
              </div>
            </div>

          </div>
          </div>
        )}

        {/* Tab: Homepage Content Editor */}
        {activeTab === 'homepage' && (() => {
          const hp: HomepageContent = config.homepage || { ...DEFAULT_PRICING_CONFIG.homepage! };
          const pageVisibility = config.pageVisibility || { ...DEFAULT_PRICING_CONFIG.pageVisibility! };
          return (
            <div className="flex flex-col gap-6">
              <div className={workbenchClass}>
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-xl shadow-brand-orange/20">
                      <LayoutDashboard size={23} />
                    </div>
                    <div>
                      <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand-orange-dark">Startseite</p>
                      <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-primary-navy">Content Studio</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        Hero-Botschaft, Bildwelt, Kennzahlen und Kompetenzargumente für den ersten Eindruck kuratieren.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
                    <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Hero</div>
                      <div className="mt-1 font-display text-xl font-black">Live</div>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Stats</div>
                      <div className="mt-1 font-display text-xl font-black text-primary-navy">3</div>
                    </div>
                    <div className="rounded-2xl bg-orange-50 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700">Vorteile</div>
                      <div className="mt-1 font-display text-xl font-black text-brand-orange-dark">3</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={panelClass}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className={sectionTitleClass}>
                      <EyeOff size={17} className="text-brand-orange-dark" />
                      Seiten-Sichtbarkeit
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Ausgeblendete Seiten verschwinden aus der Navigation und sind öffentlich nicht direkt aufrufbar.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <BlockHideToggle checked={pageVisibility.hideHome} onChange={(hidden) => handlePageVisibilityChange('hideHome', hidden)} label="Startseite ausblenden" />
                  <BlockHideToggle checked={pageVisibility.hideLeistungen} onChange={(hidden) => handlePageVisibilityChange('hideLeistungen', hidden)} label="Leistungen ausblenden" />
                  <BlockHideToggle checked={pageVisibility.hideGalerie} onChange={(hidden) => handlePageVisibilityChange('hideGalerie', hidden)} label="Galerie ausblenden" />
                  <BlockHideToggle checked={pageVisibility.hideUberUns} onChange={(hidden) => handlePageVisibilityChange('hideUberUns', hidden)} label="Über uns ausblenden" />
                  <BlockHideToggle checked={pageVisibility.hideKontakt} onChange={(hidden) => handlePageVisibilityChange('hideKontakt', hidden)} label="Kontakt ausblenden" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Hero + Stats + Features */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Hero Text */}
                <div className={panelClass}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <h3 className={sectionTitleClass}>
                      <Type size={17} className="text-brand-orange-dark" />
                      <span>1. Hero-Bereich — Texte</span>
                    </h3>
                    <BlockHideToggle
                      checked={hp.hideHero}
                      onChange={(hidden) => handleHomepageVisibilityChange('hideHero', hidden)}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Badge-Text (oben)</label>
                      <input type="text" value={hp.heroBadge} onChange={e => handleHomepageChange('heroBadge', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Haupttitel (Zeilen mit \n trennen)</label>
                      <textarea rows={2} value={hp.heroTitle} onChange={e => handleHomepageChange('heroTitle', e.target.value)}
                        className={`${inputClass} resize-none`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Orange Highlight-Text</label>
                      <input type="text" value={hp.heroHighlight} onChange={e => handleHomepageChange('heroHighlight', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Beschreibungstext (unter Titel)</label>
                      <textarea rows={3} value={hp.heroDescription} onChange={e => handleHomepageChange('heroDescription', e.target.value)}
                        className={`${inputClass} resize-none leading-relaxed`} />
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className={panelClass}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <h3 className={sectionTitleClass}>
                      <Image size={17} className="text-brand-orange-dark" />
                      <span>2. Hero-Hintergrundbild</span>
                    </h3>
                    <BlockHideToggle
                      checked={hp.hideHero}
                      onChange={(hidden) => handleHomepageVisibilityChange('hideHero', hidden)}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Bild-URL</label>
                      <input type="text" value={hp.heroImageUrl} onChange={e => handleHomepageChange('heroImageUrl', e.target.value)}
                        className={inputClass} placeholder="https://..." />
                    </div>
                    {hp.heroImageUrl && (
                      <div className="relative h-40 overflow-hidden rounded-2xl bg-primary-navy shadow-xl shadow-slate-900/10">
                        <img src={hp.heroImageUrl} alt="Vorschau" className="w-full h-full object-cover opacity-55" referrerPolicy="no-referrer"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="absolute bottom-3 left-3 text-white font-sans text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur">Vorschau</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className={panelClass}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <h3 className={sectionTitleClass}>
                      <Star size={17} className="text-brand-orange-dark" />
                      <span>3. Kennzahlen (Hero rechts)</span>
                    </h3>
                    <BlockHideToggle
                      checked={hp.hideStats}
                      onChange={(hidden) => handleHomepageVisibilityChange('hideStats', hidden)}
                    />
                  </div>
                  <div className="flex flex-col gap-5">
                    {(['stat1', 'stat2', 'stat3'] as const).map((key, i) => (
                      <div key={key} className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm">
                        <span className="font-display font-bold text-xs text-brand-orange uppercase tracking-wider block mb-3">Kennzahl {i + 1}</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className={labelClass}>Wert</label>
                            <input type="text" value={hp[key].value} onChange={e => handleHomepageStatChange(key, 'value', e.target.value)}
                              className={inputClass} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className={labelClass}>Beschriftung</label>
                            <input type="text" value={hp[key].label} onChange={e => handleHomepageStatChange(key, 'label', e.target.value)}
                              className={inputClass} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Section */}
                <div className={panelClass}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <h3 className={sectionTitleClass}>
                      <Layers size={17} className="text-brand-orange-dark" />
                      <span>4. Kompetenz-Bereich</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <BlockHideToggle
                        checked={hp.hideCompetences}
                        onChange={(hidden) => handleHomepageVisibilityChange('hideCompetences', hidden)}
                        label="Kompetenz ausblenden"
                      />
                      <BlockHideToggle
                        checked={hp.hideTeamTeaser}
                        onChange={(hidden) => handleHomepageVisibilityChange('hideTeamTeaser', hidden)}
                        label="Expertenteam ausblenden"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Abschnittsüberschrift</label>
                      <input type="text" value={hp.featureTitle} onChange={e => handleHomepageChange('featureTitle', e.target.value)}
                        className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={labelClass}>Einleitungstext</label>
                      <textarea rows={3} value={hp.featureDescription} onChange={e => handleHomepageChange('featureDescription', e.target.value)}
                        className={`${inputClass} resize-none leading-relaxed`} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      {(['feature1', 'feature2', 'feature3'] as const).map((key, i) => (
                        <div key={key} className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm">
                          <span className="font-display font-bold text-xs text-brand-orange uppercase tracking-wider block mb-3">Vorteil {i + 1}</span>
                          <div className="flex flex-col gap-2">
                            <input type="text" value={hp[key].title} onChange={e => handleHomepageFeatureChange(key, 'title', e.target.value)}
                              placeholder="Titel"
                              className={inputClass} />
                            <textarea rows={2} value={hp[key].description} onChange={e => handleHomepageFeatureChange(key, 'description', e.target.value)}
                              placeholder="Beschreibung"
                              className={`${inputClass} resize-none leading-relaxed`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Content */}
                {(() => {
                  const footer = config.footer || { ...DEFAULT_PRICING_CONFIG.footer! };
                  return (
                    <div className={panelClass}>
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                        <h3 className={sectionTitleClass}>
                          <Layers size={17} className="text-brand-orange-dark" />
                          <span>5. Footer-Bereich</span>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <BlockHideToggle
                            checked={footer.hideBrand}
                            onChange={(hidden) => handleFooterChange('hideBrand', hidden)}
                            label="Markenbereich ausblenden"
                          />
                          <BlockHideToggle
                            checked={footer.hideServices}
                            onChange={(hidden) => handleFooterChange('hideServices', hidden)}
                            label="Leistungen ausblenden"
                          />
                          <BlockHideToggle
                            checked={footer.hideLegal}
                            onChange={(hidden) => handleFooterChange('hideLegal', hidden)}
                            label="Rechtliches ausblenden"
                          />
                          <BlockHideToggle
                            checked={footer.hideCopyright}
                            onChange={(hidden) => handleFooterChange('hideCopyright', hidden)}
                            label="Copyright ausblenden"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>Footer Beschreibung</label>
                          <textarea rows={3} value={footer.description} onChange={e => handleFooterChange('description', e.target.value)}
                            className={`${inputClass} resize-none leading-relaxed`} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className={labelClass}>Leistungen Spalten-Titel</label>
                            <input type="text" value={footer.servicesTitle} onChange={e => handleFooterChange('servicesTitle', e.target.value)}
                              className={inputClass} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className={labelClass}>Rechtliches Spalten-Titel</label>
                            <input type="text" value={footer.legalTitle} onChange={e => handleFooterChange('legalTitle', e.target.value)}
                              className={inputClass} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(['serviceLink1', 'serviceLink2', 'serviceLink3', 'serviceLink4'] as const).map((field, i) => (
                            <div key={field} className="flex flex-col gap-1">
                              <label className={labelClass}>Footer Leistung {i + 1}</label>
                              <input type="text" value={footer[field]} onChange={e => handleFooterChange(field, e.target.value)}
                                className={inputClass} />
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {(['legalLink1', 'legalLink2', 'legalLink3'] as const).map((field, i) => (
                            <div key={field} className="flex flex-col gap-1">
                              <label className={labelClass}>Rechtliches Link {i + 1}</label>
                              <input type="text" value={footer[field]} onChange={e => handleFooterChange(field, e.target.value)}
                                className={inputClass} />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>Copyright Text nach Jahreszahl</label>
                          <input type="text" value={footer.copyrightSuffix} onChange={e => handleFooterChange('copyrightSuffix', e.target.value)}
                            className={inputClass} />
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Right: Save panel + preview hint */}
              <div className="flex flex-col gap-6">
                <div className={`${panelClass} sticky top-28`}>
                  <h3 className={`${sectionTitleClass} border-b border-slate-200 pb-4 mb-4`}>
                    <Save size={17} className="text-brand-orange-dark" />
                    <span>Änderungen speichern</span>
                  </h3>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed mb-5">
                    Alle Texte und Bilder werden per Custom Event sofort auf der Startseite live aktualisiert.
                  </p>
                  <button onClick={handleSaveConfig}
                    className="w-full min-h-12 bg-brand-orange hover:bg-brand-orange-dark text-white font-display font-black text-xs uppercase py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-orange/20 hover:-translate-y-0.5">
                    <Save size={14} />
                    <span>Startseite speichern</span>
                  </button>
                  {saveSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-sans font-semibold flex items-center gap-2 mt-3">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span>Änderungen live geschaltet!</span>
                    </div>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-dashed border-primary-navy/20 bg-white/55 p-5 shadow-sm backdrop-blur">
                  <h4 className="font-display font-extrabold text-xs text-primary-navy uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Image size={15} className="text-brand-orange-dark" />
                    Hinweis zu Bildern
                  </h4>
                  <p className="font-sans text-xs text-slate-500 leading-relaxed">
                    Geben Sie eine öffentlich erreichbare Bild-URL ein (z.B. von Unsplash, Pexels oder Ihrem eigenen Server). Das Bild wird mit 25% Deckkraft als Hintergrund angezeigt.
                  </p>
                </div>
              </div>

            </div>
            </div>
          );
        })()}

        {/* Tab: Leistungen Content Editor */}
        {activeTab === 'services' && (() => {
          const servicesContent = config.servicesContent || { ...DEFAULT_PRICING_CONFIG.servicesContent!, items: [...DEFAULT_PRICING_CONFIG.servicesContent!.items] };
          return (
            <div className="flex flex-col gap-6">
              <div className={workbenchClass}>
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-navy text-brand-orange shadow-xl shadow-primary-navy/15">
                      <BriefcaseBusiness size={23} />
                    </div>
                    <div>
                      <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand-orange-dark">Leistungen</p>
                      <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-primary-navy">Service Portfolio</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        Alle Leistungskarten, Modaltexte, Features und der Zusatz-Support-Block der Leistungen-Seite.
                      </p>
                    </div>
                  </div>
                  <button onClick={handleSaveConfig}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 font-display text-xs font-black uppercase text-white shadow-xl shadow-brand-orange/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-dark">
                    <Save size={15} />
                    Leistungen speichern
                  </button>
                </div>
              </div>

              <div className={panelClass}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <h3 className={sectionTitleClass}>
                    <Type size={17} className="text-brand-orange-dark" />
                    Seitenkopf
                  </h3>
                  <BlockHideToggle
                    checked={servicesContent.hideHeader}
                    onChange={(hidden) => handleServicesVisibilityChange('hideHeader', hidden)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Eyebrow</label>
                    <input value={servicesContent.eyebrow} onChange={e => handleServicesContentChange('eyebrow', e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className={labelClass}>Titel</label>
                    <input value={servicesContent.title} onChange={e => handleServicesContentChange('title', e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className={labelClass}>Beschreibung</label>
                    <textarea rows={3} value={servicesContent.description} onChange={e => handleServicesContentChange('description', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-sm">
                <div>
                  <h3 className={sectionTitleClass}>
                    <BriefcaseBusiness size={17} className="text-brand-orange-dark" />
                    Leistungskarten
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Ganze Liste oder einzelne Leistungen im öffentlichen Bereich ausblenden.
                  </p>
                </div>
                <BlockHideToggle
                  checked={servicesContent.hideServices}
                  onChange={(hidden) => handleServicesVisibilityChange('hideServices', hidden)}
                  label="Alle Leistungen ausblenden"
                />
                <button
                  type="button"
                  onClick={handleAddServiceDetail}
                  className="flex min-h-10 items-center gap-1.5 rounded-2xl bg-primary-navy px-4 py-2 font-display text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-primary-navy/15 transition hover:-translate-y-0.5 hover:bg-slate-950"
                >
                  <span>+ Leistungskarte hinzufügen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {servicesContent.items.map((service, idx) => (
                  <div key={service.id} className={panelClass}>
                    <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                      <h3 className={sectionTitleClass}>
                        <BriefcaseBusiness size={17} className="text-brand-orange-dark" />
                        Leistung {idx + 1}
                      </h3>
                      <div className="flex flex-wrap justify-end gap-2">
                        <BlockHideToggle
                          checked={service.hidden}
                          onChange={(hidden) => handleServiceDetailChange(idx, 'hidden', hidden)}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteServiceDetail(idx)}
                          className="flex min-h-9 items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-display text-[10px] font-black uppercase tracking-wider text-red-500 transition hover:bg-red-100"
                        >
                          <Trash2 size={11} />
                          <span>Entfernen</span>
                        </button>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{service.id}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>Titel</label>
                          <input value={service.title} onChange={e => handleServiceDetailChange(idx, 'title', e.target.value)} className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className={labelClass}>Tag</label>
                          <input value={service.tag || ''} onChange={e => handleServiceDetailChange(idx, 'tag', e.target.value)} className={inputClass} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Kurzbeschreibung</label>
                        <textarea rows={2} value={service.shortDesc} onChange={e => handleServiceDetailChange(idx, 'shortDesc', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Detailtext</label>
                        <textarea rows={4} value={service.longDesc} onChange={e => handleServiceDetailChange(idx, 'longDesc', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className={labelClass}>Bild-URL</label>
                        <input value={service.imageUrl} onChange={e => handleServiceDetailChange(idx, 'imageUrl', e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.features.map((feature, featureIdx) => (
                          <div key={featureIdx} className="flex flex-col gap-1">
                            <label className={labelClass}>Feature {featureIdx + 1}</label>
                            <div className="flex gap-2">
                              <input value={feature} onChange={e => handleServiceFeatureChange(idx, featureIdx, e.target.value)} className={inputClass} />
                              <button
                                type="button"
                                onClick={() => handleDeleteServiceFeature(idx, featureIdx)}
                                className="flex min-h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                                title="Feature entfernen"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddServiceFeature(idx)}
                        className="self-start rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 font-display text-[11px] font-black uppercase tracking-wider text-brand-orange-dark transition hover:bg-orange-100"
                      >
                        + Feature hinzufügen
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={panelClass}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <h3 className={sectionTitleClass}>
                    <ShieldCheck size={17} className="text-brand-orange-dark" />
                    Zusatz-Support Block
                  </h3>
                  <BlockHideToggle
                    checked={servicesContent.hideExtra}
                    onChange={(hidden) => handleServicesVisibilityChange('hideExtra', hidden)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={servicesContent.extraEyebrow} onChange={e => handleServicesContentChange('extraEyebrow', e.target.value)} className={inputClass} placeholder="Eyebrow" />
                  <input value={servicesContent.extraTitle} onChange={e => handleServicesContentChange('extraTitle', e.target.value)} className={inputClass} placeholder="Titel" />
                  <input value={servicesContent.extraImageUrl} onChange={e => handleServicesContentChange('extraImageUrl', e.target.value)} className={inputClass} placeholder="Bild-URL" />
                  <input value={servicesContent.extraButtonLabel} onChange={e => handleServicesContentChange('extraButtonLabel', e.target.value)} className={inputClass} placeholder="Button Text" />
                  <textarea rows={3} value={servicesContent.extraDescription} onChange={e => handleServicesContentChange('extraDescription', e.target.value)} className={`${inputClass} resize-none leading-relaxed md:col-span-2`} placeholder="Beschreibung" />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tab: Galerie Content Editor */}
        {activeTab === 'gallery' && (() => {
          const gallery: GalleryContent = config.gallery || { ...DEFAULT_PRICING_CONFIG.gallery!, items: [...DEFAULT_PRICING_CONFIG.gallery!.items] };
          const serviceNames = config.services.map(service => service.name).filter(Boolean);
          const pageVisibility = config.pageVisibility || { ...DEFAULT_PRICING_CONFIG.pageVisibility! };
          return (
            <div className="flex flex-col gap-6">
              <div className={workbenchClass}>
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-xl shadow-brand-orange/20">
                      <Images size={23} />
                    </div>
                    <div>
                      <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand-orange-dark">Galerie</p>
                      <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-primary-navy">Projektbilder verwalten</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        Bilder pro Dienstleistung pflegen. Die öffentliche Galerie kann anschließend nach Leistungsbereich gefiltert werden.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <BlockHideToggle
                      checked={pageVisibility.hideGalerie}
                      onChange={(hidden) => handlePageVisibilityChange('hideGalerie', hidden)}
                      label="Galerie-Seite ausblenden"
                    />
                    <button onClick={handleSaveConfig}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 font-display text-xs font-black uppercase text-white shadow-xl shadow-brand-orange/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-dark">
                      <Save size={15} />
                      Galerie speichern
                    </button>
                  </div>
                </div>
              </div>

              <div className={panelClass}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <h3 className={sectionTitleClass}>
                    <Type size={17} className="text-brand-orange-dark" />
                    Seitenkopf
                  </h3>
                  <BlockHideToggle
                    checked={gallery.hideHeader}
                    onChange={(hidden) => handleGalleryChange('hideHeader', hidden)}
                    label="Seitenkopf ausblenden"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input value={gallery.eyebrow} onChange={e => handleGalleryChange('eyebrow', e.target.value)} className={inputClass} placeholder="Eyebrow" />
                  <input value={gallery.title} onChange={e => handleGalleryChange('title', e.target.value)} className={inputClass} placeholder="Titel" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {serviceNames.map(serviceName => {
                  const relatedItems = gallery.items
                    .map((item, index) => ({ item, index }))
                    .filter(entry => entry.item.serviceName === serviceName);
                  return (
                    <div key={serviceName} className={panelClass}>
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                        <div>
                          <h3 className={sectionTitleClass}>
                            <Image size={17} className="text-brand-orange-dark" />
                            {serviceName}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">{relatedItems.length} Galerieeinträge</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddGalleryItem(serviceName)}
                          className="rounded-2xl bg-primary-navy px-4 py-2 font-display text-[11px] font-black uppercase tracking-wider text-white transition hover:bg-slate-950"
                        >
                          + Bild hinzufügen
                        </button>
                      </div>

                      <div className="flex flex-col gap-4">
                        {relatedItems.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs font-bold text-slate-500">
                            Noch keine Bilder für diese Dienstleistung.
                          </div>
                        )}
                        {relatedItems.map(({ item, index }) => (
                          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                              <span className="font-display text-xs font-black uppercase tracking-wider text-primary-navy">Galeriebild</span>
                              <div className="flex flex-wrap gap-2">
                                <BlockHideToggle
                                  checked={item.hidden}
                                  onChange={(hidden) => handleGalleryItemChange(index, 'hidden', hidden)}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGalleryItem(index)}
                                  className="flex min-h-9 items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-display text-[10px] font-black uppercase tracking-wider text-red-500 transition hover:bg-red-100"
                                >
                                  <Trash2 size={11} />
                                  <span>Entfernen</span>
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className={labelClass}>Bild-URL</label>
                                <input value={item.imageUrl} onChange={e => handleGalleryItemChange(index, 'imageUrl', e.target.value)} className={inputClass} placeholder="https://..." />
                              </div>
                              <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-center font-display text-[11px] font-black uppercase tracking-wider text-brand-orange-dark transition hover:-translate-y-0.5 hover:bg-orange-100">
                                <UploadCloud size={15} />
                                <span>Bild vom Gerät hochladen</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={(e) => handleGalleryImageUpload(index, e)}
                                />
                              </label>
                              {item.imageUrl && (
                                <div className="h-36 overflow-hidden rounded-2xl bg-primary-navy">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title || serviceName}
                                    className="h-full w-full object-cover opacity-80"
                                    referrerPolicy="no-referrer"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={panelClass}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <h3 className={sectionTitleClass}>
                    <Images size={17} className="text-brand-orange-dark" />
                    Alle Galerieeinträge
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddGalleryItem()}
                    className="rounded-2xl bg-brand-orange px-4 py-2 font-display text-[11px] font-black uppercase tracking-wider text-white transition hover:bg-brand-orange-dark"
                  >
                    + Freien Eintrag hinzufügen
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {gallery.items.map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <select value={item.serviceName} onChange={e => handleGalleryItemChange(index, 'serviceName', e.target.value)} className={inputClass}>
                          {serviceNames.map(serviceName => (
                            <option key={serviceName} value={serviceName}>{serviceName}</option>
                          ))}
                          {!serviceNames.includes(item.serviceName) && <option value={item.serviceName}>{item.serviceName}</option>}
                        </select>
                        <BlockHideToggle
                          checked={item.hidden}
                          onChange={(hidden) => handleGalleryItemChange(index, 'hidden', hidden)}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <input value={item.imageUrl} onChange={e => handleGalleryItemChange(index, 'imageUrl', e.target.value)} className={inputClass} placeholder="Bild-URL oder hochgeladene Datei" />
                        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-center font-display text-[11px] font-black uppercase tracking-wider text-brand-orange-dark transition hover:-translate-y-0.5 hover:bg-orange-100">
                          <UploadCloud size={15} />
                          <span>Bild vom Gerät hochladen</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleGalleryImageUpload(index, e)}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(index)}
                          className="self-start rounded-xl border border-red-200 bg-red-50 px-3 py-2 font-display text-[10px] font-black uppercase tracking-wider text-red-500 transition hover:bg-red-100"
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tab: Über Uns Content Editor */}
        {activeTab === 'about' && (() => {
          const about = config.about || { ...DEFAULT_PRICING_CONFIG.about!, testimonials: [...DEFAULT_PRICING_CONFIG.about!.testimonials] };
          return (
            <div className="flex flex-col gap-6">
              <div className={workbenchClass}>
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white shadow-xl shadow-brand-orange/20">
                      <Building2 size={23} />
                    </div>
                    <div>
                      <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand-orange-dark">Über Uns</p>
                      <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-primary-navy">Company Story</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        Firmenvorstellung, Leitbild, Team-Überschriften und Kundenstimmen bearbeiten.
                      </p>
                    </div>
                  </div>
                  <button onClick={handleSaveConfig}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 font-display text-xs font-black uppercase text-white shadow-xl shadow-brand-orange/20 transition hover:-translate-y-0.5 hover:bg-brand-orange-dark">
                    <Save size={15} />
                    Über Uns speichern
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={panelClass}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <h3 className={sectionTitleClass}>
                      <Type size={17} className="text-brand-orange-dark" />
                      Intro & Kennzahlen
                    </h3>
                    <BlockHideToggle
                      checked={about.hideIntro}
                      onChange={(hidden) => handleAboutVisibilityChange('hideIntro', hidden)}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <input value={about.eyebrow} onChange={e => handleAboutChange('eyebrow', e.target.value)} className={inputClass} placeholder="Eyebrow" />
                    <input value={about.title} onChange={e => handleAboutChange('title', e.target.value)} className={inputClass} placeholder="Titel" />
                    <textarea rows={3} value={about.paragraph1} onChange={e => handleAboutChange('paragraph1', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} placeholder="Absatz 1" />
                    <textarea rows={3} value={about.paragraph2} onChange={e => handleAboutChange('paragraph2', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} placeholder="Absatz 2" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={about.stat1Value} onChange={e => handleAboutChange('stat1Value', e.target.value)} className={inputClass} placeholder="Stat 1 Wert" />
                      <input value={about.stat1Label} onChange={e => handleAboutChange('stat1Label', e.target.value)} className={inputClass} placeholder="Stat 1 Label" />
                      <input value={about.stat2Value} onChange={e => handleAboutChange('stat2Value', e.target.value)} className={inputClass} placeholder="Stat 2 Wert" />
                      <input value={about.stat2Label} onChange={e => handleAboutChange('stat2Label', e.target.value)} className={inputClass} placeholder="Stat 2 Label" />
                    </div>
                  </div>
                </div>

                <div className={panelClass}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <h3 className={sectionTitleClass}>
                      <ShieldCheck size={17} className="text-brand-orange-dark" />
                      Leitbild
                    </h3>
                    <BlockHideToggle
                      checked={about.hideMission}
                      onChange={(hidden) => handleAboutVisibilityChange('hideMission', hidden)}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <input value={about.missionEyebrow} onChange={e => handleAboutChange('missionEyebrow', e.target.value)} className={inputClass} placeholder="Eyebrow" />
                    <input value={about.missionTitle} onChange={e => handleAboutChange('missionTitle', e.target.value)} className={inputClass} placeholder="Titel" />
                    <textarea rows={2} value={about.missionPoint1} onChange={e => handleAboutChange('missionPoint1', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} />
                    <textarea rows={2} value={about.missionPoint2} onChange={e => handleAboutChange('missionPoint2', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} />
                    <textarea rows={2} value={about.missionPoint3} onChange={e => handleAboutChange('missionPoint3', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} />
                  </div>
                </div>
              </div>

              <div className={panelClass}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <h3 className={sectionTitleClass}>
                    <Users size={17} className="text-brand-orange-dark" />
                    Team & Kundenstimmen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <BlockHideToggle
                      checked={about.hideTeam}
                      onChange={(hidden) => handleAboutVisibilityChange('hideTeam', hidden)}
                      label="Team ausblenden"
                    />
                    <BlockHideToggle
                      checked={about.hideTestimonials}
                      onChange={(hidden) => handleAboutVisibilityChange('hideTestimonials', hidden)}
                      label="Kundenstimmen ausblenden"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <input value={about.teamTitle} onChange={e => handleAboutChange('teamTitle', e.target.value)} className={inputClass} placeholder="Team Titel" />
                  <input value={about.teamSubtitle} onChange={e => handleAboutChange('teamSubtitle', e.target.value)} className={inputClass} placeholder="Team Untertitel" />
                  <input value={about.testimonialsTitle} onChange={e => handleAboutChange('testimonialsTitle', e.target.value)} className={inputClass} placeholder="Testimonials Titel" />
                  <input value={about.testimonialsSubtitle} onChange={e => handleAboutChange('testimonialsSubtitle', e.target.value)} className={inputClass} placeholder="Testimonials Untertitel" />
                  <input value={about.recommendationLabel} onChange={e => handleAboutChange('recommendationLabel', e.target.value)} className={inputClass} placeholder="Empfehlungslabel" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {about.testimonials.map((test, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-brand-orange-dark">
                        <div className="flex items-center gap-2">
                          <MessageSquareQuote size={16} />
                          <span className="font-display text-xs font-black uppercase">Stimme {idx + 1}</span>
                        </div>
                        <BlockHideToggle
                          checked={test.hidden}
                          onChange={(hidden) => handleTestimonialChange(idx, 'hidden', hidden)}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <input value={test.name} onChange={e => handleTestimonialChange(idx, 'name', e.target.value)} className={inputClass} placeholder="Name" />
                        <input value={test.role} onChange={e => handleTestimonialChange(idx, 'role', e.target.value)} className={inputClass} placeholder="Rolle" />
                        <textarea rows={4} value={test.text} onChange={e => handleTestimonialChange(idx, 'text', e.target.value)} className={`${inputClass} resize-none leading-relaxed`} placeholder="Text" />
                        <input type="number" min={1} max={5} value={test.stars} onChange={e => handleTestimonialChange(idx, 'stars', Number(e.target.value))} className={inputClass} placeholder="Sterne" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Tab 2: Customer Submitted Requests */}
        {activeTab === 'requests' && (
          <div className="flex flex-col gap-6">
            <div className={workbenchClass}>
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-navy text-brand-orange shadow-xl shadow-primary-navy/15">
                    <ClipboardList size={23} />
                  </div>
                  <div>
                    <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand-orange-dark">Kundenanfragen</p>
                    <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-primary-navy">Lead Pipeline</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      Neue Simulationen, Analysefälle und terminierte Anfragen als klare Arbeitsliste verwalten.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
                  <div className="rounded-2xl bg-amber-50 px-4 py-3 shadow-sm ring-1 ring-amber-100">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Neu</div>
                    <div className="mt-1 font-display text-xl font-black text-amber-900">{receivedCount}</div>
                  </div>
                  <div className="rounded-2xl bg-blue-50 px-4 py-3 shadow-sm ring-1 ring-blue-100">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">Analyse</div>
                    <div className="mt-1 font-display text-xl font-black text-blue-900">{activeCount}</div>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 shadow-sm ring-1 ring-emerald-100">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Termin</div>
                    <div className="mt-1 font-display text-xl font-black text-emerald-900">{scheduledCount}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={panelClass}>
            <div className="flex justify-between items-center border-b border-slate-200 pb-5 mb-6 flex-wrap gap-3">
              <div>
                <h2 className="font-display font-black text-xl text-primary-navy uppercase tracking-wide flex items-center gap-2">
                  <FileSpreadsheet size={20} className="text-brand-orange-dark" />
                  <span>Kunden Simulations-Anfragen</span>
                </h2>
                <span className="font-sans text-xs text-slate-500 mt-1 block">
                  Ein Verzeichnis aller simulierten Rechnerdaten und Kontaktformulareinträge.
                </span>
              </div>

              <button
                onClick={onClearAllRequests}
                disabled={requests.length === 0}
                className="min-h-11 bg-red-50 text-red-600 disabled:opacity-50 text-xs px-4 py-2 border border-red-200 hover:bg-red-100 uppercase tracking-widest font-display font-bold rounded-2xl flex items-center gap-1.5 transition-all"
              >
                <Trash2 size={13} />
                <span>Gesamte Historie leeren</span>
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 rounded-[1.5rem] bg-slate-50/70">
                <FileSpreadsheet size={48} className="text-slate-300" />
                <h4 className="font-display font-semibold text-sm text-primary-navy">Noch keine Anfragen empfangen</h4>
                <p className="font-sans text-xs text-slate-500 max-w-sm">
                  Sobald Kunden das Kontaktformular ausfüllen oder Schätzungen ausfüllen und übermitteln, tauchen diese hier live auf.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-white uppercase font-display font-extrabold text-xs tracking-wider">
                      <th className="py-4 px-4">Datum / ID</th>
                      <th className="py-4 px-4">Kunde</th>
                      <th className="py-4 px-4">Service & Fläche</th>
                      <th className="py-4 px-4">Preisschätzung</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr 
                        key={req.id} 
                        className="border-b border-slate-100 hover:bg-orange-50/50 transition-colors"
                        id={`admin-req-row-${req.id}`}
                      >
                        <td className="py-4 px-4 font-mono">
                          <span className="text-slate-400 block">{req.date}</span>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">#{req.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-primary-navy">{req.name}</div>
                          <div className="text-slate-400 flex items-center gap-1 mt-1 font-mono">
                            <Mail size={10} /> {req.email}
                          </div>
                          <div className="text-slate-400 flex items-center gap-1 font-mono">
                            <Phone size={10} /> {req.phone}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-primary-navy/10 text-primary-navy font-display font-extrabold text-xs uppercase px-3 py-1 rounded-full inline-block mb-1">
                            {req.serviceType}
                          </span>
                          {req.areaSize && (
                            <span className="text-slate-400 block ml-0.5">
                              Größe: {req.areaSize} m²
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-extrabold text-primary-navy">
                          {req.estimatedCost ? (
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 text-[11px] inline-flex items-center gap-1 font-mono">
                              €{req.estimatedCost.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Keine Kalkulation</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {onUpdateRequestStatus ? (
                            <select
                              value={req.status}
                              onChange={(e) => onUpdateRequestStatus(req.id, e.target.value as QuoteRequest['status'])}
                              className={`min-h-10 rounded-xl px-2 font-sans font-bold text-xs uppercase outline-none border cursor-pointer ${
                                req.status === 'Received' 
                                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                  : req.status === 'In Analysis'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              <option value="Received">Eingegangen (Neu)</option>
                              <option value="In Analysis">Wird analysiert</option>
                              <option value="Scheduled">Abgeschlossen / Termin</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded font-bold text-xs uppercase ${
                              req.status === 'Received' 
                                ? 'bg-amber-100 text-amber-800' 
                                : req.status === 'In Analysis'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {req.status}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (req.message) {
                                  alert(`Kundennachricht:\n\n${req.message}`);
                                } else {
                                  alert("Keine zusätzliche Nachricht vorhanden.");
                                }
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold py-2 px-3 rounded-xl transition-all uppercase font-display"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Möchten Sie den Eintrag von oder für "${req.name}" wirklich permanent löschen?`)) {
                                  onDeleteRequest(req.id);
                                }
                              }}
                              className="text-slate-400 hover:text-red-500 p-2 rounded-xl transition-colors hover:bg-red-50"
                              title="Löschen"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </div>
        )}

      </div>
    </section>
  );
}
