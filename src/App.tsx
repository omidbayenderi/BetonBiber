/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PageId, QuoteRequest } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import LeistungenView from './views/LeistungenView';
import GalerieView from './views/GalerieView';
import UberUnsView from './views/UberUnsView';
import KontaktView from './views/KontaktView';
import AdminView from './views/AdminView';
import NotFoundView from './views/NotFoundView';
import SuccessModal from './components/SuccessModal';
import CookieConsent from './components/CookieConsent';
import { getPricingConfig, PageVisibilityContent } from './lib/pricingState';
import {
  clearQuoteRequests,
  createQuoteRequest,
  deleteQuoteRequest,
  loadQuoteRequests,
  updateQuoteRequestStatus
} from './lib/requestStore';

const SITE_URL = 'https://omidbayenderi.github.io/BetonBiber';
const APP_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

const PAGE_ROUTES: Record<Exclude<PageId, 'not_found'>, string> = {
  home: '/',
  leistungen: '/leistungen',
  galerie: '/galerie',
  uber_uns: '/ueber-uns',
  kontakt: '/kontakt',
  admin: '/amit'
};

const ROUTE_PAGES: Record<string, PageId> = {
  '/': 'home',
  '/leistungen': 'leistungen',
  '/galerie': 'galerie',
  '/ueber-uns': 'uber_uns',
  '/kontakt': 'kontakt',
  '/amit': 'admin'
};

const PAGE_SEO: Record<PageId, { title: string; description: string; robots?: string }> = {
  home: {
    title: 'BetonBiber | Bautenschutz, Kellerabdichtung & Betonsanierung',
    description: 'BetonBiber ist Ihr Fachbetrieb für Kellerabdichtung, Riss-sanierung, Betonsanierung und Schimmelbeseitigung mit ingenieurmäßiger Bauwerkserhaltung.'
  },
  leistungen: {
    title: 'Leistungen | Kellerabdichtung, Riss-sanierung & Betonsanierung',
    description: 'Entdecken Sie die BetonBiber Leistungen: Kellerabdichtung, Riss-sanierung, Betonsanierung, Schimmelbeseitigung und technische Schadensanalyse.'
  },
  galerie: {
    title: 'Galerie | BetonBiber Projektarbeiten',
    description: 'Sehen Sie ausgewählte BetonBiber Projektbilder aus Abdichtung, Betonsanierung, Rückbau, Fugen Sanierung und Balkonarbeiten.'
  },
  uber_uns: {
    title: 'Über uns | BetonBiber Bautenschutz-Spezialisten',
    description: 'Lernen Sie BetonBiber kennen: erfahrene Bautenschutz-Spezialisten für Abdichtungstechnik, Bauwerkssanierung und langlebige Systemlösungen.'
  },
  kontakt: {
    title: 'Kontakt | BetonBiber Beratung & Angebotsanfrage',
    description: 'Kontaktieren Sie BetonBiber für Beratung, Schadensanalyse und ein unverbindliches Angebot für Bautenschutz und Sanierung.'
  },
  admin: {
    title: 'Admin | BetonBiber',
    description: 'Interner BetonBiber Adminbereich.',
    robots: 'noindex, nofollow'
  },
  not_found: {
    title: '404 | Seite nicht gefunden | BetonBiber',
    description: 'Die angeforderte BetonBiber Seite wurde nicht gefunden.',
    robots: 'noindex, follow'
  }
};

function getPageFromLocation(): PageId {
  const redirectedPath = sessionStorage.getItem('betonbiber_redirect_path');
  if (redirectedPath) {
    sessionStorage.removeItem('betonbiber_redirect_path');
    return ROUTE_PAGES[redirectedPath] || 'not_found';
  }
  const pathWithoutBase = APP_BASE_PATH && window.location.pathname.startsWith(APP_BASE_PATH)
    ? window.location.pathname.slice(APP_BASE_PATH.length) || '/'
    : window.location.pathname;
  const normalizedPath = pathWithoutBase.replace(/\/+$/, '') || '/';
  return ROUTE_PAGES[normalizedPath] || 'not_found';
}

function setOrCreateMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    element = selector.startsWith('link') ? document.createElement('link') : document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
    return;
  }
  Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(() => getPageFromLocation());
  const [pageVisibility, setPageVisibility] = useState<PageVisibilityContent>(() => getPricingConfig().pageVisibility || {});
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  
  // Storage for export variables from calculator to contact form
  const [exportParams, setExportParams] = useState<{
    serviceType: string;
    areaSize: number;
    estimatedCost: number;
    message: string;
  } | null>(null);

  // Success Dialog Modal trigger
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  // Load customer requests from the configured request store.
  useEffect(() => {
    let isMounted = true;

    loadQuoteRequests()
      .then(loadedRequests => {
        if (isMounted) setRequests(loadedRequests);
      })
      .catch(error => {
        console.error('Kundenanfragen konnten nicht geladen werden:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => setActivePage(getPageFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleConfigUpdated = () => {
      setPageVisibility(getPricingConfig().pageVisibility || {});
    };
    window.addEventListener('pricing_config_updated', handleConfigUpdated);
    return () => window.removeEventListener('pricing_config_updated', handleConfigUpdated);
  }, []);

  const isPageHidden = (page: PageId) => {
    if (page === 'admin' || page === 'not_found') return false;
    if (page === 'home') return Boolean(pageVisibility.hideHome);
    if (page === 'leistungen') return Boolean(pageVisibility.hideLeistungen);
    if (page === 'galerie') return Boolean(pageVisibility.hideGalerie);
    if (page === 'uber_uns') return Boolean(pageVisibility.hideUberUns);
    if (page === 'kontakt') return Boolean(pageVisibility.hideKontakt);
    return false;
  };

  const displayedPage: PageId = isPageHidden(activePage) ? 'not_found' : activePage;

  useEffect(() => {
    const seo = PAGE_SEO[displayedPage];
    const canonicalPath = displayedPage !== 'not_found' && displayedPage !== 'admin' ? PAGE_ROUTES[displayedPage] : window.location.pathname;
    const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;

    document.title = seo.title;
    setOrCreateMeta('meta[name="description"]', { name: 'description', content: seo.description });
    setOrCreateMeta('meta[name="robots"]', { name: 'robots', content: seo.robots || 'index, follow' });
    setOrCreateMeta('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    setOrCreateMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    setOrCreateMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    setOrCreateMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  }, [displayedPage]);

  const handleAddRequest = async (req: QuoteRequest) => {
    const storedRequest = await createQuoteRequest(req);
    setRequests(prev => [storedRequest, ...prev.filter(request => request.id !== storedRequest.id)]);
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteQuoteRequest(id);
      setRequests(prev => prev.filter(request => request.id !== id));
    } catch (error) {
      console.error('Kundenanfrage konnte nicht gelöscht werden:', error);
      alert('Die Kundenanfrage konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.');
    }
  };

  const handleUpdateRequestStatus = async (id: string, newStatus: QuoteRequest['status']) => {
    try {
      await updateQuoteRequestStatus(id, newStatus);
      setRequests(prev => prev.map(request => request.id === id ? { ...request, status: newStatus } : request));
    } catch (error) {
      console.error('Status der Kundenanfrage konnte nicht aktualisiert werden:', error);
      alert('Der Status konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.');
    }
  };

  const handleClearAllRequests = async () => {
    if (confirm('Möchten Sie alle Kundenanfragen wirklich dauerhaft löschen?')) {
      try {
        await clearQuoteRequests();
        setRequests([]);
      } catch (error) {
        console.error('Kundenanfragen konnten nicht geleert werden:', error);
        alert('Die Kundenanfragen konnten nicht geleert werden. Bitte versuchen Sie es erneut.');
      }
    }
  };

  const handleExportEstimatorParams = (params: {
    serviceType: string;
    areaSize: number;
    estimatedCost: number;
    message: string;
  }) => {
    setExportParams(params);
    handleNavigate('kontakt');
  };

  const handleSelectServiceForContact = (serviceTitle: string) => {
    setExportParams({
      serviceType: serviceTitle,
      areaSize: 30, // Default baseline area
      estimatedCost: 0,
      message: `Hallo Betonbiber-Team,\nich interessiere mich für Ihre Dienstleistung: "${serviceTitle}". Bitte senden Sie mir Informationsmaterial und ein unverbindliches Angebot.`
    });
  };

  const triggerSuccessAlert = (title: string, message: string) => {
    setSuccessModal({
      isOpen: true,
      title,
      message
    });
  };

  // Safe navigation scroll-to-top handler
  const handleNavigate = (page: PageId) => {
    const nextPage = isPageHidden(page) ? 'not_found' : page;
    setActivePage(nextPage);
    if (nextPage !== 'not_found') {
      const path = PAGE_ROUTES[nextPage];
      const browserPath = `${APP_BASE_PATH}${path === '/' ? '/' : path}`;
      if (window.location.pathname !== browserPath) {
        window.history.pushState({}, '', browserPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col justify-between" id="applet-root">
      
      {/* 1. Header Navigation System */}
      <Header 
        activePage={activePage} 
        navigateTo={handleNavigate}
        openEstimator={() => handleNavigate('home')}
        pageVisibility={pageVisibility}
      />

      {/* 2. Main Content Routing Pages */}
      <main className="flex-grow">
        {displayedPage === 'home' && (
          <HomeView 
            navigateTo={handleNavigate}
            openEstimator={() => handleNavigate('home')}
            onExportToContact={handleExportEstimatorParams}
          />
        )}

        {displayedPage === 'leistungen' && (
          <LeistungenView 
            navigateTo={handleNavigate}
            onSelectServiceForContact={handleSelectServiceForContact}
          />
        )}

        {displayedPage === 'galerie' && (
          <GalerieView />
        )}

        {displayedPage === 'uber_uns' && (
          <UberUnsView />
        )}

        {displayedPage === 'kontakt' && (
          <KontaktView 
            onAddRequest={handleAddRequest}
            exportParams={exportParams}
            clearExportParams={() => setExportParams(null)}
            triggerSuccess={triggerSuccessAlert}
          />
        )}

        {displayedPage === 'admin' && (
          <AdminView 
            requests={requests}
            onDeleteRequest={handleDeleteRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onClearAllRequests={handleClearAllRequests}
          />
        )}

        {displayedPage === 'not_found' && (
          <NotFoundView navigateTo={handleNavigate} />
        )}
      </main>

      {/* 3. Footer Copyright Info */}
      <Footer navigateTo={handleNavigate} />

      {/* 4. Overlay Successful Modals */}
      <SuccessModal 
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
      />

      <CookieConsent />

    </div>
  );
}
