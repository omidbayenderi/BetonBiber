/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'leistungen' | 'galerie' | 'uber_uns' | 'kontakt' | 'admin' | 'not_found';

export interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  description: string;
  photoAlt: string;
  hidden?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  stars: number;
  hidden?: boolean;
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
  hidden?: boolean;
}

export interface GalleryItem {
  id: string;
  serviceName: string;
  title: string;
  description: string;
  imageUrl: string;
  hidden?: boolean;
}
