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
import UberUnsView from './views/UberUnsView';
import KontaktView from './views/KontaktView';
import AdminView from './views/AdminView';
import SuccessModal from './components/SuccessModal';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
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

  // Load request queries from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('betonbiber_requests_v1');
      if (stored) {
        setRequests(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading requests from localStorage:', e);
    }
  }, []);

  // Save requests to local storage
  const saveRequests = (updatedList: QuoteRequest[]) => {
    setRequests(updatedList);
    try {
      localStorage.setItem('betonbiber_requests_v1', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Error saving requests to localStorage:', e);
    }
  };

  const handleAddRequest = (req: QuoteRequest) => {
    const newList = [req, ...requests];
    saveRequests(newList);
  };

  const handleDeleteRequest = (id: string) => {
    const newList = requests.filter(r => r.id !== id);
    saveRequests(newList);
  };

  const handleUpdateRequestStatus = (id: string, newStatus: QuoteRequest['status']) => {
    const newList = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
    saveRequests(newList);
  };

  const handleClearAllRequests = () => {
    if (confirm('Möchten Sie Ihren gesamten Simulationsverlauf wirklich löschen?')) {
      saveRequests([]);
    }
  };

  const handleExportEstimatorParams = (params: {
    serviceType: string;
    areaSize: number;
    estimatedCost: number;
    message: string;
  }) => {
    setExportParams(params);
    setActivePage('kontakt');
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
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col justify-between" id="applet-root">
      
      {/* 1. Header Navigation System */}
      <Header 
        activePage={activePage} 
        navigateTo={handleNavigate}
        openEstimator={() => handleNavigate('home')}
      />

      {/* 2. Main Content Routing Pages */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomeView 
            navigateTo={handleNavigate}
            openEstimator={() => handleNavigate('home')}
            onExportToContact={handleExportEstimatorParams}
          />
        )}

        {activePage === 'leistungen' && (
          <LeistungenView 
            navigateTo={handleNavigate}
            onSelectServiceForContact={handleSelectServiceForContact}
          />
        )}

        {activePage === 'uber_uns' && (
          <UberUnsView />
        )}

        {activePage === 'kontakt' && (
          <KontaktView 
            requests={requests}
            onAddRequest={handleAddRequest}
            onDeleteRequest={handleDeleteRequest}
            onClearAll={handleClearAllRequests}
            exportParams={exportParams}
            clearExportParams={() => setExportParams(null)}
            triggerSuccess={triggerSuccessAlert}
          />
        )}

        {activePage === 'admin' && (
          <AdminView 
            requests={requests}
            onDeleteRequest={handleDeleteRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onClearAllRequests={handleClearAllRequests}
          />
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

    </div>
  );
}
