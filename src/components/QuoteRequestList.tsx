/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, ClipboardList, Trash2, ShieldCheck, Mail, Phone, CalendarRange } from 'lucide-react';
import { QuoteRequest } from '../types';

interface QuoteRequestListProps {
  requests: QuoteRequest[];
  onDeleteRequest: (id: string) => void;
  onClearAll: () => void;
}

export default function QuoteRequestList({ requests, onDeleteRequest, onClearAll }: QuoteRequestListProps) {
  if (requests.length === 0) {
    return (
      <div 
        className="bg-brand-bg-card border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center gap-2 mt-4"
        id="request-list-empty"
      >
        <ClipboardList className="text-gray-300" size={40} />
        <h4 className="font-display font-semibold text-sm text-primary-navy">
          Noch keine Kostenvoranschläge
        </h4>
        <p className="font-sans text-xs text-brand-text-muted max-w-[280px]">
          Nutzen Sie unseren Rechner oder das Kontaktformular, um einen Voranschlag simulieren zu lassen.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-primary-navy p-6 rounded-lg shadow-sm" id="request-list-container">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
        <h4 className="font-display font-bold text-sm text-primary-navy flex items-center gap-1.5 uppercase tracking-wide">
          <FileText size={16} className="text-brand-orange-dark" />
          <span>Ihre Simulationshistorie ({requests.length})</span>
        </h4>
        <button
          onClick={onClearAll}
          className="text-xs font-sans text-red-500 hover:text-red-700 font-bold transition-colors uppercase tracking-wider hover:underline"
        >
          Alles leeren
        </button>
      </div>

      <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-1">
        {requests.map((req) => (
          <div 
            key={req.id} 
            className="border border-gray-200 bg-brand-bg/50 hover:bg-brand-bg p-4 rounded-lg relative transition-all"
            id={`request-item-${req.id}`}
          >
            <button
              onClick={() => onDeleteRequest(req.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
              title="Antrag löschen"
            >
              <Trash2 size={15} />
            </button>

            {/* Service & Cost Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-primary-navy text-white font-display font-bold text-xs uppercase px-2 py-0.5 rounded">
                {req.serviceType}
              </span>
              {req.estimatedCost ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-extrabold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck size={10} />
                  <span>Est: €{req.estimatedCost.toLocaleString()}</span>
                </span>
              ) : null}
              {req.areaSize ? (
                <span className="bg-gray-100 text-gray-600 font-sans font-bold text-xs px-2 py-0.5 rounded">
                  {req.areaSize} m²
                </span>
              ) : null}
            </div>

            {/* Customer coordinates */}
            <h5 className="font-display font-bold text-xs text-primary-navy mt-1">
              {req.name}
            </h5>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 text-[11px] text-brand-text-muted font-sans font-medium">
              <div className="flex items-center gap-1">
                <Mail size={12} className="text-gray-400" />
                <span className="truncate">{req.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone size={12} className="text-gray-400" />
                <span>{req.phone}</span>
              </div>
            </div>

            {/* Custom message if provided */}
            {req.message && (
              <p className="font-sans text-[11px] text-brand-text-muted bg-white/80 p-2 mt-2 border border-gray-200/50 rounded italic text-ellipsis overflow-hidden max-h-[60px]">
                "{req.message}"
              </p>
            )}

            {/* Status footer inside item */}
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-gray-200 text-xs font-sans">
              <span className="text-gray-400 flex items-center gap-1 font-semibold">
                <CalendarRange size={11} />
                {req.date}
              </span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-[9px]">
                {req.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
