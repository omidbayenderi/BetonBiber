/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, MessageSquare, PhoneCall, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function SuccessModal({ isOpen, onClose, title, message }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="success-modal-backdrop">
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-navy"
          />

          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.9, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white border-4 border-primary-navy w-full max-w-[500px] p-8 rounded-lg shadow-2xl z-10"
            id="success-modal-body"
          >
            {/* Header Success Section */}
            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="text-emerald-500 bg-emerald-50 p-3 rounded-full border border-emerald-100 animate-bounce">
                <CheckCircle2 size={48} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-2xl text-primary-navy tracking-tight">
                  {title}
                </h3>
                <p className="font-sans text-sm text-brand-orange-dark font-semibold mt-1 uppercase tracking-wide">
                  Anfrage erfolgreich eingegangen!
                </p>
              </div>
            </div>

            {/* Description / Content */}
            <p className="font-sans text-brand-text-muted text-sm text-center leading-relaxed bg-brand-bg-card p-4 rounded border border-gray-100 mb-6">
              {message}
            </p>

            {/* Timeline info mockup */}
            <div className="flex flex-col gap-4 bg-brand-bg border border-gray-200/50 p-4 rounded-lg mb-6">
              <h4 className="font-display font-bold text-xs text-primary-navy uppercase tracking-wider">
                NÄCHSTE SCHRITTE
              </h4>
              <div className="flex gap-3 items-start">
                <div className="bg-brand-orange text-white p-1 rounded mt-0.5">
                  <PhoneCall size={14} />
                </div>
                <div>
                  <p className="font-sans font-bold text-xs text-primary-navy">Telefonische Kontaktaufnahme</p>
                  <p className="font-sans text-[11px] text-brand-text-muted mt-0.5">Innerhalb von 24 Stunden meldet sich ein Spezialist bei Ihnen.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-brand-orange text-white p-1 rounded mt-0.5">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="font-sans font-bold text-xs text-primary-navy">Terminvereinbarung</p>
                  <p className="font-sans text-[11px] text-brand-text-muted mt-0.5">Wir vereinbaren eine kostenlose Vor-Ort-Besichtigung & Feuchtigkeitsmessung.</p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="bg-primary-navy hover:bg-brand-orange-dark text-white font-display font-bold text-xs uppercase px-8 py-3 rounded-md transition-colors w-full"
                id="success-modal-close-btn"
              >
                Verstanden & Schließen
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
