/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TEAM, TESTIMONIALS } from '../constants';
import { ShieldCheck, Star, Users, HardHat, Building, ThumbsUp } from 'lucide-react';
import { getPricingConfig } from '../lib/pricingState';
import { hasAnyText, hasTeamMemberContent, hasTestimonialContent, hasText } from '../lib/contentVisibility';

export default function UberUnsView() {
  const [pricingConfig, setPricingConfig] = useState(() => getPricingConfig());

  useEffect(() => {
    const handleUpdated = () => {
      setPricingConfig(getPricingConfig());
    };
    window.addEventListener('pricing_config_updated', handleUpdated);
    return () => {
      window.removeEventListener('pricing_config_updated', handleUpdated);
    };
  }, []);

  const teamList = (pricingConfig.team || TEAM).filter(hasTeamMemberContent);
  const about = pricingConfig.about;
  const testimonials = about?.hideTestimonials ? [] : (about?.testimonials || TESTIMONIALS).filter(hasTestimonialContent);
  const stats = [
    { value: about?.stat1Value, label: about?.stat1Label },
    { value: about?.stat2Value, label: about?.stat2Label }
  ].filter(stat => hasAnyText(stat.value, stat.label));
  const missionPoints = [about?.missionPoint1, about?.missionPoint2, about?.missionPoint3].filter(hasText);
  const hasIntro = !about?.hideIntro && (hasAnyText(about?.eyebrow, about?.title, about?.paragraph1, about?.paragraph2) || stats.length > 0);
  const hasMission = !about?.hideMission && (hasAnyText(about?.missionEyebrow, about?.missionTitle) || missionPoints.length > 0);
  const hasTeamSection = !about?.hideTeam && (teamList.length > 0 || hasAnyText(about?.teamTitle, about?.teamSubtitle));
  const hasTestimonialsHeader = !about?.hideTestimonials && hasAnyText(about?.testimonialsTitle, about?.testimonialsSubtitle, about?.recommendationLabel);

  return (
    <div className="bg-white py-16 md:py-24 px-6 flex flex-col items-center" id="uberuns-view-wrapper">
      <div className="max-w-[1240px] w-full flex flex-col gap-16">
        
        {/* Core Description Introduction Section */}
        {(hasIntro || hasMission) && <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {hasIntro && <div className="flex flex-col gap-6">
            {hasText(about?.eyebrow) && <span className="self-start text-xs font-sans font-extrabold text-brand-orange bg-brand-orange/15 px-3 py-1 rounded">
              {about?.eyebrow}
            </span>}
            {hasText(about?.title) && <h1 className="font-display font-black text-3xl md:text-4xl text-primary-navy uppercase tracking-tight">
              {about?.title}
            </h1>}
            {hasText(about?.paragraph1) && <p className="font-sans text-sm md:text-base text-brand-text-muted leading-relaxed">
              {about?.paragraph1}
            </p>}
            {hasText(about?.paragraph2) && <p className="font-sans text-sm text-brand-text-muted leading-relaxed">
              {about?.paragraph2}
            </p>}

            {stats.length > 0 && <div className="grid grid-cols-2 gap-4 mt-2">
              {stats.map((stat, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded bg-brand-bg/30">
                  {hasText(stat.value) && <span className="font-display font-black text-xl text-brand-orange-dark">{stat.value}</span>}
                  {hasText(stat.label) && <p className="font-sans text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-1">{stat.label}</p>}
                </div>
              ))}
            </div>}
          </div>}

          {hasMission && <div className="bg-primary-navy text-white p-8 md:p-10 rounded-xl border-4 border-primary-navy flex flex-col gap-6 relative overflow-hidden">
            {hasText(about?.missionEyebrow) && <span className="text-xs font-sans text-brand-orange font-bold uppercase tracking-widest">
              {about?.missionEyebrow}
            </span>}
            {hasText(about?.missionTitle) && <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight leading-snug">
              {about?.missionTitle}
            </h3>}
            
            {missionPoints.length > 0 && <div className="flex flex-col gap-4 font-sans text-xs text-gray-300">
              {missionPoints.map((point, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="text-brand-orange font-bold text-base">●</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>}
          </div>}
        </div>}

        {/* Team Members List — hidden when no members configured */}
        {hasTeamSection && <div className="flex flex-col gap-8">
          {hasAnyText(about?.teamTitle, about?.teamSubtitle) && <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
            {hasText(about?.teamTitle) && <h2 className="font-display font-black text-2xl uppercase text-primary-navy tracking-tight">
              {about?.teamTitle}
            </h2>}
            {hasText(about?.teamSubtitle) && <p className="font-sans text-xs text-brand-orange-dark font-extrabold uppercase tracking-widest">
              {about?.teamSubtitle}
            </p>}
          </div>}

          {teamList.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="team-members-list">
            {teamList.map((member, idx) => (
              <div 
                key={idx} 
                className="bg-brand-bg/50 border border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all group"
              >
                {hasText(member.avatarUrl) && <img 
                  src={member.avatarUrl} 
                  alt={member.photoAlt} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-navy shadow group-hover:scale-105 transition-transform duration-200 mb-4"
                  referrerPolicy="no-referrer"
                />}
                {hasText(member.name) && <h4 className="font-display font-black text-sm text-primary-navy leading-none">
                  {member.name}
                </h4>}
                {hasText(member.role) && <span className="font-sans font-extrabold text-xs text-brand-orange-dark uppercase tracking-wider mt-1.5 bg-brand-orange/10 px-2 py-0.5 rounded">
                  {member.role}
                </span>}
                {hasText(member.description) && <p className="font-sans text-xs text-brand-text-muted leading-relaxed mt-3">
                  {member.description}
                </p>}
              </div>
            ))}
          </div>}
        </div>}

        {/* Testimonials Panel / Client feedbacks with Stars */}
        {(testimonials.length > 0 || hasTestimonialsHeader) && <div className="flex flex-col gap-8 bg-brand-bg rounded-xl border border-gray-200 p-8 md:p-12">
          {hasTestimonialsHeader && <div className="flex justify-between items-end flex-wrap gap-4 border-b border-gray-200 pb-4">
            <div>
              {hasText(about?.testimonialsTitle) && <h2 className="font-display font-black text-xl uppercase text-primary-navy tracking-tight">
                {about?.testimonialsTitle}
              </h2>}
              {hasText(about?.testimonialsSubtitle) && <p className="font-sans text-xs text-brand-orange-dark font-bold uppercase tracking-widest mt-0.5">
                {about?.testimonialsSubtitle}
              </p>}
            </div>
            {hasText(about?.recommendationLabel) && <div className="flex items-center gap-1 bg-white border border-gray-200 px-3 py-1.5 rounded text-xs select-none shadow-sm">
              <ThumbsUp size={14} className="text-brand-orange-dark" />
              <span className="font-sans font-bold text-primary-navy">{about?.recommendationLabel}</span>
            </div>}
          </div>}

          {testimonials.length > 0 && <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="testimonials-grid-panel">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 rounded-lg flex flex-col justify-between shadow-sm relative">
                <div>
                  {/* Stars Rating */}
                  <div className="flex gap-1 text-amber-500 mb-3">
                    {Array.from({ length: test.stars }).map((_, sIdx) => (
                      <Star key={sIdx} size={14} className="fill-current" />
                    ))}
                  </div>
                  {hasText(test.text) && <p className="font-sans text-xs italic text-brand-text-muted leading-relaxed mb-4">
                    "{test.text}"
                  </p>}
                </div>
                <div className="border-t border-gray-100 pt-3 flex flex-col">
                  {hasText(test.name) && <span className="font-display font-bold text-xs text-primary-navy">
                    {test.name}
                  </span>}
                  {hasText(test.role) && <span className="font-sans text-xs text-gray-400 font-semibold mt-0.5">
                    {test.role}
                  </span>}
                </div>
              </div>
            ))}
          </div>}
        </div>}

      </div>
    </div>
  );
}
