/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuoteRequest } from '../types';

const LOCAL_STORAGE_KEY = 'betonbiber_requests_v1';
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const REQUESTS_TABLE = import.meta.env.VITE_SUPABASE_REQUESTS_TABLE || 'quote_requests';

type QuoteRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  message: string | null;
  area_size: number | null;
  estimated_cost: number | null;
  date: string;
  status: QuoteRequest['status'];
};

function getEndpoint() {
  return `${SUPABASE_URL}/rest/v1/${REQUESTS_TABLE}`;
}

function getHeaders(extra?: HeadersInit): HeadersInit {
  return {
    apikey: SUPABASE_ANON_KEY || '',
    Authorization: `Bearer ${SUPABASE_ANON_KEY || ''}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

function fromRow(row: QuoteRequestRow): QuoteRequest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    serviceType: row.service_type,
    message: row.message || '',
    areaSize: row.area_size ?? undefined,
    estimatedCost: row.estimated_cost ?? undefined,
    date: row.date,
    status: row.status
  };
}

function toRow(request: QuoteRequest): QuoteRequestRow {
  return {
    id: request.id,
    name: request.name,
    email: request.email,
    phone: request.phone,
    service_type: request.serviceType,
    message: request.message || null,
    area_size: request.areaSize ?? null,
    estimated_cost: request.estimatedCost ?? null,
    date: request.date,
    status: request.status
  };
}

function readLocalRequests(): QuoteRequest[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Lokale Anfragen konnten nicht geladen werden:', error);
    return [];
  }
}

function writeLocalRequests(requests: QuoteRequest[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Lokale Anfragen konnten nicht gespeichert werden:', error);
  }
}

function assertRemoteConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase ist nicht konfiguriert.');
  }
}

export function isRemoteRequestStoreConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function loadQuoteRequests(): Promise<QuoteRequest[]> {
  if (!isRemoteRequestStoreConfigured()) {
    return readLocalRequests();
  }

  const response = await fetch(`${getEndpoint()}?select=*&order=created_at.desc`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Anfragen konnten nicht geladen werden (${response.status}).`);
  }

  const rows = await response.json() as QuoteRequestRow[];
  return rows.map(fromRow);
}

export async function createQuoteRequest(request: QuoteRequest): Promise<QuoteRequest> {
  if (!isRemoteRequestStoreConfigured()) {
    const nextRequests = [request, ...readLocalRequests()];
    writeLocalRequests(nextRequests);
    return request;
  }

  const response = await fetch(getEndpoint(), {
    method: 'POST',
    headers: getHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(toRow(request))
  });

  if (!response.ok) {
    throw new Error(`Anfrage konnte nicht gespeichert werden (${response.status}).`);
  }

  const rows = await response.json() as QuoteRequestRow[];
  return rows[0] ? fromRow(rows[0]) : request;
}

export async function updateQuoteRequestStatus(id: string, status: QuoteRequest['status']) {
  if (!isRemoteRequestStoreConfigured()) {
    writeLocalRequests(readLocalRequests().map(request => request.id === id ? { ...request, status } : request));
    return;
  }

  assertRemoteConfigured();
  const response = await fetch(`${getEndpoint()}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error(`Status konnte nicht aktualisiert werden (${response.status}).`);
  }
}

export async function deleteQuoteRequest(id: string) {
  if (!isRemoteRequestStoreConfigured()) {
    writeLocalRequests(readLocalRequests().filter(request => request.id !== id));
    return;
  }

  assertRemoteConfigured();
  const response = await fetch(`${getEndpoint()}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Anfrage konnte nicht gelöscht werden (${response.status}).`);
  }
}

export async function clearQuoteRequests() {
  if (!isRemoteRequestStoreConfigured()) {
    writeLocalRequests([]);
    return;
  }

  assertRemoteConfigured();
  const response = await fetch(`${getEndpoint()}?id=not.is.null`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Anfragen konnten nicht geleert werden (${response.status}).`);
  }
}
