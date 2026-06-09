/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'leistungen' | 'uber_uns' | 'kontakt' | 'admin';

export interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  description: string;
  photoAlt: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  stars: number;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  areaSize?: number; // m²
  estimatedCost?: number;
  date: string;
  status: 'Received' | 'In Analysis' | 'Scheduled';
}

export interface ServiceDetail {
  id: string;
  title: string;
  iconName: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  imageUrl: string;
  bgDark?: boolean;
  tag?: string;
}
