/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { Filter, Image as ImageIcon } from 'lucide-react';
import { getPricingConfig } from '../lib/pricingState';
import { hasAnyText, hasText } from '../lib/contentVisibility';

export default function GalerieView() {
  const [pricingConfig, setPricingConfig] = useState(() => getPricingConfig());
  const [activeService, setActiveService] = useState('all');

  useEffect(() => {
    const handleUpdated = () => {
      setPricingConfig(getPricingConfig());
    };
    window.addEventListener('pricing_config_updated', handleUpdated);
    return () => {
      window.removeEventListener('pricing_config_updated', handleUpdated);
    };
  }, []);

  const gallery = pricingConfig.gallery;
  const serviceNames = useMemo(() => {
    const names = new Set<string>();
    pricingConfig.services.forEach(service => {
      if (hasText(service.name)) names.add(service.name);
    });
    gallery?.items.forEach(item => {
      if (!item.hidden && hasText(item.serviceName)) names.add(item.serviceName);
    });
    return Array.from(names);
  }, [pricingConfig.services, gallery?.items]);
  const visibleItems = (gallery?.items || []).filter(item => {
    if (item.hidden || !hasText(item.imageUrl)) return false;
    if (activeService === 'all') return true;
    return item.serviceName === activeService;
  });
  const hasHeader = !gallery?.hideHeader && hasAnyText(gallery?.eyebrow, gallery?.title);

  useEffect(() => {
    if (activeService !== 'all' && !serviceNames.includes(activeService)) {
      setActiveService('all');
    }
  }, [activeService, serviceNames]);

  return (
    <div className="bg-brand-bg px-6 py-16 md:py-24" id="galerie-view-wrapper">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10">
        {hasHeader && (
          <div className="flex flex-col gap-3">
            {hasText(gallery?.eyebrow) && (
              <span className="self-start rounded bg-brand-orange/15 px-3 py-1 font-sans text-xs font-extrabold uppercase text-brand-orange">
                {gallery?.eyebrow}
              </span>
            )}
            {hasText(gallery?.title) && (
              <h1 className="max-w-3xl font-display text-3xl font-black uppercase tracking-tight text-primary-navy md:text-5xl">
                {gallery?.title}
              </h1>
            )}
          </div>
        )}

        {serviceNames.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-6" id="gallery-filter-bar">
            <span className="mr-2 inline-flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-wider text-primary-navy">
              <Filter size={14} className="text-brand-orange-dark" />
              Filter
            </span>
            <button
              type="button"
              onClick={() => setActiveService('all')}
              className={`rounded px-4 py-2.5 font-sans text-xs font-bold uppercase transition-all ${
                activeService === 'all'
                  ? 'bg-primary-navy text-white shadow'
                  : 'border border-gray-200 bg-white text-primary-navy hover:bg-gray-50'
              }`}
            >
              Alle Projekte
            </button>
            {serviceNames.map(serviceName => (
              <button
                key={serviceName}
                type="button"
                onClick={() => setActiveService(serviceName)}
                className={`rounded px-4 py-2.5 font-sans text-xs font-bold uppercase transition-all ${
                  activeService === serviceName
                    ? 'bg-brand-orange text-white shadow'
                    : 'border border-gray-200 bg-white text-primary-navy hover:bg-gray-50'
                }`}
              >
                {serviceName}
              </button>
            ))}
          </div>
        )}

        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" id="gallery-grid">
            {visibleItems.map(item => (
              <article key={item.id} className="overflow-hidden rounded-lg border-2 border-primary-navy bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="aspect-[4/3] overflow-hidden bg-primary-navy">
                  <img
                    src={item.imageUrl}
                    alt={item.title || item.serviceName}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/70 p-8 text-center">
            <ImageIcon size={30} className="mb-3 text-brand-orange-dark" />
            <p className="font-display text-sm font-black uppercase tracking-wider text-primary-navy">
              Keine Galerieeinträge vorhanden
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
