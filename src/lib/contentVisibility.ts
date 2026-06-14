/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceDetail, TeamMember, Testimonial } from '../types';
import { HomepageFeature, HomepageStat } from './pricingState';

export function hasText(value?: string | null): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function hasAnyText(...values: Array<string | undefined | null>): boolean {
  return values.some(hasText);
}

export function hasHomepageStatContent(stat?: HomepageStat): boolean {
  return Boolean(stat && hasAnyText(stat.value, stat.label));
}

export function hasHomepageFeatureContent(feature?: HomepageFeature): boolean {
  return Boolean(feature && hasAnyText(feature.title, feature.description));
}

export function hasTeamMemberContent(member?: TeamMember): boolean {
  return Boolean(member && !member.hidden && hasAnyText(member.name, member.role, member.description));
}

export function hasServiceContent(service?: ServiceDetail): boolean {
  return Boolean(
    service &&
    !service.hidden &&
    hasAnyText(
      service.title,
      service.shortDesc,
      service.longDesc,
      service.tag,
      ...(service.features || [])
    )
  );
}

export function hasTestimonialContent(testimonial?: Testimonial): boolean {
  return Boolean(testimonial && !testimonial.hidden && hasAnyText(testimonial.name, testimonial.role, testimonial.text));
}
