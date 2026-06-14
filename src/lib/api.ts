// Public / Partner API client — runs on the public portal on port 3001
import { API_BASE } from './constants';
import { DashboardPayload, WHOIndicatorPayload, ManualEntry } from './types';

interface FetchOptions {
  partnerOrg?: string;
  conflictStrategy?: string;
}

function buildHeaders(options: FetchOptions = {}): Record<string, string> {
  const headers: Record<string, string> = {};
  if (options.partnerOrg) {
    headers['x-partner-org'] = options.partnerOrg;
  }
  if (options.conflictStrategy) {
    headers['x-conflict-strategy'] = options.conflictStrategy;
  }
  return headers;
}

async function fetchJSON<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status} for ${path}`);
  const json = await res.json();
  return json.data as T;
}

export async function getWorldBankData(options?: FetchOptions): Promise<DashboardPayload> {
  return fetchJSON<DashboardPayload>('/api/worldbank/dashboard', buildHeaders(options));
}

export async function getWHOData(options?: FetchOptions): Promise<WHOIndicatorPayload> {
  return fetchJSON<WHOIndicatorPayload>('/api/who/dashboard', buildHeaders(options));
}

// Manual overrides CRUD
export async function getOverrides(options?: FetchOptions): Promise<ManualEntry[]> {
  return fetchJSON<ManualEntry[]>('/api/overrides', buildHeaders(options));
}

export async function createOverride(
  entry: Omit<ManualEntry, 'id' | 'timestamp'> | Omit<ManualEntry, 'id' | 'timestamp'>[],
  options?: FetchOptions
): Promise<ManualEntry[]> {
  const headers = buildHeaders(options);
  const res = await fetch(`${API_BASE}/api/overrides`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`API error ${res.status} posting overrides`);
  const json = await res.json();
  return json.data as ManualEntry[];
}

export async function updateOverride(
  id: string,
  entry: Partial<ManualEntry>,
  options?: FetchOptions
): Promise<ManualEntry> {
  const headers = buildHeaders(options);
  const res = await fetch(`${API_BASE}/api/overrides/${id}`, {
    method: 'PUT',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`API error ${res.status} updating override`);
  const json = await res.json();
  return json.data as ManualEntry;
}

export async function deleteOverride(id: string, options?: FetchOptions): Promise<void> {
  const headers = buildHeaders(options);
  const res = await fetch(`${API_BASE}/api/overrides/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
    headers: headers,
  });
  if (!res.ok) throw new Error(`API error ${res.status} deleting override`);
}
